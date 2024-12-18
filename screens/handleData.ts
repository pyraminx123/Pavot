import {open} from '@op-engineering/op-sqlite';
import 'react-native-get-random-values';
import {Card, createEmptyCard, State} from 'ts-fsrs';
import {v4 as uuidv4} from 'uuid'; // to generate random values
import {folderData, wordObj} from './types';

const db = open({name: 'myDb.sqlite'});

const removeWhiteSpace = (name: string) => {
  return name.replace(/\W+/g, '_'); // some random regex that replaces ' ' & special characters with _
};

const generateUniqueTableName = (name: string) => {
  const nameWithoutSpaces = removeWhiteSpace(name);
  const uniqueID = uuidv4().replace(/-/g, ''); // regex removes -
  return `blup_${nameWithoutSpaces}_${uniqueID}`;
};

const createFoldersTable = async () => {
  try {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS allFolders (
        folderID INTEGER PRIMARY KEY,
        originalFolderName TEXT,
        uniqueFolderName TEXT UNIQUE
      );`,
    );
  } catch (error) {
    console.error('Error creating allFolders table', error);
  }
};

const insertIntoAllFolders = async (folderName: string) => {
  try {
    const uniqueFolderName = generateUniqueTableName(folderName);
    await db.execute(
      'INSERT INTO allFolders (originalFolderName, uniqueFolderName) VALUES (?, ?);',
      [folderName, uniqueFolderName],
    );
    return uniqueFolderName;
  } catch (error) {
    console.error(
      `Some error occurred trying to insert ${folderName} into allFolders`,
      error,
    );
  }
};

const createSettingsTable = async () => {
  try {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS settings (
        settingName TEXT PRIMARY KEY,
        settingValue TEXT
      );`,
    );
    try {
      // set default theme
      await db.execute(
        "INSERT OR IGNORE INTO settings (settingName, settingValue) VALUES ('theme', 'blue');",
      );
    } catch (error) {
      console.error('Error inserting into settings table', error);
    }
  } catch (error) {
    console.error('Error creating settings table', error);
  }
};

const changeTheme = async (theme: string) => {
  try {
    await db.execute(
      'UPDATE settings SET settingValue=? WHERE settingName="theme";',
      [theme],
    );
    //console.log('Theme changed to', theme);
  } catch (error) {
    console.error('Error changing theme', error);
  }
};

const createFolder = async (folderName: string) => {
  if (folderName.trim().length === 0) {
    console.log('Input is empty or whitespace, no folder was created');
    return;
  }
  try {
    const uniqueFolderName = await insertIntoAllFolders(folderName);
    // TODO set startingDate and shortTermDailyLoad back to null
    // TODO what it examDate changes
    db.execute(
      `CREATE TABLE ${uniqueFolderName} (
        deckID INTEGER PRIMARY KEY,
        originalDeckName TEXT,
        uniqueDeckName TEXT UNIQUE,
        folderID INTEGER,
        examDateSet BOOLEAN,
        examDate DATE,
        dueNewCards TEXT,
        dueReviewCards TEXT,
        lastTimeUpdatedDueCards DATE,
        shortTermDailyLoad TEXT,
        startingDate Date,
        FOREIGN KEY (folderID) REFERENCES allFolders(folderID)
      );`,
    );
    //console.log(`Table ${uniqueFolderName} created successfully`);
  } catch (error) {
    console.error(
      `Some error occurred trying to create a table ${folderName}`,
      error,
    );
  }
};

const deleteFolder = async (folderID: number, fetchFolders: Function) => {
  try {
    const result = await db.execute(
      'SELECT uniqueFolderName FROM allFolders WHERE folderID=?',
      [folderID],
    );
    const uniqueFolderName = result?.rows?._array[0]?.uniqueFolderName;
    // delete row inside allFolders
    db.execute('DELETE FROM allFolders WHERE folderID=?;', [folderID]);
    try {
      // deletes associated decks
      const decks = retrieveDataFromTable(uniqueFolderName);
      if (decks) {
        for (let index = 0; index < Object.keys(decks).length; index++) {
          const uniqueDeckName = Object(decks)[index].uniqueDeckName;
          await db.execute(`DROP TABLE IF EXISTS "${uniqueDeckName}";`);
        }
      }
      try {
        // deletes table
        await db.execute(`DROP TABLE "${uniqueFolderName}";`);
      } catch (error) {
        console.error(
          `An error occurred trying to delete the table ${uniqueFolderName}.`,
          error,
        );
      }
    } catch (error) {
      console.error(`Couldn't delete decks inside ${uniqueFolderName}`, error);
    }
  } catch (error) {
    console.error(
      `An error occurred trying to delete ${folderID} from allFolders.`,
      error,
    );
  }
  // soo that it rerenders
  fetchFolders();
};

