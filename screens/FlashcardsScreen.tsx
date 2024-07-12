import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../App';
import {runOnJS} from 'react-native-reanimated';
import {updateWordStats} from './handleData';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route}: FlashcardsProps) => {
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  const uniqueDeckName = route.params.uniqueDeckName;

  const [terms, setTerms] = useState(data);
  //console.log('terms', route.params.data);
  const initialLength = terms.length;
  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {
        term: '',
        definition: '',
        id: initialLength + 1,
        deckID: -1,
        wordStats: '{"Attemps":[0,0,0,0]}',
      },
    ];
    setTerms(termsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface wordObj {
    deckID: number;
    definition: string;
    term: string;
    id: number;
    wordStats: string;
  }

  interface wordStats {
    Attemps: number[];
  }

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
      updateWordStats(
        uniqueDeckName,
        Object(wordObj).id,
        JSON.stringify(wordStats),
      );
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

  return (
    // TODO handle case where no words are added yet
    // TODO after make card before already appear but text just not visible
    <View style={styles.container}>
      <Text style={styles.title}>{originalDeckName}</Text>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {terms.map((wordObj: wordObj, index: number) => {
          if (index === 0) {
            if (terms.length === 1) {
              return (
                <Flashcard
                  currentWordObj={wordObj}
                  key={wordObj.id}
                  terms={terms}
                  setTerms={setTerms}
                  disableGesture={true}
                  changeWordStats={triggerChangeWordStats}
                />
              );
            } else {
              const nextWordObj = terms[index + 1];
              return (
                // each object, even if not rendered has to have an unique key
                <React.Fragment key={wordObj.id}>
                  <Flashcard
                    currentWordObj={nextWordObj}
                    terms={terms}
                    setTerms={setTerms}
                    changeWordStats={triggerChangeWordStats}
                  />
                  <Flashcard
                    currentWordObj={wordObj}
                    terms={terms}
                    setTerms={setTerms}
                    changeWordStats={triggerChangeWordStats}
                  />
                </React.Fragment>
              );
            }
          }
        })}
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EDE6C3',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlashcardsScreen;
