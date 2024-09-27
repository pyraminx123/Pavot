import React, {useState} from 'react';
import {View, Text, Pressable, Modal, LayoutChangeEvent} from 'react-native';
import {Svg, Line} from 'react-native-svg';
import {VerticalIcon} from './icons';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

interface Props {
  options: Array<string>;
  functions: Array<Function>;
  icons: Array<React.ElementType>;
  colors: Array<string>;
  x: number;
  y: number;
}

const ContextMenu = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {styles} = useStyles(stylesheet);
  // the opacities where made with the help of chatGPT
  const [opacities, setOpacities] = useState(
    Array(props.options.length).fill(1),
  );
  const [modalWidth, setModalWidth] = useState(0);

  // the handleLayout and onLayout where made with the help of chatGPT
  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setModalWidth(width);
  };

  const handlePressIn = (index: number) => {
    const newOpacities = [...opacities];
    newOpacities[index] = 0.5;
    setOpacities(newOpacities);
  };

  const handlePressOut = (index: number) => {
    const newOpacities = [...opacities];
    newOpacities[index] = 1;
    setOpacities(newOpacities);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <VerticalIcon />
      </Pressable>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}>
          <View
            onLayout={handleLayout}
            style={[
              styles.modalView,
              {top: props.y, left: props.x - modalWidth},
            ]}>
            {props.options.map((option, index) => (
              <View key={index}>
                <Pressable
                  onPress={() => {
                    handlePressOut(index);
                    props.functions[index]();
                    setModalVisible(false);
                  }}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  style={{opacity: opacities[index]}} // Set individual opacity for each option
                >
                  <View style={styles.container}>
                    {React.createElement(props.icons[index])}
                    <Text style={[styles.text, {color: props.colors[index]}]}>
                      {option}
                    </Text>
                  </View>
                </Pressable>
                {/* Add the line outside of the Pressable */}
                {props.options.length !== index + 1 && (
                  <Svg height="2" width="100%">
                    <Line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </Svg>
                )}
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  modalContainer: {
    flex: 1,
  },
  modalView: {
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 10,
    width: 150,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    fontWeight: '300',
  },
}));

export default ContextMenu;
