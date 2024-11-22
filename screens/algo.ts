import {
  generatorParameters,
  fsrs,
  FSRS,
  RecordLogItem,
  State,
  Card,
} from 'ts-fsrs';
import {folderData, wordObj} from './types';
import {retrieveDataFromTable, updateCard} from './handleData';

// TODO add max interval (for tests)
const algorithm = async (
  isWordCorrect: boolean,
  rating: 1 | 2 | 3 | 4, // 1 - again, 2 - hard, 3 - good, 4 - easy
  flashcard: wordObj,
  uniqueDeckName: string,
  uniqueFolderName: string,
) => {
  if (!isWordCorrect) {
    rating = 1;
  }

  const folderDataArray = retrieveDataFromTable(
    uniqueFolderName,
  ) as folderData[];
  const filteredFolderData = folderDataArray.filter(
    item => item.uniqueDeckName === uniqueDeckName,
  ) as folderData[];
  const examDate = new Date(filteredFolderData[0].examDate);
  const examDateSet = Boolean(filteredFolderData[0].examDateSet);
  console.log('r', examDate, examDateSet);

  const card = {
    due: flashcard.due,
    stability: flashcard.stability,
    difficulty: flashcard.difficulty,
    elapsed_days: flashcard.elapsed_days,
    scheduled_days: flashcard.scheduled_days,
    reps: flashcard.reps,
    lapses: flashcard.lapses,
    state: State[flashcard.state as unknown as keyof typeof State],
    last_review: flashcard.last_review,
  };

  if (!examDateSet) {
    await longTerm(flashcard, uniqueDeckName, card, rating);
  } else {
    await shortTerm(examDate, card, rating, uniqueDeckName);
  }
};

const shortTerm = (
  examDate: Date,
  card: Card,
  rating: 1 | 2 | 3 | 4,
  uniqueDeckName: string,
) => {
  const dateToday = new Date();
  const difference = examDate.getTime() - dateToday.getTime();
  const differenceInDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
  console.log('short term', differenceInDays);

  const params = generatorParameters({
    enable_fuzz: false,
    enable_short_term: true,
    maximum_interval: differenceInDays / 4,
    request_retention: 0.9,
  });

  const f: FSRS = fsrs(params);
  let scheduled_days = f.next(card, dateToday, rating).card.scheduled_days;
  console.log('scheduled_days', scheduled_days);
  console.log(examDate, new Date(examDate.getTime() - 1000 * 60 * 60 * 24));
};

const longTerm = async (
  flashcard: wordObj,
  uniqueDeckName: string,
  card: Card,
  rating: 1 | 2 | 3 | 4,
) => {
  console.log('long term');
  const params = generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    maximum_interval: 365,
    request_retention: 0.9,
  });
  const f: FSRS = fsrs(params);
  let scheduling_cards: RecordLogItem = f.next(card, new Date(), rating);
  await updateCard(flashcard, scheduling_cards.card, uniqueDeckName);
};

export default algorithm;
