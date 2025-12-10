import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Button, 
  TextInput 
} from 'react-native';

// Pastikan file ini ada di folder assets
import recycleData from './assets/recycle_data.json';

export default function EncyclopediaScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState('');

  const handlePress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Logika Filter Pencarian
  const filteredData = recycleData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.7}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.iconText}>♻️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>Kategori: {item.category}</Text>
        <Text style={[styles.difficulty, { color: item.difficulty === 'Mudah' ? '#2e7d32' : '#f57f17' }]}>
          Tingkat: {item.difficulty}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Ensiklopedia Daur Ulang</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari sampah... (misal: Botol)"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      {/* Daftar Sampah */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sampah tidak ditemukan :(</Text>
        }
      />

      {/* Modal Detail */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={{fontSize: 20, color: '#999'}}>✕</Text>
            </TouchableOpacity>

            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                 <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                 <Text style={styles.modalDesc}>{selectedItem.description}</Text>
                 
                 <View style={styles.divider} />
                 
                 <Text style={styles.stepHeader}>Langkah-langkah:</Text>
                 {selectedItem.steps.map((step: string, index: number) => (
                   <View key={index} style={styles.stepRow}>
                     <Text style={styles.stepNumber}>{index + 1}.</Text>
                     <Text style={styles.stepText}>{step}</Text>
                   </View>
                 ))}

                 <View style={{height: 20}} /> 
                 <Button title="Tutup Panduan" onPress={() => setModalVisible(false)} color="#2e7d32" />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#2e7d32' },
  searchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  searchInput: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999', fontStyle: 'italic' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 }, 
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 3 },
  imagePlaceholder: { width: 60, height: 60, backgroundColor: '#e8f5e9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 24 },
  textContainer: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 14, color: '#666', marginTop: 2 },
  difficulty: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  
  // Style Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, height: '70%', elevation: 5 },
  closeIcon: { alignSelf: 'flex-end', padding: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2e7d32', marginBottom: 8 },
  modalDesc: { textAlign: 'center', color: '#555', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  stepHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  stepRow: { flexDirection: 'row', marginBottom: 8 },
  stepNumber: { fontWeight: 'bold', marginRight: 8, color: '#2e7d32' },
  stepText: { flex: 1, lineHeight: 20, color: '#444' }
});