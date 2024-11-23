import React, {createContext, useContext, useState, ReactNode} from 'react';

// with the help of Copilot and chatGPT
const LearningModeContext = createContext<{
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  cycle: number;
  setCycle: React.Dispatch<React.SetStateAction<number>>;
  isButtonPressed: boolean;
  setIsButtonPressed: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  currentIndex: 0,
  setCurrentIndex: () => {},
  cycle: 0,
  setCycle: () => {},
  isButtonPressed: false,
  setIsButtonPressed: () => {},
});

export const useLearningModeContext = () => useContext(LearningModeContext);

export const LearningModeProvider = ({children}: {children: ReactNode}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  return (
    <LearningModeContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        cycle,
        setCycle,
        isButtonPressed,
        setIsButtonPressed,
      }}>
      {children}
    </LearningModeContext.Provider>
  );
};
