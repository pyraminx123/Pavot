import React from 'react';

import {Text, Pressable, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {wordObj} from '../types';
import algorithm from '../algo';

type SetTermsStackType = (newStack: wordObj[]) => void;

const Flashcard = (props: {
  currentWordObj: wordObj;
  termsStack: wordObj[];
  setTermsStack: SetTermsStackType;
  disableGesture?: boolean; // optional
  uniqueDeckName: string;
}) => {
  //console.log('here', props.termsStack);
  const {styles, theme} = useStyles(stylesheet);

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
  const defaultBorderColor = theme.colors.light;
  const borderColor = useSharedValue<string>(defaultBorderColor);

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

  const updateTermsStack = () => {
    if (props.termsStack.length > 2) {
      const newTerms = props.termsStack.slice(1);
      console.log(newTerms);
      props.setTermsStack(newTerms);
    } else if (props.termsStack.length === 2) {
      const newTerms = props.termsStack.slice(1);
      props.setTermsStack(newTerms);
      // make function for end of set
      console.log('You just finished this set');
    }
  };

  // handle ending, so that last card also comes back to correct position
  // eventually update
  const setValuesOfAnimation = () => {
    'worklet';
    goBackDuration.value = 300;
    offset.value = {
      x: 0,
      y: 0,
    };
  };
  // if it doesn't work, try to use async/await
  const handleSwipedWord = (isWordCorrect: boolean) => {
    'worklet';
    runOnJS(updateTermsStack)();
    setValuesOfAnimation();
    runOnJS(algorithm)(
      isWordCorrect,
      3,
      props.currentWordObj,
      props.uniqueDeckName,
    );
    //console.log(props.termsStack);
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
      if (offset.value.x > threshold && !disableGesture) {
        borderColor.value = '#00FF00';
      } else if (offset.value.x < -threshold && !disableGesture) {
        borderColor.value = '#FF0000';
      } else {
        borderColor.value = defaultBorderColor;
      }
    })
    .onFinalize(() => {
      if (offset.value.x > threshold && !disableGesture) {
        console.log('word known');
        handleSwipedWord(true);
        return null;
      } else if (offset.value.x < -threshold && !disableGesture) {
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

const stylesheet = createStyleSheet(theme => ({
  card: {
    width: 320,
    height: 200,
    backgroundColor: theme.colors.light,
    borderRadius: 10,
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
    fontSize: theme.typography.sizes.title,
    fontWeight: '300',
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily,
  },
}));

export default Flashcard;
