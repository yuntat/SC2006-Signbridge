import React from 'react';
import { 
  View, 
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
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('SignBridgeMain')}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>{t('backToHome')}</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {/* Language Selection Buttons */}
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.buttonText}>{t('language.english')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => changeLanguage('zh')}
          >
            <Text style={styles.buttonText}>{t('language.chinese')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => changeLanguage('tl')}
          >
            <Text style={styles.buttonText}>{t('language.tamil')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => changeLanguage('ma')}
          >
            <Text style={styles.buttonText}>{t('language.malay')}</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 10,
  },
  backText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
  },
  languageButton: {
    width: '50%',
    padding: 15,
    backgroundColor: argonTheme.COLORS.DEFAULT,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguageSelect;