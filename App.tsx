import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// for translation
import "./i18n.config";
import {useTranslation, initReactI18next} from "react-i18next";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lernmodus" component={LearnScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("HELLO")}</Text>
      <Button
        title="Gehe zum Lernmodus"
        onPress={() => navigation.navigate('Lernmodus')}
      />
    </View>
  );
};

const LearnScreen = ({navigation}) => {
  return <Text style={styles.text}>Seite für den Lernmodus</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
  },
});

export default MyStack;
