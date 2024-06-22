/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {Folder} from './components/Folder';
import AddFolder from './components/addFolder';
import {retrieveDataFromTable, createFoldersTable} from './handleData';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, decksWithinTable} from '../App';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  createFoldersTable();
  const {t} = useTranslation();

  const navigateToSetsScreen = (tableName: string) => {
    const tableParam: decksWithinTable = {tableName};
    navigation.navigate('Deck', tableParam);
  };

  interface allFoldersArray {
    folderID: number;
    folderName: string;
  }

  // rerender when new folder is added
  const [allFolders, setAllFolders] = useState<allFoldersArray[]>([]);

  const fetchFolders = async () => {
    const folders = (await retrieveDataFromTable(
      'allFolders',
    )) as allFoldersArray[];
    setAllFolders([...folders, {folderID: -1, folderName: 'AddFolder'}]);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  console.log(allFolders, 'all folders');

  // Folder component inside a Pressable
  // varable has to be named item
  const renderItem = ({item}: {item: allFoldersArray}) => {
    if (item.folderID === -1) {
      return <AddFolder onFolderAdded={fetchFolders} />;
    } else {
      return (
        <Pressable onPress={() => navigateToSetsScreen(item.folderName)}>
          <Folder name={item.folderName} />
        </Pressable>
      );
    }
  };

  // TODO add keyExtraxtor?
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('HELLO')}</Text>
      <SafeAreaView>
        <FlatList numColumns={2} data={allFolders} renderItem={renderItem} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
