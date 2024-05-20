import React from 'react';
import {View, Text, StyleSheet, Button, Pressable} from 'react-native';

import {Folder} from './components/Folder';
import {retrieveDataFromTable} from './handleData';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList, folderData} from '../App';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const {t} = useTranslation();
  // TODO use map()
  const navigateToSetsScreen = (tableName: string) => {
    const decks = retrieveDataFromTable(tableName) as folderData[];
    navigation.navigate('Set', {
      decks,
      tableName,
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
