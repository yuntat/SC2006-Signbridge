import React, { useRef, useState } from 'react';
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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <Block flex>
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.container}>
          {/* Back Button (Top Left) */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('SignBridgeMain')}
          >
            <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.backText}>{t('backToHome')}</Text>
          </TouchableOpacity>

          {/* Language Switcher Button (Top Right) */}
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => navigation.navigate('LanguageSelect')}
          >
            <Ionicons name="language" size={24} color={argonTheme.COLORS.PRIMARY} />
            <Text style={styles.languageText}>{t('currentLanguage')}</Text>
          </TouchableOpacity>

          {/* Camera View */}
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
          </Block>

          {/* Controls */}
          <Block style={styles.controls}>
            <Button 
              color={argonTheme.COLORS.ORANGE}
              onPress={() => setIsCameraOn(!isCameraOn)}
              style={styles.controlButton}
            >
              <Text>{isCameraOn ? t('turnOffCamera') : t('turnOnCamera')}</Text>
            </Button>
            
            <Button 
              color={argonTheme.COLORS.PRIMARY}
              onPress={() => navigation.navigate('SignBridgeMain')}
              style={styles.controlButton}
            >
              <Text>{t('startTranslation')}</Text>
            </Button>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
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
    aspectRatio: 16/9,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: argonTheme.COLORS.WHITE,
  },
  webcam: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '90%',
    maxWidth: 1200,
    aspectRatio: 16/9,
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: argonTheme.COLORS.WHITE,
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
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  languageText: {
    marginLeft: 5,
    color: argonTheme.COLORS.PRIMARY,
  },
});

export default LiveTrans;