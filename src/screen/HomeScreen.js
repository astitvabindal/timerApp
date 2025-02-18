// React Native Timer App with Full Feature Set
// Updated to match all requirements

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, SectionList, Alert, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerApp = () => {
  const [timers, setTimers] = useState([]);
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerDuration, setNewTimerDuration] = useState('');
  const [newTimerCategory, setNewTimerCategory] = useState('');
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [completedTimer, setCompletedTimer] = useState(null);

  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === 'Running' && timer.remaining > 0) {
            const updatedRemaining = timer.remaining - 1;
            if (updatedRemaining === 0) {
              completeTimer(timer.id, timer.name);
              return { ...timer, remaining: 0, status: 'Completed' };
            }
            return { ...timer, remaining: updatedRemaining };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saveTimers = async (timers) => {
    await AsyncStorage.setItem('timers', JSON.stringify(timers));
  };

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) setTimers(JSON.parse(storedTimers));
  };

  const saveHistory = async (history) => {
    await AsyncStorage.setItem('history', JSON.stringify(history));
  };

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem('history');
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  };

  const addTimer = () => {
    if (!newTimerName || !newTimerDuration || !newTimerCategory) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    const newTimer = {
      id: Date.now().toString(),
      name: newTimerName,
      duration: parseInt(newTimerDuration),
      remaining: parseInt(newTimerDuration),
      category: newTimerCategory,
      status: 'Paused',
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    setNewTimerName('');
    setNewTimerDuration('');
    setNewTimerCategory('');
  };

  const startTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id && timer.remaining > 0
          ? { ...timer, status: 'Running' }
          : timer
      )
    );
  };

  const pauseTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, status: 'Paused' } : timer
      )
    );
  };

  const resetTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, remaining: timer.duration, status: 'Paused' } : timer
      )
    );
  };

  const completeTimer = (id, name) => {
    setCompletedTimer(name);
    setShowModal(true);
    const newHistoryItem = { name, time: new Date().toLocaleString() };
    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timer App</Text>
      <TextInput placeholder="Timer Name" value={newTimerName} onChangeText={setNewTimerName} style={styles.input} />
      <TextInput placeholder="Duration (s)" keyboardType="numeric" value={newTimerDuration} onChangeText={setNewTimerDuration} style={styles.input} />
      <TextInput placeholder="Category" value={newTimerCategory} onChangeText={setNewTimerCategory} style={styles.input} />
      <Button title="Add Timer" onPress={addTimer} />
      <SectionList
        sections={Object.values(
          timers.reduce((acc, timer) => {
            if (!acc[timer.category]) acc[timer.category] = { title: timer.category, data: [] };
            acc[timer.category].data.push(timer);
            return acc;
          }, {})
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timerItem}>
            <Text>{item.name} - {item.remaining}s [{item.status}]</Text>
            <Button title="Start" onPress={() => startTimer(item.id)} />
            <Button title="Pause" onPress={() => pauseTimer(item.id)} />
            <Button title="Reset" onPress={() => resetTimer(item.id)} />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.categoryHeader}>{title}</Text>
        )}
      />
      <Modal visible={showModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Text>Congratulations! {completedTimer} Completed</Text>
          <Button title="Close" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, marginVertical: 5, padding: 8 },
  timerItem: { padding: 10, borderBottomWidth: 1 },
  categoryHeader: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#ddd', padding: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
});

export default TimerApp;
