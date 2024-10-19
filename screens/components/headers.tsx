import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {
  AddIconOutline,
  CrossIconBig,
  HomeIconOutline,
  HomeIconSolid,
  LeftIcon,
  SettingsIconOutline,
  SettingsIconSolid,
} from './icons';
import {useAddButtonContext} from '../contexts/headerContext';

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

export const BottomTab = (props: {
  onPressHome: Function;
  onPressSettings: Function;
  screenFocused: 'BigHome' | 'Settings' | 'Other';
}) => {
  const {styles} = useStyles(stylesheet);
  const {handleAddPress} = useAddButtonContext();

  return (
    <View style={styles.bottomTab}>
      <View style={styles.buttons}>
        <Pressable onPress={() => props.onPressHome()}>
          {props.screenFocused === 'BigHome' ? (
            <HomeIconSolid />
          ) : (
            <HomeIconOutline />
          )}
        </Pressable>
        <Pressable style={styles.addButton} onPress={() => handleAddPress()}>
          <AddIconOutline />
        </Pressable>
        <Pressable onPress={() => props.onPressSettings()}>
          {props.screenFocused === 'Settings' ? (
            <SettingsIconSolid />
          ) : (
            <SettingsIconOutline />
          )}
        </Pressable>
      </View>
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
  bottomTab: {
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    position: 'relative',
    marginBottom: 50,
  },
  buttons: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));