const setShortTermDailyLoad = async (
  uniqueDeckName: string,
  uniqueFolderName: string,
  dailyLoads: {[key: number]: wordObj[]}, // eg {1: [wordObj1], 2: [wordObj2]}
) => {
  try {
    await db.execute(
      `UPDATE ${uniqueFolderName} SET shortTermDailyLoad=? WHERE uniqueDeckName=?;`,
      [JSON.stringify(dailyLoads), uniqueDeckName],
    );
  } catch (error) {
    console.error('Error setting short term daily load', error);
  }
};

// TODO setExamDate = true
const setExamDate = async (
  uniqueDeckName: string,
  uniqueFolderName: string,
  examDate: Date,
) => {
  try {
    const startingDate = new Date();
    await db.execute(
      `UPDATE ${uniqueFolderName} SET examDate=?, examDateSet=?, startingDate=?, shortTermDailyLoad=null WHERE uniqueDeckName=?;`,
      [
        examDate.toISOString(),
        true,
        startingDate.toISOString(),
        uniqueDeckName,
      ],
    );
  } catch (error) {
    console.error('Error adding exam date', error);
  }
};

const getExamDate = async (
  uniqueDeckName: string,
  uniqueFolderName: string,
) => {
  try {
    const examDateSetResult = await db.execute(
      `SELECT examDateSet FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
      [uniqueDeckName],
    );
    const examDateSet = examDateSetResult?.rows?._array[0]?.examDateSet;
    if (examDateSet) {
      const result = await db.execute(
        `SELECT examDate FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
        [uniqueDeckName],
      );
      return result?.rows?._array[0]?.examDate;
    } else {
      return Date.now();
    }
  } catch (error) {
    console.error('Error getting exam date', error);
    return '';
  }
};

const setExamDateSet = async (
  uniqueDeckName: string,
  uniqueFolderName: string,
  examDateSetValue: boolean,
) => {
  try {
    await db.execute(
      `UPDATE ${uniqueFolderName} SET examDateSet=? WHERE uniqueDeckName=?;`,
      [examDateSetValue, uniqueDeckName],
    );
  } catch (error) {
    console.error('Error resetting exam date', error);
  }
};

const deleteDueCards = async (
  uniqueFolderName: string,
  uniqueDeckName: string,
) => {
  try {
    await db.execute(
      `UPDATE ${uniqueFolderName} SET dueNewCards=?, dueReviewCards=? WHERE uniqueDeckName=?;`,
      [JSON.stringify([]), JSON.stringify([]), uniqueDeckName],
    );
  } catch (error) {
    console.error('Error deleting due cards', error);
  }
};

const setDueReviewCards = async (
  dueReviewCards: wordObj[],
  uniqueFolderName: string,
  uniqueDeckName: string,
) => {
  try {
    await db.execute(
      `UPDATE ${uniqueFolderName} SET dueReviewCards=? WHERE uniqueDeckName=?;`,
      [JSON.stringify(dueReviewCards), uniqueDeckName],
    );
  } catch (error) {
    console.error('Error setting due cards', error);
  }
};

const getDueCards = async (
  uniqueFolderName: string,
  uniqueDeckName: string,
): Promise<{dueNewCards: wordObj[]; dueReviewCards: wordObj[]}> => {
  try {
    const dueReviewCards = await db.execute(
      `SELECT dueReviewCards FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
      [uniqueDeckName],
    );
    const dueNewCards = await db.execute(
      `SELECT dueNewCards FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
      [uniqueDeckName],
    );
    const dueReviewCardsString =
      dueReviewCards?.rows?._array[0]?.dueReviewCards || '[]';
    const dueNewCardsString = dueNewCards?.rows?._array[0]?.dueNewCards || '[]';

    const result = {
      dueNewCards: JSON.parse(dueNewCardsString),
      dueReviewCards: JSON.parse(dueReviewCardsString),
    };
    return result;
  } catch (error) {
    console.error('Error getting due cards', error);
    return {dueNewCards: [], dueReviewCards: []};
  }
};

