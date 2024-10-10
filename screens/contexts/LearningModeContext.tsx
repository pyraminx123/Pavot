import React, {createContext, useContext, useState, ReactNode} from 'react';

// with the help of Copilot and chatGPT
const LearningModeContext = createContext<{
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}>({
  currentIndex: 0,
  setCurrentIndex: () => {},
});

export const useLearningModeContext = () => useContext(LearningModeContext);

export const LearningModeProvider = ({children}: {children: ReactNode}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <LearningModeContext.Provider value={{currentIndex, setCurrentIndex}}>
      {children}
    </LearningModeContext.Provider>
  );
};
