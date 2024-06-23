import React, {useState} from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {insertIntoDeck} from '../handleData';
import QuestionModal from './QuestionModal';

// Define the AddWord component
const AddWord = (props: {
  onWordAdded: Function;
  folderName: string;
  deckName: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const openModal = () => {
    setInputValue1('');
    setInputValue2('');
    setModalVisible(true);
  };

  const onClose = async () => {
    await setModalVisible(false);
    await insertIntoDeck(
      props.folderName,
      props.deckName,
      inputValue1,
      inputValue2,
    );
    props.onWordAdded();
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={openModal}>
        <Text style={styles.text}>+</Text>
      </Pressable>
      <QuestionModal
        question={'Add a new word'}
        placeholers={['Enter term', 'Enter definition']}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        values={[inputValue1, inputValue2]}
        setValues={[setInputValue1, setInputValue2]}
        onClose={onClose}
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
});

export default AddWord;
