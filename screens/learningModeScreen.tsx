/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {retrieveDataFromTable} from './handleData';
import {wordObj} from './types';

type LearningModeProps = NativeStackScreenProps<
  AppStackParamList,
  'LearningMode'
>;

const LearningModeScreen = ({navigation, route}: LearningModeProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const now = new Date();
  const allWords = route.params.flashcardParams.data;
  console.log(allWords);
  const dueCards = allWords.filter(card => new Date(card.due) <= now);
  console.log(dueCards);
  const allDefs = allWords.map(word => word.definition);
  //console.log(allDefs);
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const flashcardParams = route.params.flashcardParams;
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, isButtonPressed, setIsButtonPressed} =
    useLearningModeContext();
  useEffect(() => {
    if (currentIndex === 0) {
      setIsButtonPressed(false);
    }
  }, [currentIndex, setIsButtonPressed]);

  // with the help of chatGPT
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setIsExiting(true);
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
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
      animation: 'none',
    });
  }, [navigation, isExiting]);

  useEffect(() => {
    const updateNavigationOptions = async () => {
      //console.log('exiter', isExiting);
      await navigation.setOptions({
        animation: isExiting ? 'slide_from_bottom' : 'none',
      });
      if (isExiting) {
        navigation.navigate('DeckHome', {
          flashcardParams: route.params.flashcardParams,
        });
      }
    };
    updateNavigationOptions();
  }, [isExiting]);

  useEffect(() => {
    const updatedAllWords = retrieveDataFromTable(
      route.params.flashcardParams.uniqueDeckName,
    ) as wordObj[];

    const updatedData = retrieveDataFromTable(
      flashcardParams.uniqueDeckName,
    ) as wordObj[];
    const updatedFlashcardParams = {
      data: updatedData,
      uniqueDeckName: flashcardParams.uniqueDeckName,
      originalDeckName,
    };
    const updatedWordObj = updatedAllWords[currentIndex];
    //console.log(updatedWordObj, currentIndex);
    // TODO navigate to empty screen to add Words
    if (updatedAllWords.length > 0 && isButtonPressed === true) {
      if ((updatedWordObj.state as unknown as string) === 'New') {
        const otherDefs = allDefs.filter(
          word => word !== updatedWordObj.definition,
        ); // removes the correct definition
        const otherRandomDefs = theme.utils
          .shuffleArray([...otherDefs])
          .slice(0, 4);
        const defsWithTerm = theme.utils.shuffleArray([
          ...otherRandomDefs,
          updatedWordObj.definition,
        ]);
        //console.log('rand', otherRandomDefs, 'with', defsWithTerm);
        navigation.navigate('SingleChoice', {
          term: updatedWordObj.term,
          correctDef: updatedWordObj.definition,
          otherDefs: defsWithTerm,
          originalDeckName: originalDeckName,
          flashcardParams: updatedFlashcardParams,
        });
      } else {
        navigation.navigate('Write', {
          flashcardParams: updatedFlashcardParams,
        });
      }
    }
  }, [allWords, currentIndex, isButtonPressed]);

  return (
    <View style={styles.container}>
      {dueCards.map((word, index) => {
        return (
          <View key={index}>
            <Text>{word.term}</Text>
          </View>
        );
      })}
      <Pressable style={styles.button} onPress={() => setIsButtonPressed(true)}>
        <Text style={styles.text}>Start</Text>
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '200',
    marginVertical: 12,
    fontSize: theme.typography.sizes.text,
    color: theme.colors.light,
  },
  button: {
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    backgroundColor: theme.colors.dark,
  },
}));

export default LearningModeScreen;
