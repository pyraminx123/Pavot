import React from 'react';
import {Text, View} from 'react-native';
import {useStyles, createStyleSheet} from 'react-native-unistyles';

const CongratsScreen = () => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Congrats!</Text>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '200',
    marginVertical: 12,
    fontSize: theme.typography.sizes.text,
    color: theme.colors.light,
  },
}));

export default CongratsScreen;
