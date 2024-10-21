/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useLayoutEffect} from 'react';
import {View, Text, Pressable, FlatList} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainHeader} from './components/headers';
import {retrieveDataFromTable} from './handleData';
import {wordObj} from './types';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {State} from 'ts-fsrs';
import {useAddButtonContext} from './contexts/headerContext';
import {useFocusEffect} from '@react-navigation/native';

type DeckHomeProps = NativeStackScreenProps<AppStackParamList, 'DeckHome'>;

const DeckHomeScreen = ({route, navigation}: DeckHomeProps) => {
  const {setCurrentIndex} = useLearningModeContext();
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const uniqueDeckName = route.params.flashcardParams.uniqueDeckName;
  const initialData = retrieveDataFromTable(uniqueDeckName) as wordObj[];
  const {styles, theme} = useStyles(stylesheet);
  const {setHandleAddPress} = useAddButtonContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader
          title={theme.utils.capitalize(originalDeckName)}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, originalDeckName]);

  useFocusEffect(
    useCallback(() => {
      setHandleAddPress(() => {
        console.log('DeckHomeScreen Add Action');
        const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
        navigation.navigate('Words', {
          data,
          uniqueDeckName,
          originalDeckName,
          uniqueFolderName: route.params.uniqueFolderName,
        });
      });
    }, []),
  );

  const navigateToFlashcardsScreen = () => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    navigation.navigate('Flashcards', {
      data,
      originalDeckName,
      uniqueDeckName,
    });
  };

  const navigateToLearningModeScreen = () => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    setCurrentIndex(0);
    navigation.navigate('LearningMode', {
      flashcardParams: {
        data,
        originalDeckName,
        uniqueDeckName,
      },
      uniqueFolderName: route.params.uniqueFolderName,
    });
  };

  // TODO define maturity level in database
  const renderItem = ({
    item,
  }: {
    item: {
      term: string;
      definition: string;
      stability: number;
      state: State;
      maturityLevel: string;
    };
  }) => {
    const colors = {
      redLight: '#F0CACA',
      redDark: '#C04E4E',
      yellowLight: '#F9EDC5',
      yellowDark: '#8A7C28',
      greenLight: '#C2E8A2',
      greenDark: '#335536',
    };
    let backgroundColor = '';
    let textColor = '';
    if (item.maturityLevel === 'Difficult') {
      backgroundColor = colors.redLight;
      textColor = colors.redDark;
    } else if (item.maturityLevel === 'Easy') {
      backgroundColor = colors.greenLight;
      textColor = colors.greenDark;
    } else {
      backgroundColor = colors.yellowLight;
      textColor = colors.yellowDark;
    }
    //console.log(item);
    return (
      <View style={[styles.wordContainer, {backgroundColor: backgroundColor}]}>
        <Text style={[styles.textLeft, {color: textColor}]}>{item.term}</Text>
        <Text style={[styles.middleLine, {color: textColor}]}>|</Text>
        <Text style={[styles.textRight, {color: textColor}]}>
          {item.definition}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text>Chart pie</Text>

      <View style={styles.allButtonsContainer}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigateToFlashcardsScreen()}>
            <Text style={styles.buttonText}>Flashcards</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigateToLearningModeScreen()}>
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit>
              Learning Mode
            </Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Game</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start studying</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <FlatList data={initialData} renderItem={renderItem} />
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
  button: {
    textAlign: 'left',
    width: 150,
    justifyContent: 'center',
    backgroundColor: theme.colors.light,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  allButtonsContainer: {
    marginTop: 10,
    //justifyContent: 'space-around',
  },
  buttonText: {
    marginVertical: 5,
    fontSize: theme.typography.sizes.smallText,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '300',
  },
  wordContainer: {
    backgroundColor: theme.colors.light,
    margin: 5,
    borderRadius: 10,
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLeft: {
    fontSize: theme.typography.sizes.smallText,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '200',
    left: 10,
    position: 'absolute',
  },
  textRight: {
    fontSize: theme.typography.sizes.smallText,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '200',
    right: 10,
    position: 'absolute',
  },
  middleLine: {
    fontSize: theme.typography.sizes.text,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '100',
  },
}));

export default DeckHomeScreen;
