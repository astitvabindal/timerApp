import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    console.log('RVBRVBR');

    const storedHistory = await AsyncStorage.getItem('history');
    console.log('RVBRVBR', storedHistory);
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Completed Timers</Text>
        {history.length === 0 ? (
          <>
            <Image
              source={require('../assets/timer.png')}
              style={{
                marginTop: 50,
                width: 250,
                height: 250,
                // margin:"auto",
                alignSelf: 'center',
              }}
            />
            <Text style={styles.noHistory}>No completed Timers</Text>
          </>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.historyItem}>
                <Text style={{fontSize: 18}}>
                  <Text style={{fontWeight: 'bold'}}>Name:-</Text>
                  {item.name}
                </Text>
                <Text style={{fontSize: 18}}>
                  <Text style={{fontWeight: 'bold'}}>Time:-</Text>
                  {item.time}
                </Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#FFF3E0'},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  noHistory: {textAlign: 'center', marginTop: 30, fontSize: 25},
  historyItem: {
    padding: 10,
    backgroundColor: '#D9E2F3',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default HistoryScreen;
