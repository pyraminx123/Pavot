import {open} from '@op-engineering/op-sqlite';
import {generateUniqueTableName} from './functions';
import {insertIntoFolder} from './folders';
import {State, createEmptyCard} from 'ts-fsrs';

const db = open({name: 'myDb.sqlite'});

// TODO folderID is currently = null
const createDeck = (
  originalDeckName: string,
  uniqueFolderName: string,
): string => {
  if (originalDeckName.trim().length === 0) {
    originalDeckName = 'Unnamed deck';
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
          maturityLevel TEXT,
          FOREIGN KEY (deckID) REFERENCES ${uniqueFolderName}(deckID)
        );`,
    );
    insertIntoFolder(uniqueFolderName, originalDeckName, uniqueDeckName);
    return uniqueDeckName;
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${uniqueDeckName}`,
      error,
    );
    return '';
  }
};

// ?? currently due it the current date and state is "0"
// TODO update function
const insertIntoDeck = async (
  uniqueFolderName: string,
  uniqueDeckName: string,
  term: string,
  definition: string,
) => {
  if (uniqueDeckName.trim().length === 0) {
    uniqueDeckName = createDeck('Unnamed deck', uniqueFolderName);
  }
  // only one of them needs to be filled
  if (term.trim().length > 0 || definition.trim().length > 0) {
    try {
      const emptyCard = createEmptyCard();
      const result = await db.execute(
        `SELECT deckID FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
        [uniqueDeckName],
      );
      const deckID = result?.rows?._array[0]?.deckID;
      await db.execute(
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
            state,
            maturityLevel
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
          'Difficult',
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

const deleteEntryInDeck = async (
  uniqueDeckName: string,
  id: number,
): Promise<void> => {
  try {
    db.execute(`DELETE FROM ${uniqueDeckName} WHERE id=?;`, [id]);
  } catch (error) {
    console.error(
      `Some error occurred trying to delete entry with id ${id} in ${uniqueDeckName}`,
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

const changeTermOrDef = async (
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

export {
  createDeck,
  insertIntoDeck,
  changeDeckName,
  deleteEntryInDeck,
  deleteDeck,
  changeTermOrDef,
};
