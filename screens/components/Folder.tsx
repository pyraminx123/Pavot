import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import DeleteButton from './deleteButton';
import {deleteFolder} from '../handleData';

const Folder = (props: {
  name: string;
  fetchFolders: Function;
  folderID: number;
}) => {
  return (
    <View style={styles.folder}>
      <Text style={styles.text}>{props.name}</Text>
      <View style={styles.containerRight}>
        <DeleteButton
          deleteFunction={() =>
            deleteFolder(props.folderID, props.fetchFolders)
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  folder: {
    borderRadius: 15,
    padding: 10,
    height: 130,
    width: 150,
    margin: 10,
    backgroundColor: 'white',
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  text: {
    fontSize: 25,
  },
});

export {Folder};
