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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Block flex style={[styles.container, { minHeight: height }]}>
        <StatusBar hidden />

        <Block flex center style={styles.backgroundContainer}>
          <ImageBackground
            source={Images.Onboarding}
            style={[styles.backgroundImage, { height: height, width }]}
          />
        </Block>

        <Block style={styles.overlayContent}>
          {/* Render the Logo - Make it Bigger */}
          <Image source={Images.LogoOnboarding} style={styles.logo} />

          {/* Keep Subtitle Only */}
          <Block style={styles.subTitle}>
            <Text color="white" size={18}>
              Breaking Barriers, Building Connections!
            </Text>
          </Block>

          {/* Button Positioned Below Subtitle */}
          <Button
            style={[styles.button, { width: width * 0.4 }]} // Reduced width
            color={argonTheme.COLORS.SECONDARY}
            onPress={() => navigation.replace("Register")}
            textStyle={{ color: argonTheme.COLORS.BLACK }}
          >
            Get Started
          </Button>
        </Block>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  overlayContent: {
    position: "absolute",
    top: "25%", // Adjust positioning as needed
    width: "100%",
    alignItems: "center",
    zIndex: 3,
  },
  logo: {
    width: 500, // Increased logo size
    height: 350,
    resizeMode: "contain",
    marginBottom: 5,
  },
  subTitle: {
    marginBottom: 20, // Space between subtitle and button
  },
  button: {
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  }
});

export default Onboarding;
