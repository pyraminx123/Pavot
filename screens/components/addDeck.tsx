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
import QuestionModal from './QuestionModal';

// Define the AddDeck component
const AddDeck = (props: {onDeckAdded: Function, folderName: string}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const openModal = () => {
    setInputValue('');
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    createDeck(inputValue, props.folderName);
    props.onDeckAdded();
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        question={'Create a new deck'}
        placeholers={['Enter deck name']}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        values={[inputValue]}
        setValues={[setInputValue]}
        onClose={onClose}
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
});

export default AddDeck;
