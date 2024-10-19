/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useRef, useLayoutEffect} from 'react';

import {
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
import {MainHeader} from './components/headers';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AppStackParamList} from '../App';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {wordObj} from './types';
import {useAddButtonContext} from './contexts/headerContext';

type DecksProps = NativeStackScreenProps<AppStackParamList, 'Deck'>;

const DecksScreen = ({route, navigation}: DecksProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const uniqueFolderName = route.params.uniqueFolderName;
  const originalFolderName = route.params.originalFolderName;
  const [scrollY, setScrollY] = useState(0);
  const flatlistRef = useRef<View>(null);
  const [flatlistPositionY, setFlatlistPositionY] = useState(0);
  const {setHandleAddPress} = useAddButtonContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader
          title={theme.utils.capitalize(originalFolderName)}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, originalFolderName]);

  useFocusEffect(
    useCallback(() => {
      setHandleAddPress(() => {
        console.log('DeckScreen Add Action');
        const emptyCard = {} as wordObj[];
        navigation.navigate('Words', {
          data: emptyCard,
          uniqueDeckName: '',
          originalDeckName: '',
          uniqueFolderName: route.params.uniqueFolderName,
        });
      });
    }, []),
  );

  const measureFlatlistPosition = () => {
    if (flatlistRef.current) {
      flatlistRef.current.measureInWindow((x, y, width, height) => {
        setFlatlistPositionY(y - height);
      });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //console.log(flatlistPositionY, event.nativeEvent.contentOffset.y);
    setScrollY(event.nativeEvent.contentOffset.y + flatlistPositionY);
  };

  interface folderData {
    deckID: number;
    originalDeckName: string;
    uniqueDeckName: string;
    folderID: number;
  }
  //console.log('folder', retrieveDataFromTable(uniqueFolderName));

  const navigateToDeckHomeScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    const flashcardParams = {data, originalDeckName, uniqueDeckName};
    navigation.navigate('DeckHome', {
      flashcardParams,
      uniqueFolderName,
    });
  };

  const navigateToWordsScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    //console.log('from decks', data);
    navigation.navigate('Words', {
      data: data,
      originalDeckName: originalDeckName,
      uniqueDeckName: uniqueDeckName,
      uniqueFolderName: uniqueFolderName,
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
            navigateToDeckHomeScreen(item.uniqueDeckName, item.originalDeckName)
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

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  list: {
    alignItems: 'center',
    paddingBottom: 50,
  },
});

export default DecksScreen;
