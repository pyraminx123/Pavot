import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
  console.log(navigation);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hallo</Text>
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
