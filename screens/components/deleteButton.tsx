import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

const DeleteButton = (props: {deleteFunction: Function}) => {
  return (
    <Pressable onPress={() => props.deleteFunction()} style={styles.button}>
      <Text>x</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EB8585',
    borderRadius: 5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeleteButton;
