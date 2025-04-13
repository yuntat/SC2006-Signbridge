import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  View,
  ScrollView,
  Platform
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { useWindowDimensions } from "react-native";

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

const Onboarding = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const isMobile = width < 768; // Tablet breakpoint

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
          {/* Responsive container */}
          <View style={[
            styles.groupContainer, 
            { 
              width: isMobile ? width * 0.9 : width * 0.6,
              padding: isMobile ? 15 : 20
            }
          ]}>
            {/* Logo */}
            <Block style={styles.logoContainer}>
              <Image 
                source={Images.LogoOnboarding} 
                style={[
                  styles.logo,
                  {
                    width: isMobile ? width * 0.8 : 500,
                    height: isMobile ? width * 0.56 : 350 // 7:5 aspect ratio
                  }
                ]} 
              />
            </Block>
            
            {/* Subtitle */}
            <Block style={styles.subTitle}>
              <Text 
                color="white" 
                size={isMobile ? 16 : 18}
                style={{ textAlign: 'center' }}
              >
                Breaking Barriers, Building Connections
              </Text>
            </Block>
            
            {/* Button */}
            <Button
              style={[
                styles.button,
                {
                  width: isMobile ? '70%' : '40%',
                  height: isMobile ? theme.SIZES.BASE * 2.5 : theme.SIZES.BASE * 3
                }
              ]}
              color={argonTheme.COLORS.SECONDARY}
              onPress={() => navigation.replace("Register")}
              textStyle={{ 
                color: argonTheme.COLORS.BLACK,
                fontSize: isMobile ? 14 : 16 
              }}
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
    padding: 10,
  },
  groupContainer: {
    backgroundColor: 'rgba(36, 36, 36, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    resizeMode: "contain",
  },
  subTitle: {
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

export default Onboarding;