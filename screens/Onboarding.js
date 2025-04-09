import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  View,
  ScrollView
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { useWindowDimensions } from "react-native";

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

const Onboarding = ({ navigation }) => {
  const { height, width } = useWindowDimensions();

  return (
    <Block flex style={[styles.container, { minHeight: height }]}>
      <StatusBar hidden />
      
      {/* Background Image with Overlay */}
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
      >
        <View style={styles.imageOverlay} />
        
        {/* Content Container */}
        <Block flex style={styles.contentContainer}>
          {/* New container wrapping logo, subtitle, and button */}
          <View style={[styles.groupContainer, { width: width * 0.6 }]}>
            {/* Logo */}
            <Block style={styles.logoContainer}>
              <Image source={Images.LogoOnboarding} style={styles.logo} />
            </Block>
            
            {/* Subtitle */}
            <Block style={styles.subTitle}>
              <Text color="white" size={18}>
                Breaking Barriers, Building Connections
              </Text>
            </Block>
            
            {/* Button */}
            <Button
              style={styles.button}
              color={argonTheme.COLORS.SECONDARY}
              onPress={() => navigation.replace("Register")}
              textStyle={{ color: argonTheme.COLORS.BLACK }}
            >
              Let's Go!
            </Button>
          </View>
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
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  groupContainer: {
    backgroundColor: 'rgba(36, 36, 36, 0.5)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 500, // Reduced size for better responsiveness
    height: 350, // Maintain aspect ratio
    resizeMode: "contain",
  },
  subTitle: {
    marginBottom: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    height: theme.SIZES.BASE * 3,
    width: '40%',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

export default Onboarding;