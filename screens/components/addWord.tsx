import React, {useState} from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
} from 'react-native';
import {insertIntoDeck} from '../handleData';

// Define the QuestionModal component
const QuestionModal = (props: {
  modalVisible: boolean;
  setModalVisible: Function;
  deckName: string;
  setTerm: Function;
  setDefinition: Function;
  onWordAdded: Function;
  folderName: string;
  term: string;
  definition: string;
}) => {
  const onClose = async () => {
    await props.setModalVisible(false);
    await insertIntoDeck(
      props.folderName,
      props.deckName,
      props.term,
      props.definition,
    );
    props.onWordAdded();
  };

  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={() => onClose()}
      transparent={true}>
      <View style={styles.modalView}>
        <Text>Term?</Text>
        <TextInput
          value={props.term}
          onChangeText={text => props.setTerm(text)}
          style={styles.textInput}
        />
        <Text>Definition?</Text>
        <TextInput
          value={props.definition}
          onChangeText={text => props.setDefinition(text)}
          style={styles.textInput}
        />
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// Define the AddWord component
const AddWord = (props: {
  onWordAdded: Function;
  folderName: string;
  deckName: string;
  term: string;
  definition: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const openModal = () => {
    setInputValue1('');
    setInputValue2('');
    setModalVisible(true);
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        deckName={props.deckName}
        setTerm={setInputValue1}
        setDefinition={setInputValue2}
        onWordAdded={props.onWordAdded}
        folderName={props.folderName}
        term={props.term}
        definition={props.definition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#83B4E1',
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
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

export default AddWord;
