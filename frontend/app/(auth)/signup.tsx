// frontend/app/(auth)/signup.tsx

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
import { registerUser } from '../../api'; 

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    // registerUser関数を呼び出す
    const result = await registerUser(username, email, password); 

    if (result.success) {
      console.log('Signup successful:', result.user);
      Alert.alert('登録完了', 'ユーザー登録が完了しました。ログインしてください。', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } else {
      console.error('Signup failed:', result.error);
      let errorMessage = 'ユーザー登録に失敗しました。';
      if (result.error) {
        // バックエンドからのエラーメッセージを解析して表示
        if (result.error.username) {
          errorMessage += `\nユーザー名: ${result.error.username.join(', ')}`;
        }
        if (result.error.email) {
            errorMessage += `\nメールアドレス: ${result.error.email.join(', ')}`;
        }
        if (result.error.password) {
          errorMessage += `\nパスワード: ${result.error.password.join(', ')}`;
        }
      }
      Alert.alert('エラー', errorMessage);
    }
    setLoading(false);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>らぷり</Text>
        <Text style={styles.sectionTitle}>新規登録</Text>

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
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder=""
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
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
            style={styles.signupButton} 
            onPress={handleSignup} 
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>{loading ? '登録中...' : '登録'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>戻る</Text>
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
  signupButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});