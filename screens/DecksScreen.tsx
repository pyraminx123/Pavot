/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useRef} from 'react';

import {
  Text,
  View,
  Pressable,
  FlatList,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import DeckContainer from './components/deckContainer';
import AddDeck from './components/addDeck';
import {retrieveDataFromTable, generateUniqueTableName} from './handleData';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AppStackParamList, deckData} from '../App';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

type DecksProps = NativeStackScreenProps<AppStackParamList, 'Deck'>;

const DecksScreen = ({route, navigation}: DecksProps) => {
  const uniqueFolderName = route.params.uniqueFolderName;
  const originalFolderName = route.params.originalFolderName;
  const [scrollY, setScrollY] = useState(0);
  const flatlistRef = useRef<View>(null);
  const [flatlistPositionY, setFlatlistPositionY] = useState(0);

  const measureFlatlistPosition = () => {
    if (flatlistRef.current) {
      flatlistRef.current.measureInWindow((x, y, width, height) => {
        setFlatlistPositionY(y - height);
      });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log(flatlistPositionY, event.nativeEvent.contentOffset.y);
    setScrollY(event.nativeEvent.contentOffset.y + flatlistPositionY);
  };

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  interface folderData {
    deckID: number;
    originalDeckName: string;
    uniqueDeckName: string;
    folderID: number;
  }
  //console.log('folder', retrieveDataFromTable(uniqueFolderName));

  const navigateToFlashcardsScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as deckData[];
    navigation.navigate('Flashcards', {data, originalDeckName, uniqueDeckName});
  };

  const navigateToWordsScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as deckData[];
    //console.log('from decks', data);
    navigation.navigate('Words', {
      data: data,
      originalDeckName: originalDeckName,
      uniqueDeckName: uniqueDeckName,
      uniqueFolderName: uniqueFolderName,
      folderID: route.params.folderID,
      originalFolderName: route.params.originalFolderName,
    });
  };

  const [decks, setDecks] = useState<folderData[]>();

  const fetchDecks = async () => {
    try {
      const getDecks = (await retrieveDataFromTable(
        uniqueFolderName,
      )) as folderData[];
      setDecks([
        ...getDecks,
        {
          deckID: -1,
          originalDeckName: 'AddDeck',
          uniqueDeckName: generateUniqueTableName('AddDeck'),
          folderID: -1,
        },
      ]);
    } catch (error) {
      console.error('Error fetching decks', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [uniqueFolderName]),
  );

  const renderItem = ({item}: {item: folderData}) => {
    if (item.deckID === -1) {
      return <AddDeck onDeckAdded={fetchDecks} folderName={uniqueFolderName} />;
    } else {
      return (
        <Pressable
          onPress={() =>
            navigateToFlashcardsScreen(
              item.uniqueDeckName,
              item.originalDeckName,
            )
          }>
          <DeckContainer
            originalDeckName={item.originalDeckName}
            uniqueDeckName={item.uniqueDeckName}
            uniqueFolderName={uniqueFolderName}
            fetchDecks={fetchDecks}
            navigateToWordsScreen={() =>
              navigateToWordsScreen(item.uniqueDeckName, item.originalDeckName)
            }
            scrollY={scrollY}
          />
        </Pressable>
      );
    }
  };

  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(originalFolderName)}</Text>
      <SafeAreaView ref={flatlistRef} onLayout={measureFlatlistPosition}>
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          numColumns={1}
          data={decks}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: theme.typography.sizes.title,
    color: theme.colors.dark,
    fontWeight: '400',
    fontFamily: theme.typography.fontFamily,
  },
  list: {
    alignItems: 'center',
    paddingBottom: 50,
  },
}));

export default DecksScreen;
