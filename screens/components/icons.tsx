import React from 'react';
import {Text, View} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

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

export const TickIcon = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg viewBox="0 0 15 15" fill="none" width="30" height="30">
        <Path
          d="M1 7l4.5 4.5L14 3"
          stroke={theme.colors.dark}
          stroke-linecap="square"
        />
      </Svg>
    </View>
  );
};

export const UploadIcon = () => {
  const {theme} = useStyles();
  return (
    <View>
      <Svg
        viewBox="0 0 15 15"
        fill="none"
        width={theme.typography.sizes.text}
        height={theme.typography.sizes.text}>
        <Path
          d="M7.5 1.5l3.25 3m-3.25-3l-3 3m3-3V11m6-4v6.5h-12V7"
          stroke={theme.colors.dark}
        />
      </Svg>
    </View>
  );
};

interface ParrotProps {
  text: string;
  conffeties: boolean;
  tears: boolean;
}

const Confetti = () => {
  return (
    <View>
      <Svg width="101" height="92" viewBox="0 0 101 92" fill="none">
        <Path d="M8 62.5L0 55L8 51.5L15 58L8 62.5Z" fill="#69F99A" />
        <Path d="M12 33V22H21L17.5 33H12Z" fill="#A869F9" />
        <Path d="M51.5 6.5L54 0H62V6.5H51.5Z" fill="#F9698B" />
        <Path d="M58 91.5V86H67.5V91.5H58Z" fill="#A367B5" />
        <Path d="M31 71L26.5 80H31L38.5 74L31 71Z" fill="#69F9F9" />
        <Path
          d="M57.5 70.25L62 59.75L71 64.25L67.5 70.25H57.5Z"
          fill="#F4AC6A"
        />
        <Path d="M33 37.5V33.5H43.5L49 37.5H33Z" fill="#F969EA" />
        <Path
          d="M93.5 34L85.5 26.5L93.5 23L100.5 29.5L93.5 34Z"
          fill="#FF5959"
        />
        <Path d="M38.5 22L41 15.5H49V22H38.5Z" fill="#B9F969" />
        <Path d="M62 37.5V26.5H71L67.5 37.5H62Z" fill="#6C69F9" />
      </Svg>
    </View>
  );
};

const Tears = () => {
  return (
    <View>
      <Svg width="18" height="46" viewBox="0 0 18 46" fill="none">
        <Path
          d="M8.46317 0.000161107C8.23912 0.00217646 8.11857 0.0361227 7.94763 0.251765C7.77668 0.467407 6.33681 2.48556 5.53774 4.04978C4.96555 5.1699 4.52217 5.77765 4.26686 7.00912C4.00754 8.25991 3.82596 9.08102 4.26686 10.28C4.5728 11.1119 4.8486 11.603 5.53774 12.161C6.46121 12.9087 7.27465 12.9934 8.46317 12.9997C9.67421 13.0061 10.5061 12.921 11.4486 12.161C12.1408 11.6027 12.4228 11.1137 12.7314 10.28C13.1749 9.08198 12.9927 8.2595 12.7314 7.00912C12.4738 5.77624 12.0278 5.16835 11.4486 4.04978C10.6362 2.48105 9.20343 0.491355 8.99071 0.251765C8.77799 0.0121746 8.69144 -0.00189217 8.46317 0.000161107Z"
          fill="#4A86E6"
        />
        <Path
          d="M13.4632 33.0002C13.2391 33.0022 13.1186 33.0361 12.9476 33.2518C12.7767 33.4674 11.3368 35.4856 10.5377 37.0498C9.96555 38.1699 9.52217 38.7777 9.26686 40.0091C9.00754 41.2599 8.82596 42.081 9.26686 43.28C9.5728 44.1119 9.8486 44.603 10.5377 45.161C11.4612 45.9087 12.2747 45.9934 13.4632 45.9997C14.6742 46.0061 15.5061 45.921 16.4486 45.161C17.1408 44.6027 17.4228 44.1137 17.7314 43.28C18.1749 42.082 17.9927 41.2595 17.7314 40.0091C17.4738 38.7762 17.0278 38.1684 16.4486 37.0498C15.6362 35.4811 14.2034 33.4914 13.9907 33.2518C13.778 33.0122 13.6914 32.9981 13.4632 33.0002Z"
          fill="#4A86E6"
        />
        <Path
          d="M4.46317 17.0002C4.23912 17.0022 4.11857 17.0361 3.94763 17.2518C3.77668 17.4674 2.33681 19.4856 1.53774 21.0498C0.965547 22.1699 0.522172 22.7777 0.266859 24.0091C0.00754231 25.2599 -0.174045 26.081 0.266859 27.28C0.572801 28.1119 0.848596 28.603 1.53774 29.161C2.46121 29.9087 3.27465 29.9934 4.46317 29.9997C5.67421 30.0061 6.5061 29.921 7.44855 29.161C8.14084 28.6027 8.42276 28.1137 8.73142 27.28C9.17493 26.082 8.9927 25.2595 8.73142 24.0091C8.4738 22.7762 8.02781 22.1684 7.44855 21.0498C6.63617 19.4811 5.20343 17.4914 4.99071 17.2518C4.77799 17.0122 4.69144 16.9981 4.46317 17.0002Z"
          fill="#4A86E6"
        />
      </Svg>
    </View>
  );
};

