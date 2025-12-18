import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

// @ts-ignore (Biar gak merah karena beda file JS/TS)
import { auth } from './firebaseConfig';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Cek dulu isiannya
    if (!email || !password) {
      Alert.alert("Kosong!", "Tolong isi email dan password dulu ya.");
      return;
    }

    console.log("Mencoba mendaftar dengan:", email); // Cek di Terminal
    setLoading(true);

    try {
      // 2. Proses ke Firebase
      // Tambahkan tulisan 'as any' di sebelah auth
const userCredential = await createUserWithEmailAndPassword(auth as any, email, password);
      
      // 3. Kalau Berhasil
      console.log("Sukses User ID:", userCredential.user.uid);
      Alert.alert("Berhasil!", "Akun sudah jadi. Silakan Login.");
      navigation.goBack();

    } catch (error: any) {
      // 4. Kalau Gagal (PENTING: Baca errornya di sini)
      console.log("Error Firebase:", error.code, error.message);
      
      let pesanError = "Terjadi kesalahan.";
      if (error.code === 'auth/email-already-in-use') {
        pesanError = "Email ini sudah terdaftar!";
      } else if (error.code === 'auth/weak-password') {
        pesanError = "Password terlalu lemah (min. 6 karakter).";
      } else if (error.code === 'auth/invalid-email') {
        pesanError = "Format email salah (contoh: a@b.com).";
      } else {
        pesanError = error.message;
      }
      
      Alert.alert("Gagal Daftar", pesanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Daftar Akun Baru</Text>
        
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight:10}} />
          <TextInput 
            style={{flex:1}} 
            placeholder="Email (contoh@gmail.com)" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight:10}} />
          <TextInput 
            style={{flex:1}} 
            placeholder="Password (min. 6 huruf)" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={{color:'white', fontWeight:'bold'}}>DAFTAR SEKARANG</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop:20}}>
          <Text style={{color:'#2e7d32'}}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f8e9', borderRadius: 10, padding: 15, marginBottom: 15, width: '100%' },
  btn: { backgroundColor: '#1b5e20', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
});