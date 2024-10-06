import React from 'react';
import {View} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {useStyles} from 'react-native-unistyles';

export const BinIcon = () => {
  //const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="15" height="15">
        <Path
          d="M4.5 3V1.5a1 1 0 011-1h4a1 1 0 011 1V3M0 3.5h15m-13.5 0v10a1 1 0 001 1h10a1 1 0 001-1v-10M7.5 7v5m-3-3v3m6-3v3"
          stroke="red"
        />
      </Svg>
    </View>
  );
};

export const EditIcon = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="15" height="15">
        <Path
          d="M.5 9.5l-.354-.354L0 9.293V9.5h.5zm9-9l.354-.354a.5.5 0 00-.708 0L9.5.5zm5 5l.354.354a.5.5 0 000-.708L14.5 5.5zm-9 9v.5h.207l.147-.146L5.5 14.5zm-5 0H0a.5.5 0 00.5.5v-.5zm.354-4.646l9-9-.708-.708-9 9 .708.708zm8.292-9l5 5 .708-.708-5-5-.708.708zm5 4.292l-9 9 .708.708 9-9-.708-.708zM5.5 14h-5v1h5v-1zm-4.5.5v-5H0v5h1zM6.146 3.854l5 5 .708-.708-5-5-.708.708zM8 15h7v-1H8v1z"
          fill={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

export const VerticalIcon = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="20" height="20">
        <Path
          d="M7.5 3a.5.5 0 110-1 .5.5 0 010 1zm0 5a.5.5 0 110-1 .5.5 0 010 1zm0 5a.5.5 0 110-1 .5.5 0 010 1z"
          stroke={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

export const LeftIcon = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="30" height="30">
        <Path
          d="M10 14L3 7.5 10 1"
          stroke={theme.colors.dark}
          stroke-linecap="square"
        />
      </Svg>
    </View>
  );
};

export const CrossIconBig = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="30" height="30">
        <Path d="M1.5 1.5l12 12m-12 0l12-12" stroke={theme.colors.dark} />
      </Svg>
    </View>
  );
};

export const CrossIconSmall = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="20" height="20">
        <Path d="M1.5 1.5l12 12m-12 0l12-12" stroke={theme.colors.dark} />
      </Svg>
    </View>
  );
};
