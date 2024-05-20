import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDb.sqlite'});

const getFolders = () => {
  return db;
};

const deleteTable = tableName => {
  try {
    db.execute(`DROP TABLE ${tableName}`);
  } catch {
    console.error(`No such table ${tableName}.`);
  }
};

const createFolder = folderName => {
  try {
    db.execute(
      `CREATE TABLE ${folderName} (deckID INTEGER PRIMARY KEY, deck TEXT);`,
    );
  } catch (error) {
    console.error(
      `Some error occured trying to create a table ${folderName}`,
      error,
    );
  }
};

const createDeck = (deckName, folderName) => {
  try {
    db.execute(
      `CREATE TABLE ${deckName} (
        id INTEGER PRIMARY KEY,
        term TEXT,
        definition TEXT,
        deckID INTEGER,
        FOREIGN KEY (deckID) REFERENCES ${folderName}(deckID)
      );`,
    );
  } catch (error) {
    console.error(
      `Some error occured trying to create a table ${deckName}`,
      error,
    );
  }
};

// ! it deletes a row within a folder and not the entire table!
const deleteDeck = (folderName, deckID) => {
  try {
    db.execute(`DELETE FROM ${folderName} WHERE deckID=${deckID};`);
  } catch (error) {
    console.error(
      `Some error ocurred trying to delete a deck from ${folderName}`,
      error,
    );
  }
};

const insertIntoFolder = (folderName, deckName) => {
  try {
    db.execute(`INSERT INTO ${folderName} (deck) VALUES (?);`, [deckName]);
  } catch (error) {
    console.error(
      `Some error occured trying to insert ${deckName} into ${folderName}`,
      error,
    );
  }
};

const insertIntoDeck = (deckName, term, definition, deckID) => {
  try {
    db.execute(
      `INSERT INTO ${deckName} (term, definition, deckID)
        VALUES (?, ?, ?);`,
      [term, definition, deckID],
    );
  } catch (error) {
    console.error(
      `Some error occured trying to insert ${term} into ${deckName}`,
      error,
    );
  }
};

const retrieveDataFromTable = tableName => {
  try {
    const res = db.execute(`SELECT * FROM ${tableName}`).rows?._array;
    return res;
  } catch {
    console.error(`No such table ${tableName} exists`);
  }
};

export {
  createFolder,
  createDeck,
  deleteTable,
  deleteDeck,
  insertIntoDeck,
  insertIntoFolder,
  retrieveDataFromTable,
  getFolders,
};
