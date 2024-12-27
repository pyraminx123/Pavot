/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {View, Text, Pressable, SafeAreaView, FlatList} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Folder} from './components/Folder';
import {retrieveDataFromTable, createFoldersTable} from './handleData';

// for translation
import '../i18n.config';
//import {useTranslation} from 'react-i18next';

import {AppStackParamList, folderInfo} from '../App';
import {useAddButtonContext} from './contexts/headerContext';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type HomeScreenProps = NativeStackNavigationProp<AppStackParamList, 'Home'>;

//type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const {styles} = useStyles(stylesheet);
  const {setHandleAddPress} = useAddButtonContext();
  createFoldersTable();
  //insertIntoAllFolders('test');
  //const {t} = useTranslation() eg {t('HELLO')};

  useFocusEffect(
    useCallback(() => {
      fetchFolders();
      setHandleAddPress(() => {
        navigation.navigate('HiddenTabStack', {
          screen: 'AddFolder',
          params: {uniqueFolderName: '', originalFolderName: ''},
        });
      });
    }, []),
  );

  const navigateToDecksScreen = (folder: folderInfo) => {
    //console.log('folder', folder);
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
      setAllFolders(folders);
    } catch (error) {
      console.error('Error fetching folders', error);
    }
  };

  //console.log(allFolders, 'all folders');

  // Folder component inside a Pressable
  const renderItem = ({item}: {item: allFoldersArray}) => {
    return (
      <Pressable onPress={() => navigateToDecksScreen(item)}>
        <Folder
          name={item.originalFolderName}
          fetchFolders={fetchFolders}
          folderID={item.folderID}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pavot</Text>
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
