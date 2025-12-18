import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore
import { auth } from './firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Eits!", "Email dan Password tidak boleh kosong.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.tsx akan otomatis mendeteksi login
    } catch (error: any) {
      Alert.alert("Gagal Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>♻️</Text>
        <Text style={styles.title}>SIPILAH</Text>
        <Text style={styles.subtitle}>Masuk untuk mulai memilah</Text>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight:10}} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight:10}} />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
             <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>MASUK</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{marginTop:20}}>
          <Text style={{color:'#2e7d32', fontWeight:'bold'}}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5 },
  emoji: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32' },
  subtitle: { color: '#666', marginBottom: 30 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f8e9', borderRadius: 10, padding: 15, marginBottom: 15, width: '100%' },
  input: { flex: 1 },
  btn: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});