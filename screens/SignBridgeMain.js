import React from 'react';
import { ImageBackground, View, StyleSheet, Dimensions, useWindowDimensions,Image } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { Images, argonTheme } from '../constants';

//const { width, height } = Dimensions.get('screen');

const SignBridgeMain = ({ navigation }) => {
  const buttons = [
    { id: 1, image: Images.img1, text: 'Option 1' },
    { id: 2, image: Images.img2, text: 'Option 2' },
    { id: 3, image: Images.img3, text: 'Option 3' },
    { id: 4, image: Images.img4, text: 'Option 4' },
  ];

  const { height, width } = useWindowDimensions();

  return (
      <Block flex style={styles.container}>
        <Block flex center style={styles.backgroundContainer}>
            <ImageBackground
                source={Images.Onboarding}
                style={[styles.backgroundImage, { height: height, width }]}
            >
          {/* Image Buttons Grid */}
          <Block flex center style={styles.gridContainer}>
            {buttons.map((item) => (
              <Block key={item.id} style={styles.buttonContainer}>
                <Image source={item.image} style={styles.image} />
                <Button
                  color={argonTheme.COLORS.ORANGE}
                  style={styles.button}
                  onPress={() => navigation.navigate('App')} // Goes to main app
                >
                  <Text style={styles.buttonText}>{item.text}</Text>
                </Button>
              </Block>
            ))}
          </Block>
          </ImageBackground>
        </Block>
      </Block>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  buttonContainer: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    width: '100%',
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    // shadowColor: argonTheme.COLORS.BLACK,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    // shadowOpacity: 0.1,
  },
  buttonText: {
    color: argonTheme.COLORS.WHITE,
    fontWeight: 'bold',
  },
});

export default SignBridgeMain;