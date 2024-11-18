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
  let scheduled_days = f.next(card, new Date(), rating).card.scheduled_days;
  console.log('scheduled_days', scheduled_days);

  const getTypicalIntervals = (initialCard: Card) => {
    let intervals: number[] = [];
    let currentCard = {...initialCard};
    let date = currentCard.due;
    let iterationCount = 0;
    const maxIterations = 50; // Safety limit for iterations

    let scheduledCard: RecordLogItem = f.next(currentCard, date, 4);
    let scheduledNbDays = scheduledCard.card.scheduled_days;
    let due = scheduledCard.card.due;

    intervals.push(scheduledNbDays);
    currentCard = scheduledCard.card; // Update the card state
    let retrievability = f.get_retrievability(currentCard, due, false);

    // Debugging initial state
    console.log('Initial:', {
      scheduledNbDays,
      retrievability,
      stability: currentCard.stability,
      difficulty: currentCard.difficulty,
    });

    // Loop until retrievability is greater than or equal to the target (0.9)
    while (retrievability < 0.85 && iterationCount < maxIterations) {
      const nextCard = f.next(currentCard, due, 4);
      scheduledNbDays = nextCard.card.scheduled_days;
      due = nextCard.card.due;

      intervals.push(scheduledNbDays);

      currentCard = nextCard.card;
      retrievability = f.get_retrievability(currentCard, due, false);

      console.log('Iteration', iterationCount + 1, {
        scheduledNbDays,
        stability: nextCard.card.stability,
        difficulty: nextCard.card.difficulty,
        retrievability: retrievability,
      });

      iterationCount++;
    }

    if (iterationCount >= maxIterations) {
      console.warn(
        'Reached maximum iterations, stopping early to avoid infinite loop.',
      );
    }

    return intervals;
  };

  const intervals = getTypicalIntervals(card);
  const optimalNbDays = intervals.reduce((a, b) => a + b, 0);
  const nbOfTotalCards = (retrieveDataFromTable(uniqueDeckName) as wordObj[])
    .length;
  console.log('nbOfTotalCards', nbOfTotalCards);

  let compressionFactor = (differenceInDays - 1) / optimalNbDays;
  if (compressionFactor > 1) {
    compressionFactor = 1;
  }

  const newInterval = intervals.map(interval => interval * compressionFactor);
  console.log('new interval', newInterval);

  console.log('intervals', intervals, optimalNbDays, compressionFactor);
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
    maximum_interval: 1000,
    request_retention: 0.9,
  });
  const f: FSRS = fsrs(params);
  let scheduling_cards: RecordLogItem = f.next(card, new Date(), rating);
  await updateCard(flashcard, scheduling_cards.card, uniqueDeckName);
};

export default algorithm;
