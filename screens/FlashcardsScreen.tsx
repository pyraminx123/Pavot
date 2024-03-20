import React from 'react';

import {View, Text, Pressable, StyleSheet, Button} from 'react-native';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';

type FlashcardsProps = {
  word: string;
  definition: string;
};

// use pressable later for Flashcard
const Flashcard = (props: FlashcardsProps) => {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: 'violet',
        }}
      />
      <Button onPress={handlePress} title="Click me" />
    </View>
  );
};

const FlashcardsScreen = () => {
  return (
    <View style={styles.container}>
      <Flashcard word="to swim" definition="nadar" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: 'lightblue',
    borderRadius: 25,
    borderBlockColor: 'black',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    color: 'black',
  },
});

export default FlashcardsScreen;
