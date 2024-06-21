import React, {useState} from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
} from 'react-native';
import {createFolder} from '../handleData';

// Define the QuestionModal component
const QuestionModal = (props: {
  question: string;
  modalVisible: boolean;
  setModalVisible: Function;
  value: string;
  setValue: Function;
  onFolderAdded: Function;
}) => {
  const onClose = async () => {
    await props.setModalVisible(false);
    await createFolder(props.value);
    props.onFolderAdded();
  };

  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={() => onClose()}
      transparent={true}>
      <View style={styles.modalView}>
        <Text>{props.question}</Text>
        <TextInput
          value={props.value}
          onChangeText={text => props.setValue(text)}
          style={styles.textInput}
        />
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// Define the AddFolder component
const AddFolder = (props: {onFolderAdded: Function}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const openModal = () => {
    setInputValue('');
    setModalVisible(true);
  };

  return (
    <View>
      <Pressable style={styles.folder} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        question={'Folder name?'}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        value={inputValue}
        setValue={setInputValue}
        onFolderAdded={props.onFolderAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  folder: {
    borderBlockColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    height: 130,
    width: 150,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  },
  textInput: {
    height: 30,
    width: 100,
  },
  modalView: {
    margin: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    padding: 50,
    borderRadius: 25,
  },
});

export default AddFolder;
