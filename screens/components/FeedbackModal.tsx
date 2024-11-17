import React from 'react';
import {Modal, Text, Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Parrot} from './icons';

interface Props {
  modalVisible: boolean;
  onClose: () => void;
  isCorrect: boolean;
  term: string;
  definition: string;
  userAnswer: string;
}

const FeedbackModal = (props: Props) => {
  const {styles, theme} = useStyles(stylesheet);
  const feedbackText = props.isCorrect ? 'Correct!' : 'Incorrect!';
  const borderColor = props.isCorrect
    ? theme.baseColors.green
    : theme.baseColors.red;

  return (
    <Modal transparent={true} visible={props.modalVisible}>
      <View style={styles.overlay}>
        <View style={[styles.modalView, {borderColor: borderColor}]}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Term: {props.term}</Text>
            <Text style={styles.text}>Definition: {props.definition}</Text>
            <Text style={styles.text}>Your answer: {props.userAnswer}</Text>
          </View>
          <View style={styles.parrot}>
            <Parrot
              text={feedbackText}
              conffeties={props.isCorrect}
              tears={!props.isCorrect}
            />
          </View>
          <Pressable
            style={[styles.button, {borderColor: borderColor}]}
            onPress={props.onClose}>
            <Text style={styles.textButton}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const stylesheet = createStyleSheet(theme => ({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  textContainer: {
    marginLeft: 10,
    marginTop: 30,
  },
  modalView: {
    height: 200,
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 3,
    //borderColor: 'black', // TODO change to green or red
    overflow: 'hidden',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    //borderTopColor: '#000000', // TODO change to green or red
    borderTopWidth: 2,
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    bottom: 0,
  },
  textButton: {
    color: '#000000',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    fontWeight: '300',
  },
  parrot: {
    position: 'absolute',
    right: -20,
    bottom: 30,
    transform: [{scale: 0.8}],
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    color: '#000000',
    fontWeight: '200',
  },
}));

export default FeedbackModal;
