import React, {useEffect, useState} from 'react';

import {View, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

// props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = () => {
  const [words, setWords] = useState([
    {word: 'nadar', definition: 'to swim', id: 0},
    {word: 'trepar', definition: 'to climb', id: 1},
    {word: 'comer', definition: 'to eat', id: 2},
    {word: 'hola', definition: 'hello', id: 3},
  ]);

  const initialLength = words.length;

  useEffect(() => {
    const wordsWithEnding = [
      ...words,
      {word: '', definition: '', id: initialLength},
    ];
    setWords(wordsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // after make card before already appear but text just not visible
    <View style={styles.container}>
      <GestureHandlerRootView>
        {words.map((wordObj, index) => {
          if (index === 0) {
            if (words.length === 1) {
              console.log(wordObj.id);
              return (
                <Flashcard
                  key={wordObj.id}
                  word={wordObj.word}
                  definition={wordObj.definition}
                  words={words}
                  setWords={setWords}
                  disableGesture={true}
                />
              );
            } else {
              const nextWordObj = words[index + 1];
              console.log(wordObj.id, nextWordObj.id);
              return (
                // each object, even if not rendered has to have an unique key
                <React.Fragment key={wordObj.id}>
                  <Flashcard
                    word={nextWordObj.word}
                    definition={nextWordObj.definition}
                    words={words}
                    setWords={setWords}
                  />
                  <Flashcard
                    word={wordObj.word}
                    definition={wordObj.definition}
                    words={words}
                    setWords={setWords}
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
