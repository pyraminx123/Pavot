/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect} from 'react';
import {Pressable, SafeAreaView, Text} from 'react-native';
import {useStyles, createStyleSheet} from 'react-native-unistyles';
import {CloseHeader} from './components/headers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HiddenTabStackParamList} from '../App';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {retrieveDataFromTable} from './handleData';
import {wordObj} from './types';

type CycleProps = NativeStackScreenProps<HiddenTabStackParamList, 'Cycle'>;

const CycleScreen = ({navigation, route}: CycleProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const originalDeckName = route.params.originalDeckName;
  const deckHomeParams = route.params.deckHomeParams;
  const uniqueDeckName = deckHomeParams.uniqueFolderName;
  const allWords = deckHomeParams.flashcardParams.data;
  const allDefs = allWords.map(word => word.definition);
  const allDueCards = route.params.allDueCards;
  const {setIsButtonPressed, setCurrentIndex, currentIndex, setCycle} =
    useLearningModeContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CloseHeader
          title={theme.utils.capitalize(originalDeckName)}
          onPress={() => {
            navigation.navigate('DeckHome', deckHomeParams);
          }}
        />
      ),
      gestureEnabled: false,
      headerBackVisible: false,
      animation: 'none',
    });
  }, [navigation]);

  const navigateToCorrectScreen = () => {
    const dataForStatusBar = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    const nextWordObj = allDueCards[currentIndex + 1];
    if (nextWordObj) {
      if (nextWordObj.maturityLevel === 'Difficult') {
        console.log('difficult');
        navigation.navigate('SingleChoice', {
          term: nextWordObj.term,
          correctDef: nextWordObj.definition,
          originalDeckName: originalDeckName,
          otherDefs: allDefs,
          flashcardParams: deckHomeParams.flashcardParams,
          uniqueFolderName: deckHomeParams.uniqueFolderName,
          dataForStatusBar: dataForStatusBar,
          allDueCardsLength: allDueCards.length,
        });
      } else {
        console.log('easy');
        navigation.navigate('Write', {
          flashcardParams: deckHomeParams.flashcardParams,
          dataForStatusBar: dataForStatusBar,
          uniqueFolderName: deckHomeParams.uniqueFolderName,
          allDueCardsLength: allDueCards.length,
        });
      }
    } else {
      console.log('no more cards'); // TODO navigate to congrats screen this should happen from either single or write
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Cycle</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('LearningMode', deckHomeParams);
          setIsButtonPressed(true);
          setCurrentIndex(currentIndex + 1);
          setCycle(0);
          navigateToCorrectScreen();
        }}>
        <Text>Continue</Text>
      </Pressable>
    </SafeAreaView>
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
    color: theme.colors.dark,
  },
}));

export default CycleScreen;
