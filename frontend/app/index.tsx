import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // 3秒後にログイン画面に遷移
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* ラーメンの画像 */}
      <View style={styles.ramenContainer}>
        <Image
            source={require('@/assets/images/ramen.png')}
            style={{ width: 200, height: 205 }}
            resizeMode="contain"
        />
      </View>
      
      {/* ローディングテキスト */}
      <Text style={styles.loadingText}>ローディング中</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ramenContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    borderWidth: 3,
    borderColor: '#DAA520',
  },
  ramenEmoji: {
    fontSize: 60,
  },
  loadingText: {
    color: '#FF4500',
    fontSize: 20,
    fontWeight: 'bold',
  },
});