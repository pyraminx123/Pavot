import {UnistylesRegistry} from 'react-native-unistyles';
import {breakpoints} from './breakpoints';
import {
  blueTheme,
  greenTheme,
  orangeTheme,
  redTheme,
  pinkTheme,
} from './themes';
import {retrieveDataFromTable} from '../handleData';
import {createSettingsTable} from '../handleData';

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  blue: typeof blueTheme;
  green: typeof greenTheme;
  orange: typeof orangeTheme;
  red: typeof redTheme;
  pink: typeof pinkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

interface Settings {
  settingName: string;
  settingValue: string;
}

createSettingsTable();

const settings = retrieveDataFromTable('settings') as Settings[];
console.log(settings);
const initialTheme = (settings[0]?.settingValue as keyof AppThemes) || 'blue';

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    blue: blueTheme,
    green: greenTheme,
    orange: orangeTheme,
    red: redTheme,
    pink: pinkTheme,
  })
  .addConfig({
    initialTheme: initialTheme,
  });
