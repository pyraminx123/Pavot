import {UnistylesRegistry} from 'react-native-unistyles';
import {breakpoints} from './breakpoints';
import {blueTheme, greenTheme} from './themes';

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  blue: typeof blueTheme;
  green: typeof greenTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    blue: blueTheme,
    green: greenTheme,
  })
  .addConfig({
    initialTheme: 'blue',
  });
