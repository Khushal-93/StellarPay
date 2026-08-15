import { useContext } from 'react';
import { MockStateContext } from '../context/MockStateContext';

export const useMockState = () => {
  const context = useContext(MockStateContext);
  if (!context) {
    throw new Error('useMockState must be used within a MockStateProvider');
  }
  return context;
};
