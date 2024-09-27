import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import QuestionModal from './QuestionModal';
import {createFolder} from '../handleData';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

// Define the AddFolder component
const AddFolder = (props: {onFolderAdded: Function}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {styles} = useStyles(stylesheet);

  const openModal = () => {
    setInputValue('');
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    createFolder(inputValue);
    props.onFolderAdded(); // eg fetches folders
  };

  return (
    <View>
      <Pressable style={styles.folder} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        question={'Create a new folder'}
        placeholers={['Enter folder name']}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        values={[inputValue]}
        setValues={[setInputValue]}
        onClose={onClose}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  folder: {
    borderRadius: 10,
    height: 130,
    width: 150,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
  },
  text: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.colors.dark,
  },
}));

export default AddFolder;
