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
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.question} >Create a new Folder</Text>
          <TextInput
            value={props.value}
            onChangeText={text => props.setValue(text)}
            style={styles.textInput}
            placeholder='Enter folder name'
            placeholderTextColor='rgba(0, 0, 0, 0.5)'
          />
          <Pressable onPress={() => onClose()} style={styles.closeBtn} >
            <Text>Close</Text>
          </Pressable>
        </View>
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
    borderRadius: 15,
    height: 130,
    width: 150,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 25,
  },
  question: {
    fontSize: 20,
    margin: 20,
  },
  textInput: {
    height: 50,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
  },
  closeBtn: {
    margin: 20,
    backgroundColor: 'white',
    width: 120,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    backgroundColor: '#83B4E1',
    alignItems: 'center',
    borderRadius: 25,
    width: 345,
    height: 200,
  },
});

export default AddFolder;
