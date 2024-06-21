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

const insertIntoAllFolders = (folderName) => {
  try {
    db.execute('INSERT INTO allFolders (folderName) VALUES (?);', [folderName]);
  } catch (error) {
    console.error(
      `Some error occurred trying to insert ${folderName} into allFolders`,
      error,
    );
  }
};

// TODO also handle when input is only whitespaces
// TODO whitespaces should be replaced with _?
// TODO the folderName can't have spaces, it can however be stored in allFolders correctly
const createFolder = folderName => {
  if (folderName.length === 0) {
    console.log('Input is empty, no folder was created');
    return;
  }
  try {
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${folderName} (
        deckID INTEGER PRIMARY KEY,
        deckName TEXT,
        folderID INTEGER,
        FOREIGN KEY (folderID) REFERENCES allFolders(folderID)
      );`,
    );
    insertIntoAllFolders(folderName);
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${folderName}`,
      error,
    );
  }
};

const deleteFolder = folderName => {
  try {
    db.execute('DELETE FROM allFolders WHERE folderName=?;', [folderName]);
  } catch (error) {
    console.error(
      `An error occurred trying to delete ${folderName} from allFolders.`,
      error,
    );
  }
  try {
    db.execute(`DROP TABLE IF EXISTS "${folderName}";`);
  } catch (error) {
    console.error(
      `An error occurred trying to delete the table ${folderName}.`,
      error,
    );
  }
};

const createDeck = (deckName, folderName) => {
  if (deckName.length === 0) {
    console.log('Input is empty, no deck was created');
    return;
  }
  try {
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${deckName} (
        id INTEGER PRIMARY KEY,
        term TEXT,
        definition TEXT,
        deckID INTEGER,
        FOREIGN KEY (deckID) REFERENCES ${folderName}(deckID)
      );`,
    );
    insertIntoFolder(folderName, deckName);
  } catch (error) {
    console.log('deckName:', deckName, 'folderName:', folderName);
    console.error(
      `Some error occurred trying to create a table ${deckName}`,
      error,
    );
  }
};

const insertIntoFolder = async (folderName, deckName) => {
  try {
    const result = await db.execute(
      'SELECT folderID FROM allFolders WHERE folderName=?',
      [folderName],
    );
    const rowsArray = result.rows._array;
    console.log('rows', rowsArray);
    if (rowsArray.length > 0) {
      const folderID = rowsArray[0].folderID;
      try {
        await db.execute(`INSERT INTO ${folderName} (deckName, folderID) VALUES (?, ?);`, [
          deckName,
          folderID,
        ]);
      } catch (error) {
        console.error(
          `Some error occurred trying to insert ${deckName} into ${folderName}`,
          error,
        );
      }
    } else {
      console.error(`No folderID found for folderName: ${folderName}`);
    }
  } catch (error) {
    console.error(
      'Some error occurred trying to get the folderID from allFolders',
      error,
    );
  }
};

// ! it deletes a row within a folder and not the entire table!
// TODO expand this delete function
const deleteDeck = (folderName, deckID) => {
  try {
    db.execute(`DELETE FROM ${folderName} WHERE deckID=?;`, [deckID]);
  } catch (error) {
    console.error(
      `Some error occurred trying to delete a deck from ${folderName}`,
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
      `Some error occurred trying to insert ${term} into ${deckName}`,
      error,
    );
  }
};

const retrieveDataFromTable = tableName => {
  try {
    const res = db.execute(`SELECT * FROM ${tableName}`).rows._array;
    return res;
  } catch (error) {
    console.error(`No such table ${tableName} exists`, error);
  }
};

export {
  createFoldersTable,
  createFolder,
  createDeck,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  retrieveDataFromTable,
};
