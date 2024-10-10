/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {RightArrow} from './components/icons';
import algorithm from './algo';

type WriteProps = NativeStackScreenProps<AppStackParamList, 'Write'>;

const WriteScreen = ({navigation, route}: WriteProps) => {
  const flashcardParams = route.params.flashcardParams;
  const {styles, theme} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, setCurrentIndex} = useLearningModeContext();
  const wordObj = flashcardParams.data[currentIndex];
  const term = wordObj.term;
  const def = wordObj.definition;
  const [text, onChangeText] = useState('');

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
          title={theme.utils.capitalize(flashcardParams.originalDeckName)}
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

  // TODO check for typos and stuff like that
  const checkWord = async (enteredDef: string) => {
    const isCorrect = enteredDef === def;
    //console.log(isCorrect);
    algorithm(
      isCorrect,
      2,
      route.params.flashcardParams.data[currentIndex],
      route.params.flashcardParams.uniqueDeckName,
    );
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
      <View style={styles.card}>
        <Text style={styles.text}>{term}</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={txt => onChangeText(txt)}
          placeholder="Definition"
          placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
        />
        <Pressable style={styles.arrow} onPress={() => checkWord(text)}>
          <RightArrow />
        </Pressable>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  card: {
    marginTop: 30,
    width: 320,
    height: 200,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: theme.colors.light,
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.middleTitle,
    color: theme.colors.dark,
    fontWeight: '200',
  },
  textInput: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.text,
    fontWeight: '200',
    marginTop: 20,
    width: 320,
    color: theme.colors.dark,
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dark,
  },
  textInputContainer: {
    flexDirection: 'row',
  },
  arrow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
}));

export default WriteScreen;
