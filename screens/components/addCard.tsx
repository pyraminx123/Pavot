import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {deckData} from '../../App';

interface addCardProps {
  data: deckData[];
  setData: Function;
}

const AddCard = (props: addCardProps) => {
  return (
    <Pressable
      style={styles.button}
      onPress={() =>
        props.setData([
          ...props.data,
          {id: -1, term: '', definition: '', deckID: -1},
        ])
      }>
      <Text>+</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#83B4E1',
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    margin: 10,
  },
});

export default AddCard;
