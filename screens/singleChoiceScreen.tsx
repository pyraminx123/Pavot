/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';
import algorithm from './algo';
import {wordObj} from './types';
import {useFocusEffect} from '@react-navigation/native';
import FeedbackModal from './components/FeedbackModal';

const ChoiceContainer = (props: {text: string; onPress: Function}) => {
  const [isSelected, setIsSelected] = useState(false);
  const {styles, theme} = useStyles(stylesheet);
  const {currentIndex} = useLearningModeContext();

  useFocusEffect(
    useCallback(() => {
      setIsSelected(false);
    }, [currentIndex]),
  );

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
  const allDefs = route.params.otherDefs;
  const flashcardParams = route.params.flashcardParams;
  const dataForStatusBar = route.params.dataForStatusBar;
  const allDueCardsLength = route.params.allDueCardsLength;
  const {styles, theme} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, setCurrentIndex, cycle, setCycle} =
    useLearningModeContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onModalClose, setOnModalClose] = useState<() => void>(() => () => {}); // typescript: with the help from CoPilot
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const getCurrentPer = (words: wordObj[]) => {
    return {
      perDiffWords:
        (words.filter(item => item.maturityLevel === 'Difficult').length /
          words.length) *
        100,
      perMedWords:
        (words.filter(item => item.maturityLevel === 'Medium').length /
          words.length) *
        100,
      perEasyWords:
        (words.filter(item => item.maturityLevel === 'Easy').length /
          words.length) *
        100,
    };
  };
  const currentPer = getCurrentPer(dataForStatusBar);
  const {perEasyWords, perMedWords, perDiffWords} = currentPer;
  const segmentData = [
    {per: perEasyWords, color: '#C2E8A2'},
    {per: perMedWords, color: '#F9EDC5'},
    {per: perDiffWords, color: '#F0CACA'},
  ];

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
      navigation.navigate('DeckHome', {
        flashcardParams: route.params.flashcardParams,
        uniqueFolderName: route.params.uniqueFolderName,
      });
    }
  }, [isExiting]);

  const showModal = () => {
    return new Promise<void>(resolve => {
      setIsModalVisible(true);

      const handleModalClose = () => {
        setIsModalVisible(false);
        resolve();
      };

      setOnModalClose(() => handleModalClose);
    });
  };

  const checkWord = async (def: string) => {
    const isWordCorrect = correctDef === def;
    setUserAnswer(def);

    setIsCorrect(isWordCorrect);

    algorithm(
      isCorrect,
      2,
      flashcardParams.data[currentIndex],
      flashcardParams.uniqueDeckName,
      route.params.uniqueFolderName,
    );

    await theme.utils.sleep(500);
    await showModal();

    if (currentIndex === 4 || allDueCardsLength - 1 === currentIndex) {
      console.log('to cycle');
      setCycle(cycle + 1);
    } else {
      setCurrentIndex(currentIndex + 1);
      navigation.navigate('HiddenTabStack', {
        screen: 'LearningMode',
        params: {
          flashcardParams,
          uniqueFolderName: route.params.uniqueFolderName,
        },
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        {segmentData.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.lineSegment,
              {flex: segment.per, backgroundColor: segment.color},
            ]}
          />
        ))}
      </View>
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
      <FeedbackModal
        modalVisible={isModalVisible}
        onClose={() => onModalClose()}
        isCorrect={isCorrect}
        term={word}
        definition={correctDef}
        userAnswer={userAnswer}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  lineContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  lineSegment: {
    height: '100%',
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
