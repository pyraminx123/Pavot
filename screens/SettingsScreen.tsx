/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import {changeTheme} from './handleData/settings';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppTabParamList} from '../App';
import {useAddButtonContext} from './contexts/headerContext';

const Circle = (props: {
  color: 'red' | 'green' | 'pink' | 'orange' | 'blue';
}) => {
  const colors = {
    red: '#A35050',
    green: '#335536',
    pink: '#A367B5',
    orange: '#CA8042',
    blue: '#073E94',
  };
  const {styles} = useStyles(stylesheet);
  return (
    <Pressable
      onPress={() => {
        UnistylesRuntime.setTheme(props.color);
        changeTheme(props.color);
        //console.log(retrieveDataFromTable('settings'));
      }}>
      <View style={[styles.circle, {backgroundColor: colors[props.color]}]} />
    </Pressable>
  );
};

type SettingsScreenProps = NativeStackNavigationProp<
  AppTabParamList,
  'Settings'
>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenProps>();
  const {setHandleAddPress} = useAddButtonContext();
  const {styles, theme} = useStyles(stylesheet);

  useFocusEffect(
    useCallback(() => {
      //fetchFolders();
      setHandleAddPress(() => {
        navigation.navigate('HiddenTabStack', {
          screen: 'AddFolder',
          params: {uniqueFolderName: '', originalFolderName: ''},
        });
      });
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.settingColor}>
          <Text style={styles.text}>Theme</Text>
          <View style={[styles.circle, {backgroundColor: theme.colors.dark}]} />
        </View>
        <View style={styles.colorsContainer}>
          <Circle color="red" />
          <Circle color="green" />
          <Circle color="pink" />
          <Circle color="orange" />
          <Circle color="blue" />
        </View>
        {/* other settings come here, styles.setting */}
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.title,
    fontWeight: '400',
    marginBottom: 20,
  },
  settingColor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    width: '100%',
    padding: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBlockColor: theme.colors.dark,
    borderBottomWidth: 1.5,
    justifyContent: 'space-between',
  },
  colorsContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: theme.colors.light,
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.text,
    fontWeight: '200',
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
}));

export default SettingsScreen;
