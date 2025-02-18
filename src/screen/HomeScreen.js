import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SectionList, Alert, StyleSheet, Modal, ScrollView,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

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
    const activeTimers = timers.filter(timer => timer.status !== 'Completed');
    await AsyncStorage.setItem('timers', JSON.stringify(activeTimers));
  };

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      const parsedTimers = JSON.parse(storedTimers);
      setTimers(parsedTimers.filter(timer => timer.status !== 'Completed'));
    }
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

  // Start a timer
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

    setTimers(prevTimers => {
      const activeTimers = prevTimers.filter(timer => timer.id !== id);
      saveTimers(activeTimers);
      return activeTimers;
    });
  };

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <Text style={styles.header}>Timer App</Text>
        <TextInput
          placeholder="Timer Name"
          value={newTimerName}
          onChangeText={setNewTimerName}
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (s)"
          keyboardType="numeric"
          value={newTimerDuration}
          onChangeText={setNewTimerDuration}
          style={styles.input}
        />
        <TextInput
          placeholder="Category"
          value={newTimerCategory}
          onChangeText={setNewTimerCategory}
          style={styles.input}
        />
        <TouchableOpacity style={styles.AddTimer} onPress={addTimer}>
          <LinearGradient
            colors={['#1E3C72', '#2A5298', '#1A3C74']}
            style={styles.linearGradient1}>
            <Text style={{...styles.buttonText1, color: '#FFFFFF'}}>
              Add Timer
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <SectionList
          sections={Object.values(
            timers.reduce((acc, timer) => {
              if (!acc[timer.category])
                acc[timer.category] = {title: timer.category, data: []};
              acc[timer.category].data.push(timer);
              return acc;
            }, {}),
          )}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.timerItem}>
              <Text style={{fontSize: 19}}>
                <Text style={{fontWeight: 'bold'}}> Name:-</Text>
                {item.name}({item.status})
              </Text>
              <Text
                style={{
                  borderWidth: 0.5,
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                  textAlign: 'center',
                  fontSize: 16,
                  marginTop: 5,
                  marginBottom: 5,
                  alignContent: 'center',
                  margin: 'auto',
                  lineHeight: 100,
                }}>
                {' '}
                {item.remaining}s
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={styles.startCss}
                  onPress={() => startTimer(item.id)}>
                  <LinearGradient
                    colors={['#4B0082', '#8A2BE2', '#6A0DAD']}
                    style={styles.linearGradient1}>
                    <Text style={{...styles.buttonText1, color: '#FFFFFF'}}>
                      Start
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startCss}
                  onPress={() => pauseTimer(item.id)}>
                  <LinearGradient
                    colors={['#00B4D8', '#007A8C', '#003B46']}
                    style={styles.linearGradient1}>
                    <Text style={{...styles.buttonText1, color: '#FFFFFF'}}>
                      Pause
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startCss}
                  onPress={() => resetTimer(item.id)}>
                  <LinearGradient
                    colors={['#B89F91', '#A35D55', '#6E4B3B']}
                    style={styles.linearGradient1}>
                    <Text style={{...styles.buttonText1, color: '#FFFFFF'}}>
                      Reset
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.categoryHeader}>{title}</Text>
          )}
        />
        <Modal visible={showModal} transparent={true}>
          <View style={styles.modalContainer}>
            <FastImage
              source={require('../assets/congs.gif')}
              style={{width: 300, height: 300}}
            />
            <Text style={{color: 'white',margin:20,fontSize:18}}>
              Congratulations! {completedTimer} Completed
            </Text>
            <TouchableOpacity
                  style={{...styles.startCss,backgroundColor:"red",borderRadius:15}}
                  onPress={() => setShowModal(false)}>
                    <Text style={{...styles.buttonText1, color: '#FFFFFF'}}>
                      Close
                    </Text>
                </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#FFF3E0'},
  header: {fontSize: 24, fontWeight: 'bold', textAlign: 'center'},
  input: {
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  timerItem: {padding: 10},
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    padding: 5,
    marginTop: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  startCss: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: '30%',
  },
  linearGradient1: {
    height: '100%',
    borderRadius: 15,
    flex: 1,
  },
  buttonText1: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  AddTimer: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default TimerApp;
