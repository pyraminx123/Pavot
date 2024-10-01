/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Pressable} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../App';
import {runOnJS} from 'react-native-reanimated';
import {retrieveWordFromDeck, updateWordStats} from './handleData';
import type {wordObj, wordStats} from './types';
import {LeftIcon} from './components/icons';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route, navigation}: FlashcardsProps) => {
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  const uniqueDeckName = route.params.uniqueDeckName;
  const {styles} = useStyles(stylesheet);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: capitalize(originalDeckName),
      headerTitleStyle: styles.title,
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <LeftIcon />
        </Pressable>
      ),
    });
  }, [navigation, originalDeckName]);

  const [terms, setTerms] = useState(data);
  const [termsStack, setTermsStack] = useState(terms as wordObj[]);
  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {
        term: '',
        definition: '',
        id: Math.random(),
        deckID: -1,
        wordStats: '{"Attemps":[0,0,0,0]}',
      },
    ] as wordObj[];
    setTerms(termsWithEnding);
    setTermsStack(termsWithEnding);
  }, []);

  const changeWordStats = async (
    isWordCorrect: boolean,
    wordObj: wordObj[],
  ) => {
    try {
      const wordStats = JSON.parse(Object(wordObj).wordStats) as wordStats[];
      //console.log('stats', Object(wordStats).Attemps);
      const attemps = Object(wordStats).Attemps;
      attemps.shift(); // removes first item
      attemps.push(isWordCorrect ? 1 : 0);
      Object(wordStats).Attemps = attemps;
      await updateWordStats(
        uniqueDeckName,
        Object(wordObj).id,
        JSON.stringify(wordStats),
      );
      //console.log(wordStats);
      const updatedWordObject = retrieveWordFromDeck(
        uniqueDeckName,
        Object(wordObj).id,
      );
      setTerms(prevTerms => {
        prevTerms.map(term => {
          Object(terms).id === Object(wordObj).id ? updatedWordObject : term;
        });
        return prevTerms;
      });
      return '';
    } catch (error) {
      console.error('Some error ocurred trying to update wordStats', error);
      return '';
    }
  };

  // here the async/await are very important
  const triggerChangeWordStats = async (
    isWordCorrect: boolean,
    wordObj: wordObj[],
  ) => {
    'worklet';
    await runOnJS(changeWordStats)(isWordCorrect, wordObj);
  };

  // useEffect(() => {
  //   terms.map(term => {
  //     if (term.deckID !== -1) {
  //       const wordAttemps = Object(
  //         JSON.parse(Object(term).wordStats) as wordStats[],
  //       ).Attemps;
  //       console.log(wordAttemps);
  //       if (wordAttemps.includes(0)) {
  //         setTermsStack(prevData => {
  //           return [...prevData, term];
  //         });
  //       } else {
  //         return term;
  //       }
  //     } else {
  //       return term;
  //     }
  //   });
  // }, [terms]);

  return (
    // TODO handle case where no words are added yet
    // TODO after make card before already appear but text just not visible
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {termsStack.length > 0 && (
          <>
            <Pressable style={styles.card} />
            <Flashcard
              currentWordObj={termsStack[0]}
              key={termsStack[0].id}
              termsStack={termsStack}
              setTermsStack={setTermsStack}
              disableGesture={termsStack.length === 1}
              changeWordStats={triggerChangeWordStats}
            />
          </>
        )}
      </GestureHandlerRootView>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  title: {
    fontSize: theme.typography.sizes.title,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    height: 200,
    backgroundColor: theme.colors.light,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: theme.colors.light,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default FlashcardsScreen;
