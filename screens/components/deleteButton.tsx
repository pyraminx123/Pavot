import React from 'react';
import {Pressable, Text} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {useStyles} from 'react-native-unistyles';

const DeleteButton = (props: {deleteFunction: Function}) => {
  const {theme} = useStyles();
  return (
    <Pressable onPress={() => props.deleteFunction()}>
      <Text>
        <Svg viewBox="0 0 15 15" fill="none" width="20" height="20">
          <Path
            d="M7.5 3a.5.5 0 110-1 .5.5 0 010 1zm0 5a.5.5 0 110-1 .5.5 0 010 1zm0 5a.5.5 0 110-1 .5.5 0 010 1z"
            stroke={theme.colors.dark}
          />
        </Svg>
      </Text>
    </Pressable>
  );
};

export default DeleteButton;
