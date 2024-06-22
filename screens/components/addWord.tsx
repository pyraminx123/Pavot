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
  term: string,
  definition: string
}) => {
  const onClose = async () => {
    await props.setModalVisible(false);
    await insertIntoDeck(props.folderName, props.deckName, props.term, props.definition);
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
const AddWord = (props: {onWordAdded: Function, folderName: string, deckName: string, term: string, definition: string}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input1Value, setInput1Value] = useState('');
  const [input2Value, setInput2Value] = useState('');

  const openModal = () => {
    setInput1Value('');
    setInput2Value('');
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
        setTerm={setInput1Value}
        setDefinition={setInput2Value}
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
    borderBlockColor: 'black',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 10,
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

export default AddWord;