export const Parrot = (props: ParrotProps) => {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.parrotContainer}>
      {props.conffeties && (
        <View style={styles.confetti}>
          <Confetti />
        </View>
      )}
      {props.tears && (
        <View style={styles.tears}>
          <Tears />
        </View>
      )}
      <Text style={styles.parrotText}>{props.text}</Text>
      <Svg width="64" height="113" viewBox="0 0 64 113" fill="none">
        <Path
          d="M18.262 11.3105L19.5128 7.05765L24.2659 5.05634L28.894 9.80946L23.8907 14.3124L18.262 11.3105Z"
          fill="#AFAFBB"
        />
        <Path
          d="M21.3891 7.30781C21.0042 7.46175 20.8074 7.67978 20.6386 8.0583C20.5565 8.24223 20.5342 8.3583 20.5135 8.55863C20.4671 9.0066 20.4839 9.33141 20.7636 9.68437C21.035 10.0268 21.3344 10.1069 21.7643 10.1847C22.3017 10.2819 22.7224 10.2862 23.1402 9.93454C23.5083 9.62473 23.6402 9.28989 23.6405 8.8088C23.6408 8.39144 23.5391 8.12309 23.2653 7.80814C23.0069 7.51094 22.7705 7.4085 22.3897 7.30781C22.0119 7.2079 21.7519 7.16268 21.3891 7.30781Z"
          fill="#A07D51"
        />
        <Path
          d="M16.1359 16.3137C14.9727 15.6244 13.8842 15.4382 13.8842 15.4382C13.8842 15.4382 7.02033 23.4159 7.12996 24.4441C7.2396 25.4723 13.7188 28.044 13.6342 28.6969C14.2607 28.2838 15.2226 28.5936 17.1365 29.3223C19.1113 28.938 19.7507 27.8704 21.0141 26.5705C19.7436 21.9212 17.299 17.0031 16.1359 16.3137Z"
          fill="#031309"
        />
        <Path
          d="M8.76563 31.9595C-0.0639182 24.4509 -2.74727 19.5186 3.13692 7.31833C7.88874 4.96123 9.91053 5.13794 10.7669 9.44473L12.1428 10.5705C13.5893 12.5139 14.1403 13.5873 14.2692 15.4487C10.7893 19.03 7.26459 23.9543 7.26459 23.9543C6.80316 23.9391 6.76514 28.9718 8.76563 31.9595Z"
          fill="#EFE2E8"
        />
        <Path
          d="M45.655 70.4744C45.8246 65.4301 45.5052 62.357 44.7794 57.8411C44.7794 57.8411 46.4054 55.4645 47.5311 55.4645C48.6569 55.4645 56.5987 62.2717 61.04 64.2203C62.1811 64.3524 62.5547 64.5128 63.0414 63.0946L63.6031 91.6133L62.2271 89.2368C62.2271 89.2368 62.6683 92.8637 61.04 92.4889C59.64 92.1667 59.9143 88.9866 59.9143 88.9866C59.9143 88.9866 58.7284 90.1626 58.0381 90.4876C56.4756 91.2233 57.788 87.6107 57.788 87.6107C57.788 87.6107 56.8291 89.7636 55.9118 89.1117C54.9944 88.4598 55.2027 88.2406 54.9111 86.2348C52.4876 88.7732 50.9579 89.1134 49.5326 87.6107C46.6844 84.8535 45.164 82.1356 44.6544 77.9794C44.4321 75.155 44.7286 73.3164 45.655 70.4744Z"
          fill="#B5A023"
        />
        <Path
          d="M33.7722 55.3394C31.3867 62.1532 37.9433 86.5054 40.4014 86.4849C42.8595 86.4644 42.4954 78.2296 43.5285 82.2321C44.7868 84.8311 44.2793 87.6107 44.6544 89.3618C45.0296 91.113 52.5345 101.12 53.5353 101.87C54.536 102.621 53.1601 100.744 53.5353 98.743C53.5353 98.743 57.0375 112.377 57.9131 111.626C58.7888 110.876 58.959 102.142 59.7894 105.122L61.9158 112.752C62.7462 115.732 63.6668 90.8628 63.5418 90.3625C63.4169 89.8622 61.7908 88.3612 61.9158 88.8615C62.0407 89.3618 62.4454 92.4783 61.0402 92.3638C59.7743 92.2607 61.0508 89.5097 59.7894 89.3618C58.9646 89.2651 58.7403 90.4354 57.9131 90.3625C56.4047 90.2295 59.3902 86.1514 57.9131 86.4849C56.8424 86.7267 57.4889 88.648 56.4121 88.8615C55.0152 89.1385 55.936 85.9949 54.5359 85.7344C53.6327 85.5664 53.1326 88.9643 51.0336 87.7358C47.4618 85.6451 46.84 83.3282 46.4056 82.2321C44.3633 77.0788 46.7127 73.4522 46.4056 71.0998C45.7529 66.1006 46.7537 58.2423 45.6551 57.3408C41.0862 58.8623 41.2199 57.9635 40.1513 57.0906C39.3631 57.0635 40.1394 54.1546 38.9005 53.5883C37.6616 53.022 34.6779 53.5973 33.7722 55.3394Z"
          fill="#073E94"
        />
        <Path
          d="M18.5121 76.8536C13.0275 73.5583 11.0943 69.4081 11.8827 53.4632L14.8847 54.8391C15.5568 59.8343 15.9053 62.618 16.7609 67.7226C18.5432 71.5104 21.2639 74.477 24.8913 77.8542C24.594 83.6854 24.488 86.5452 24.8913 89.1117C24.3667 87.9468 24.9992 89.9841 24.2659 89.1117C23.5325 88.2392 21.931 84.6969 20.1381 78.4797C19.2704 77.7355 18.9992 77.4201 18.5194 76.8621L18.5121 76.8536Z"
          fill="#073E94"
        />
        <Path
          d="M13.884 15.2383C14.2484 13.2287 12.0078 11.5593 12.0078 10.8604C12.0078 10.1614 12.9224 10.8317 13.5088 10.8604C13.7385 8.1261 13.7112 6.41573 15.6352 5.60692C16.6856 5.38532 17.6409 5.89912 19.5128 7.10791C18.9404 9.35009 18.9998 10.4914 20.8887 11.9861C22.2585 13.0035 24.1079 12.6381 26.8926 11.6857C27.8796 12.7203 28.6672 13.3139 30.0197 12.8863C27.8028 18.4726 26.5236 22.0511 21.0137 26.8207C19.293 21.4695 18.1072 19.0059 16.1355 16.2389C14.5312 16.3292 13.9756 16.1522 13.884 15.2383Z"
          fill="#B49DA3"
        />
        <Path
          d="M10.632 9.93457C8.78053 6.45293 7.51128 5.46882 3.1271 7.6831C1.71708 5.46199 2.12642 3.30524 3.37724 1.80424C4.62805 0.303234 11.1449 -0.573393 16.7611 0.428331C28.009 2.54016 31.855 5.89649 38.6406 11.8182L38.7755 11.9359C44.776 15.2003 45.7948 34.7014 48.0316 37.3276C50.2684 39.9538 65.4124 60.2846 62.7913 64.2203C60.1703 68.156 48.4069 55.4646 47.6564 55.8398C46.9059 56.215 46.5947 56.8749 45.7802 57.3408C43.9329 58.3974 42.2995 59.1791 40.4016 58.2164C38.5694 57.2869 39.937 53.8561 37.9 53.5883C36.4921 53.4032 35.43 54.0293 34.6478 55.2144C30.5761 61.384 39.401 85.4843 39.401 85.4843C39.401 85.4843 40.0264 86.9853 40.9019 86.2348C41.7775 85.4843 41.7563 82.4098 42.528 80.6061C43.1839 79.0727 45.7801 89.8622 45.5299 90.6126C45.2798 91.3631 40.9865 87.9606 38.1501 87.2354C33.0546 85.9327 25.767 89.9872 24.6412 89.1117C23.5154 88.2361 25.5168 78.7298 24.0158 77.3539C22.5148 75.978 16.8861 69.5988 16.5109 67.9727C16.1356 66.3467 15.3851 56.215 14.7597 55.2144C14.1343 54.2137 13.2588 54.7141 11.8829 53.5883C10.5069 52.4626 12.3832 28.6969 13.7591 28.3217C15.135 27.9465 15.8754 29.2609 17.2614 29.0722C19.0737 28.8254 19.7323 27.6145 21.139 26.4454C25.8744 22.51 29.2693 13.9372 29.2693 12.9366C29.2693 12.9366 26.091 13.0538 26.2673 11.1854C26.4437 9.31705 25.1836 4.16264 19.8881 7.05769C18.5656 7.33976 17.2618 5.048 15.6353 5.68179C13.7335 6.42288 13.8004 9.94643 13.7591 10.56C13.7178 11.1736 12.4835 13.4162 10.632 9.93457Z"
          fill="#D21D17"
        />
        <Path
          d="M21.5142 7.68308C21.29 7.78002 21.194 7.94546 21.139 8.18341C21.0828 8.42607 21.0568 8.57881 21.139 8.80882C21.1982 8.97468 21.2925 9.06354 21.3891 9.18407C21.575 9.4159 21.8661 9.42529 22.1396 9.30915C22.3304 9.22814 22.4135 9.11465 22.5149 8.9339C22.6134 8.75825 22.6802 8.63092 22.64 8.43357C22.6048 8.261 22.5004 8.07034 22.3898 7.93325C22.2597 7.77193 22.207 7.76005 22.0146 7.68308C21.8331 7.61051 21.6936 7.60553 21.5142 7.68308Z"
          fill="#0B0B09"
        />
      </Svg>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  parrotContainer: {
    flexDirection: 'row',
  },
  parrotText: {
    marginRight: 10,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.smallText,
    fontWeight: '200',
    color: '#000000',
  },
  confetti: {
    position: 'absolute',
    zIndex: -1,
    right: 70,
    bottom: 60,
  },
  tears: {
    position: 'absolute',
    zIndex: 1,
    right: 30,
    bottom: 55,
  },
}));
