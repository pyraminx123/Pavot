import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

const Folder = (props: {name: String}) => {
  return (
    <View style={styles.folder}>
      <Text style={styles.text}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  folder: {
    borderBlockColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    padding: 10,
    height: 130,
    width: 150,
    margin: 10,
  },
  text: {
    fontSize: 25,
  },
});

export {Folder};
