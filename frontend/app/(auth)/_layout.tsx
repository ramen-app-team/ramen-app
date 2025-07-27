// ramen-app/frontend/app/(auth)/_layout.tsx

import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from './authContext'; // AuthProviderとuseAuthをインポート
import React from 'react';

// AuthLayoutの外側でAuthProviderを提供
export default function AuthRootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth(); // AuthContextから認証状態を取得

  if (loading) {
    // ローディング中は何も表示しない、またはローディング画面を表示
    return null; 
  }

  // ログイン済みであれば、/(tabs) にリダイレクト
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // ログイン済みでなければ、認証スタックを表示
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}