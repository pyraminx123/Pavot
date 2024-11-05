/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable, Text, View, Switch} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CloseHeader} from './components/headers';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {retrieveDataFromTable} from './handleData';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {wordObj} from './types';
import {Parrot} from './components/icons';

type LearningModeProps = NativeStackScreenProps<
  AppStackParamList,
  'LearningMode'
>;

const LearningModeScreen = ({navigation, route}: LearningModeProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const now = new Date();
  const allWords = route.params.flashcardParams.data;
  //console.log(allWords);
  const dueCards = allWords.filter(card => new Date(card.due) <= now);
  //console.log(dueCards);
  const allDefs = allWords.map(word => word.definition);
  //console.log(allDefs);
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const flashcardParams = route.params.flashcardParams;
  const [isExiting, setIsExiting] = useState(false);
  const {currentIndex, isButtonPressed, setIsButtonPressed} =
    useLearningModeContext();
  const dateToday = new Date();
  // TODO save this info to the database
  const [date, setDate] = useState(new Date());
  const [isSwitchOn, setIsSwitchOn] = useState(false);

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
    console.log(isButtonPressed, updatedAllWords.length);
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
        const params = {
          term: updatedWordObj.term,
          correctDef: updatedWordObj.definition,
          otherDefs: defsWithTerm,
          originalDeckName: originalDeckName,
          flashcardParams: updatedFlashcardParams,
          uniqueFolderName: route.params.uniqueFolderName,
        };
        navigation.navigate('HiddenTabStack', {screen: 'SingleChoice', params});
      } else {
        const params = {
          flashcardParams: updatedFlashcardParams,
          uniqueFolderName: route.params.uniqueFolderName,
        };
        navigation.navigate('HiddenTabStack', {screen: 'Write', params});
      }
    }
  }, [allWords, currentIndex, isButtonPressed]);

  const textDueWords =
    dueCards.length === 1
      ? 'You have 1 word due today'
      : 'You have ' + dueCards.length + ' words due today';

  return (
    <View style={styles.container}>
      <Text>{textDueWords}</Text>
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
              setIsSwitchOn(!isSwitchOn);
            }}
            value={isSwitchOn}
          />
        </View>
        {isSwitchOn && (
          <View style={styles.settingDate}>
            <RNDateTimePicker
              value={date}
              minimumDate={dateToday}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
              themeVariant="light"
            />
          </View>
        )}
      </View>
      <Pressable style={styles.button} onPress={() => setIsButtonPressed(true)}>
        <Text style={styles.text}>Start</Text>
      </Pressable>
      <Parrot />
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
