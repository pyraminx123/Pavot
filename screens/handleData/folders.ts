import {open} from '@op-engineering/op-sqlite';
import {generateUniqueTableName, retrieveDataFromTable} from './functions';

const db = open({name: 'myDb.sqlite'});

const createFoldersTable = async () => {
  try {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS allFolders (
          folderID INTEGER PRIMARY KEY,
          originalFolderName TEXT,
          uniqueFolderName TEXT UNIQUE
        );`,
    );
  } catch (error) {
    console.error('Error creating allFolders table', error);
  }
};

const insertIntoAllFolders = async (folderName: string) => {
  try {
    const uniqueFolderName = generateUniqueTableName(folderName);
    await db.execute(
      'INSERT INTO allFolders (originalFolderName, uniqueFolderName) VALUES (?, ?);',
      [folderName, uniqueFolderName],
    );
    return uniqueFolderName;
  } catch (error) {
    console.error(
      `Some error occurred trying to insert ${folderName} into allFolders`,
      error,
    );
  }
};

const createFolder = async (folderName: string) => {
  if (folderName.trim().length === 0) {
    console.log('Input is empty or whitespace, no folder was created');
    return;
  }
  try {
    const uniqueFolderName = await insertIntoAllFolders(folderName);
    // TODO set startingDate and shortTermDailyLoad back to null
    // TODO what it examDate changes
    db.execute(
      `CREATE TABLE ${uniqueFolderName} (
          deckID INTEGER PRIMARY KEY,
          originalDeckName TEXT,
          uniqueDeckName TEXT UNIQUE,
          folderID INTEGER,
          examDateSet BOOLEAN,
          examDate DATE,
          dueNewCards TEXT,
          dueReviewCards TEXT,
          lastTimeUpdatedDueCards DATE,
          shortTermDailyLoad TEXT,
          startingDate Date,
          FOREIGN KEY (folderID) REFERENCES allFolders(folderID)
        );`,
    );
    //console.log(`Table ${uniqueFolderName} created successfully`);
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${folderName}`,
      error,
    );
  }
};

const deleteFolder = async (folderID: number, fetchFolders: Function) => {
  try {
    const result = await db.execute(
      'SELECT uniqueFolderName FROM allFolders WHERE folderID=?',
      [folderID],
    );
    const uniqueFolderName = result?.rows?._array[0]?.uniqueFolderName;
    // delete row inside allFolders
    db.execute('DELETE FROM allFolders WHERE folderID=?;', [folderID]);
    try {
      // deletes associated decks
      const decks = retrieveDataFromTable(uniqueFolderName);
      if (decks) {
        for (let index = 0; index < Object.keys(decks).length; index++) {
          const uniqueDeckName = Object(decks)[index].uniqueDeckName;
          await db.execute(`DROP TABLE IF EXISTS "${uniqueDeckName}";`);
        }
      }
      try {
        // deletes table
        await db.execute(`DROP TABLE "${uniqueFolderName}";`);
      } catch (error) {
        console.error(
          `An error occurred trying to delete the table ${uniqueFolderName}.`,
          error,
        );
      }
    } catch (error) {
      console.error(`Couldn't delete decks inside ${uniqueFolderName}`, error);
    }
  } catch (error) {
    console.error(
      `An error occurred trying to delete ${folderID} from allFolders.`,
      error,
    );
  }
  // soo that it rerenders
  fetchFolders();
};

// TODO name function better
const insertIntoFolder = async (
  uniqueFolderName: string,
  originalDeckName: string,
  uniqueDeckName: string,
) => {
  try {
    await db.execute(
      `INSERT INTO ${uniqueFolderName} (originalDeckName, uniqueDeckName, examDateSet, examDate, lastTimeUpdatedDueCards, dueNewCards, dueReviewCards) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        originalDeckName,
        uniqueDeckName,
        false,
        Date.now(),
        null,
        JSON.stringify([]),
        JSON.stringify([]),
      ],
    );
  } catch (error) {
    console.error(
      'Some error occurred trying to insert data into the folder',
      error,
    );
  }
};

export {createFoldersTable, createFolder, deleteFolder, insertIntoFolder};
