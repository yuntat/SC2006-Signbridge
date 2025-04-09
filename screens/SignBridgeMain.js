import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { ImageBackground, StyleSheet, useWindowDimensions, Image, View } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { MotiView } from 'moti';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

import { Images, argonTheme } from '../constants';
import { useTranslation } from 'react-i18next';

const SignBridgeMain = ({ navigation }) => {
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const imageSize = Math.min(width, height) * 0.28;

  // State to manage the key for re-animation
  const [animationKey, setAnimationKey] = useState(0);

  // Use useFocusEffect to trigger animation reset on screen focus
  useFocusEffect(
    useCallback(() => {
      // Increment the key whenever the screen comes into focus
      // This forces the component with this key to re-mount
      setAnimationKey(prevKey => prevKey + 1);

      // No cleanup needed in this case, but good practice to return undefined or a cleanup function
      return undefined;
    }, []) // Empty dependency array means this effect callback itself doesn't change
  );


  const buttons = [
    // ... (button definitions remain the same)
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
      onPress: () => navigation.navigate('SignToText')
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
        <View style={styles.overlay} />

        {/* Use React.Fragment with the animationKey to wrap the mapping */}
        {/* Changing the key forces this fragment and its children to re-render */}
        <Block flex style={styles.gridContainer} key={animationKey}>
          {buttons.map((item, index) => (
            <MotiView
              // Use item.id for MotiView's key - important for Moti's internal tracking if needed
              // The parent's key change is what triggers the remount here.
              key={item.id}
              style={styles.buttonContainerWrapper}
              from={{ opacity: 0, scale: 0.7, translateY: 30 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 500,
                delay: index * 150,
              }}
            >
              <Block style={styles.buttonContainer}>
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
                  <Text style={styles.buttonText} numberOfLines={2} ellipsizeMode="tail">
                    {item.text}
                  </Text>
                </Button>
              </Block>
            </MotiView>
          ))}
        </Block>
      </ImageBackground>
    </Block>
  );
};

// --- Styles remain the same ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.BLACK,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  gridContainer: {
    // Removed flex: 1 from here as the Block parent takes flex: 1
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  buttonContainerWrapper: {
     width: '48%',
     marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  image: {
    marginBottom: 12,
    borderRadius: 15,
  },
  button: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 4,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  buttonText: {
    color: argonTheme.COLORS.WHITE,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default SignBridgeMain;