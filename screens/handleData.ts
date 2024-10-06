import {open} from '@op-engineering/op-sqlite';
import 'react-native-get-random-values';
import {Card, createEmptyCard, State} from 'ts-fsrs';
import {v4 as uuidv4} from 'uuid'; // to generate random values
import {wordObj} from './types';

const db = open({name: 'myDb.sqlite'});

const removeWhiteSpace = (name: string) => {
  return name.replace(/\W+/g, '_'); // some random regex that replaces ' ' & special characters with _
};

const generateUniqueTableName = (name: string) => {
  const nameWithoutSpaces = removeWhiteSpace(name);
  const uniqueID = uuidv4().replace(/-/g, ''); // regex removes -
  return `blup_${nameWithoutSpaces}_${uniqueID}`;
};

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
    db.execute(
      `CREATE TABLE ${uniqueFolderName} (
        deckID INTEGER PRIMARY KEY,
        originalDeckName TEXT,
        uniqueDeckName TEXT UNIQUE,
        folderID INTEGER,
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

// TODO folderID is currently = null
const createDeck = (originalDeckName: string, uniqueFolderName: string) => {
  if (originalDeckName.trim().length === 0) {
    console.log('Input is empty or whitespace, no deck was created');
    return;
  }
  const uniqueDeckName = generateUniqueTableName(originalDeckName);
  try {
    // wordStats should be json data
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${uniqueDeckName} (
        id INTEGER PRIMARY KEY,
        term TEXT,
        definition TEXT,
        deckID INTEGER,
        due DATE,
        stability NUMBER,
        difficulty NUMBER,
        elapsed_days NUMBER,
        scheduled_days NUMBER,
        reps NUMBER,
        lapses NUMBER,
        state NUMBER,
        last_review DATE,
        FOREIGN KEY (deckID) REFERENCES ${uniqueFolderName}(deckID)
      );`,
    );
    insertIntoFolder(uniqueFolderName, originalDeckName, uniqueDeckName);
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${uniqueDeckName}`,
      error,
    );
  }
};

const changeDeckName = async (
  uniqueFolderName: string,
  newDeckName: string,
  uniqueDeckName: string,
) => {
  if (newDeckName.trim().length === 0) {
    newDeckName = 'Unnamed deck';
  }

  try {
    await db.execute(
      `UPDATE ${uniqueFolderName} SET originalDeckName=? WHERE uniqueDeckName=?;`,
      [newDeckName, uniqueDeckName],
    );
  } catch (error) {
    console.error(
      'Some error occurred trying to change the name of the deck',
      error,
    );
  }
};

const insertIntoFolder = (
  uniqueFolderName: string,
  originalDeckName: string,
  uniqueDeckName: string,
) => {
  try {
    db.execute(
      `INSERT INTO ${uniqueFolderName} (originalDeckName, uniqueDeckName) VALUES (?, ?);`,
      [originalDeckName, uniqueDeckName],
    );
  } catch (error) {
    console.error(
      'Some error occurred trying to get the folderID from allFolders',
      error,
    );
  }
};

const deleteDeck = (
  uniqueFolderName: string,
  uniqueDeckName: string,
  fetchDecks: Function,
) => {
  // deletes row inside folder
  try {
    db.execute(`DELETE FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`, [
      uniqueDeckName,
    ]);
    // deletes deck
    try {
      db.execute(`DROP TABLE IF EXISTS "${uniqueDeckName}";`);
    } catch (error) {
      console.error(`Couldn't delete ${uniqueDeckName}`, error);
    }
  } catch (error) {
    //console.log(uniqueDeckName);
    console.error(
      `Some error occurred trying to delete a deck from ${uniqueFolderName}`,
      error,
    );
  }
  // so that it rerenders
  fetchDecks();
};

