import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
} from 'react-native';

// Define the QuestionModal component
const QuestionModal = (props: {
  modalVisible: boolean;
  setModalVisible: Function;
  question: string; // eg 'Create a new Folder'
  values: Array<string>;
  setValues: Array<Function>;
  placeholers: Array<string>;
  onClose: Function;
}) => {

  return (
    <Modal
      visible={props.modalVisible}
      onRequestClose={() => props.onClose()}
      transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.question}>{props.question}</Text>
          {props.values.map((value, index) => (
            <TextInput 
              value={value} 
              onChangeText={text => props.setValues[index](text)} 
              style={styles.textInput}
              placeholder={props.placeholers[index]}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              key={index}
            />
          ))}
          <Pressable onPress={() => props.onClose()} style={styles.closeBtn} >
            <Text>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default QuestionModal;
