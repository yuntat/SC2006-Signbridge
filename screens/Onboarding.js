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
        <Block flex center>
          <ImageBackground
            source={Images.Onboarding}
            style={[styles.backgroundImage, { height: height, width }]}
          />
        </Block>
        <Block center style={styles.overlayContent}>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block style={styles.title}>
              <Block>
                <Text color="white" size={width > 600 ? 80 : 60}>
                  Design
                </Text>
              </Block>
              <Block>
                <Text color="white" size={width > 600 ? 80 : 60}>
                  System
                </Text>
              </Block>
              <Block style={styles.subTitle}>
                <Text color="white" size={16}>
                  Fully coded React Native components.
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block center style={styles.buttonContainer}>
          <Button
            style={[styles.button, { width: width * 0.8 }]}
            color={argonTheme.COLORS.SECONDARY}
            onPress={() => navigation.replace("App")}
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
  backgroundImage: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  overlayContent: {
    position: "absolute",
    top: "30%",
    zIndex: 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    zIndex: 3,
  },
  button: {
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  title: {
    alignItems: 'flex-start',
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;
