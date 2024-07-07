import React from 'react';
import {Button} from 'react-native';

const SaveButton = (onSave: Function) => {
  return <Button title={'Save'} onPress={() => onSave()} />;
};

export default SaveButton;
