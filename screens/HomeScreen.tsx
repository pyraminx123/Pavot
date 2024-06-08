/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  ScrollView,
} from 'react-native';

import {Folder} from './components/Folder';
import AddFolder from './components/addFolder';
import {retrieveDataFromTable, createFoldersTable} from './handleData';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, folderData} from '../App';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  createFoldersTable();
  const {t} = useTranslation();

  const navigateToSetsScreen = (tableName: string) => {
    const decks = retrieveDataFromTable(tableName) as folderData[];
    navigation.navigate('Set', {
      decks,
      tableName,
    });
  };

  interface allFoldersArray {
    folderID: number;
    folderName: string;
  }

  // TODO rerender when new folder is added
  const [allFolders, setAllFolders] = useState<allFoldersArray[]>([]);

  const fetchFolders = async () => {
    const folders = (await retrieveDataFromTable(
      'allFolders',
    )) as allFoldersArray[];
    setAllFolders(folders);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  console.log(allFolders, 'all folders');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('HELLO')}</Text>
      <ScrollView contentContainerStyle={styles.containerHorizontal}>
        {allFolders?.map(folder => (
          <Pressable onPress={() => navigateToSetsScreen(folder.folderName)}>
            <Folder name={folder.folderName} key={folder.folderID} />
          </Pressable>
        ))}
      </ScrollView>
      <AddFolder onFolderAdded={fetchFolders} />
      <Button title="Add" onPress={() => navigation.navigate('Add')} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
