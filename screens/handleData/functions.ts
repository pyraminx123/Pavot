import {open} from '@op-engineering/op-sqlite';
import {v4 as uuidv4} from 'uuid'; // to generate random values

const db = open({name: 'myDb.sqlite'});

const removeWhiteSpace = (name: string) => {
  return name.replace(/\W+/g, '_'); // some random regex that replaces ' ' & special characters with _
};

const generateUniqueTableName = (name: string) => {
  const nameWithoutSpaces = removeWhiteSpace(name);
  const uniqueID = uuidv4().replace(/-/g, ''); // regex removes -
  return `blup_${nameWithoutSpaces}_${uniqueID}`;
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

export {removeWhiteSpace, generateUniqueTableName, retrieveDataFromTable};
