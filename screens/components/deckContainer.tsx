import React, {useCallback, useEffect, useRef, useState} from 'react';

import {View, Text, Pressable} from 'react-native';
import {deleteDeck} from '../handleData/deck';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {EditIcon, BinIcon} from './icons';
import ContextMenu from './contextMenu';
import {useFocusEffect} from '@react-navigation/native';

const DeckContainer = (props: {
  originalDeckName: string;
  uniqueDeckName: string;
  uniqueFolderName: string;
  fetchDecks: Function;
  navigateToWordsScreen: Function;
  scrollY: number;
}) => {
  const {styles, theme} = useStyles(stylesheet);
  const options = ['Edit deck', 'Delete deck']; // for context menu
  const colors = [theme.colors.dark, 'red'];
  const icons = [EditIcon, BinIcon];
  const functions = [
    () => props.navigateToWordsScreen(),
    () =>
      deleteDeck(
        props.uniqueFolderName,
        props.uniqueDeckName,
        props.fetchDecks,
      ),
  ];

  const deckRef = useRef<View>(null);
  const [deckPosition, setDeckPosition] = useState({x: 0, y: 0});
  const measureDeckPosition = () => {
    if (deckRef.current) {
      deckRef.current.measureInWindow((x, y, width) => {
        setDeckPosition({x: x + width, y: y});
      });
    }
  };

  // with the help of chatGPT
  useFocusEffect(useCallback(() => measureDeckPosition(), []));

  useEffect(() => {
    //console.log(props.scrollY);
    measureDeckPosition();
  }, [props.scrollY]);

  //console.log('deckPosition', deckPosition);
  return (
    <View style={styles.container} ref={deckRef} onLayout={measureDeckPosition}>
      <View style={styles.containerLeft}>
        <Text style={styles.text}>{props.originalDeckName}</Text>
      </View>
      {/* here comes the chart pie */}
      <View style={styles.containerRight}>
        <Pressable onPress={measureDeckPosition}>
          <ContextMenu
            options={options}
            icons={icons}
            functions={functions}
            colors={colors}
            x={deckPosition.x}
            y={deckPosition.y}
          />
        </Pressable>
      </View>
    </View>
  );
};

// TODO make better
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const stylesheet = createStyleSheet(theme => ({
  container: {
    borderRadius: 10,
    margin: 10,
    backgroundColor: theme.colors.light,
    width: windowWidth - 40,
    height: 70,
    justifyContent: 'center',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerRight: {
    position: 'absolute',
    right: 5,
    top: 12,
  },
  text: {
    fontSize: theme.typography.sizes.text,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '300',
    color: theme.colors.dark,
    margin: 15,
  },
}));

export default DeckContainer;
