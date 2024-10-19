/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Pressable, SafeAreaView, FlatList} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Folder} from './components/Folder';
import AddFolder from './components/addFolder';
import {
  retrieveDataFromTable,
  createFoldersTable,
  generateUniqueTableName,
} from './handleData';

// for translation
import '../i18n.config';
//import {useTranslation} from 'react-i18next';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, folderInfo} from '../App';
import {useAddButtonContext} from './contexts/headerContext';
import {useFocusEffect} from '@react-navigation/native';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const {styles} = useStyles(stylesheet);
  const {setHandleAddPress} = useAddButtonContext();
  createFoldersTable();
  //insertIntoAllFolders('test');
  //const {t} = useTranslation() eg {t('HELLO')};

  useFocusEffect(
    useCallback(() => {
      setHandleAddPress(() => {
        console.log('HomeScreen Add Action');
      });
    }, []),
  );

  const navigateToDecksScreen = (folder: folderInfo) => {
    console.log('folder', folder);
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
      <Text style={styles.text}>Vocabulum</Text>
      <SafeAreaView style={styles.listContainer}>
        <FlatList
          numColumns={2}
          data={allFolders}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    marginTop: 60,
  },
  list: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  text: {
    top: 50,
    color: theme.colors.dark,
    fontSize: 40,
    textAlign: 'center',
  },
}));

export default HomeScreen;
