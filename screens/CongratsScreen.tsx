/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect} from 'react';
import {Text, View} from 'react-native';
import {useStyles, createStyleSheet} from 'react-native-unistyles';
import {CloseHeader} from './components/headers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HiddenTabStackParamList} from '../App';
import {deleteDueCards} from './handleData';

type CongratsProps = NativeStackScreenProps<
  HiddenTabStackParamList,
  'Congrats'
>;

const CongratsScreen = ({navigation, route}: CongratsProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const originalDeckName = route.params.originalDeckName;
  const deckHomeParams = route.params.deckHomeParams;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CloseHeader
          title={theme.utils.capitalize(originalDeckName)}
          onPress={() => {
            navigation.navigate('DeckHome', deckHomeParams);
            // TODO problem: if the whole study session is not completed, the due cards will not be deleted
            deleteDueCards(
              deckHomeParams.uniqueFolderName,
              deckHomeParams.flashcardParams.uniqueDeckName,
            );
          }}
        />
      ),
      gestureEnabled: false,
      headerBackVisible: false,
      animation: 'none',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Congrats!</Text>
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
    color: theme.colors.dark,
  },
}));

export default CongratsScreen;
