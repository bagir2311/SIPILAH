import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// INI YANG BARU: Pake library khusus agar tidak warning
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import ScannerScreen from './ScannerScreen';
import EncyclopediaScreen from './EncyclopediaScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {activeTab === 'scanner' ? <ScannerScreen /> : <EncyclopediaScreen />}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('scanner')}>
            <Text style={{fontSize: 24}}>📷</Text>
            <Text style={[styles.tabText, { color: activeTab === 'scanner' ? '#2e7d32' : '#999' }]}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('guide')}>
            <Text style={{fontSize: 24}}>📖</Text>
            <Text style={[styles.tabText, { color: activeTab === 'guide' ? '#2e7d32' : '#999' }]}>Panduan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  bottomBar: { flexDirection: 'row', height: 70, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  tabButton: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  tabText: { fontSize: 12, marginTop: 4, fontWeight: 'bold' }
});