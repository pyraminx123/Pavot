import type {wordObj} from './types';

const sortTerms = (terms: wordObj[], shuffle: boolean) => {
  const unkownTerms = getUnknownTerms(terms);
  if (shuffle) {
    const shuffledTerms = shuffleTerms(unkownTerms);
  }
};

const isUnknown = (term: wordObj) => {
  const attemps = JSON.parse(term.wordStats).Attemps;
  return attemps.includes(0);
};

const getUnknownTerms = (terms: wordObj[]) => {
  const unkownTerms = terms.filter(term => isUnknown(term));
  return unkownTerms;
};

// Fisher-Yates shuffle
const shuffleTerms = (array: wordObj[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export {sortTerms};
