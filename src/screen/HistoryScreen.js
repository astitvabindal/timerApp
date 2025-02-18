import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    console.log("RVBRVBR")

    const storedHistory = await AsyncStorage.getItem('history');
    console.log("RVBRVBR",storedHistory)
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Timers</Text>
      {history.length === 0 ? (
        <Text style={styles.noHistory}>No completed timers yet</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>Name:-{item.name}</Text>
              <Text>Time:-{item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  noHistory: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  historyItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});

export default HistoryScreen;
