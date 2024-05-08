import React, {useEffect, useState} from 'react';

import {View, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

import {retrieveDataFromTable} from './handleData';

// props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = () => {
  // TODO: use a variable for tableName
  const [terms, setTerms] = useState(retrieveDataFromTable('spanisch') ?? []);

  const initialLength = terms.length;

  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {term: '', definition: '', id: initialLength},
    ];
    setTerms(termsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(terms);

  return (
    // after make card before already appear but text just not visible
    <View style={styles.container}>
      <GestureHandlerRootView>
        {terms.map((wordObj, index) => {
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
