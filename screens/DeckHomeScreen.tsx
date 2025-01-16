/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  PixelRatio,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AppStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainHeader} from './components/headers';
import {retrieveDataFromTable} from './handleData';
import {wordObj} from './types';
import {useLearningModeContext} from './contexts/LearningModeContext';
import {useAddButtonContext} from './contexts/headerContext';
import {useFocusEffect} from '@react-navigation/native';
import {VictoryPie} from 'victory-native';

type DeckHomeProps = NativeStackScreenProps<AppStackParamList, 'DeckHome'>;

const DeckHomeScreen = ({route, navigation}: DeckHomeProps) => {
  const {setCurrentIndex, setIsButtonPressed, setCycle} =
    useLearningModeContext();
  const originalDeckName = route.params.flashcardParams.originalDeckName;
  const uniqueDeckName = route.params.flashcardParams.uniqueDeckName;
  const uniqueFolderName = route.params.uniqueFolderName;
  const initialData = retrieveDataFromTable(uniqueDeckName) as wordObj[];
  const {styles, theme} = useStyles(stylesheet);
  const {setHandleAddPress} = useAddButtonContext();
  const [pieData, setPieData] = useState([
    {x: 'Difficult', y: 0},
    {x: 'Medium', y: 0},
    {x: 'Easy', y: 0},
  ]);
  function hashMaturityLevels(data: wordObj[]) {
    return data.map(item => item.maturityLevel).join('-');
  }
  const maturityLevelsHash = useMemo(
    () => hashMaturityLevels(initialData),
    [initialData],
  );

  useEffect(() => {
    const newCounts = initialData.reduce(
      (counts, item) => {
        if (item.maturityLevel === 'Difficult') {
          counts.Difficult++;
        } else if (item.maturityLevel === 'Medium') {
          counts.Medium++;
        } else if (item.maturityLevel === 'Easy') {
          counts.Easy++;
        }
        return counts;
      },
      {Difficult: 0, Medium: 0, Easy: 0},
    );

    setPieData([
      {x: 'Difficult', y: newCounts.Difficult},
      {x: 'Medium', y: newCounts.Medium},
      {x: 'Easy', y: newCounts.Easy},
    ]);
  }, [maturityLevelsHash]);

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
        //console.log('DeckHomeScreen Add Action');
        const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
        navigation.navigate('Words', {
          data,
          uniqueDeckName,
          originalDeckName,
          uniqueFolderName,
        });
      });
    }, []),
  );

  const navigateToFlashcardsScreen = () => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    navigation.navigate('HiddenTabStack', {
      screen: 'Flashcards',
      params: {data, originalDeckName, uniqueDeckName, uniqueFolderName},
    });
  };

  const navigateToLearningModeScreen = () => {
    const data = retrieveDataFromTable(uniqueDeckName) as wordObj[];
    setCurrentIndex(0);
    setIsButtonPressed(false);
    setCycle(0);
    const flashcardParams = {
      data,
      originalDeckName,
      uniqueDeckName,
      uniqueFolderName,
    };
    navigation.navigate('HiddenTabStack', {
      screen: 'LearningMode',
      params: {
        flashcardParams,
        uniqueFolderName,
      },
    });
  };

  // TODO define maturity level in database
  const renderItem = ({item}: {item: wordObj}) => {
    let backgroundColor = '';
    let textColor = '';
    if (item.maturityLevel === 'Difficult') {
      backgroundColor = theme.baseColors.redLight;
      textColor = theme.baseColors.redDark;
    } else if (item.maturityLevel === 'Easy') {
      backgroundColor = theme.baseColors.greenLight;
      textColor = theme.baseColors.greenDark;
    } else {
      backgroundColor = theme.baseColors.yellowLight;
      textColor = theme.baseColors.yellowDark;
    }

    return (
      <Pressable
        style={[styles.wordContainer, {backgroundColor: backgroundColor}]}
        onPress={() => {
          navigation.navigate('HiddenTabStack', {
            screen: 'WordInfo',
            params: {wordObj: item, uniqueDeckName},
          });
        }}>
        <Text
          style={[styles.textLeft, {color: textColor}]}
          numberOfLines={2}
          lineBreakMode="tail"
          allowFontScaling={true}>
          {item.term}
        </Text>
        <Text style={[styles.middleLine, {color: textColor}]}>|</Text>
        <Text
          style={[styles.textRight, {color: textColor}]}
          numberOfLines={2}
          lineBreakMode="tail"
          allowFontScaling={true}>
          {item.definition}
        </Text>
      </Pressable>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {initialData.length > 0 && (
        <View style={styles.pie}>
          <VictoryPie
            data={pieData}
            height={150}
            labels={() => null}
            colorScale={[
              theme.baseColors.redLight,
              theme.baseColors.yellowLight,
              theme.baseColors.greenLight,
            ]}
            padding={{top: 0, bottom: 0}}
          />
        </View>
      )}
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
        <FlatList
          contentContainerStyle={styles.list}
          data={initialData}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const borderRadius = PixelRatio.roundToNearestPixel(10);

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  pie: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    overflow: 'hidden',
    textAlign: 'left',
    width: 150,
    justifyContent: 'center',
    backgroundColor: theme.colors.light,
    padding: 10,
    margin: 5,
    borderBlockColor: theme.colors.light,
    borderRadius: borderRadius,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  allButtonsContainer: {
    marginBottom: 10,
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
    overflow: 'hidden',
    borderBlockColor: theme.colors.light,
    backgroundColor: theme.colors.light,
    margin: 5,
    borderRadius: borderRadius,
    width: 320,
    paddingVertical: 15,
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
    width: '45%',
  },
  textRight: {
    fontSize: theme.typography.sizes.smallText,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '200',
    left: '55%',
    position: 'absolute',
    width: '40%',
  },
  middleLine: {
    fontSize: theme.typography.sizes.text,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '100',
  },
  list: {
    paddingBottom: 400,
  },
}));

export default DeckHomeScreen;
