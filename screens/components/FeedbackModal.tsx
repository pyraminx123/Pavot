import React, {useState} from 'react';
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
  const [textOpacity, setTextOpacity] = useState(1);

  return (
    <Modal transparent={true} visible={props.modalVisible}>
      <View style={styles.overlay}>
        <View style={[styles.modalView, {borderColor: borderColor}]}>
          <View style={styles.textContainer}>
            <Text
              style={styles.text}
              numberOfLines={2}
              lineBreakMode="tail"
              allowFontScaling={true}>
              Term: {props.term}
            </Text>
            <Text
              style={styles.text}
              numberOfLines={2}
              lineBreakMode="tail"
              allowFontScaling={true}>
              Definition: {props.definition}
            </Text>
            <Text
              style={styles.text}
              numberOfLines={2}
              lineBreakMode="tail"
              allowFontScaling={true}>
              Your answer: {props.userAnswer}
            </Text>
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
            onPressIn={() => setTextOpacity(0.5)}
            onPressOut={() => setTextOpacity(1)}
            onPress={props.onClose}>
            <Text style={[styles.textButton, {opacity: textOpacity}]}>
              Continue
            </Text>
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
    width: '60%',
    marginLeft: 10,
    marginTop: 20,
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 3,
    overflow: 'hidden',
    paddingBottom: 80, // Add padding for better spacing
  },
  button: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    right: -25,
    bottom: 30,
    transform: [{scale: 0.7}],
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    color: '#000000',
    fontWeight: '200',
  },
}));

export default FeedbackModal;
