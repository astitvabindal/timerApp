import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTimers = async (timers) => {
  await AsyncStorage.setItem('timers', JSON.stringify(timers));
};

export const loadTimers = async (setTimers) => {
  const savedTimers = await AsyncStorage.getItem('timers');
  if (savedTimers) setTimers(JSON.parse(savedTimers));
};