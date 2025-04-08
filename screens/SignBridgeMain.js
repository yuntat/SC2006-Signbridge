import React from 'react';
import { ImageBackground, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { Images, argonTheme } from '../constants';
import { useTranslation } from 'react-i18next';

const SignBridgeMain = ({ navigation }) => {
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const imageSize = Math.min(width, height) * 0.3;

  const buttons = [
    { 
      id: 1, 
      image: Images.img1, 
      text: t('buttons.livevideo'),
      onPress: () => navigation.navigate('LiveTrans') 
    },
    { 
      id: 2, 
      image: Images.img2, 
      text: t('buttons.preRecordedVideo'),
      onPress: () => console.log('Pre-Recorded pressed')
    },
    { 
      id: 3, 
      image: Images.img3, 
      text: t('buttons.texttosign'),
      onPress: () => navigation.navigate('TextToSign')
    },
    { 
      id: 4, 
      image: Images.img4, 
      text: t('buttons.languageselect'),
      onPress: () => navigation.navigate('LanguageSelect') 
    },
  ];

  return (
    <Block flex style={styles.container}>
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.gridContainer}>
          {buttons.map((item) => (
            <Block key={item.id} style={styles.buttonContainer}>
              <Image 
                source={item.image} 
                style={[styles.image, { width: imageSize, height: imageSize }]} 
                resizeMode="contain"
              />
              <Button
                color={argonTheme.COLORS.ORANGE}
                style={styles.button}
                onPress={item.onPress}
              >
                <Text style={styles.buttonText}>{item.text}</Text>
              </Button>
            </Block>
          ))}
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.BLACK,
  },
  backgroundImage: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  buttonContainer: {
    width: '45%', // Slightly less than 50% for better spacing
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    // Size now controlled dynamically in component
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    width: '100%',
    borderRadius: 5,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
    padding: 8,
  },
  buttonText: {
    color: argonTheme.COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SignBridgeMain;