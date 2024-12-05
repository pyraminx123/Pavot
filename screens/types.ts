import {State} from 'ts-fsrs';

export interface wordObj {
  deckID: number;
  definition: string;
  term: string;
  id: number;
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: Date;
  maturityLevel: 'Difficult' | 'Medium' | 'Easy';
}

export interface wordStats {
  Attemps: number[];
}

export interface folderData {
  deckID: number;
  originalDeckName: string;
  uniqueDeckName: string;
  folderID: number;
  examDateSet: boolean;
  examDate: Date;
  dueNewCards: wordObj[];
  dueReviewCards: wordObj[];
  lastTimeUpdatedDueCards: Date;
  shortTermDailyLoad: {[key: number]: wordObj[]};
  startingDate: Date;
}
