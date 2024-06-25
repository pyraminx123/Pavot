import {open} from '@op-engineering/op-sqlite';
import {v4 as uuidv4} from 'uuid'; // to generate random values

const db = open({name: 'myDb.sqlite'});

const sanitizeName = name => {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
};

const createMetaTable = () => {
  try {
    db.execute(
      `CREATE TABLE IF NOT EXISTS metaTable (
        id INTEGER PRIMARY KEY,
        originalName TEXT,
        tableName TEXT UNIQUE
      );`,
    );
  } catch (error) {
    console.error(error);
  }
};

const removeWhiteSpace = name => {
  return name.replace(/\W+/g, '_'); // some random regex that replaces ' ' with _
};

const generateUniqueTableName = name => {
  const nameWithoutSpaces = removeWhiteSpace(name);
  const uniqueID = uuidv4().replace(/-/g, ''); // regex removes -
  return `${nameWithoutSpaces}_${uniqueID}`;
};

const insertIntoMetaTable = name => {
  const uniqueName = generateUniqueTableName(name);
  try {
    db.execute(
      'INSERT INTO metaTable (originalName, tableName) VALUES (?, ?);',
      [name, uniqueName],
    );
  } catch (error) {
    console.error(error);
  }
};

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
      `Some error occurred trying to insert ${folderName} into allFolders`,
      error,
    );
  }
};

// TODO also handle when input is only whitespaces
// TODO whitespaces should be replaced with _?
// TODO the folderName can't have spaces, it can however be stored in allFolders correctly
const createFolder = folderName => {
  if (folderName.trim().length === 0) {
    console.log('Input is empty or whitespace, no folder was created');
    return;
  }
  const sanitizedFolderName = sanitizeName(folderName);
  try {
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${sanitizedFolderName} (
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

const deleteFolder = (folderName, fetchFolders) => {
  const sanitizedFolderName = sanitizeName(folderName);
  try {
    // delete row inside allFolders
    db.execute('DELETE FROM allFolders WHERE folderName=?;', [folderName]);

    try {
      // deletes associated decks
      const decks = retrieveDataFromTable(sanitizedFolderName);
      console.log('decks inside folder (delete function)', decks);
      for (let index = 0; index < decks.length; index++) {
        const deckName = decks[index].deckName;
        db.execute(`DROP TABLE IF EXISTS "${sanitizeName(deckName)}";`);
      }
      try {
        // deletes table
        db.execute(`DROP TABLE IF EXISTS "${sanitizedFolderName}";`);
      } catch (error) {
        console.error(
          `An error occurred trying to delete the table ${sanitizedFolderName}.`,
          error,
        );
      }
    } catch (error) {
      console.error(`Couldn't delete decks inside ${folderName}`, error);
    }
  } catch (error) {
    console.error(
      `An error occurred trying to delete ${folderName} from allFolders.`,
      error,
    );
  }
  // just to check if it works
  console.log(
    db.execute('SELECT name FROM sqlite_master WHERE type="table";').rows,
  );
  // soo that it rerenders
  fetchFolders();
};

const createDeck = (deckName, folderName) => {
  if (deckName.trim().length === 0) {
    console.log('Input is empty or whitespace, no deck was created');
    return;
  }
  const sanitizedDeckName = sanitizeName(deckName);
  const sanitizedFolderName = sanitizeName(folderName);
  try {
    db.execute(
      `CREATE TABLE IF NOT EXISTS ${sanitizedDeckName} (
        id INTEGER PRIMARY KEY,
        term TEXT,
        definition TEXT,
        deckID INTEGER,
        FOREIGN KEY (deckID) REFERENCES ${sanitizedFolderName}(deckID)
      );`,
    );
    insertIntoFolder(folderName, deckName);
  } catch (error) {
    console.log('deckName:', deckName, 'folderName:', folderName);
    console.error(
      `Some error occurred trying to create a table ${sanitizedDeckName}`,
      error,
    );
  }
};

const insertIntoFolder = (folderName, deckName) => {
  const sanitizedFolderName = sanitizeName(folderName);
  try {
    const result = db.execute(
      'SELECT folderID FROM allFolders WHERE folderName=?',
      [folderName],
    );
    const rowsArray = result.rows._array;
    console.log('rows', rowsArray);
    if (rowsArray.length > 0) {
      const folderID = rowsArray[0].folderID;
      try {
        db.execute(
          `INSERT INTO ${sanitizedFolderName} (deckName, folderID) VALUES (?, ?);`,
          [deckName, folderID],
        );
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

const deleteDeck = (folderName, deckName, fetchDecks) => {
  // deletes row inside folder
  try {
    db.execute(`DELETE FROM ${folderName} WHERE deckName=?;`, [deckName]);
    // deletes deck
    try {
      db.execute(`DROP TABLE IF EXISTS "${deckName}";`);
    } catch (error) {
      console.error(`Couldn't delete ${deckName}`, error);
    }
  } catch (error) {
    console.error(
      `Some error occurred trying to delete a deck from ${folderName}`,
      error,
    );
  }
  // just to check if it works
  console.log(
    db.execute('SELECT name FROM sqlite_master WHERE type="table";').rows,
  );
  // so that it rerenders
  fetchDecks();
};

const insertIntoDeck = async (folderName, deckName, term, definition) => {
  const sanitizedDeckName = sanitizeName(deckName);
  const deckID = await db.execute(
    `SELECT deckID FROM ${folderName} WHERE deckName=?`,
    [deckName],
  ).rows._array[0].deckID;
  console.log(deckID, 'id');

  if (term.trim().length > 0 && definition.trim().length > 0) {
    try {
      db.execute(
        `INSERT INTO ${sanitizedDeckName} (term, definition, deckID)
          VALUES (?, ?, ?);`,
        [term, definition, deckID],
      );
    } catch (error) {
      console.error(
        `Some error occurred trying to insert ${term} into ${deckName}`,
        error,
      );
    }
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
  createMetaTable,
  createFoldersTable,
  createFolder,
  createDeck,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  retrieveDataFromTable,
};
