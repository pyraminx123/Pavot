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

// with the help of chatGPT (but also mine)
export const HomeIconOutline = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="45" height="45">
        <Path
          d="M1 8L7.5 2L14 8M2 7V14H6V10H9V14H13V7"
          stroke-width="1"
          stroke={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

export const HomeIconSolid = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill={theme.colors.dark} width="45" height="45">
        <Path
          d="M1 8L7.5 2L14 8M2 8V14H6V10H9V14H13V8"
          stroke-width="1"
          stroke={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

export const SettingsIconOutline = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="45" height="45">
        <Path
          clip-rule="evenodd"
          d="M5.944.5l-.086.437-.329 1.598a5.52 5.52 0 00-1.434.823L2.487 2.82l-.432-.133-.224.385L.724 4.923.5 5.31l.328.287 1.244 1.058c-.045.277-.103.55-.103.841 0 .291.058.565.103.842L.828 9.395.5 9.682l.224.386 1.107 1.85.224.387.432-.135 1.608-.537c.431.338.908.622 1.434.823l.329 1.598.086.437h3.111l.087-.437.328-1.598a5.524 5.524 0 001.434-.823l1.608.537.432.135.225-.386 1.106-1.851.225-.386-.329-.287-1.244-1.058c.046-.277.103-.55.103-.842 0-.29-.057-.564-.103-.841l1.244-1.058.329-.287-.225-.386-1.106-1.85-.225-.386-.432.134-1.608.537a5.52 5.52 0 00-1.434-.823L9.142.937 9.055.5H5.944z"
          stroke={theme.colors.dark}
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <Path
          clip-rule="evenodd"
          d="M9.5 7.495a2 2 0 01-4 0 2 2 0 014 0z"
          stroke={theme.colors.dark}
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
};

export const SettingsIconSolid = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill={theme.colors.dark} width="45" height="45">
        <Path
          clip-rule="evenodd"
          d="M5.944.5l-.086.437-.329 1.598a5.52 5.52 0 00-1.434.823L2.487 2.82l-.432-.133-.224.385L.724 4.923.5 5.31l.328.287 1.244 1.058c-.045.277-.103.55-.103.841 0 .291.058.565.103.842L.828 9.395.5 9.682l.224.386 1.107 1.85.224.387.432-.135 1.608-.537c.431.338.908.622 1.434.823l.329 1.598.086.437h3.111l.087-.437.328-1.598a5.524 5.524 0 001.434-.823l1.608.537.432.135.225-.386 1.106-1.851.225-.386-.329-.287-1.244-1.058c.046-.277.103-.55.103-.842 0-.29-.057-.564-.103-.841l1.244-1.058.329-.287-.225-.386-1.106-1.85-.225-.386-.432.134-1.608.537a5.52 5.52 0 00-1.434-.823L9.142.937 9.055.5H5.944z"
          stroke={theme.colors.dark}
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <Path
          clip-rule="evenodd"
          d="M9.5 7.495a2 2 0 01-4 0 2 2 0 014 0z"
          fill="#FFFFFF"
          stroke={theme.colors.dark}
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
};

export const AddIconOutline = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="45" height="45">
        <Path
          d="M7.5 4v7M4 7.5h7m-3.5 7a7 7 0 110-14 7 7 0 010 14z"
          stroke={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

export const RightArrow = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 20 20" fill="none" width="25" height="25">
        <Path d="M13.5 7.5l-4-4m4 4l-4 4m4-4H1" stroke={theme.colors.dark} />
      </Svg>
    </View>
  );
};
