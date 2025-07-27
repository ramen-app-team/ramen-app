// frontend/app/(auth)/login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
// api.ts から関数をインポート
import { loginUser } from '../../api'; 
// AuthContextからlogin関数とuseAuthフックをインポート
import { useAuth } from './authContext'; 

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // AuthContextからlogin関数を取得
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // loginUser関数を呼び出す
    const result = await loginUser(username, password);

    if (result.success && result.tokens) {
      console.log('Login successful:', result.tokens);
      // AuthContextのlogin関数を呼び出し、トークンを保存
      await login(result.tokens.access, result.tokens.refresh); 
      // 画面遷移は_layout.tsxのRedirectが処理するため、ここからは削除
      // Alert.alert('ログイン成功', 'メイン画面へ移動します。'); // アラートは残しても良いが、自動遷移の方がスムーズ
    } else {
      console.error('Login failed:', result.error);
      let errorMessage = 'ログインに失敗しました。';
      if (result.error && typeof result.error === 'string') {
        errorMessage = result.error; 
      } else if (result.error && typeof result.error === 'object' && result.error.detail) {
        errorMessage = result.error.detail;
      }
      Alert.alert('エラー', errorMessage);
    }
    setLoading(false);
  };

  const goToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>らぷり</Text>
        <Text style={styles.sectionTitle}>ログイン</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ユーザーネーム</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder=""
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder=""
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>{loading ? 'ログイン中...' : 'ログイン'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.signupButton} onPress={goToSignup}>
            <Text style={styles.signupButtonText}>新規登録</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  title: {
    color: '#FF4500',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    color: '#FF4500',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
  },
  signupButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});