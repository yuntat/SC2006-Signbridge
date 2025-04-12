import React, { useState, useCallback } from 'react';
import { 
  ImageBackground, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Block, Text } from 'galio-framework';
import { MotiView } from 'moti';
import { useFocusEffect } from '@react-navigation/native';
import { Images } from '../constants';
import { useTranslation } from 'react-i18next';

const SignBridgeMain = ({ navigation }) => {
  const { t } = useTranslation();
  const [pressedButton, setPressedButton] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Responsive dimensions for web
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const buttonSize = isMobile ? width * 0.4 : 250; // Fixed size on desktop, responsive on mobile
  const gridGap = isMobile ? 20 : 40;
  
  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prevKey => prevKey + 1);
      return undefined;
    }, []) 
  );

  const buttons = [
    {
      id: 1,
      image: Images.img1,
      text: t('buttons.livevideo'),
      onPress: () => navigation.navigate('LiveTrans'),
      color: '#FF6B6B'
    },
    {
      id: 2,
      image: Images.img2,
      text: t('buttons.preRecordedVideo'),
      onPress: () => navigation.navigate('SignToText'),
      color: '#4ECDC4'
    },
    {
      id: 3,
      image: Images.img3,
      text: t('buttons.texttosign'),
      onPress: () => navigation.navigate('TextToSign'),
      color: '#FFBE0B'
    },
    {
      id: 4,
      image: Images.img4,
      text: t('buttons.languageselect'),
      onPress: () => navigation.navigate('LanguageSelect'),
      color: '#A162E8'
    },
  ];

  const handlePress = (onPress) => {
    setTimeout(onPress, 150);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Images.Onboarding}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        {/* Centered grid container */}
        <View style={[styles.gridContainer, {
          gap: gridGap,
          maxWidth: isMobile ? '100%' : 600, // Limits width on desktop
        }]}>
          {buttons.map((item) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 500 }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    width: buttonSize,
                    height: buttonSize,
                    backgroundColor: item.color,
                  },
                  pressedButton === item.id && styles.buttonPressed
                ]}
                onPressIn={() => setPressedButton(item.id)}
                onPressOut={() => setPressedButton(null)}
                onPress={() => handlePress(item.onPress)}
                activeOpacity={0.8}
              >
                <MotiView
                  animate={{ scale: pressedButton === item.id ? 0.95 : 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  style={styles.buttonContent}
                >
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.buttonText}>{item.text}</Text>
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '60%',
    height: '60%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SignBridgeMain;