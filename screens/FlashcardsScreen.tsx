import React, {useEffect, useState} from 'react';

import {View, Text, Pressable, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

interface myWordObj {
  word: string;
  definition: string;
  id: number;
}

const Flashcard = (props: {
  word: string;
  definition: string;
  words: Array<myWordObj>;
  setWords: React.Dispatch<React.SetStateAction<Array<myWordObj>>>;
  disableGesture?: boolean; // optional
}) => {
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

  const handleSwipedWord = () => {
    'worklet';
    if (props.words.length > 2) {
      runOnJS(props.setWords)(props.words.slice(1));
    } else if (props.words.length === 2) {
      runOnJS(props.setWords)(props.words.slice(1));
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
    })
    .onFinalize(() => {
      if (offset.value.x > threshold) {
        handleSwipedWord();
        return null;
      } else if (offset.value.x < -threshold) {
        handleSwipedWord();
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
  const [words, setWords] = useState([
    {word: 'nadar', definition: 'to swim', id: 0},
    {word: 'trepar', definition: 'to climb', id: 1},
    {word: 'comer', definition: 'to eat', id: 2},
    {word: 'hola', definition: 'hello', id: 3},
  ]);

  const initialLength = words.length;

  useEffect(() => {
    const wordsWithEnding = [
      ...words,
      {word: '', definition: '', id: initialLength},
    ];
    setWords(wordsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // after make car before alreacy appear but text just not visible
    <View style={styles.container}>
      <GestureHandlerRootView>
        {words.map((wordObj, index) => {
          if (index === 0) {
            if (words.length === 1) {
              return (
                <Flashcard
                  key={wordObj.id}
                  word={wordObj.word}
                  definition={wordObj.definition}
                  words={words}
                  setWords={setWords}
                  disableGesture={true}
                />
              );
            } else {
              const nextWordObj = words[index + 1];
              return (
                <>
                  <Flashcard
                    key={nextWordObj.id}
                    word={nextWordObj.word}
                    definition={nextWordObj.definition}
                    words={words}
                    setWords={setWords}
                  />
                  <Flashcard
                    key={wordObj.id}
                    word={wordObj.word}
                    definition={wordObj.definition}
                    words={words}
                    setWords={setWords}
                  />
                </>
              );
            }
          }
        })}
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  pressBtn: {
    width: 300,
    height: 200,
    zIndex: 2,
    position: 'absolute',
    left: -150,
    top: -100,
  },
  text: {
    fontSize: 50,
    color: 'black',
  },
});

export default FlashcardsScreen;
