import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDb.sqlite'});

const createSettingsTable = async () => {
  try {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS settings (
          settingName TEXT PRIMARY KEY,
          settingValue TEXT
        );`,
    );
    try {
      // set default theme
      await db.execute(
        "INSERT OR IGNORE INTO settings (settingName, settingValue) VALUES ('theme', 'blue');",
      );
    } catch (error) {
      console.error('Error inserting into settings table', error);
    }
  } catch (error) {
    console.error('Error creating settings table', error);
  }
};

const changeTheme = async (theme: string) => {
  try {
    await db.execute(
      'UPDATE settings SET settingValue=? WHERE settingName="theme";',
      [theme],
    );
    //console.log('Theme changed to', theme);
  } catch (error) {
    console.error('Error changing theme', error);
  }
};

export {createSettingsTable, changeTheme};
