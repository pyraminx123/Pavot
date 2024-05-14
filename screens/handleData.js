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
    db.execute(`CREATE TABLE ${folderName} (setId INT PRIMARY KEY, set TEXT)`);
  } catch {
    console.error(`Some error occured trying to create a table ${folderName}`);
  }
};

const createSet = (setName, folderName) => {
  try {
    db.execute(
      `CREATE TABLE ${setName} (
        id INT PRIMARY KEY,
        term TEXT,
        definition TEXT,
        folderID INT,
        FOREIGN KEY (folderID) REFERENCES ${folderName}(setID)
      );`,
    );
  } catch {
    console.error('Table already exists.');
  }
};

const insertIntoFolder = (folderName, setName) => {
  try {
    db.execute(`INSERT INTO ${folderName} (set) VALUES (?);`, setName);
  } catch {
    console.error(
      `Some error occured trying to insert ${setName} into ${folderName}`,
    );
  }
};

const insertIntoSet = (setName, term, definition, folderID) => {
  try {
    db.execute(
      `INSERT INTO ${setName} (term, definition, folderID)
        VALUES (?, ?, ?);`,
      [term, definition, folderID],
    );
  } catch {
    console.error('Row already exists or no such table exists.');
  }
};

const retrieveDataFromTable = tableName => {
  try {
    const res = db.execute(`SELECT * FROM ${tableName}`).rows?._array;
    return res;
  } catch {
    return [
      {
        term: 'No such table exists!',
        definition: "I'm sorry you have to experience this",
        id: 0,
      },
    ];
  }
};

export {
  createFolder,
  createSet,
  deleteTable,
  insertIntoSet,
  insertIntoFolder,
  retrieveDataFromTable,
};
