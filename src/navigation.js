import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screen/HomeScreen';
import HistoryScreen from './screen/HistoryScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator  screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        if (route.name === 'Home') {
          return <MaterialCommunityIcons name={'home'} size={size} color={color} />;
        }
        else if(route.name === 'History'){
          return <FontAwesome name={'history'} size={size} color={color} />;
        }
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {backgroundColor: '#F0F4F8', paddingBottom: 5},
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
