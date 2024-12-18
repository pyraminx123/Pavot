/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable, Text, View, Switch, Alert} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {
  getDueCards,
  getExamDate,
  retrieveDataFromTable,
  setDueNewCards,
  setDueReviewCards,
  setExamDate,
  setExamDateSet,
} from './handleData';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {folderData, wordObj} from './types';
import {State} from 'ts-fsrs';

type LearningModeProps = NativeStackScreenProps<
  AppStackParamList,
  'LearningMode'
>;

const LearningModeScreen = ({navigation, route}: LearningModeProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const now = new Date();
  const allWords = route.params.flashcardParams.data;
  //console.log('all', allDueCards);
  //console.log(dueCards);
  const allDefs = allWords.map(word => word.definition);
  //console.log(allDefs);
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const flashcardParams = route.params.flashcardParams;
  const uniqueDeckName = flashcardParams.uniqueDeckName;
  const uniqueFolderName = route.params.uniqueFolderName;
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, isButtonPressed, setIsButtonPressed, cycle} =
    useLearningModeContext();
  // data will immediately be updated
  const [date, setDate] = useState(new Date());
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [allDueCards, setAllDueCards] = useState<wordObj[]>([]);
  const [newCards, setNewCards] = useState<wordObj[]>([]);
  const [reviewCards, setReviewCards] = useState<wordObj[]>([]);

  useEffect(() => {
    console.log('allWords changed, fetching data');
    const fetchData = async () => {
      const result = await fetchDueCards();
      if (result) {
        const {allCardsThatAreDue, dueNewCards, dueReviewCards} = result;
        setAllDueCards(allCardsThatAreDue);
        setNewCards(dueNewCards);
        setReviewCards(dueReviewCards);
      }
    };

    fetchData();
  }, [allWords]);

  const fetchDueCards = async () => {
    try {
      const newReviewCards = allWords.filter(
        card =>
          new Date(card.due) <= now &&
          card.state !== ('New' as unknown as State),
      );
      //console.log('newReviewCards', newReviewCards);
      await setDueReviewCards(newReviewCards, uniqueFolderName, uniqueDeckName);
      await setDueNewCards(uniqueFolderName, uniqueDeckName);
      const {dueNewCards, dueReviewCards} = await getDueCards(
        uniqueFolderName,
        uniqueDeckName,
      );
      const allCardsThatAreDue = [...dueReviewCards, ...dueNewCards];
      return {allCardsThatAreDue, dueNewCards, dueReviewCards};
    } catch (error) {
      console.error('Error fetching due cards', error);
    }
  };

  //console.log('allDueCards', allDueCards);

  useEffect(() => {
    const fetchExamDate = async () => {
      const examDate = await getExamDate(uniqueDeckName, uniqueFolderName);
      setDate(new Date(examDate));
    };
    fetchExamDate();
    const examSet = Boolean(
      (retrieveDataFromTable(uniqueFolderName) as folderData[]).filter(
        item => item.uniqueDeckName === uniqueDeckName,
      )[0].examDateSet,
    );
    setIsSwitchOn(examSet);
  }, [uniqueDeckName, uniqueFolderName]);

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
          uniqueFolderName: route.params.uniqueFolderName,
        });
      }
    };
    updateNavigationOptions();
  }, [isExiting]);

  // TODO retrieve data so that the status bar is up to date
  useEffect(() => {
    if (cycle > 0) {
      if (allDueCards.length - 1 === currentIndex) {
        navigation.navigate('HiddenTabStack', {
          screen: 'Congrats',
          params: {originalDeckName, deckHomeParams: route.params},
        });
      } else {
        navigation.navigate('HiddenTabStack', {
          screen: 'Cycle',
          params: {originalDeckName, deckHomeParams: route.params, allDueCards},
        });
      }
    } else {
      const updatedWordObj = allDueCards[currentIndex];
      // TODO navigate to empty screen to add Words
      if (isButtonPressed === true && updatedWordObj) {
        const updatedFlashcardParams = {
          data: allDueCards,
          uniqueDeckName: flashcardParams.uniqueDeckName,
          originalDeckName,
          uniqueFolderName,
        };
        // single choice
        // TODO if under certain retention rate (or difficulty/stability)
        if (updatedWordObj.maturityLevel === 'Difficult') {
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
          const params = {
            term: updatedWordObj.term,
            correctDef: updatedWordObj.definition,
            otherDefs: defsWithTerm,
            originalDeckName: originalDeckName,
            flashcardParams: updatedFlashcardParams,
            uniqueFolderName: route.params.uniqueFolderName,
            dataForStatusBar: retrieveDataFromTable(
              uniqueDeckName,
            ) as wordObj[],
            allDueCardsLength: allDueCards.length,
          };
          navigation.navigate('HiddenTabStack', {
            screen: 'SingleChoice',
            params,
          });
          // write
        } else {
          const params = {
            flashcardParams: updatedFlashcardParams,
            uniqueFolderName: route.params.uniqueFolderName,
            dataForStatusBar: retrieveDataFromTable(
              uniqueDeckName,
            ) as wordObj[],
            allDueCardsLength: allDueCards.length,
          };
          navigation.navigate('HiddenTabStack', {screen: 'Write', params});
        }
      } else if (isButtonPressed === true && allDueCards.length === 0) {
        setIsButtonPressed(false);
        Alert.alert('Nothing to study (-:');
      }
    }
  }, [allWords, currentIndex, isButtonPressed, cycle]);

  const textDueReviewWords =
    reviewCards.length === 1
      ? 'Review: You have 1 word due today'
      : 'Review: You have ' + reviewCards.length + ' words due today';
  const textDueNewWords =
    newCards.length === 1
      ? 'New: You have 1 word due today'
      : 'New: You have ' + newCards.length + ' words due today';

  return (
    <View style={styles.container}>
      <Text>{textDueReviewWords}</Text>
      <Text>{textDueNewWords}</Text>
      <View style={styles.settingWhole}>
        <View
          style={[
            styles.settingExam,
            isSwitchOn ? styles.bordersSwitchOn : styles.bordersSwitchOff,
          ]}>
          <Text style={styles.settingText}>Set exam date</Text>
          <Switch
            trackColor={{
              false: theme.baseColors.red,
              true: theme.baseColors.green,
            }}
            ios_backgroundColor={theme.baseColors.red}
            onValueChange={() => {
              // so that the date is set to today when the switch is turned on
              // it is if (false) since the isSwithOn value is not updated yet
              if (!isSwitchOn) {
                setDate(new Date());
                setExamDate(uniqueDeckName, uniqueFolderName, new Date());
              } else {
                setExamDateSet(uniqueDeckName, uniqueFolderName, !isSwitchOn);
              }
              setIsSwitchOn(!isSwitchOn);
            }}
            value={isSwitchOn}
          />
        </View>
        {isSwitchOn && (
          <View style={styles.settingDate}>
            <RNDateTimePicker
              value={date}
              minimumDate={now}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
                setExamDate(uniqueDeckName, uniqueFolderName, currentDate);
              }}
              themeVariant="light"
            />
          </View>
        )}
      </View>
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
  bordersSwitchOn: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bordersSwitchOff: {
    borderRadius: 10,
  },
  settingWhole: {
    marginVertical: 10,
  },
  settingExam: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    width: 330,
    padding: 10,
    justifyContent: 'space-between',
  },
  settingText: {
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    fontWeight: '200',
  },
  settingDate: {
    width: 330,
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBlockColor: theme.colors.dark,
    borderTopWidth: 1.5,
  },
}));

export default LearningModeScreen;
