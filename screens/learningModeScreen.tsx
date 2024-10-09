/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {CloseHeader} from './components/headers';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {State} from 'ts-fsrs';

type LearningModeProps = NativeStackScreenProps<
  AppStackParamList,
  'LearningMode'
>;

const LearningModeScreen = ({navigation, route}: LearningModeProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);
  const allWords = route.params.data;
  const allDefs = allWords.map(word => word.definition);
  console.log(allDefs);
  const originalDeckName = route.params.originalDeckName;

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
      animation: 'slide_from_right',
    });
  }, [navigation, isExiting]);

  useEffect(() => {
    const updateNavigationOptions = async () => {
      //console.log('exiter', isExiting);
      await navigation.setOptions({
        animation: isExiting ? 'slide_from_bottom' : 'slide_from_right',
      });
      if (isExiting) {
        navigation.navigate('DeckHome', route.params);
      }
    };
    updateNavigationOptions();
  }, [isExiting]);

  return (
    <View style={styles.container}>
      {allWords.map(wordObj => {
        console.log(wordObj.state, State.New);
        if ((wordObj.state as unknown as string) === 'New') {
          //   const otherDefs = [
          //     allDefs.filter(word => word !== wordObj.definition),
          //   ];
          //const otherRandomDefs = otherDefs;
          navigation.navigate('SingleChoice', {
            term: wordObj.term,
            correctDef: wordObj.definition,
            otherDefs: ['Essen', 'Laufen', 'Schwimmen', 'Trinken'],
            originalDeckName: originalDeckName,
            flashcardParams: route.params,
          });
          return '';
        } else {
          console.log('hello');
        }
      })}
    </View>
  );
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
