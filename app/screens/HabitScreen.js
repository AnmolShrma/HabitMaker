// screens/HabitScreen.js

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';
import {useHabit} from '../context/HabitProvider';
import {Calendar} from 'react-native-calendars';

const HabitScreen = ({navigation, route}) => {
  const {updateHabit} = useHabit();

  const [habit, setHabit] = useState(route.params.habit);
  const handleIncrement = () => {
    const currentDate = new Date();
    const previousDate = new Date(habit.lastCompletionDate);

    if (
      currentDate.getFullYear() === previousDate.getFullYear() &&
      currentDate.getMonth() === previousDate.getMonth() &&
      currentDate.getDate() === previousDate.getDate()
    ) {
      setHabit(prevHabit => ({
        ...prevHabit,
        currentStreak: prevHabit.currentStreak + 1,
        longestStreak: Math.max(
          prevHabit.longestStreak,
          prevHabit.currentStreak + 1,
        ),
        lastCompletionDate: currentDate,
      }));
      updateHabit({
        ...habit,
        currentStreak: habit.currentStreak + 1,
        longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
        lastCompletionDate: currentDate,
      });
    } else {
      setHabit(prevHabit => ({
        ...prevHabit,
        currentStreak: 1,
        longestStreak: Math.max(prevHabit.longestStreak, 1),
        lastCompletionDate: currentDate,
      }));
      updateHabit({
        ...habit,
        currentStreak: 1,
        longestStreak: Math.max(habit.longestStreak, 1),
        lastCompletionDate: currentDate,
      });
    }
  };

  const handleReset = () => {
    setHabit(prevHabit => ({
      ...prevHabit,
      currentStreak: 0,
    }));
    updateHabit({
      ...habit,
      currentStreak: 0,
    });
  };

  const formattedLastCompletionDate = format(
    new Date(habit.lastCompletionDate),
    'MMM d, yyyy',
  );

  const generateMarkedDates = habit => {
    const markedDates = {};
    let startingDate = new Date(habit?.startDate);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const currentDate = new Date();

    const diffDays = Math.round(
      Math.abs((startingDate - currentDate) / oneDay),
    );
    console.log({startingDate, currentDate, diffDays});
    for (let i = 0; i < diffDays + 1; i++) {
      const updatedDate = new Date(
        startingDate.setDate(startingDate.getDate() + i),
      );
      startingDate = new Date(habit?.startDate);
      const formatedDate = new Date(updatedDate).toISOString().split('T')[0];
      console.log({formatedDate});
      if (i === 0) {
        markedDates[formatedDate] = {
          startingDay: true,
          color: '#50cebb',
          textColor: 'white',
        };
      } else if (i === diffDays) {
        markedDates[formatedDate] = {
          endingDay: true,
          color: '#50cebb',
          textColor: 'white',
        };
      } else {
        markedDates[formatedDate] = {
          color: '#50cebb',
          textColor: 'white',
        };
      }
    }

    return markedDates;
  };

  const markedDates = generateMarkedDates(habit);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.subtitle}>
          {habit.currentStreak === 0
            ? 'Start your streak!'
            : `Streak: ${habit.currentStreak}`}
        </Text>
        <Text style={styles.subtitle}>
          Longest Streak: {habit.longestStreak}
        </Text>
        <Text style={styles.subtitle}>
          Last Completed: {formattedLastCompletionDate}
        </Text>
      </View>

      <Calendar
        markedDates={markedDates}
        markingType="period"
        theme={{
          selectedDayBackgroundColor: '#0F0',
          todayTextColor: '#0F0',
        }}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionIncrementButton]}
          onPress={handleIncrement}>
          <Text style={styles.actionButtonText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionResetButton]}
          onPress={handleReset}>
          <Text style={styles.actionButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  actionIncrementButton: {
    backgroundColor: '#0F0',
  },
  actionResetButton: {
    backgroundColor: '#F00',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  calendar: {
    marginBottom: 20,
  },
  calendarDay: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarDayMarked: {
    backgroundColor: '#0F0',
  },
  calendarDayMarkedText: {
    color: '#fff',
  },
  calendarDayDisabled: {
    opacity: 0.5,
  },
  calendarDayDisabledText: {
    color: '#888',
  },
  calendarDayToday: {
    backgroundColor: '#FFA500',
  },
  calendarDayTodayText: {
    color: '#fff',
  },
});

export default HabitScreen;
