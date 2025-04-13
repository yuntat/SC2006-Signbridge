from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
import cv2
import base64
import time
from collections import Counter

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
MODEL_PATH = "finally.pt"
VALID_CLASSES = {"Hello", "I Love You", "No", "OK", "Yes"}

# --- INITIALIZATION ---
print("[INFO] Loading YOLO model...")
model = YOLO(MODEL_PATH)
print("[INFO] Model loaded successfully.")

class_counter = Counter()
start_time = time.time()
last_most_common = "Waiting..."

@app.route("/predict", methods=["POST"])
def predict():
    global start_time, class_counter, last_most_common

    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"label": "No image"}), 400

        # Decode base64 to image
        img_data = base64.b64decode(data["image"])
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({"label": "Invalid image"}), 400

        print("[INFO] Frame received.")

        # Run inference
        results = model.predict(frame, conf=0.5, verbose=False)
        boxes = results[0].boxes.data.cpu().tolist()
        names = model.names
        detections = [names[int(box[5])] for box in boxes if names[int(box[5])] in VALID_CLASSES]

        print(f"[INFO] Detected: {detections}")
        for name in detections:
            class_counter[name] += 1

        # Update most frequent label every 5 seconds
        if time.time() - start_time > 5:
            if class_counter:
                last_most_common = class_counter.most_common(1)[0][0]
                print(f"[INFO] Most Detected in last 5s: {last_most_common}")
            else:
                last_most_common = "No valid detection"
            class_counter.clear()
            start_time = time.time()

        return jsonify({"label": last_most_common})

    except Exception as e:
        print("[ERROR] Exception in /predict:", e)
        return jsonify({"label": "Error"}), 500

# For dev testing (disable when using Gunicorn)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
