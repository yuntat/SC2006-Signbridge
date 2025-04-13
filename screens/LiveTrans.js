import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, useWindowDimensions, ImageBackground, Platform, AppState } from 'react-native'; // Keep Platform and AppState
import { Block, Button, Text } from 'galio-framework';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Images, argonTheme } from '../constants';

// --- IMPORTANT ---
// This component uses react-webcam and is intended for WEB ENVIRONMENTS
// It will likely NOT work correctly in a native React Native (iOS/Android) app
// without significant modifications or using a different camera solution.
// --- IMPORTANT ---

const LiveTrans = () => {
  const webcamRef = useRef(null); // Use webcamRef
  const [isCameraOn, setIsCameraOn] = useState(true); // Controls if webcam attempts to render
  const [isTranslating, setIsTranslating] = useState(false); // Controls if API calls are made
  const [detectedLabel, setDetectedLabel] = useState("Ready");
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const appState = useRef(AppState.currentState); // Keep for potential browser tab visibility check

  // Backend endpoint
  const VM_IP = "https://signtotext.eastasia.cloudapp.azure.com/flaskapp";


  // --- App State/Tab Visibility Handling (Basic for Web) ---
  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log('Tab is hidden');
            // Stop translation when tab is hidden
            setIsTranslating(false);
            // Optionally turn off camera if needed, though browser might handle this
            // setIsCameraOn(false);
        } else {
            console.log('Tab is visible');

        }
    };

    // Check if running in a browser environment before adding listener
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
       document.addEventListener("visibilitychange", handleVisibilityChange);
       console.log("Added visibilitychange listener");
    } else {
        console.log("Not in a browser environment, skipping visibility listener.");
    }


    return () => {
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        console.log("Removed visibilitychange listener");
      }
    };
  }, []);


  // --- Frame Sending Logic (Controlled by isTranslating) ---
  const sendFrameToBackend = async () => {
    // Check if webcam is ready, camera is on, and translation is active
    // Also check if the document is visible (basic check for web)
    const isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;
    if (!webcamRef.current || !isCameraOn || !isTranslating || !isDocumentVisible) {
        // console.log("Skipping frame send. Conditions not met:", { camReady: !!webcamRef.current, camOn: isCameraOn, translating: isTranslating, visible: isDocumentVisible });
        return;
    }

    try {
      // Use getScreenshot from react-webcam
      const screenshot = webcamRef.current.getScreenshot({
          // You can specify width/height here if needed, but defaults are often fine
          // width: 640,
          // height: 480
      });

      if (!screenshot) {
        console.warn("Failed to get screenshot.");
        return; // Skip if no screenshot
      }

      // Send the base64 part (remove data:image/jpeg;base64,)
      const base64Image = screenshot.split(",")[1];
      if (!base64Image) {
          console.warn("Invalid screenshot format received.");
          return;
      }

      // console.log("Sending frame to backend...");
      const res = await fetch(`${VM_IP}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image, // Send base64 string
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      // console.log("[DEBUG] Received:", data);
      // Update label only if translation is still active and tab visible
       if (isTranslating && (typeof document !== 'undefined' ? !document.hidden : true)) {
          setDetectedLabel(data.label || "...");
       }
    } catch (err) {
      console.error("Prediction error:", err);
       // Update label only if translation is still active
       if (isTranslating && (typeof document !== 'undefined' ? !document.hidden : true)) {
            setDetectedLabel("Error");
       }
    }
  };

  // --- Interval for Sending Frames ---
  useEffect(() => {
    let intervalId = null;
    const isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;

    // Start interval only when camera is on, user wants to translate, and tab is visible
    if (isCameraOn && isTranslating && isDocumentVisible) {
      console.log("Starting translation interval...");
      intervalId = setInterval(() => {
        sendFrameToBackend();
      }, 1500); // Send frame every 1.5 seconds (adjust as needed)
    } else {
      console.log("Stopping translation interval or conditions not met.");
    }

    // Cleanup function: Clear interval when dependencies change or component unmounts
    return () => {
      if (intervalId) {
        console.log("Clearing translation interval.");
        clearInterval(intervalId);
      }
    };
  }, [isCameraOn, isTranslating]);

  // --- Button Handlers ---
  const toggleCamera = () => {
    setIsCameraOn(prev => {
        const nextState = !prev;
        // If turning camera off, also stop translation
        if (!nextState) {
            setIsTranslating(false);
            setDetectedLabel("Camera Off");
        } else {
            setDetectedLabel("Ready"); // Reset label when turning on
        }
        return nextState;
    });
  };

  const toggleTranslation = () => {
    if (!isCameraOn) {
        // Maybe use Alert or a different feedback mechanism suitable for web
        alert("Please turn the camera on first.");
        return;
    }
     setIsTranslating(prev => {
         const nextState = !prev;
         setDetectedLabel(nextState ? "Starting..." : "Stopped"); // Update label immediately
         return nextState;
     });
  };

  // Define video constraints for react-webcam
  const videoConstraints = {
    width: 1280, // Request HD width
    height: 720, // Request HD height
    facingMode: "user", // Use the front camera
    aspectRatio: 16 / 9
  };

  // --- Render Logic ---
  // No permission check needed here, react-webcam handles browser prompts

  return (
    <Block flex>
      <ImageBackground
        source={Images.Onboarding} // This might not display correctly in web depending on how Images is set up
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.container}>
          {/* Back Button - Positioned Absolutely */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
                setIsTranslating(false); // Stop translating when navigating away
                setIsCameraOn(false); // Turn off camera too
                navigation.navigate('SignBridgeMain'); // Navigate
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.backText}>{t('backToHome')}</Text>
          </TouchableOpacity>

          {/* --- Camera and Detection Area --- */}
          <Block flex style={styles.contentArea}>
             {/* Webcam View Container */}
             <Block style={styles.cameraOuterContainer}>
              {isCameraOn ? (
                // Use Webcam component here
                <Webcam
                  ref={webcamRef}
                  audio={false} // No audio needed
                  style={styles.webcamPreview} // Use updated style
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  mirrored={true} // Mirror front camera view
                  onUserMedia={() => console.log("Webcam stream started")} // Optional: Log when camera starts
                  onUserMediaError={(error) => console.error("Webcam error:", error)} // Log errors
                />
              ) : (
                <View style={styles.placeholderView}>
                   <MaterialIcons name="videocam-off" size={80} color={argonTheme.COLORS.MUTED} />
                   <Text style={styles.placeholderText}>Camera Off</Text>
                </View>
              )}
            </Block>

            {/* Detection Text - Positioned below camera */}
            <Block style={styles.detectionContainer}>
                 <Text style={styles.detectionText}>
                    {isTranslating ? detectedLabel : (isCameraOn ? "Ready" : "Camera Off")}
                 </Text>
            </Block>
          </Block>


          {/* --- Controls - Positioned Absolutely --- */}
          <Block style={styles.controls}>
            <Button
              color={isCameraOn ? argonTheme.COLORS.WARNING : argonTheme.COLORS.INFO} // Change color based on state
              onPress={toggleCamera}
              style={styles.controlButton}
              textStyle={styles.buttonText}
            >
              {isCameraOn ? t('turnOffCamera') : t('turnOnCamera')}
            </Button>
            <Button
              color={isTranslating ? argonTheme.COLORS.ERROR : argonTheme.COLORS.SUCCESS} // Change color based on state
              onPress={toggleTranslation}
              style={styles.controlButton}
              textStyle={styles.buttonText}
              disabled={!isCameraOn} // Disable if camera is off
            >
              {isTranslating ? t('stopTranslation') : t('startTranslation')}
            </Button>
          </Block>

        </Block>
      </ImageBackground>
    </Block>
  );
};

// Styles
const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
    position: 'relative', // Needed for absolute positioning of controls/back button
    paddingTop: 80, // Make space for back button
    paddingBottom: 120, // Make space for controls
  },
  contentArea: {
    flex: 1, // Take remaining space between header/footer areas
    justifyContent: 'center', // Center camera vertically
    alignItems: 'center',
  },
  cameraOuterContainer: {
    width: '90%',
    maxWidth: 800,
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: argonTheme.COLORS.INFO,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  webcamPreview: {
    width: '100%',
    height: '100%',
    // objectFit: 'cover', // Use this if needed for scaling within the container
  },
  placeholderView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
   placeholderText: {
      color: argonTheme.COLORS.MUTED,
      marginTop: 10,
   },
  detectionContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  detectionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  controls: {
    position: 'absolute', // Position at the bottom
    bottom: 30, // Adjust spacing from bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    elevation: 3, // For Android (if used via react-native-web)
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
    cursor: 'pointer',
  },
  backText: {
    marginLeft: 5,
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LiveTrans;