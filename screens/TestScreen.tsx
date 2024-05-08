import React, {useState} from 'react';

import {View, Text, Pressable, StyleSheet, Modal} from 'react-native';

import {createTable, deleteTable, insertIntoTable} from './handleData.js';

const QuestionModal = (props: {
  question: String;
  modalVisible: boolean;
  setModalVisible: Function;
}) => {
  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={() => props.setModalVisible(false)}
      transparent={true}>
      <View style={styles.modalView}>
        <Text>{props.question}</Text>
        <Pressable onPress={() => props.setModalVisible(false)}>
          <Text>close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

function AddCardsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  deleteTable('spanish');
  createTable('spanish');

  insertIntoTable('spanish', 'kleiner Beitrag', 'el granito de arena');

  return (
    <View style={styles.centeredView}>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Add table</Text>
        <QuestionModal
          question={"What's the name of the table"}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    padding: 50,
  },
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'blue',
  },
});

export default AddCardsScreen;