// ?? currently due it the current date and state is "0"
// TODO update function
const insertIntoDeck = async (
  uniqueFolderName: string,
  uniqueDeckName: string,
  term: string,
  definition: string,
) => {
  // only one of them needs to be filled
  if (term.trim().length > 0 || definition.trim().length > 0) {
    try {
      const emptyCard = createEmptyCard();
      const result = await db.execute(
        `SELECT deckID FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
        [uniqueDeckName],
      );
      const deckID = result?.rows?._array[0]?.deckID;
      db.execute(
        `INSERT INTO ${uniqueDeckName} (
          term,
          definition,
          deckID,
          due,
          stability,
          difficulty,
          elapsed_days,
          scheduled_days,
          reps,
          lapses,
          state
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          term,
          definition,
          deckID,
          new Date(emptyCard.due).toISOString(),
          emptyCard.stability,
          emptyCard.difficulty,
          emptyCard.elapsed_days,
          emptyCard.scheduled_days,
          emptyCard.reps,
          emptyCard.lapses,
          State[emptyCard.state],
        ],
      );
      //console.log('table', retrieveDataFromTable(uniqueDeckName));
    } catch (error) {
      console.error(
        `Some error occurred trying to insert ${term} into ${uniqueDeckName}`,
        error,
      );
    }
  }
};

const updateCard = async (
  oldCard: wordObj,
  newCardInfo: Card,
  uniqueDeckName: string,
) => {
  try {
    //console.log('newState', State[newCardInfo.state]);
    await db.execute(
      `UPDATE ${uniqueDeckName} SET
        due=?,
        stability=?,
        difficulty=?,
        elapsed_days=?,
        scheduled_days=?,
        reps=?,
        lapses=?,
        state=?,
        last_review=?
      WHERE id=?;`,
      [
        new Date(newCardInfo.due).toISOString(),
        newCardInfo.stability,
        newCardInfo.difficulty,
        newCardInfo.elapsed_days,
        newCardInfo.scheduled_days,
        newCardInfo.reps,
        newCardInfo.lapses,
        State[newCardInfo.state],
        newCardInfo?.last_review
          ? new Date(newCardInfo.last_review).toISOString()
          : null,
        oldCard.id,
      ],
    );
    //console.log('Data', retrieveDataFromTable(uniqueDeckName));
  } catch (error) {
    console.error(
      `Some error occurred trying to update card with id ${oldCard.id} in ${uniqueDeckName} due: ${newCardInfo.due}`,
      error,
    );
  }
};

const updateEntryInDeck = async (
  uniqueDeckName: string,
  id: number,
  newTerm: string,
  newDefinition: string,
) => {
  if (newTerm.trim().length > 0 && newDefinition.trim().length > 0) {
    try {
      await db.execute(
        `UPDATE ${uniqueDeckName} SET term=?, definition=? WHERE id=?;`,
        [newTerm, newDefinition, id],
      );
      //console.log(`Updated entry with id ${id} in ${uniqueDeckName}`);
    } catch (error) {
      console.error(
        `Some error occurred trying to update entry with id ${id} in ${uniqueDeckName}`,
        error,
      );
    }
  }
};

const deleteEntryInDeck = async (uniqueDeckName: string, id: number) => {
  try {
    db.execute(`DELETE FROM ${uniqueDeckName} WHERE id=?;`, [id]);
  } catch (error) {
    console.error(
      `Some error occurred trying to delete entry with id ${id} in ${uniqueDeckName}`,
      error,
    );
  }
};

const retrieveDataFromTable = (tableName: string): object => {
  try {
    const res = db.execute(`SELECT * FROM ${tableName};`)?.rows
      ?._array as object;
    //console.log(typeof res);
    return res as object;
  } catch (error) {
    console.error(`No such table ${tableName} exists`, error);
    return {};
  }
};

const retrieveWordFromDeck = (uniqueDeckName: string, id: number): object => {
  try {
    const res = db.execute(`SELECT * FROM ${uniqueDeckName} WHERE id=?;`, [id])
      ?.rows?._array;
    return res as object;
  } catch (error) {
    console.log(
      `Couldn't retrieve word with id ${id} from ${uniqueDeckName}`,
      error,
    );
    return {};
  }
};

export {
  generateUniqueTableName,
  createFoldersTable,
  createFolder,
  createDeck,
  changeDeckName,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  updateEntryInDeck,
  deleteEntryInDeck,
  updateCard,
  retrieveDataFromTable,
  retrieveWordFromDeck,
};
