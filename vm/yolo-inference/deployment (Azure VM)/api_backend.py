from fastapi import FastAPI, UploadFile
import uvicorn
from ultralytics import YOLO
from collections import Counter
import tempfile
import os
import logging # Added for better debugging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add this after `app = FastAPI()`
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific domains in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
MODEL_PATH = "finally.pt"
CONFIDENCE_THRESHOLD = 0.60  # *** TUNE THIS *** Minimum confidence for a detection to be considered
WINDOW_SIZE = 10            # *** TUNE THIS *** Size of the sliding window (frames)
STABILITY_THRESHOLD_RATIO = 0.60 # *** TUNE THIS *** % of frames in window that must agree

# Load the user's custom YOLO model
try:
    model = YOLO(MODEL_PATH)
    # Simple check if model loaded correctly (optional but good practice)
    if not hasattr(model, 'names'):
         raise ValueError("Model loaded incorrectly or does not have 'names' attribute.")
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
    # Assuming class 0-25 are A-Z. Verify this matches your model's training.
    gesture_dict = {i: chr(65 + i) for i in range(26)}
    # Use model.names if available and preferred (more robust if classes change)
    # gesture_dict = model.names # Uncomment this if model.names holds {'A': 0, 'B': 1, ...} or similar
    logger.info(f"Gesture dictionary (model.names): {model.names}") # Log the actual names
except Exception as e:
    logger.error(f"Error loading YOLO model: {e}")
    # Exit or handle appropriately if the model is critical
    raise SystemExit(f"Failed to load model: {e}")


def process_frame(results):
    """
    Extract the gesture label from YOLO results if confidence is sufficient.
    Returns the class label (e.g., 'A') or None.
    """
    # Ensure results list is not empty and contains detection boxes
    if not results or not results[0].boxes or len(results[0].boxes.data) == 0:
        return None  # No detections in this frame

    detections = results[0].boxes.data.cpu().numpy() # [x1, y1, x2, y2, conf, class]

    # Find detection with the highest confidence
    top_detection = max(detections, key=lambda x: x[4]) # x[4] is confidence score
    confidence = top_detection[4]
    class_index = int(top_detection[5])

    # Check against confidence threshold
    if confidence >= CONFIDENCE_THRESHOLD:
        try:
             # Map class index to letter using model.names
             label = model.names[class_index]
             # Optional: Validate label is a single uppercase letter if expected
             # if not (len(label) == 1 and 'A' <= label <= 'Z'):
             #     logger.warning(f"Detected label '{label}' (index {class_index}) is not a single uppercase letter. Check model.names.")
             #     return None # Or handle as needed
             return label
        except KeyError:
             logger.warning(f"Class index {class_index} not found in model.names {model.names}")
             return None
        except Exception as e:
             logger.error(f"Error mapping class index {class_index} to label: {e}")
             return None
    else:
        # logger.debug(f"Detection below threshold: {model.names.get(class_index, 'Unknown')}({confidence:.2f})")
        return None # Confidence too low


@app.post("/predict/")
async def predict(file: UploadFile):
    """
    Predicts the sign language sequence from an uploaded video file.
    """
    # Ensure the uploaded file is a video (basic check)
    if not file.content_type.startswith("video/"):
        return {"error": f"Invalid file type: {file.content_type}. Please upload a video."}

    # Use a temporary file to store the uploaded video
    video_path = None
    try:
        # Using NamedTemporaryFile ensures it's cleaned up even on error
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            contents = await file.read()
            temp_video.write(contents)
            video_path = temp_video.name
        logger.info(f"Video saved temporarily to {video_path}")

        # Process video frame-by-frame using YOLO stream
        detected_labels_per_frame = []
        try:
            results_stream = model.predict(video_path, stream=True, verbose=False) # verbose=False reduces console clutter
            for frame_results in results_stream:
                label = process_frame([frame_results]) # Pass results as a list
                detected_labels_per_frame.append(label) # Append label OR None
            logger.info(f"Processed {len(detected_labels_per_frame)} frames.")
            logger.debug(f"Raw frame labels: {detected_labels_per_frame}")

        except Exception as e:
            logger.error(f"Error during YOLO prediction: {e}")
            return {"error": "Failed to process video frames."}

        # Filter and generate text from the sequence of detected labels
        final_text = generate_text_from_predictions(
            detected_labels_per_frame,
            window_size=WINDOW_SIZE,
            stability_threshold=STABILITY_THRESHOLD_RATIO * WINDOW_SIZE # Pass absolute threshold
        )

        logger.info(f"Detected sequence: {final_text}")
        return {"translated_text": final_text}

    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        return {"error": "An unexpected error occurred."}
    finally:
        # Ensure temporary file is always removed
        if video_path and os.path.exists(video_path):
            # os.remove(video_path)
            logger.info(f"Temporary video file {video_path} removed.")


def generate_text_from_predictions(predictions, window_size, stability_threshold):
    """
    Generates refined text from a list of per-frame predictions (including Nones).
    Uses an overlapping sliding window and stability check.
    """
    if not predictions:
        return "No frames processed"

    # Filter out None values for initial analysis if desired, or handle them in the window
    # Option 1: Keep Nones - they might help delimit stable signs
    # frame_labels = predictions
    # Option 2: Filter Nones - focus only on detected letters (simpler for window logic)
    frame_labels = [p for p in predictions if p is not None]

    if not frame_labels:
        return "No sign detected (or all detections below threshold)"

    logger.debug(f"Labels after filtering Nones: {frame_labels}")

    stable_letters = []
    # Use an overlapping sliding window
    for i in range(len(frame_labels) - window_size + 1):
        window = frame_labels[i : i + window_size]
        # logger.debug(f"Window {i}: {window}") # Can be very verbose

        if not window: # Should not happen with the loop condition, but safe check
            continue

        # Count occurrences of each label in the window
        count = Counter(window)
        if not count: # Skip if window somehow became empty (e.g., all Nones if not filtered)
            continue

        # Find the most common label and its frequency
        most_common_label, frequency = count.most_common(1)[0]

        # Check if the most common label meets the stability threshold
        # Note: stability_threshold is now the *count*, not ratio
        if frequency >= stability_threshold:
            stable_letters.append(most_common_label)
        # else:
            # logger.debug(f"Window {i} unstable: {count}") # Log unstable windows if needed

    logger.debug(f"Stable letters after windowing: {stable_letters}")

    if not stable_letters:
        return "No clear sign detected (sequence too unstable)"

    # Remove consecutive duplicates
    if len(stable_letters) > 0:
        deduped_text = [stable_letters[0]]
        for letter in stable_letters[1:]:
            if letter != deduped_text[-1]:
                deduped_text.append(f" {letter}")
        logger.debug(f"Deduped letters: {deduped_text}")
        return "".join(deduped_text)
    else:
         # This case should be covered by the "No clear sign detected" above
         # but included for completeness
        return "No sign detected"


if __name__ == "__main__":
    # Make sure the model path is correct relative to where you run the script
    print(f"Attempting to load model from: {os.path.abspath(MODEL_PATH)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)