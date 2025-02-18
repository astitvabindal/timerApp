import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const TimerItem = ({ timer, updateTimer }) => {
  return (
    <View style={styles.timerItem}>
        {timer && <>
            <Text>{timer?.name}</Text>
      <ProgressBar progress={timer.remaining / timer.duration} color='blue' />
      <View style={styles.buttons}>
        <Button title='Start' onPress={() => updateTimer(timer.id, { status: 'Running' })} />
        <Button title='Pause' onPress={() => updateTimer(timer.id, { status: 'Paused' })} />
        <Button title='Reset' onPress={() => updateTimer(timer.id, { remaining: timer?.duration, status: 'Stopped' })} />
      </View>
        </>}
    </View>
  );
};

const styles = StyleSheet.create({
  timerItem: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }
});

export default TimerItem;