import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

// MapViewコンポーネントのタイプ定義
interface MapViewProps {
  style: any;
  provider?: any;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  children?: React.ReactNode;
}

export default function App() {
  const [MapView, setMapView] = useState<any>(null);
  const [PROVIDER_GOOGLE, setPROVIDER_GOOGLE] = useState<any>(null);

  // 例として東京タワーを中央に表示
  const origin = {latitude: 35.6585805, longitude: 139.742858};

  useEffect(() => {
    // Web環境ではreact-native-mapsをインポートしない
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((maps) => {
        setMapView(maps.default);
        setPROVIDER_GOOGLE(maps.PROVIDER_GOOGLE);
      });
    }
  }, []);

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapText}>
            地図機能はモバイルアプリでご利用ください
          </Text>
          <Text style={styles.webMapSubText}>
            位置: 東京タワー周辺
          </Text>
          <Text style={styles.webMapSubText}>
            緯度: {origin.latitude}, 経度: {origin.longitude}
          </Text>
        </View>
      );
    }

    if (!MapView) {
      return (
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapText}>地図を読み込み中...</Text>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderMap()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 16,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
