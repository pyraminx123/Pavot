const baseTheme = {
  typography: {
    fontFamily: 'Roboto',
    sizes: {
      title: 40,
      middleTitle: 32,
      text: 24,
      smallText: 16,
    },
  },
};

export const blueTheme = {
  ...baseTheme,
  colors: {
    light: '#EBEDF8',
    dark: '#073E94',
  },
} as const;

export const greenTheme = {
  ...baseTheme,
  colors: {
    light: '#F1F8EB',
    dark: '#335536',
  },
} as const;
