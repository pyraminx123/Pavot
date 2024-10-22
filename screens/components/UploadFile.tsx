/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Alert, Pressable, Text} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {UploadIcon} from './icons';
import {pick, types} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {wordObj} from '../types';

const UploadFile = (props: {
  previousData: wordObj[];
  setData: Function;
  uniqueFolderName: string;
  uniqueDeckName: string;
}) => {
  const {styles} = useStyles(stylesheet);
  const [fileContent, setFileContent] = useState('');
  const handleUpload = async () => {
    try {
      const document = await pick({
        allowMultiSelection: false,
        type: [types.plainText],
      });
      const allFilesAreTxt = document.every(file => file.type === 'text/plain');
      if (!allFilesAreTxt) {
        Alert.alert('Error', 'Please select a .txt file');
      } else {
        //console.log('doc', document);
        const fileUri = document[0].uri;
        //console.log('File URI:', fileUri);
        let decodedUri = decodeURIComponent(fileUri);
        if (decodedUri.startsWith('file://')) {
          decodedUri = decodedUri.replace('file://', '');
        }
        setFileContent(await RNFS.readFile(decodedUri, 'utf8'));
      }
    } catch (error) {
      console.log('Document selection error:', error);
    }
  };

  // with the help of Copilot
  useEffect(() => {
    if (fileContent) {
      const newCards = fileContent
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => {
          try {
            const [term, definition] = line.split('\t');
            return {
              deckID: -1,
              definition: definition,
              difficulty: 0,
              due: new Date(),
              elapsed_days: 0,
              id: Math.random(),
              lapses: 0,
              last_review: new Date(),
              reps: 0,
              scheduled_days: -1,
              stability: -1,
              state: 0, // Ensure the state matches the wordObj type
              maturityLevel: 'Medium' as 'Medium',
              term: term,
            };
          } catch (error) {
            console.error('Error while splitting line:', error);
            return '';
          }
        });
      props.setData([...props.previousData, ...newCards]);
    }
  }, [fileContent]);

  return (
    <Pressable style={styles.button} onPress={() => handleUpload()}>
      <Text style={styles.text}>Upload .txt File</Text>
      <UploadIcon />
    </Pressable>
  );
};

const stylesheet = createStyleSheet(theme => ({
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 333,
  },
  text: {
    fontSize: theme.typography.sizes.text,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '300',
    marginRight: 10,
  },
}));

export default UploadFile;
