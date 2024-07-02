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
import {
  retrieveDataFromTable,
  createFoldersTable,
  generateUniqueTableName,
} from './handleData';

// for translation
import '../i18n.config';
import {useTranslation} from 'react-i18next';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, folderInfo} from '../App';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  createFoldersTable();
  //insertIntoAllFolders('test');
  const {t} = useTranslation();

  const navigateToDecksScreen = (folder: folderInfo) => {
    navigation.navigate('Deck', folder);
  };

  interface allFoldersArray {
    folderID: number;
    originalFolderName: string;
    uniqueFolderName: string;
  }

  // rerender when new folder is added
  const [allFolders, setAllFolders] = useState<allFoldersArray[]>([]);

  const fetchFolders = async () => {
    try {
      const folders = (await retrieveDataFromTable(
        'allFolders',
      )) as allFoldersArray[];
      setAllFolders([
        ...folders,
        {
          folderID: -1,
          originalFolderName: 'AddFolder',
          uniqueFolderName: generateUniqueTableName('AddFolder'),
        },
      ]);
    } catch (error) {
      console.error('Error fetching folders', error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  //console.log(allFolders, 'all folders');

  // Folder component inside a Pressable
  // varable has to be named item
  const renderItem = ({item}: {item: allFoldersArray}) => {
    if (item.folderID === -1) {
      return <AddFolder onFolderAdded={fetchFolders} />;
    } else {
      return (
        <Pressable onPress={() => navigateToDecksScreen(item)}>
          <Folder
            name={item.originalFolderName}
            fetchFolders={fetchFolders}
            folderID={item.folderID}
          />
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('HELLO')}</Text>
      <SafeAreaView>
        <FlatList
          numColumns={2}
          data={allFolders}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EDE6C3',
  },
  list: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  text: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
  },
});

export default HomeScreen;
