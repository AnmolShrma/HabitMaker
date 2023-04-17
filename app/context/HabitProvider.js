import React, {createContext, useReducer, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HabitContext = createContext();

const initialState = [];

const habitReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_HABIT':
      return [...state, action.payload];
    case 'UPDATE_HABIT':
      return state.map(habit => {
        if (habit.id === action.payload.id) {
          return {...habit, ...action.payload};
        } else {
          return habit;
        }
      });
    case 'REMOVE_HABIT':
      return state.filter(habit => habit.id !== action.payload);
    case 'SET_HABITS':
      return action.payload;
    default:
      return state;
  }
};

export const HabitProvider = ({children}) => {
  const [habits, dispatch] = useReducer(habitReducer, initialState);
  const [loading, setLoading] = useState(true);
  const addHabit = habit => {
    dispatch({type: 'ADD_HABIT', payload: habit});
  };

  const updateHabit = habit => {
    dispatch({type: 'UPDATE_HABIT', payload: habit});
  };

  const removeHabit = id => {
    dispatch({type: 'REMOVE_HABIT', payload: id});
  };

  useEffect(() => {
    async function getStoredData() {
      try {
        const storedData = await AsyncStorage.getItem('habits');
        console.log({storedData: JSON.parse(storedData)});

        if (storedData !== null) {
          dispatch({type: 'SET_HABITS', payload: JSON.parse(storedData)});
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    getStoredData();
  }, []);

  useEffect(() => {
    console.log({habits});
    async function saveData() {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error(error);
      }
    }

    saveData();
  }, [habits]);

  if (loading) {
    return null;
  }
  return (
    <HabitContext.Provider value={{habits, addHabit, updateHabit, removeHabit}}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = React.useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
