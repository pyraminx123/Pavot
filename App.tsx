import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import HomeScreen from './screens/HomeScreen.tsx';
import FlashcardsScreen from './screens/FlashcardsScreen.tsx';
import AddCardsScreen from './screens/TestScreen.tsx';
import SetsScreen from './screens/SetsScreen.tsx';

export interface deckData {
  deckID: number;
  id: number;
  term: string;
  definition: string;
}

export interface folderData {
  deck: string;
  deckID: number;
}

interface decksWithinTable {
  decks: folderData[];
  tableName: string;
}

// parameters that are passed
export type AppStackParamList = {
  Home: undefined;
  Flashcards: deckData[];
  Add: undefined;
  Set: decksWithinTable;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="Set" component={SetsScreen} />
        <Stack.Screen name="Add" component={AddCardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
