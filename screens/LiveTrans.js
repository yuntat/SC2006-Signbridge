import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, useWindowDimensions, ImageBackground } from 'react-native';
import { Block, Button, Text } from 'galio-framework';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Images, argonTheme } from '../constants';

const LiveTrans = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [detectedLabel, setDetectedLabel] = useState("Waiting...");
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();

  const VM_IP = "https://signtotext.eastasia.cloudapp.azure.com/flaskapp/predict:8000";

  const sendFrameToBackend = async () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    try {
      const res = await fetch(`${VM_IP}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: screenshot.split(",")[1],
        }),
      });

      const data = await res.json();
      console.log("[DEBUG] Received:", data);
      setDetectedLabel(data.label || "No label");
    } catch (err) {
      console.error("Prediction error:", err);
      setDetectedLabel("Error");
    }
  };

  useEffect(() => {
    if (!isCameraOn) return;

    const interval = setInterval(() => {
      sendFrameToBackend();
    }, 1000);

    return () => clearInterval(interval);
  }, [isCameraOn]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <Block flex>
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('SignBridgeMain')}
          >
            <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.backText}>{t('backToHome')}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => navigation.navigate('LanguageSelect')}
          >
            <Ionicons name="language" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.languageText}>{t('currentLanguage')}</Text>
          </TouchableOpacity> */}

          <Block style={styles.cameraContainer}>
            {isCameraOn ? (
              <View style={styles.webcamContainer}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={styles.webcam}
                />
              </View>
            ) : (
              <Image source={Images.placeholder} style={styles.placeholder} />
            )}
            <Text style={styles.detectionText}>Most Detected: {detectedLabel}</Text>
          </Block>

          <Block style={styles.controls}>
            <Button 
              color={argonTheme.COLORS.DEFAULT}
              onPress={() => setIsCameraOn(!isCameraOn)}
              style={styles.controlButton}
              textStyle={styles.buttonText} // Add this prop
            >
              {isCameraOn ? t('turnOffCamera') : t('turnOnCamera')}
            </Button>
            <Button 
              color={argonTheme.COLORS.DEFAULT}
              onPress={() => navigation.navigate('SignBridgeMain')}
              style={styles.controlButton}
              textStyle={styles.buttonText} // Add this prop
            >
              {t('startTranslation')}
            </Button>
          </Block>

        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webcamContainer: {
    width: '90%',
    maxWidth: 1200,
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: argonTheme.COLORS.INFO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webcam: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '90%',
    maxWidth: 1200,
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: argonTheme.COLORS.WHITE,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detectionText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  backText: {
    marginLeft: 5,
    color: argonTheme.COLORS.PRIMARY,
  },
  // languageButton: {
  //   position: 'absolute',
  //   top: 40,
  //   right: 20,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255,255,255,0.8)',
  //   padding: 10,
  //   borderRadius: 20,
  //   zIndex: 10,
  // },
  // languageText: {
  //   marginLeft: 5,
  //   color: argonTheme.COLORS.PRIMARY,
  // },
});

export default LiveTrans;
