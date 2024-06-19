import { open } from '@op-engineering/op-sqlite';

const db = open({ name: 'myDb.sqlite' });

const createFoldersTable = () => {
  try {
    db.execute(
      'CREATE TABLE IF NOT EXISTS allFolders (folderID INTEGER PRIMARY KEY, folderName TEXT);',
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteTable = (tableName) => {
  try {
    db.execute(`DROP TABLE IF EXISTS ${tableName}`);
  } catch (error) {
    console.error(`No such table ${tableName}.`);
  }
};

const createFolder = (folderName) => {
  if (folderName.length === 0) {
    console.log('Input is empty, no folder was created');
    return;
  }
  try {
    const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9_]/g, '');
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${sanitizedFolderName} (
        deckID INTEGER PRIMARY KEY,
        deckName TEXT,
        folderID INTEGER,
        FOREIGN KEY (folderID) REFERENCES allFolders(folderID)
      );`,
    );
    insertIntoAllFolders(folderName); // Note: Pass the original name for display purposes
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${folderName}`,
      error,
    );
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

const deleteFolder = (folderName) => {
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
    const sanitizedDeckName = deckName.replace(/[^a-zA-Z0-9_]/g, '');
    const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9_]/g, '');

    db.execute(
      `CREATE TABLE IF NOT EXISTS ${sanitizedDeckName} (
        id INTEGER PRIMARY KEY,
        term TEXT,
        definition TEXT,
        deckID INTEGER,
        FOREIGN KEY (deckID) REFERENCES ${sanitizedFolderName}(deckID)
      );`,
    );
    insertIntoFolder(folderName, deckName); // Pass the original folderName for display purposes
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
    const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9_]/g, '');
    const result = await db.execute(
      'SELECT folderID FROM allFolders WHERE folderName=?',
      [folderName],
    );
    console.log('Query result:', result);

    const rowsArray = result.rows._array;

    if (rowsArray.length > 0) {
      const folderID = rowsArray[0].folderID;

      try {
        await db.execute(`INSERT INTO ${sanitizedFolderName} (deckName, folderID) VALUES (?, ?);`, [
          deckName,
          folderID,
        ]);
      } catch (error) {
        console.error(
          `Some error occurred trying to insert ${deckName} into ${sanitizedFolderName}`,
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

const retrieveDataFromTable = (tableName) => {
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
  deleteTable,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  retrieveDataFromTable,
};
