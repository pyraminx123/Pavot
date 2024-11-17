import {generatorParameters, fsrs, FSRS, RecordLogItem, State} from 'ts-fsrs';
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
  const examDate = filteredFolderData[0].examDate;
  const examDateSet = Boolean(filteredFolderData[0].examDateSet);
  console.log('r', examDate, examDateSet);
  const params = generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    maximum_interval: 2,
    request_retention: 0.9,
  });
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
  //console.log('Hello from the algorithm');
  //console.log('flashcard', flashcard);
  //console.log(State[flashcard.state]);
  const f: FSRS = fsrs(params);
  let scheduling_cards: RecordLogItem = f.next(card, new Date(), rating);
  //console.log('scheduling_cards:', scheduling_cards.card);
  await updateCard(flashcard, scheduling_cards.card, uniqueDeckName);
};

export default algorithm;
