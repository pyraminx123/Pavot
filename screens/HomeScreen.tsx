import React from 'react';

import {View, Text, StyleSheet, Button, Pressable} from 'react-native';

import {Folder} from './components/Folder';

import {retrieveDataFromTable} from './handleData';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  // TODO use map()
  const navigateToSetsScreen = (tableName: String) => {
    navigation.navigate('Set', {
      data: retrieveDataFromTable(tableName),
      tableName: tableName,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('HELLO')}</Text>
      <View style={styles.containerHorizontal}>
        <Pressable onPress={() => navigateToSetsScreen('spanish')}>
          <Folder name={'Spanisch - Impresiones B1'} />
        </Pressable>
        <Pressable onPress={() => navigateToSetsScreen('spanish')}>
          <Folder name={"Französisch - l'étranger"} />
        </Pressable>
      </View>
      <View style={styles.containerHorizontal}>
        <Pressable onPress={() => navigateToSetsScreen('spanish')}>
          <Folder name={'Spanisch - Impresiones B1'} />
        </Pressable>
        <Pressable onPress={() => navigateToSetsScreen('spanish')}>
          <Folder name={"Französisch - l'étranger"} />
        </Pressable>
      </View>
      <Button
        title="Go to flashcards"
        onPress={() => navigation.navigate('Flashcards')}
      />
      <Button title="Add" onPress={() => navigation.navigate('Add')} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerHorizontal: {
    flexDirection: 'row',
  },
  folder: {
    borderBlockColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    padding: 10,
    height: 130,
    width: 150,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
  },
});

export default HomeScreen;
