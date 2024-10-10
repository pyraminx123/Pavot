/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';

type LearningModeProps = NativeStackScreenProps<
  AppStackParamList,
  'LearningMode'
>;

const LearningModeScreen = ({navigation, route}: LearningModeProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const allWords = route.params.flashcardParams.data;
  const allDefs = allWords.map(word => word.definition);
  //console.log(allDefs);
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex} = useLearningModeContext();

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
        navigation.navigate('DeckHome', route.params.flashcardParams);
      }
    };
    updateNavigationOptions();
  }, [isExiting]);

  useEffect(() => {
    const wordObj = allWords[currentIndex];
    console.log(wordObj, currentIndex);
    if ((wordObj.state as unknown as string) === 'New') {
      const otherDefs = allDefs.filter(word => word !== wordObj.definition); // removes the correct definition
      const otherRandomDefs = theme.utils
        .shuffleArray([...otherDefs])
        .slice(0, 4);
      const defsWithTerm = theme.utils.shuffleArray([
        ...otherRandomDefs,
        wordObj.definition,
      ]);
      //console.log('rand', otherRandomDefs, 'with', defsWithTerm);
      navigation.navigate('SingleChoice', {
        term: wordObj.term,
        correctDef: wordObj.definition,
        otherDefs: defsWithTerm,
        originalDeckName: originalDeckName,
        flashcardParams: route.params.flashcardParams,
      });
    } else {
      console.log('hello');
    }
  }, [allWords, currentIndex]);

  // TODO check that array contains at least 4 items
  return <View style={styles.container} />;
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: theme.colors.dark,
  },
}));

export default LearningModeScreen;
