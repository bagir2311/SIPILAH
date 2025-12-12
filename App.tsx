import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// 👇 PERBAIKAN UTAMA DI SINI 👇
// Kita hapus import ScannerScreen yang bikin error
// Kita pakai EncyclopediaScreen.tsx yang Anda punya
import EncyclopediaScreen from './EncyclopediaScreen'; 
import HistoryScreen from './HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#2e7d32', // Warna Hijau
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 5, height: 60 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Scan Sampah') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Riwayat') {
              iconName = focused ? 'time' : 'time-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Tab 1: Arahkan ke EncyclopediaScreen */}
        <Tab.Screen name="Scan Sampah" component={EncyclopediaScreen} />
        
        {/* Tab 2: Arahkan ke HistoryScreen */}
        <Tab.Screen name="Riwayat" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}