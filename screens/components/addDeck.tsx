import React, {useState} from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
} from 'react-native';
import {createDeck} from '../handleData';

// Define the QuestionModal component
const QuestionModal = (props: {
  question: string;
  modalVisible: boolean;
  setModalVisible: Function;
  deckName: string;
  setDeckName: Function;
  onDeckAdded: Function;
  folderName: string;
}) => {
  const onClose = async () => {
    await props.setModalVisible(false);
    await createDeck(props.deckName, props.folderName);
    props.onDeckAdded();
  };

  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={() => onClose()}
      transparent={true}>
      <View style={styles.modalView}>
        <Text>{props.question}</Text>
        <TextInput
          value={props.deckName}
          onChangeText={text => props.setDeckName(text)}
          style={styles.textInput}
        />
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// Define the AddDeck component
const AddDeck = (props: {onDeckAdded: Function, folderName: string}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const openModal = () => {
    setInputValue('');
    setModalVisible(true);
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        question={'Deck name?'}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        deckName={inputValue}
        setDeckName={setInputValue}
        onDeckAdded={props.onDeckAdded}
        folderName={props.folderName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 70,
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

export default AddDeck;
