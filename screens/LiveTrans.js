import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, useWindowDimensions, ImageBackground, Platform, AppState } from 'react-native'; // Keep Platform and AppState
import { Block, Button, Text } from 'galio-framework';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import Ionicons for the switch icon
import { useNavigation } from '@react-navigation/native';
import { Images, argonTheme } from '../constants';

// --- IMPORTANT ---
// This component uses react-webcam and is intended for WEB ENVIRONMENTS
// It will likely NOT work correctly in a native React Native (iOS/Android) app
// without significant modifications or using a different camera solution.
// Camera switching (facingMode) support depends on the browser and device capabilities.
// --- IMPORTANT ---

const LiveTrans = () => {
  const webcamRef = useRef(null); // Use webcamRef
  const [isCameraOn, setIsCameraOn] = useState(true); // Controls if webcam attempts to render
  const [isTranslating, setIsTranslating] = useState(false); // Controls if API calls are made
  const [detectedLabel, setDetectedLabel] = useState("Ready");
  const [facingMode, setFacingMode] = useState("user"); // State for camera facing mode ('user' or 'environment')
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
            // Optional: Re-enable things if needed when tab becomes visible
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
    const isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;
    if (!webcamRef.current || !isCameraOn || !isTranslating || !isDocumentVisible) {
        // console.log("Skipping frame send. Conditions not met:", { camReady: !!webcamRef.current, camOn: isCameraOn, translating: isTranslating, visible: isDocumentVisible });
        return;
    }

    try {
      const screenshot = webcamRef.current.getScreenshot();

      if (!screenshot) {
        console.warn("Failed to get screenshot.");
        return;
      }

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
          image: base64Image,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
       if (isTranslating && (typeof document !== 'undefined' ? !document.hidden : true)) {
          setDetectedLabel(data.label || "...");
       }
    } catch (err) {
      console.error("Prediction error:", err);
       if (isTranslating && (typeof document !== 'undefined' ? !document.hidden : true)) {
            setDetectedLabel("Error");
       }
    }
  };

  // --- Interval for Sending Frames ---
  useEffect(() => {
    let intervalId = null;
    const isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;

    if (isCameraOn && isTranslating && isDocumentVisible) {
      console.log("Starting translation interval...");
      intervalId = setInterval(() => {
        sendFrameToBackend();
      }, 1500);
    } else {
      console.log("Stopping translation interval or conditions not met.");
    }

    return () => {
      if (intervalId) {
        console.log("Clearing translation interval.");
        clearInterval(intervalId);
      }
    };
  // Add facingMode here ONLY IF you want the interval to restart on camera switch.
  // Usually, it's not needed, as the webcam component itself will update.
  }, [isCameraOn, isTranslating]); // facingMode removed from dependencies intentionally

  // --- Button Handlers ---
  const toggleCamera = () => {
    setIsCameraOn(prev => {
        const nextState = !prev;
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
        alert("Please turn the camera on first.");
        return;
    }
     setIsTranslating(prev => {
         const nextState = !prev;
         setDetectedLabel(nextState ? "Starting..." : "Stopped");
         return nextState;
     });
  };

  // --- NEW: Handler to Switch Camera ---
  const switchCamera = () => {
      setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
      // Reset label when switching cameras
      setDetectedLabel("Ready");
      // Optionally stop translation when switching
      // setIsTranslating(false);
      console.log(`Switched camera to: ${facingMode === 'user' ? 'environment' : 'user'}`);
  };


  // --- Define video constraints dynamically based on state ---
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode, // Use the state variable here
    aspectRatio: 16 / 9
  };

  return (
    <Block flex>
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
                setIsTranslating(false);
                setIsCameraOn(false);
                navigation.navigate('SignBridgeMain');
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.backText}>{t('backToHome')}</Text>
          </TouchableOpacity>

          {/* Camera and Detection Area */}
          <Block flex style={styles.contentArea}>
             {/* Webcam View Container */}
             <Block style={styles.cameraOuterContainer}>
              {isCameraOn ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  style={styles.webcamPreview}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints} // Use dynamic constraints
                  mirrored={facingMode === "user"} // Mirror only the front camera
                  onUserMedia={() => console.log("Webcam stream started")}
                  onUserMediaError={(error) => {
                    console.error("Webcam error:", error);
                    // Handle specific errors e.g., if environment camera not found
                    if (error.name === "OverconstrainedError" || error.name === "NotFoundError") {
                         alert(`Could not access the requested camera (${facingMode}). Please check permissions or try another camera.`);
                         // Optionally switch back or disable switch button
                         // setFacingMode('user');
                    } else if (error.name === "NotAllowedError") {
                        alert("Camera access was denied. Please grant permission in your browser settings.");
                        setIsCameraOn(false); // Turn off camera state if permission denied
                        setDetectedLabel("Permission Denied");
                    } else {
                         alert(`An unexpected error occurred with the camera: ${error.name}`);
                    }
                  }}
                />
              ) : (
                <View style={styles.placeholderView}>
                   <MaterialIcons name="videocam-off" size={80} color={argonTheme.COLORS.MUTED} />
                   <Text style={styles.placeholderText}>Camera Off</Text>
                </View>
              )}
            </Block>

            {/* Detection Text */}
            <Block style={styles.detectionContainer}>
                 <Text style={styles.detectionText}>
                    {isTranslating ? detectedLabel : (isCameraOn ? "Ready" : "Camera Off")}
                 </Text>
            </Block>
          </Block>

          {/* Controls */}
          <Block style={styles.controls}>
            {/* Turn On/Off Camera Button */}
            <Button
              color={isCameraOn ? argonTheme.COLORS.WARNING : argonTheme.COLORS.INFO}
              onPress={toggleCamera}
              style={[styles.controlButton, styles.flexButton]} // Added flexButton style
              textStyle={styles.buttonText}
            >
              {isCameraOn ? t('turnoffcamera') : t('turnoncamera')}
            </Button>

            {/* NEW: Switch Camera Button (Icon Only) */}
             <TouchableOpacity
                onPress={switchCamera}
                style={[styles.controlButton, styles.iconButton]} // Use specific style for icon button
                disabled={!isCameraOn} // Disable if camera is off
            >
                <Ionicons
                    name="camera-reverse"
                    size={24}
                    color={!isCameraOn ? argonTheme.COLORS.MUTED : "#FFFFFF"} // Dim icon when disabled
                />
            </TouchableOpacity>

            {/* Start/Stop Translation Button */}
            <Button
              color={isTranslating ? argonTheme.COLORS.ERROR : argonTheme.COLORS.SUCCESS}
              onPress={toggleTranslation}
              style={[styles.controlButton, styles.flexButton]} // Added flexButton style
              textStyle={styles.buttonText}
              disabled={!isCameraOn}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
    paddingTop: 80,
    paddingBottom: 120,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
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
    // objectFit: 'cover', // Can uncomment if needed, but usually not for webcam
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
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Distribute buttons evenly
    alignItems: 'center',
    paddingHorizontal: 10, // Reduced horizontal padding slightly
  },
  controlButton: { // Base style for all control buttons/touchables
    borderRadius: 8,
    marginHorizontal: 5, // Add some space between buttons
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    elevation: 3,
    justifyContent: 'center', // Center content (icon or text)
    alignItems: 'center',     // Center content
    height: 44, // Give buttons a consistent height
  },
  flexButton: { // Style for buttons that contain text and should flex
    flex: 1, // Allow text buttons to take up more space
    maxWidth: '38%', // Limit max width to prevent overlap on small screens
    paddingHorizontal: 10, // Add padding for text
  },
  iconButton: { // Specific style for the icon-only button
    backgroundColor: argonTheme.COLORS.SECONDARY, // Example background color
    minWidth: 50, // Ensure it's wide enough to be tappable
    paddingHorizontal: 0, // No extra horizontal padding needed for icon only
    flexGrow: 0, // Don't let it grow
    flexShrink: 0, // Don't let it shrink
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text is centered
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
    // cursor: 'pointer', // Removed as it's not standard RN style prop
  },
  backText: {
    marginLeft: 5,
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LiveTrans;