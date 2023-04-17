// components/HabitCard.js

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const HabitCard = ({habit, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.habitStartDate}>
          Started on {new Date(habit.startDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.streakText}>{habit.currentStreak} days</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitStartDate: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});

export default HabitCard;
