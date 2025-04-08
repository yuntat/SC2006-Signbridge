import React, { useState } from 'react';
import { StyleSheet, TextInput, View, ImageBackground, useWindowDimensions } from 'react-native';
import { Block, Button, Text } from 'galio-framework';
import { Images, argonTheme } from '../constants';

const TextToSign = ({ navigation }) => {
  const [text, setText] = useState('');
  const { height, width } = useWindowDimensions();

  const handleConvert = () => {
    console.log('Converting text:', text);
    // Add your conversion logic here
    // You would typically call your sign language generation API here
  };

  return (
    <Block flex>
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block flex style={styles.container}>
          <Block style={styles.content}>
            <Text style={styles.title}>Text to Sign Language</Text>
            
            {/* Text Input Box */}
            <TextInput
              style={styles.input}
              multiline
              placeholder="Enter your text here..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
            />

            {/* Convert Button */}
            <Button 
              color={argonTheme.COLORS.ORANGE}
              onPress={handleConvert}
              style={styles.button}
            >
              Convert
            </Button>

            {/* Sign Language Display Area */}
            {text && (
              <Block style={styles.signDisplay}>
                <Text style={styles.signText}>Sign language output will appear here</Text>
              </Block>
            )}
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
    padding: 20,
    justifyContent: 'center'
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: argonTheme.COLORS.BLACK,
    marginBottom: 25,
    textAlign: 'center'
  },
  input: {
    minHeight: 150,
    borderColor: argonTheme.COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: argonTheme.COLORS.WHITE
  },
  button: {
    width: '100%',
    borderRadius: 8,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  signDisplay: {
    marginTop: 25,
    padding: 15,
    backgroundColor: argonTheme.COLORS.LIGHT,
    borderRadius: 8,
    alignItems: 'center'
  },
  signText: {
    color: argonTheme.COLORS.BLACK,
    fontSize: 16
  }
});

export default TextToSign;