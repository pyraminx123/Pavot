import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../App';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route}: FlashcardsProps) => {
  const data = route.params as wordObj[];
  const [terms, setTerms] = useState(data);

  const initialLength = terms.length;

  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {term: '', definition: '', id: initialLength + 1, deckID: data[0].deckID},
    ];
    setTerms(termsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface wordObj {
    deckID: number;
    definition: string;
    term: string;
    id: number;
  }

  return (
    // TODO handle case where no words are added yet
    // TODO after make card before already appear but text just not visible
    // TODO there could be a problem when the id is the same
    <View style={styles.container}>
      <GestureHandlerRootView>
        {terms.map((wordObj: wordObj, index: number) => {
          if (index === 0) {
            if (terms.length === 1) {
              return (
                <Flashcard
                  key={wordObj.id}
                  term={wordObj.term}
                  definition={wordObj.definition}
                  terms={terms}
                  setTerms={setTerms}
                  disableGesture={true}
                />
              );
            } else {
              const nextWordObj = terms[index + 1];
              return (
                // each object, even if not rendered has to have an unique key
                <React.Fragment key={wordObj.id}>
                  <Flashcard
                    term={nextWordObj.term}
                    definition={nextWordObj.definition}
                    terms={terms}
                    setTerms={setTerms}
                  />
                  <Flashcard
                    term={wordObj.term}
                    definition={wordObj.definition}
                    terms={terms}
                    setTerms={setTerms}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlashcardsScreen;
