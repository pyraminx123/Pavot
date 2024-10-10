/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';

const ChoiceContainer = (props: {text: string; onPress: Function}) => {
  const [isSelected, setIsSelected] = useState(false);
  const {styles, theme} = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.choiceContainer,
        {borderColor: isSelected ? theme.colors.dark : theme.colors.light},
      ]}
      onPress={() => {
        setIsSelected(true);
        props.onPress();
      }}>
      <View style={styles.bigCircle}>
        <View style={[styles.smallCircle, {opacity: isSelected ? 1 : 0}]} />
      </View>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};

type SingleChoiceProps = NativeStackScreenProps<
  AppStackParamList,
  'SingleChoice'
>;

const SingleChoiceScreen = ({navigation, route}: SingleChoiceProps) => {
  const word = route.params.term;
  const correctDef = route.params.correctDef;
  const originalDeckName = route.params.originalDeckName;
  const allDefs = route.params.otherDefs; // TODO add the correct def to it and shuffle
  const {styles, theme} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, setCurrentIndex} = useLearningModeContext();

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
    if (isExiting) {
      navigation.setOptions({animation: 'slide_from_bottom'});
      navigation.navigate('DeckHome', route.params.flashcardParams);
    }
  }, [isExiting]);

  const checkWord = async (def: string) => {
    if (correctDef === def) {
      console.log('Correct!');
    } else {
      console.log('Incorrect!');
    }
    await theme.utils.sleep(500);
    const allWordsLength = route.params.flashcardParams.data.length;
    if (currentIndex < allWordsLength - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    navigation.navigate('LearningMode', {
      flashcardParams: route.params.flashcardParams,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{word}</Text>
      {allDefs.map((def, index) => (
        <ChoiceContainer
          key={index}
          text={def}
          onPress={() => {
            checkWord(def);
          }}
        />
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    top: 10,
    left: 35,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.middleTitle,
    fontWeight: '200',
    color: theme.colors.dark,
    marginBottom: 20,
  },
  choiceContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light,
    marginVertical: 5,
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.text,
    fontWeight: '200',
    color: theme.colors.dark,
  },
  bigCircle: {
    height: 25,
    width: 25,
    borderRadius: 25,
    borderColor: theme.colors.dark,
    borderWidth: 1.5,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCircle: {
    height: 15,
    width: 15,
    borderRadius: 15,
    backgroundColor: theme.colors.dark,
  },
}));

export default SingleChoiceScreen;
