import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from 'react';

const AddButtonContext = createContext<{
  handleAddPress: Function;
  setHandleAddPress: React.Dispatch<React.SetStateAction<Function>>;
}>({
  handleAddPress: () => {},
  setHandleAddPress: () => {},
});

export const AddButtonProvider = ({children}: {children: ReactNode}) => {
  const [handleAddPress, setHandleAddPress] = useState(() => () => {});

  const updateHandleAddPress = useCallback((fn: Function) => {
    setHandleAddPress(() => fn);
  }, []);

  return (
    <AddButtonContext.Provider
      value={{handleAddPress, setHandleAddPress: updateHandleAddPress}}>
      {children}
    </AddButtonContext.Provider>
  );
};

export const useAddButtonContext = () => useContext(AddButtonContext);
