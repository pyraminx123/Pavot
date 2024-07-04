import React from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import DeleteButton from './deleteButton';

const Card = () => {
  return (
    <View style={styles.card}>
      <View style={styles.containerRight}>
        <DeleteButton
          deleteFunction={() => console.log('I have to make a delete function')}
        />
      </View>
      <View style={styles.content}>
        <TextInput
          value={''}
          onChangeText={() => console.log('changed text')}
          style={styles.textInput}
          placeholder={'term'}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        />
        <TextInput
          value={''}
          onChangeText={() => console.log('changed text')}
          style={styles.textInput}
          placeholder={'definition'}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#83B4E1',
    borderRadius: 25,
    width: 345,
    alignItems: 'center',
    margin: 10,
  },
  content: {
    marginTop: 40,
  },
  textInput: {
    height: 50,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
    marginBottom: 100,
  },
});

export default Card;
