import React from "react";
import { ScrollView, StyleSheet, Text, ImageBackground, useWindowDimensions } from "react-native";
import { Block, Button, theme } from "galio-framework";
import { argonTheme } from "../constants";
import { Images } from "../constants";

const TermsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  
  const termsData = [
    {
      title: "1. Acceptance of Terms",
      content: "By using SignBridge, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately."
    },
    {
      title: "2. User Responsibilities",
      content: "You agree to: Provide accurate information when required, not upload harmful content, use the App only for lawful purposes, and not attempt to reverse-engineer the App."
    },
    {
      title: "3. Privacy Policy",
      content: "All video/data processing occurs on-device when possible. Uploaded videos are temporarily stored then deleted. We collect usage data to improve accuracy (opt-out available)."
    },
    {
      title: "4. Prohibited Activities",
      content: "You may not use the App to: Harass others, upload abusive content, violate intellectual property rights, conduct illegal activities, or overload system resources."
    },
    {
      title: "5. Accuracy Disclaimer",
      content: "Translations are AI-generated and may contain errors. Not for medical/legal use. Verify critical communications. We continuously work to improve accuracy."
    },
    {
      title: "6. Video Upload Terms",
      content: "Maximum 5 minute duration. Files auto-deleted after 24 hours. Only MP4/MOV/AVI formats. 100MB maximum size."
    }
  ];
  
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: width,
      height: height,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 20,
      justifyContent: 'center',
    },
    content: {
      paddingBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.COLORS.WHITE,
      textAlign: 'center'
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 5,
      color: theme.COLORS.WHITE
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 10,
      color: theme.COLORS.WHITE
    },
    button: {
      marginTop: 30,
      alignSelf: 'center',
      backgroundColor: argonTheme.COLORS.PRIMARY,
    },
    termBlock: {
        marginBottom: 15
      }
  });

  return (
        <Block flex>
        <ImageBackground source={Images.Onboarding} style={styles.backgroundImage} resizeMode="cover">
            <Block style={styles.overlay}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Terms and Conditions</Text>
                
                {termsData.map((term, index) => (
                <Block key={index} style={styles.termBlock}>
                    <Text style={styles.sectionHeader}>{term.title}</Text>
                    <Text style={styles.text}>{term.content}</Text>
                </Block>
                ))}
                
                <Button color="primary" style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={{ color: theme.COLORS.WHITE }}>I Understand</Text>
                </Button>
            </ScrollView>
            </Block>
        </ImageBackground>
        </Block>
  );
};

export default TermsScreen;