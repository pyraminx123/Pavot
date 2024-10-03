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
import type {wordObj} from './types';
import {CloseHeader} from './components/headers';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route, navigation}: FlashcardsProps) => {
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  //const uniqueDeckName = route.params.uniqueDeckName;
  const {styles} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);

  // with the help of chatGPT
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setIsExiting(true);
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    //console.log('exiter', isExiting);
    navigation.setOptions({
      header: () => (
        <CloseHeader
          title={capitalize(originalDeckName)}
          onPress={() => {
            setIsExiting(true);
          }}
        />
      ),
      gestureEnabled: false,
      headerBackVisible: false,
      animation: 'slide_from_right',
    });
  }, [navigation, originalDeckName, isExiting]);

  useEffect(() => {
    const updateNavigationOptions = async () => {
      //console.log('exiter', isExiting);
      await navigation.setOptions({
        animation: isExiting ? 'slide_from_bottom' : 'slide_from_right',
      });
      if (isExiting) {
        navigation.goBack();
      }
    };

    updateNavigationOptions();
  }, [isExiting]);

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

  // here the async/await are very important
  const triggerChangeWordStats = async () => {
    'worklet';
    await runOnJS(() => console.log('does nothing'));
  };

  return (
    // TODO handle case where no words are added yet bzw screen doesn't open when no words are added
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
              updateCard={triggerChangeWordStats}
            />
          </>
        )}
      </GestureHandlerRootView>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
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
