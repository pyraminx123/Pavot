/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {RightArrow} from './components/icons';
import algorithm from './algo';
import {wordObj} from './types';
import {AppStackParamList} from '../App';
import {useFocusEffect} from '@react-navigation/native';
import FeedbackModal from './components/FeedbackModal';

type WriteProps = NativeStackScreenProps<AppStackParamList, 'Write'>;

const WriteScreen = ({navigation, route}: WriteProps) => {
  const flashcardParams = route.params.flashcardParams;
  const {styles, theme} = useStyles(stylesheet);
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, setCurrentIndex} = useLearningModeContext();
  const currentWordObj = flashcardParams.data[currentIndex];
  const term = currentWordObj.term;
  const def = currentWordObj.definition;
  const [text, onChangeText] = useState('');
  const textInputRef = useRef<TextInput>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onModalClose, setOnModalClose] = useState<() => void>(() => () => {}); // typescript: with the help from CoPilot
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset text and ref each time the screen is focused
  useFocusEffect(
    useCallback(() => {
      onChangeText('');
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, [currentIndex]),
  );

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
  const currentPer = getCurrentPer(flashcardParams.data);
  const {perEasyWords, perMedWords, perDiffWords} = currentPer;
  const segmentData = [
    {per: perEasyWords, color: '#C2E8A2'},
    {per: perMedWords, color: '#F9EDC5'},
    {per: perDiffWords, color: '#F0CACA'},
  ];

  // with the help of chatGPT
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
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

  // TODO check for typos and stuff like that
  const checkWord = async (enteredDef: string) => {
    const isWordCorrect = enteredDef === def;
    setIsCorrect(isWordCorrect);
    //console.log(isCorrect);
    algorithm(
      isWordCorrect,
      2,
      route.params.flashcardParams.data[currentIndex],
      route.params.flashcardParams.uniqueDeckName,
      route.params.uniqueFolderName,
    );
    await theme.utils.sleep(500);
    await showModal();
    // waits for a response from the user
    // await new Promise(resolve => {
    //   Alert.alert(`${isCorrect}`, '', [{text: 'OK', onPress: resolve}]);
    // });
    const allWordsLength = route.params.flashcardParams.data.length;
    if (currentIndex < allWordsLength - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    navigation.navigate('HiddenTabStack', {
      screen: 'LearningMode',
      params: {
        flashcardParams,
        uniqueFolderName: route.params.uniqueFolderName,
      },
    });
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
      <View style={styles.card}>
        <Text style={styles.text}>{term}</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={text}
          onChangeText={txt => onChangeText(txt)}
          placeholder="Definition"
          placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
          onSubmitEditing={() => checkWord(text)}
        />
        <Pressable style={styles.arrow} onPress={() => checkWord(text)}>
          <RightArrow />
        </Pressable>
      </View>
      <FeedbackModal
        modalVisible={isModalVisible}
        onClose={() => onModalClose()}
        isCorrect={isCorrect}
        term={term}
        definition={def}
        userAnswer={text}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
