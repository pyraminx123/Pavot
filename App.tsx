/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import './screens/style/unistyles';

// screens
import HomeScreen from './screens/HomeScreen.tsx';
import FlashcardsScreen from './screens/FlashcardsScreen.tsx';
import DecksScreen from './screens/DecksScreen.tsx';
import WordScreen from './screens/WordScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import DeckHomeScreen from './screens/DeckHomeScreen.tsx';
import {wordObj} from './screens/types.ts';
import {BottomTab} from './screens/components/headers.tsx';

export interface folderInfo {
  folderID: number;
  originalFolderName: string;
  uniqueFolderName: string;
}

interface flashcardParams {
  data: wordObj[];
  originalDeckName: string;
  uniqueDeckName: string;
}

interface wordScreenParams {
  data: wordObj[];
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
  DeckHome: flashcardParams;
};

export type AppTabParamList = {
  BigHome: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
      <Stack.Screen name="Deck" component={DecksScreen} />
      <Stack.Screen
        name="Words"
        component={WordScreen}
        options={{gestureEnabled: false, headerBackVisible: false}}
      />
      <Stack.Screen name="DeckHome" component={DeckHomeScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        tabBar={({navigation}) => {
          // with the help of chatGPT
          const {routes, index} = navigation.getState();
          let currentRouteName = routes[index].name;
          if (currentRouteName === 'BigHome') {
            const stateIndex = routes[index].state?.index;
            if (stateIndex !== 0) {
              currentRouteName = 'Other';
            }
          }
          //console.log(routes[index]);
          return (
            <BottomTab
              onPressHome={() => navigation.navigate('Home')}
              onPressSettings={() => navigation.navigate('Settings')}
              onPressAdd={() => console.log('add')}
              screenFocused={
                currentRouteName as 'BigHome' | 'Settings' | 'Other'
              }
            />
          );
        }}>
        <Tab.Screen name="BigHome" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
