import React from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

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
    <Pressable onPress={() => UnistylesRuntime.setTheme(props.color)}>
      <View style={[styles.circle, {backgroundColor: colors[props.color]}]} />
    </Pressable>
  );
};

const SettingsScreen = () => {
  const {styles, theme} = useStyles(stylesheet);
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    top: 50,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.title,
    fontWeight: '400',
    marginBottom: 70,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    width: 330,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  settingColor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    width: 330,
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
    width: 330,
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
