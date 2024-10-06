import React from 'react';
import {Pressable, Text} from 'react-native';
import {CrossIconSmall} from './icons';

const DeleteButton = (props: {deleteFunction: Function}) => {
  return (
    <Pressable onPress={() => props.deleteFunction()}>
      <Text>
        <CrossIconSmall />
      </Text>
    </Pressable>
  );
};

export default DeleteButton;
