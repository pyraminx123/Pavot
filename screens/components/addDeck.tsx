import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {createDeck} from '../handleData';
import QuestionModal from './QuestionModal';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

// Define the AddDeck component
const AddDeck = (props: {onDeckAdded: Function; folderName: string}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {styles} = useStyles(stylesheet);

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

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.light,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 70,
  },
  text: {
    fontSize: theme.typography.sizes.text,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
  },
}));

export default AddDeck;
