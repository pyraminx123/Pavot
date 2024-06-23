import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import AddWord from './addWord';

const DeckContainer = (props: {name: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <Text style={styles.text}>{props.name}</Text>
        <AddWord />
      </View>
      {/* here comes the chart pie */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    margin: 10,
    backgroundColor: 'white',
    width: 350,
    height: 70,
    justifyContent: 'center',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    margin: 15,
  },
});

export default DeckContainer;
