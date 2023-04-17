// screens/HabitListScreen.js

import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import HabitCard from '../components/HabitCard';
import EmptyState from '../components/EmptyState';

const HabitListScreen = ({navigation}) => {
  const [habits, setHabits] = useState([]);

  const handleAddHabit = newHabit => {
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const handleHabitPress = habit => {
    navigation.navigate('Habit', {habit});
  };

  const handleHabitDelete = habitId => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
  };

  const renderHabitCard = ({item}) => (
    <HabitCard
      habit={item}
      onPress={() => handleHabitPress(item)}
      onDelete={handleHabitDelete}
    />
  );

  return (
    <View style={styles.container}>
      {habits.length > 0 ? (
        <FlatList
          data={habits}
          renderItem={renderHabitCard}
          keyExtractor={habit => habit.id}
        />
      ) : (
        <EmptyState text="You don't have any habits yet. Click the '+' button to add a new habit." />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('HabitForm', {onAddHabit: handleAddHabit})
        }>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#FFA500',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 40,
    color: '#fff',
  },
});

export default HabitListScreen;
