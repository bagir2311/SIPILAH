import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
// @ts-ignore
import { auth } from './firebaseConfig';
import { ActivityIndicator, View } from 'react-native';

// Import Halaman
import EncyclopediaScreen from './EncyclopediaScreen';
import HistoryScreen from './HistoryScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

// Inisialisasi Navigasi
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Kumpulan Tab Utama (Home & History)
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Scan Sampah') iconName = focused ? 'camera' : 'camera-outline';
          else if (route.name === 'Riwayat') iconName = focused ? 'time' : 'time-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Scan Sampah" component={EncyclopediaScreen} />
      <Tab.Screen name="Riwayat" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

// 2. Kumpulan Login & Register
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// 3. Komponen Utama (Pengatur Lalu Lintas)
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sedang login atau tidak
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // Kalau User ADA -> Masuk Aplikasi
        <MainApp />
      ) : (
        // Kalau User KOSONG -> Masuk Login
        <AuthStack />
      )}
    </NavigationContainer>
  );
}