import React from 'react';

import {View, Text, PixelRatio} from 'react-native';
import DeleteButton from './deleteButton';
import {deleteFolder} from '../handleData/folders';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const Folder = (props: {
  name: string;
  fetchFolders: Function;
  folderID: number;
}) => {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.folder}>
      <Text
        style={styles.text}
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        allowFontScaling={false}
        ellipsizeMode="head">
        {props.name}
      </Text>
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

const borderRadius = PixelRatio.roundToNearestPixel(10);

const stylesheet = createStyleSheet(theme => ({
  folder: {
    overflow: 'hidden',
    borderBlockColor: theme.colors.light,
    borderRadius: borderRadius,
    padding: 10,
    height: 130,
    width: 150,
    margin: 10,
    backgroundColor: theme.colors.light,
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '300',
    color: theme.colors.dark,
    maxWidth: '80%',
  },
}));

export {Folder};
