import {open} from '@op-engineering/op-sqlite';
import 'react-native-get-random-values';
import {Card, State} from 'ts-fsrs';
import {folderData, wordObj} from '../types';
import {retrieveDataFromTable} from './functions';

const db = open({name: 'myDb.sqlite'});

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

// TODO update this function
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

const updateCardInfo = async (
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

export {
  setExamDate,
  getExamDate,
  setExamDateSet,
  setDueReviewCards,
  setDueNewCards,
  setShortTermDailyLoad,
  getDueCards,
  deleteDueCards,
  updateCardInfo,
};
