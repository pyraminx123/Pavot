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
import LearningModeScreen from './screens/learningModeScreen.tsx';
import SingleChoiceScreen from './screens/singleChoiceScreen.tsx';

import {LearningModeProvider} from './screens/contexts/LearningModeContext.tsx';
import WriteScreen from './screens/WriteScreen.tsx';

export interface folderInfo {
  folderID: number;
  originalFolderName: string;
  uniqueFolderName: string;
  handleAddPress?: () => void;
}

interface flashcardParams {
  data: wordObj[];
  originalDeckName: string;
  uniqueDeckName: string;
}
interface deckHomeParams {
  flashcardParams: flashcardParams;
  handleAddPress?: () => void;
}
interface learningModeParams {
  flashcardParams: flashcardParams;
}

interface wordScreenParams {
  data: wordObj[];
  originalDeckName: string;
  uniqueDeckName: string;
  uniqueFolderName: string;
  folderID: number;
  originalFolderName: string;
}

interface singleChoiceParams {
  term: string;
  correctDef: string;
  otherDefs: string[]; // length = 3
  originalDeckName: string;
  flashcardParams: flashcardParams;
}

interface writeParams {
  flashcardParams: flashcardParams;
}

// parameters that are passed
export type AppStackParamList = {
  Home: {handleAddPress?: () => void};
  Flashcards: flashcardParams;
  Deck: folderInfo;
  Words: wordScreenParams;
  DeckHome: deckHomeParams;
  LearningMode: learningModeParams;
  SingleChoice: singleChoiceParams;
  Write: writeParams;
};

export type AppTabParamList = {
  BigHome: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

// TODO update animation
const HomeStackScreen = () => {
  return (
    <LearningModeProvider>
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
        <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
          <Stack.Screen name="LearningMode" component={LearningModeScreen} />
          <Stack.Screen name="SingleChoice" component={SingleChoiceScreen} />
          <Stack.Screen name="Write" component={WriteScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </LearningModeProvider>
  );
};

// TODO bug: when first opening the app the house is not solid
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
