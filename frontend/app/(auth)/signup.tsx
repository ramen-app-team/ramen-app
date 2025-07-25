import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // サインアップ処理（実装は省略）
    router.replace('/(tabs)');
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* アプリタイトル */}
        <Text style={styles.title}>らぷり</Text>
        
        {/* 新規登録セクション */}
        <Text style={styles.sectionTitle}>新規登録</Text>
        
        {/* ユーザーネーム入力 */}
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
        
        {/* パスワード入力 */}
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
        
        {/* ボタン */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>登録</Text>
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