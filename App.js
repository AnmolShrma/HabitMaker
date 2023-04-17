// App.js

import notifee from '@notifee/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {HabitProvider} from './app/context/HabitProvider';
import HabitFormScreen from './app/screens/HabitFormScreen';
import HabitScreen from './app/screens/HabitScreen';
import HomeScreen from './app/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  // Bootstrap sequence function
  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
    }
  }

  useEffect(() => {
    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error);
  }, []);

  if (loading) {
    return null;
  }
  return (
    <HabitProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Habit Tracker'}}
          />
          <Stack.Screen
            name="HabitForm"
            component={HabitFormScreen}
            options={{title: 'Add New Habit'}}
          />
          <Stack.Screen
            name="HabitScreen"
            component={HabitScreen}
            options={({route}) => ({title: route.params.habit.name})}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </HabitProvider>
  );
};

export default App;
