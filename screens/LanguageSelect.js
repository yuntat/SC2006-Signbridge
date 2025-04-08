import React from 'react';
import { 
  View, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  useWindowDimensions, 
  ImageBackground 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Images, argonTheme } from '../constants';

const LanguageSelect = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { height, width } = useWindowDimensions();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={Images.Onboarding}
      style={[styles.backgroundImage, { height, width }]}
      resizeMode="cover"
    >
      {/* Reduced opacity overlay or remove it completely */}
      <View style={styles.container}>
        {/* Back Button (Top Left) */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('SignBridgeMain')}
        >
          <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
          <Text style={styles.backText}>{t('backToHome')}</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button 
            title="English" 
            onPress={() => changeLanguage('en')} 
            color={argonTheme.COLORS.PRIMARY}
          />
          <Button 
            title="Chinese" 
            onPress={() => changeLanguage('zh')} 
            color={argonTheme.COLORS.PRIMARY}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // More transparent overlay
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backText: {
    marginLeft: 5,
    color: argonTheme.COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 40,
  },
});

export default LanguageSelect;