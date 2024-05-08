import {open} from '@op-engineering/op-sqlite';

const db = open({name: 'myDb.sqlite'});

const deleteTable = tableName => {
  try {
    db.execute(`DROP TABLE ${tableName}`);
  } catch {
    console.error(`No such table ${tableName}.`);
  }
};

const createTable = tableName => {
  try {
    db.execute(
      `CREATE TABLE ${tableName} (id INT PRIMARY KEY,
        term varchar(255),
        definition varchar(255));`,
    );
  } catch {
    console.error('Table already exists.');
  }
};

const insertIntoTable = (tableName, term, definition) => {
  const arrayWithID = db.execute(`SELECT id FROM ${tableName}`).rows?._array;
  console.log('the array:', arrayWithID);
  const id = arrayWithID.length === 0 ? 0 : arrayWithID[arrayWithID.length - 1];
  console.log(id);
  try {
    db.execute(
      `INSERT INTO ${tableName} (id, term, definition)
        VALUES (?, ?, ?);`,
      [id, term, definition],
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

export {createTable, deleteTable, insertIntoTable, retrieveDataFromTable};
