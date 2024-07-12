import React from 'react';

import {Text, Pressable, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

interface wordObj {
  deckID: number;
  definition: string;
  term: string;
  id: number;
  wordStats: string;
}

const Flashcard = (props: {
  currentWordObj: wordObj;
  terms: wordObj[];
  setTerms: React.Dispatch<React.SetStateAction<wordObj[]>>;
  changeWordStats: Function;
  disableGesture?: boolean; // optional
}) => {
  const term = props.currentWordObj.term;
  const definition = props.currentWordObj.definition;

  const disableGesture = props.disableGesture ?? false;

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
  const screenWidth: number = Dimensions.get('window').width;
  const threshold: number = (screenWidth / 100) * 10;
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const goBackDuration = useSharedValue(0);
  const borderColor = useSharedValue('#FFFFFF');

  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(offset.value.x, {
            duration: goBackDuration.value,
          }),
        },
        {
          translateY: withTiming(offset.value.y, {
            duration: goBackDuration.value,
          }),
        },
      ],
    };
  });

  const handleSwipedWord = (isWordCorrect: boolean) => {
    'worklet';
    if (props.terms.length > 2) {
      runOnJS(props.setTerms)(props.terms.slice(1));
    } else if (props.terms.length === 2) {
      runOnJS(props.setTerms)(props.terms.slice(1));
      // make function for end of set
      console.log('You just finished this set');
    }
    // handle ending, so that last card also comes back to correct position
    // eventually update
    goBackDuration.value = 300;
    offset.value = {
      x: 0,
      y: 0,
    };
    runOnJS(props.changeWordStats(isWordCorrect, props.currentWordObj));
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      goBackDuration.value = 0;
      offset.value = {
        x: e.translationX,
        y: e.translationY,
      };
      if (offset.value.x > threshold) {
        borderColor.value = '#00FF00';
      } else if (offset.value.x < -threshold) {
        borderColor.value = '#FF0000';
      } else {
        borderColor.value = '#FFFFFF';
      }
    })
    .onFinalize(() => {
      if (offset.value.x > threshold) {
        console.log('word known');
        handleSwipedWord(true);
        return null;
      } else if (offset.value.x < -threshold) {
        console.log('word unkown');
        handleSwipedWord(false);
        return null;
      } else {
        goBackDuration.value = 300;
        offset.value = {
          x: 0,
          y: 0,
        };
      }
      isPressed.value = false;
    });

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <GestureDetector gesture={pan}>
      <AnimatedPressable
        onPress={() => {
          if (!disableGesture) {
            animate();
          }
        }}
        style={[styles.pressBtn, !disableGesture ? swipeStyle : null]}>
        <Animated.View
          style={[frontStyle, styles.card, {borderColor: borderColor}]}>
          <Text style={styles.text}>{term}</Text>
        </Animated.View>
        <Animated.View
          style={[backStyle, styles.card, {borderColor: borderColor}]}>
          <Text style={styles.text}>{definition}</Text>
        </Animated.View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 3,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressBtn: {
    width: 320,
    height: 200,
    position: 'absolute',
  },
  text: {
    fontSize: 36,
    color: 'black',
  },
});

export default Flashcard;
