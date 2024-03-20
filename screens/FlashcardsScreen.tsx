import React from 'react';

import {View, Text, Pressable, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
} from 'react-native-reanimated';

type FlashcardsProps = {
  word: string;
  definition: string;
};

// thanks https://blog.stackademic.com/creating-a-3d-animated-flip-card-component-in-react-native-with-reanimated-d67ba35193af
const Flashcard = (props: FlashcardsProps) => {
  const rotationF = useSharedValue(0);
  const rotationB = useSharedValue(180);
  const frontStyle = useAnimatedStyle(() => {
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotationF.value}deg`}],
      position: 'absolute',
    };
  });
  const backStyle = useAnimatedStyle(() => {
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotationB.value}deg`}],
      position: 'absolute',
    };
  });
  const onAnimate = () => {
    'worklet';
    if (rotationF.value === 180) {
      rotationF.value = withTiming(0, {duration: 1000});
      rotationB.value = withTiming(180, {duration: 1000});
      return;
    }
    rotationF.value = withTiming(180, {duration: 1000});
    rotationB.value = withTiming(360, {duration: 1000});
  };
  const animate = () => {
    runOnUI(onAnimate)();
  };

  return (
    <Pressable onPress={animate} style={styles.pressBtn}>
      <Animated.View style={[frontStyle, styles.card]}>
        <Text style={styles.text}>{props.word}</Text>
      </Animated.View>
      <Animated.View style={[backStyle, styles.card]}>
        <Text style={styles.text}>{props.definition}</Text>
      </Animated.View>
    </Pressable>
  );
};

// props need to be updated
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
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pressBtn: {
    width: 300,
    height: 200,
  },
  text: {
    fontSize: 50,
    color: 'black',
  },
});

export default FlashcardsScreen;
