/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, TextInput} from 'react-native';
import {WordsHeader} from './components/headers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HiddenTabStackParamList} from '../App';
import {useStyles, createStyleSheet} from 'react-native-unistyles';
import {updateEntryInDeck} from './handleData';

type WordInfoProps = NativeStackScreenProps<
  HiddenTabStackParamList,
  'WordInfo'
>;

const WordInfoScreen = ({navigation, route}: WordInfoProps) => {
  const oldDefinition = route.params.wordObj.definition;
  const oldTerm = route.params.wordObj.term;
  const uniqueDeckName = route.params.uniqueDeckName;
  const [definition, setDefinition] = useState(oldDefinition);
  const [term, setTerm] = useState(oldTerm);
  const {styles, theme} = useStyles(stylesheet);

  const onSave = () => {
    updateEntryInDeck(
      uniqueDeckName,
      route.params.wordObj.id,
      term,
      definition,
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <WordsHeader
          title={'Word Info'}
          onSave={() => {
            onSave();
            navigation.goBack();
          }}
          onClose={navigation.goBack}
        />
      ),
      gestureEnabled: false,
      headerBackVisible: false,
      animation: 'slide_from_bottom',
    });
  }, [navigation, onSave]);
  //console.log('term', term);

  useEffect(() => {
    onSave();
  }, [term, definition]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={term}
        onChangeText={txt => {
          setTerm(txt);
        }}
        placeholder="Term"
        placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
      />
      <TextInput
        style={styles.title}
        value={definition}
        onChangeText={txt => {
          setDefinition(txt);
        }}
        placeholder="Definition"
        placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.dark,
    fontWeight: '400',
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dark,
    marginHorizontal: 20,
  },
}));

export default WordInfoScreen;
