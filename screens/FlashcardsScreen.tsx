/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {PixelRatio, Pressable, SafeAreaView} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HiddenTabStackParamList} from '../App';
import type {wordObj} from './types';
import {CloseHeader} from './components/headers';

type FlashcardsProps = NativeStackScreenProps<
  HiddenTabStackParamList,
  'Flashcards'
>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route, navigation}: FlashcardsProps) => {
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  const uniqueDeckName = route.params.uniqueDeckName;
  const {styles, theme} = useStyles(stylesheet);
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
          title={theme.utils.capitalize(originalDeckName)}
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
      },
    ] as wordObj[];
    setTerms(termsWithEnding);
    setTermsStack(termsWithEnding);
  }, []);

  return (
    // TODO handle case where no words are added yet bzw screen doesn't open when no words are added
    <SafeAreaView style={styles.container}>
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
              uniqueDeckName={uniqueDeckName}
              uniqueFolderName={route.params.uniqueFolderName}
            />
          </>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const borderRadius = PixelRatio.roundToNearestPixel(10);

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
    overflow: 'hidden',
    width: 320,
    height: 200,
    backgroundColor: theme.colors.light,
    borderRadius: borderRadius,
    borderWidth: 3,
    borderColor: theme.colors.light,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default FlashcardsScreen;
