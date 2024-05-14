import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDb.sqlite'});

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
      `CREATE TABLE [${folderName}] (setId INT PRIMARY KEY, deck TEXT)`,
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
        id INT PRIMARY KEY,
        term TEXT,
        definition TEXT,
        folderID INT,
        FOREIGN KEY (folderID) REFERENCES ${folderName}(deckID)
      );`,
    );
  } catch (error) {
    console.error(
      `Some error occured trying to create a table ${deckName}`,
      error,
    );
  }
};

const insertIntoFolder = (folderName, deckName) => {
  try {
    db.execute(`INSERT INTO ${folderName} (set) VALUES (?);`, deckName);
  } catch {
    console.error(
      `Some error occured trying to insert ${deckName} into ${folderName}`,
    );
  }
};

const insertIntoSet = (deckName, term, definition, folderID) => {
  try {
    db.execute(
      `INSERT INTO ${deckName} (term, definition, folderID)
        VALUES (?, ?, ?);`,
      [term, definition, folderID],
    );
  } catch {
    console.error('Row already exists or no such table exists.');
  }
};

const retrieveDataFromTable = tableName => {
  try {
    const res = db.execute(`SELECT * FROM ${tableName}`);
    return res;
  } catch {
    console.error(`No such table ${tableName} exists`);
  }
};

export {
  createFolder,
  createDeck,
  deleteTable,
  insertIntoSet,
  insertIntoFolder,
  retrieveDataFromTable,
};