const setDueNewCards = async (
  uniqueFolderName: string,
  uniqueDeckName: string,
) => {
  try {
    const folderDataArray = retrieveDataFromTable(
      uniqueFolderName,
    ) as folderData[];
    const filteredFolderData = folderDataArray.filter(
      item => item.uniqueDeckName === uniqueDeckName,
    ) as folderData[];
    const examDateSet = Boolean(filteredFolderData[0].examDateSet);
    const dateToday = new Date();

    if (!examDateSet) {
      // if long term enabled
      const lastTimeUpdatedDueCards = await db.execute(
        `SELECT lastTimeUpdatedDueCards FROM ${uniqueFolderName} WHERE uniqueDeckName=?;`,
        [uniqueDeckName],
      )?.rows?._array[0]?.lastTimeUpdatedDueCards;
      const lastTime = new Date(lastTimeUpdatedDueCards);
      const difference = Math.abs(dateToday.getTime() - lastTime.getTime());
      const daysDifference = Math.trunc(difference / (1000 * 3600 * 24));

      if (lastTimeUpdatedDueCards) {
        if (daysDifference >= 1) {
          const result = await db.execute(
            `SELECT * FROM ${uniqueDeckName} WHERE state="New";`,
          );
          const dueNewCards = result?.rows?._array.slice(0, 10) || [];
          await db.execute(
            `UPDATE ${uniqueFolderName} SET dueNewCards=?, lastTimeUpdatedDueCards=? WHERE uniqueDeckName=?;`,
            [
              JSON.stringify(dueNewCards),
              dateToday.toISOString(),
              uniqueDeckName,
            ],
          );
        }
      } else {
        const result = await db.execute(
          `SELECT * FROM ${uniqueDeckName} WHERE state="New";`,
        );
        const dueNewCards = result?.rows?._array.slice(0, 10) || [];
        await db.execute(
          `UPDATE ${uniqueFolderName} SET dueNewCards=?, lastTimeUpdatedDueCards=? WHERE uniqueDeckName=?;`,
          [
            JSON.stringify(dueNewCards),
            dateToday.toISOString(),
            uniqueDeckName,
          ],
        );
      }
    } else {
      // if short term enabled
      console.log('short term enabled');
      const startingDate = filteredFolderData[0].startingDate;
      let shortTermDailyLoad = JSON.parse(
        filteredFolderData[0].shortTermDailyLoad as unknown as string,
      ); // TODO set back to null when short term is disabled
      console.log('shortTermDailyLoad', shortTermDailyLoad);
      if (!shortTermDailyLoad) {
        const examDate = filteredFolderData[0].examDate; // TODO what if examDate changes
        const difference = new Date(examDate).getTime() - dateToday.getTime();
        const differenceInDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
        const reviewDays = Math.floor(differenceInDays / 3);
        const totalDaysForLearning = differenceInDays - reviewDays;
        const allWords = retrieveDataFromTable(uniqueDeckName) as wordObj[];
        const intervals = calculateIntervals(totalDaysForLearning, allWords);
        const distributedCards = distributeCards(
          intervals,
          allWords,
          reviewDays,
        ); // TODO mix them
        await setShortTermDailyLoad(
          uniqueDeckName,
          uniqueFolderName,
          distributedCards,
        );
        const updatedFolderDataArray = (await retrieveDataFromTable(
          uniqueFolderName,
        )) as folderData[];
        const updatedFilteredFolderData = updatedFolderDataArray.filter(
          item => item.uniqueDeckName === uniqueDeckName,
        ) as folderData[];
        shortTermDailyLoad = updatedFilteredFolderData[0].shortTermDailyLoad;
      }
      const differenceBetweenStartAndExam = Math.abs(
        Math.ceil(
          (new Date(startingDate).getTime() - dateToday.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      console.log(
        'load',
        String(differenceBetweenStartAndExam),
        shortTermDailyLoad,
      );
      // TODO don't forget to save to database
    }
  } catch (error) {
    console.error('Error setting new due cards', error);
  }
};

// for short term
const calculateIntervals = (
  totalDaysForLearning: number,
  allWords: wordObj[],
) => {
  const func = (i: number) => 1 / i;
  let weightTotal = 0;
  for (let i = 1; i <= totalDaysForLearning; i++) {
    weightTotal += func(i);
  }

  let intervals = [];
  for (let i = 1; i <= totalDaysForLearning; i++) {
    intervals.push(Math.floor(allWords.length * (func(i) / weightTotal)));
  }

  const cardsLeftToDistribute =
    allWords.length - intervals.reduce((a, b) => a + b, 0);
  //console.log('cardsLeftToDistribute', cardsLeftToDistribute);
  if (cardsLeftToDistribute > 0) {
    for (let i = 0; i < cardsLeftToDistribute; i++) {
      const randomIndex = Math.floor(Math.random() * intervals.length);
      intervals[randomIndex] += 1;
    }
  }

  return intervals;
};

// also for short term
const distributeCards = (
  intervals: number[],
  allWords: wordObj[],
  reviewDays: number,
) => {
  let distributedAllWords = allWords;
  let distributedCards: {[key: number]: wordObj[]} = {};
  let i = 0;
  for (i = 0; i < intervals.length; i++) {
    distributedCards[+i] = distributedAllWords.slice(0, intervals[i]);
    distributedAllWords = distributedAllWords.slice(intervals[i]);
  }
  for (let j = 0; j < reviewDays; j++) {
    distributedCards[i + j] = allWords; // TODO distribute cards for review too
  }
  return distributedCards;
};

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

const insertIntoFolder = async (
  uniqueFolderName: string,
  originalDeckName: string,
  uniqueDeckName: string,
) => {
  try {
    await db.execute(
      `INSERT INTO ${uniqueFolderName} (originalDeckName, uniqueDeckName, examDateSet, examDate, lastTimeUpdatedDueCards, dueNewCards, dueReviewCards) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        originalDeckName,
        uniqueDeckName,
        false,
        Date.now(),
        null,
        JSON.stringify([]),
        JSON.stringify([]),
      ],
    );
  } catch (error) {
    console.error(
      'Some error occurred trying to insert data into the folder',
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

const updateCard = async (
  oldCard: wordObj,
  newCardInfo: Card,
  uniqueDeckName: string,
) => {
  try {
    // TODO update maturityLevel
    let maturityLevel = 'Difficult';
    if (
      (newCardInfo.state as unknown as string) === 'New' ||
      newCardInfo.stability < 1
    ) {
      maturityLevel = 'Difficult';
    } else if (newCardInfo.stability >= 21) {
      maturityLevel = 'Easy';
    } else {
      maturityLevel = 'Medium';
    }
    //console.log('newState', State[newCardInfo.state]);
    await db.execute(
      `UPDATE ${uniqueDeckName} SET
        due=?,
        stability=?,
        difficulty=?,
        elapsed_days=?,
        scheduled_days=?,
        reps=?,
        lapses=?,
        state=?,
        last_review=?,
        maturityLevel=?
      WHERE id=?;`,
      [
        new Date(newCardInfo.due).toISOString(),
        newCardInfo.stability,
        newCardInfo.difficulty,
        newCardInfo.elapsed_days,
        newCardInfo.scheduled_days,
        newCardInfo.reps,
        newCardInfo.lapses,
        State[newCardInfo.state],
        newCardInfo?.last_review
          ? new Date(newCardInfo.last_review).toISOString()
          : null,
        maturityLevel,
        oldCard.id,
      ],
    );
    //console.log('Data', retrieveDataFromTable(uniqueDeckName));
  } catch (error) {
    console.error(
      `Some error occurred trying to update card with id ${oldCard.id} in ${uniqueDeckName} due: ${newCardInfo.due}`,
      error,
    );
  }
};

const updateEntryInDeck = async (
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

const deleteEntryInDeck = async (uniqueDeckName: string, id: number) => {
  try {
    db.execute(`DELETE FROM ${uniqueDeckName} WHERE id=?;`, [id]);
  } catch (error) {
    console.error(
      `Some error occurred trying to delete entry with id ${id} in ${uniqueDeckName}`,
      error,
    );
  }
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

const retrieveWordFromDeck = (uniqueDeckName: string, id: number): object => {
  try {
    const res = db.execute(`SELECT * FROM ${uniqueDeckName} WHERE id=?;`, [id])
      ?.rows?._array;
    return res as object;
  } catch (error) {
    console.error(
      `Couldn't retrieve word with id ${id} from ${uniqueDeckName}`,
      error,
    );
    return {};
  }
};

export {
  generateUniqueTableName,
  createFoldersTable,
  createSettingsTable,
  changeTheme,
  createFolder,
  createDeck,
  changeDeckName,
  deleteDeck,
  deleteFolder,
  insertIntoDeck,
  setExamDate,
  getExamDate,
  setExamDateSet,
  setDueReviewCards,
  setDueNewCards,
  setShortTermDailyLoad,
  getDueCards,
  deleteDueCards,
  updateEntryInDeck,
  deleteEntryInDeck,
  updateCard,
  retrieveDataFromTable,
  retrieveWordFromDeck,
};
