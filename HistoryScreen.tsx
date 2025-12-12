import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

// IMPORT FIREBASE
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Pastikan file ini ada

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- FUNGSI AMBIL DATA DARI FIREBASE ---
  const loadHistory = async () => {
    try {
     
      const q = query(collection(db, "history"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const dataList = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      
      setHistory(dataList);
    } catch (e) {
      console.log("Gagal memuat dari Firebase:", e);
      // Jangan alert error internet terus menerus agar tidak mengganggu
    } finally {
      setLoading(false);
    }
  };

  // Otomatis refresh saat tab dibuka
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  // Fungsi Tarik ke Bawah (Refresh)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadHistory().then(() => setRefreshing(false));
  }, []);

  // --- FUNGSI HAPUS DARI FIREBASE ---
  const deleteItem = async (id: string) => {
    Alert.alert("Hapus Data", "Yakin ingin menghapus data ini dari Cloud?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, "history", id)); // Hapus di Cloud
            loadHistory(); // Refresh tampilan
          } catch (e) {
            Alert.alert("Gagal", "Cek koneksi internet.");
          }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Header Kartu */}
      <View style={styles.headerRow}>
        <View style={[styles.badge, 
          { backgroundColor: item.kategori?.toLowerCase().includes('plastik') ? '#e3f2fd' : '#ffebee' }
        ]}>
          <Text style={[styles.badgeText,
            { color: item.kategori?.toLowerCase().includes('plastik') ? '#1565c0' : '#d84315' }
          ]}>{item.kategori || "Umum"}</Text>
        </View>
        <Text style={styles.dateText}>{item.tanggal}</Text>
      </View>
      
      {/* Isi Utama */}
      <Text style={styles.title}>{item.nama}</Text>
      <Text style={styles.price}>{item.harga}</Text>
      
      {/* Footer (Lokasi & Tombol Hapus) */}
      <View style={styles.footerRow}>
        <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}> {item.lokasi}</Text>
        </View>
        
        <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
           <Ionicons name="trash-outline" size={18} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔥 Riwayat (Cloud)</Text>
        <Text style={styles.subTitle}>Data tersimpan aman di Firebase</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#d84315" style={{marginTop: 50}} />
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Belum ada data.</Text>
          <Text style={{color:'#999', marginTop:5}}>Scan sampah dulu yuk!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#d84315' },
  subTitle: { fontSize: 12, color: '#888' },
  listContent: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems:'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  dateText: { color: '#aaa', fontSize: 11 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', borderTopWidth:1, borderTopColor:'#f5f5f5', paddingTop:10 },
  locationText: { fontSize: 12, color: '#666', marginLeft: 4 },
  deleteBtn: { padding: 5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, color: '#555', marginTop: 15, fontWeight: 'bold' }
});