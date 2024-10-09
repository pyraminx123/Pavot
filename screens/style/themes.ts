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
  utils: {
    hexToRgba: (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    capitalize: (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
    sleep: (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
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

export const orangeTheme = {
  ...baseTheme,
  colors: {
    light: '#FDF1E8',
    dark: '#CA8042',
  },
} as const;

export const redTheme = {
  ...baseTheme,
  colors: {
    light: '#FFD9D9',
    dark: '#A35050',
  },
} as const;

export const pinkTheme = {
  ...baseTheme,
  colors: {
    light: '#FAE9FF',
    dark: '#A367B5',
  },
} as const;
