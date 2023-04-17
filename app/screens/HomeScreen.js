// screens/HomeScreen.js

import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  EventType,
  TriggerType,
} from '@notifee/react-native';
import React, {useEffect} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HabitCard from '../components/HabitCard';
import {useHabit} from '../context/HabitProvider';

const HomeScreen = ({navigation}) => {
  const {habits} = useHabit();

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  const handleAddHabit = () => {
    navigation.navigate('HabitForm');
  };

  const handleHabitPressed = habit => {
    navigation.navigate('HabitScreen', {habit});
  };

  const onDisplayNotification = async () => {
    // Request permissions (required for iOS)
    let channelId = '';
    if (Platform.OS === 'ios') {
      await notifee.requestPermission();
    } else {
      // Create a channel (required for Android)
      channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }

    // Display a notification
    await notifee.displayNotification({
      title:
        '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
      subtitle: '&#129395;',
      body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibrate: true,
        color: '#4caf50',
        actions: [
          {
            title: '<b>Dance</b> &#128111;',
            pressAction: {id: 'dance'},
          },
          {
            title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
            pressAction: {id: 'cry'},
          },
        ],
      },
    });
  };

  const onCreateTriggerNotification = async () => {
    const settings = await notifee.getNotificationSettings();
    console.log({settings});
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
      //Create timestamp trigger
      const currentDate = new Date();
      // currentDate.setHours(currentDate.getHours() + 5);
      // currentDate.setMinutes(currentDate.getMinutes() + 30);
      currentDate.setSeconds(currentDate.getSeconds() + 10);

      console.log(currentDate);
      // Create a time-based trigger
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: currentDate.getTime(),
        alarmManager: true,
      };
      await notifee.deleteChannel('your-channel-id');

      await notifee.createChannel({
        id: 'your-channel-id',
        name: 'your-channel-id',
      });

      // Create a trigger notification
      await notifee.createTriggerNotification(
        {
          title: 'Meeting with Jane',
          body: 'Today at 11:20am',
          android: {
            channelId: 'your-channel-id',
          },
        },
        trigger,
      );
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={({item}) => (
          <HabitCard habit={item} onPress={() => handleHabitPressed(item)} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            You haven't added any habits yet.
          </Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={onDisplayNotification}>
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
  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 24,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomeScreen;
