import React from 'react';

import {View, Text, Pressable, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

type FlashcardsProps = {
  word: string;
  definition: string;
};

// thanks https://blog.stackademic.com/creating-a-3d-animated-flip-card-component-in-react-native-with-reanimated-d67ba35193af
const Flashcard = (props: FlashcardsProps) => {
  // Animation, turn card
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

  // Gesture, swipe
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value.x}, {translateY: offset.value.y}],
    };
  });
  const start = useSharedValue({x: 0, y: 0});
  const pan = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <GestureDetector gesture={pan}>
      <AnimatedPressable
        onPress={animate}
        style={[styles.pressBtn, swipeStyle]}>
        <Animated.View style={[frontStyle, styles.card]}>
          <Text style={styles.text}>{props.word}</Text>
        </Animated.View>
        <Animated.View style={[backStyle, styles.card]}>
          <Text style={styles.text}>{props.definition}</Text>
        </Animated.View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

// props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = () => {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <Flashcard word="to swim" definition="nadar" />
      </GestureHandlerRootView>
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
