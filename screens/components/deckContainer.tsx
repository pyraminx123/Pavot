import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

const DeckContainer = (props: {name: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBlockColor: 'black',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 25,
  },
});

export default DeckContainer;
