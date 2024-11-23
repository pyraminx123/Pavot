/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect, useState} from 'react';
import {View, TextInput} from 'react-native';
import {WordsHeader} from './components/headers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HiddenTabStackParamList} from '../App';
import {useStyles, createStyleSheet} from 'react-native-unistyles';
import {createFolder} from './handleData';

type AddFolderProps = NativeStackScreenProps<
  HiddenTabStackParamList,
  'AddFolder'
>;

const AddFolderScreen = ({navigation, route}: AddFolderProps) => {
  const originalFolderName = route.params.originalFolderName;
  const uniqueFolderName = route.params.uniqueFolderName;
  const [text, onChangeText] = useState(originalFolderName);
  const {styles, theme} = useStyles(stylesheet);

  // TODO update function for when folder name is edited
  const onSave = () => {
    if (uniqueFolderName.length === 0) {
      createFolder(text);
    }
    navigation.navigate('Home');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <WordsHeader
          title={uniqueFolderName.length ? 'Edit Folder' : 'Create Folder'}
          onSave={onSave}
          onClose={navigation.goBack}
        />
      ),
      gestureEnabled: false,
      headerBackVisible: false,
      animation: 'slide_from_right',
    });
  }, [navigation, text]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={text}
        onChangeText={txt => {
          onChangeText(txt);
        }}
        placeholder="Folder name"
        placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
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
  title: {
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.dark,
    fontWeight: '400',
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dark,
    marginHorizontal: 20,
    marginTop: '50%',
  },
}));

export default AddFolderScreen;
