import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';

// TODO change file name
// Define the AddWord component
const AddWord = (props: {onPressed: Function}) => {
  return (
    <View>
      <Pressable style={styles.container} onPress={() => props.onPressed}>
        <Text style={styles.text}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#83B4E1',
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default AddWord;
