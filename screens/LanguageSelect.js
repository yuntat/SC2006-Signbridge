import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSelect = ({ navigation }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    navigation.goBack(); // Return to previous screen
  };

  return (
    <View style={styles.container}>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="Chinese" onPress={() => changeLanguage('zh')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});

export default LanguageSelect;