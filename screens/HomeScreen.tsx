import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('HELLO')}</Text>
      <Button
        title="Go to flashcards"
        onPress={() => navigation.navigate('Flashcards')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
  },
});

export default HomeScreen;
