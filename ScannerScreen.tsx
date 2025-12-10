import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Location from 'expo-location'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// ✅ API KEY YANG SUKSES
const API_KEY = "AIzaSyBt-MzyQ_MVpORQkjeDttHyNmHBAGzy0JU"; 

export default function ScannerScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [locationName, setLocationName] = useState("Mencari GPS...");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocationName(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
      }
    })();
  }, []);

  const analyzeWithGemini = async (imageUri: string) => {
    setLoading(true);
    setResult(null);

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

      // 🔥 PROMPT KHUSUS INDONESIA 🇮🇩 🔥
      // Saya tambahkan instruksi keras agar AI tidak pakai Bahasa Inggris/USD
      const prompt = `
        Peran: Ahli Daur Ulang & Lingkungan di INDONESIA.
        Tugas: Analisis gambar sampah/barang ini.
        
        ATURAN WAJIB:
        1. Gunakan BAHASA INDONESIA yang baku.
        2. Mata uang WAJIB RUPIAH (Rp). Jangan gunakan Dollar/USD.
        3. Jika barang bekas (seperti kaleng/kardus), berikan harga jual rongsok di Indonesia.
        4. Output HANYA JSON valid (tanpa markdown).

        Format JSON:
        {
          "nama": "Nama benda (Contoh: Kaleng Pembersih Karburator)",
          "kategori": "Kategori (Logam/Plastik/Kertas/B3)",
          "harga": "Estimasi harga (Contoh: Rp 500 - Rp 1.000 per pcs)",
          "saran": "Saran pengelolaan (Contoh: Jangan dibakar, buang ke B3)",
          "karbon": "Jejak karbon (Rendah/Tinggi)"
        }
      `;

      console.log("Menghubungi Gemini (Mode Indonesia)...");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/jpeg", data: base64 } }
              ]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let rawText = data.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(rawText);
      
      finalizeResult(parsedData, "✨ AI Online (Indonesia)");

    } catch (error) {
      console.log("Error, masuk manual.");
      manualModeTrigger();
    } finally {
      setLoading(false);
    }
  };

  const manualModeTrigger = () => {
    Alert.alert(
      "Verifikasi Manual", 
      "Sinyal lemah. Bantu konfirmasi jenis sampah:",
      [
        { text: "Botol Plastik", onPress: () => useMock("Botol Plastik", "Plastik", "Rp 3.000/kg") },
        { text: "Kardus", onPress: () => useMock("Kardus Bekas", "Kertas", "Rp 2.000/kg") },
        { text: "Kaleng", onPress: () => useMock("Kaleng Logam", "Logam", "Rp 13.000/kg") },
        { text: "Lainnya", onPress: () => useMock("Sampah Residu", "Lainnya", "-") }
      ]
    );
  };

  const useMock = (nama: string, kat: string, hrg: string) => {
    finalizeResult({
      nama: nama,
      kategori: kat,
      harga: hrg,
      saran: "Pastikan sampah terpilah dengan benar.",
      karbon: "Estimasi Manual"
    }, "✅ Verifikasi User");
  };

  const finalizeResult = async (dataAI: any, sourceLabel: string) => {
    const finalData = {
      ...dataAI,
      lokasi: locationName,
      tanggal: new Date().toLocaleDateString(),
      sumber: sourceLabel,
      id: Date.now()
    };
    setResult(finalData);
    
    try {
      const history = await AsyncStorage.getItem('recycle_history');
      const newHistory = history ? JSON.parse(history) : [];
      newHistory.unshift(finalData);
      await AsyncStorage.setItem('recycle_history', JSON.stringify(newHistory));
    } catch (e) {}
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.3 });
    if (!result.canceled) { setImage(result.assets[0].uri); setResult(null); }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Izin Ditolak"); return; }
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.3 });
    if (!result.canceled) { setImage(result.assets[0].uri); setResult(null); }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{fontSize: 50}}>📸</Text>
            <Text style={{color: '#888', marginTop: 10}}>Foto Sampah</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#2196F3'}]} onPress={pickImage}>
            <Text style={styles.buttonText}>📂 Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#FF9800'}]} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 Kamera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: loading ? '#ccc' : '#2e7d32' }]} 
          onPress={() => image ? analyzeWithGemini(image) : Alert.alert("Foto Dulu!")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.mainButtonText}>✨ Identifikasi</Text>
          )}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>🔍 Hasil Identifikasi</Text>
            <View style={{backgroundColor:'#e8f5e9', padding:4, borderRadius:4, alignSelf:'center', marginBottom:10}}>
                <Text style={{fontSize:10, color:'#2e7d32', fontWeight:'bold'}}>{result.sumber}</Text>
            </View>
            <View style={styles.geoBox}>
              <Text style={styles.geoText}>📍 {result.lokasi}</Text>
              <Text style={styles.geoText}>📅 {result.tanggal}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.label}>Nama:</Text><Text style={styles.value}>{result.nama}</Text></View>
            <View style={styles.infoRow}><Text style={styles.label}>Kategori:</Text><View style={styles.tagBadge}><Text style={styles.tagText}>{result.kategori}</Text></View></View>
            <View style={styles.infoRow}><Text style={styles.label}>Harga:</Text><Text style={styles.priceValue}>{result.harga}</Text></View>
            <View style={styles.infoRow}><Text style={styles.label}>Emisi:</Text><Text style={{fontWeight:'bold', color: '#795548'}}>{result.karbon}</Text></View>
            <View style={styles.adviceBox}><Text style={styles.adviceTitle}>💡 Panduan:</Text><Text style={styles.adviceText}>{result.saran}</Text></View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  imageContainer: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  placeholder: { width: '90%', height: 250, backgroundColor: '#e9ecef', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#bbb' },
  imagePreview: { width: '90%', height: 250, borderRadius: 15, borderWidth: 2, borderColor: '#2e7d32' },
  contentContainer: { padding: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: { flex: 0.48, paddingVertical: 12, borderRadius: 10, alignItems: 'center', elevation: 2 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mainButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#2e7d32' },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  resultCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 50 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32', marginBottom: 15, textAlign: 'center' },
  geoBox: { backgroundColor: '#e3f2fd', padding: 8, borderRadius: 8, marginBottom: 10 },
  geoText: { fontSize: 12, color: '#1565c0', textAlign: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  label: { fontSize: 15, color: '#666', fontWeight:'500' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
  tagBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 12 },
  priceValue: { fontSize: 16, fontWeight: 'bold', color: '#d32f2f' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  adviceBox: { marginTop: 15, backgroundColor: '#fff8e1', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ffe082' },
  adviceTitle: { fontWeight: 'bold', color: '#f57f17', marginBottom: 4 },
  adviceText: { color: '#f57f17', lineHeight: 20, fontSize: 14 }
});