import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDb.sqlite'});

const createFoldersTable = () => {
  try {
    db.execute(
      'CREATE TABLE IF NOT EXISTS allFolders (folderID INTEGER PRIMARY KEY, folderName TEXT);',
    );
  } catch (error) {
    console.error(error);
  }
};

const insertIntoAllFolders = folderName => {
  try {
    db.execute('INSERT INTO allFolders (folderName) VALUES (?);', [folderName]);
  } catch (error) {
    console.error(
      `Some error ocurred trying to insert ${folderName} into allFolders`,
      error,
    );
  }
};

const deleteTable = tableName => {
  try {
    db.execute(`DROP TABLE ${tableName}`);
  } catch {
    console.error(`No such table ${tableName}.`);
  }
};

// TODO also handle when input is only whitespaces
// TODO whitespaces should be replaced with _
// TODO the folderName can't have spaces, it can however be stored in allFolders correctly
const createFolder = folderName => {
  if (folderName.length === 0) {
    console.log('Input is empty, no folder was created');
    return;
  }
  try {
    db.execute(
      `CREATE TABLE ${folderName} (
        deckID INTEGER PRIMARY KEY,
        deck TEXT,
        folderID INTEGER,
        FOREIGN KEY (folderID) REFERENCES allFolders(folderID)
      );`,
    );
    insertIntoAllFolders(folderName);
    //console.log(
    //  db.execute("SELECT name FROM sqlite_master WHERE type='table';").rows,
    //);
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

// TODO also delete decks associated with it!
const deleteFolder = folderName => {
  try {
    db.execute('DELETE FROM allFolders WHERE folderName=?;', [folderName]);
  } catch (error) {
    console.error(
      `An error ocurred trying to delete ${folderName} from allFolders.`,
      error,
    );
  }
  try {
    db.execute(`DROP TABLE IF EXISTS "${folderName}";`);
  } catch (error) {
    console.error(
      `An error ocurred trying to delete the table ${folderName}.`,
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

// TODO remove deckID
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
  createFoldersTable,
  createFolder,
  createDeck,
  deleteTable,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  insertIntoFolder,
  retrieveDataFromTable,
};
