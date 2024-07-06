import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import HomeScreen from './screens/HomeScreen.tsx';
import FlashcardsScreen from './screens/FlashcardsScreen.tsx';
import DecksScreen from './screens/DecksScreen.tsx';
import WordScreen from './screens/WordScreen.tsx';

export interface deckData {
  deckID: number;
  id: number;
  term: string;
  definition: string;
}

export interface folderInfo {
  folderID: number;
  originalFolderName: string;
  uniqueFolderName: string;
}

interface flashcardParams {
  data: deckData[];
  originalDeckName: string;
}

interface wordScreenParams {
  data: deckData[];
  originalDeckName: string;
  uniqueDeckName: string;
  uniqueFolderName: string;
  folderID: number;
  originalFolderName: string;
}

// parameters that are passed
export type AppStackParamList = {
  Home: undefined;
  Flashcards: flashcardParams;
  Deck: folderInfo;
  Words: wordScreenParams;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="Deck" component={DecksScreen} />
        <Stack.Screen
          name="Words"
          component={WordScreen}
          options={{
            gestureEnabled: false,
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
