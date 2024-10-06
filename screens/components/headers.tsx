import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {CrossIconBig, LeftIcon} from './icons';

export const MainHeader = (props: {title: string; onPress: Function}) => {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.headerContainerMain}>
      <Pressable style={styles.backIcon} onPress={() => props.onPress()}>
        <LeftIcon />
      </Pressable>
      <View style={styles.textContainer}>
        <Text
          style={styles.titleMain}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          allowFontScaling={false}
          ellipsizeMode="tail">
          {props.title}
        </Text>
      </View>
    </View>
  );
};

export const CloseHeader = (props: {title: string; onPress: Function}) => {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.headerContainerClose}>
      <View style={styles.textContainer}>
        <Text
          style={styles.titleClose}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          allowFontScaling={false}
          ellipsizeMode="tail">
          {props.title}
        </Text>
      </View>
      <Pressable
        style={styles.closeIcon}
        onPress={() => {
          props.onPress();
        }}>
        <CrossIconBig />
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  headerContainerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerContainerClose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backIcon: {
    position: 'relative',
    marginLeft: 20,
    marginTop: 50,
  },
  textContainer: {
    width: '80%',
  },
  titleMain: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.title,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    marginTop: 50,
  },
  titleClose: {
    fontSize: theme.typography.sizes.title,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    marginLeft: 30,
    marginTop: 50,
  },
  closeIcon: {
    position: 'relative',
    marginRight: 30,
    marginTop: 50,
  },
}));
