import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Switch, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { TimeSlot, IkitaiFriend } from '@/types';
import { updateMyIkitaiStatus, fetchIkitaiFriends } from '@/api';
import * as Location from 'expo-location';

const TIME_SLOTS: { key: TimeSlot; label: string }[] = [
  { key: 'now', label: '今すぐ' },
  { key: 'lunch', label: '昼' },
  { key: 'night', label: '夜' },
];

// --- メインコンポーネント ---
export default function RamenIkitaiScreen() {
  // --- 状態管理 (State) ---
  const [isIkitai, setIsIkitai] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>('now');
  const [friends, setFriends] = useState<IkitaiFriend[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- データ取得 (Effect) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: ログインユーザー自身の初期状態もAPIで取得する必要がある
      const friendData = await fetchIkitaiFriends();
      setFriends(friendData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // --- 表示ロジック (Memoization) ---
  const municipalities = useMemo(() => {
    // フレンドリストから重複なく市区町村リストを作成
    const uniqueMunicipalities = [...new Set(friends.map(f => f.municipality))];
    return ['すべて', ...uniqueMunicipalities];
  }, [friends]);

  const filteredFriends = useMemo(() => {
    if (!selectedMunicipality || selectedMunicipality === 'すべて') {
      return friends;
    }
    return friends.filter(f => f.municipality === selectedMunicipality);
  }, [friends, selectedMunicipality]);

  // --- イベントハンドラ ---
  const handleStatusChange = async (newStatus: boolean) => {
    if (newStatus) {
      // スイッチをONにする場合
      try {
        // 1. 位置情報の利用許可を確認
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('位置情報の利用が許可されていません。');
          return;
        }

        // 2. 現在位置を取得
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = location.coords;

        // 3. API連携: サーバーに自分の状態と位置情報を送信
        setIsIkitai(true); // UIを先に更新
        await updateMyIkitaiStatus('on', selectedTimeSlot, latitude, longitude);

      } catch (error) {
        console.error("位置情報の取得またはAPI送信に失敗しました", error);
        alert('エラーが発生しました。');
        setIsIkitai(false); // エラー時は状態を戻す
      }
    } else {
      // スイッチをOFFにする場合
      setIsIkitai(false);
      // API連携: 位置情報はnullで送信
      await updateMyIkitaiStatus('off', null, null, null);
    }
  };

  const handleTimeSlotSelect = async (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if (isIkitai) {
      // API連携: ONの状態で時間帯を変更した場合もサーバーに通知
      await updateMyIkitaiStatus('on', timeSlot, null, null);
    }
  };

  // --- レンダリング ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>データを読み込み中...</Text>
        <ActivityIndicator size="large" color="#D2691E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 自分のイキタイ状態設定 */}
      <View style={styles.myStatusContainer}>
        <View style={styles.statusSwitchRow}>
          <Text style={styles.sectionTitle}>ラーメンイキタイ</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isIkitai}
              onValueChange={handleStatusChange}
              trackColor={{ false: '#E5E5E5', true: '#D2691E' }}
              thumbColor={isIkitai ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        </View>
        
        {isIkitai && (
          <View style={styles.activeStatusContainer}>
            <View style={styles.timeSlotSelector}>
              {TIME_SLOTS.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.timeSlotButton, 
                    selectedTimeSlot === key && styles.timeSlotButtonSelected
                  ]}
                  onPress={() => handleTimeSlotSelect(key)}
                >
                  <Text style={[
                    styles.timeSlotText, 
                    selectedTimeSlot === key && styles.timeSlotTextSelected
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.separator} />

      {/* フレンドリスト */}
      <View style={styles.friendListContainer}>
        <View style={styles.friendsTitleContainer}>
          <Text style={styles.sectionTitle}>イキタイ中のフレンド</Text>
          <Text style={styles.friendsCount}>({filteredFriends.length}人)</Text>
        </View>
        
        {/* 市区町村フィルター */}
        <View style={styles.filterContainer}>
          {municipalities.map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.filterButton, 
                selectedMunicipality === m && styles.filterButtonSelected
              ]}
              onPress={() => setSelectedMunicipality(m)}
            >
              <Text style={[
                styles.filterText, 
                selectedMunicipality === m && styles.filterTextSelected
              ]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* フレンド一覧 */}
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.userName}</Text>
                <Text style={styles.friendDetail}>{item.municipality}</Text>
              </View>
              <View style={[
                styles.timeSlotBadge, 
                item.timeSlot === 'now' ? styles.timeSlotBadge_now :
                item.timeSlot === 'lunch' ? styles.timeSlotBadge_lunch :
                styles.timeSlotBadge_night
              ]}>
                <Text style={styles.timeSlotBadgeText}>
                  {TIME_SLOTS.find(ts => ts.key === item.timeSlot)?.label}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>イキタイ中のフレンドがいません</Text>
              <Text style={styles.emptySubText}>友達をアプリに招待してみましょう</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

// --- スタイル定義 ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA'
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
    fontWeight: '500'
  },
  
  // 自分のステータス部分
  myStatusContainer: { 
    margin: 16,
    padding: 24, 
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusSwitchRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#2C3E50'
  },
  switchContainer: {
    transform: [{ scale: 1.1 }],
  },
  activeStatusContainer: {
    marginTop: 20,
  },
  timeSlotSelector: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 12,
  },
  timeSlotButton: { 
    flex: 1,
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeSlotButtonSelected: { 
    backgroundColor: '#D2691E',
    borderColor: '#A0522D',
  },
  timeSlotText: { 
    fontSize: 15, 
    color: '#495057',
    fontWeight: '500'
  },
  timeSlotTextSelected: { 
    fontWeight: '600', 
    color: 'white' 
  },
  
  separator: { 
    height: 1, 
    backgroundColor: '#E9ECEF',
    marginHorizontal: 16,
  },
  
  // フレンドリスト部分
  friendListContainer: { 
    flex: 1, 
    margin: 16,
    marginTop: 16,
    padding: 24, 
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  friendsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  friendsCount: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  
  // フィルター部分
  filterContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 24,
    gap: 8,
  },
  filterButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    backgroundColor: '#F8F9FA', 
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  filterButtonSelected: { 
    backgroundColor: '#D2691E',
    borderColor: '#D2691E',
  },
  filterText: { 
    color: '#495057',
    fontWeight: '500',
    fontSize: 14,
  },
  filterTextSelected: { 
    color: 'white',
    fontWeight: '600',
  },
  
  // フレンドアイテム部分
  friendItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16,
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F3F4',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: { 
    fontSize: 16, 
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 4,
  },
  friendDetail: { 
    fontSize: 14, 
    color: '#6C757D',
  },
  
  // 時間帯バッジ
  timeSlotBadge: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  timeSlotBadge_now: { backgroundColor: '#DC3545' },
  timeSlotBadge_lunch: { backgroundColor: '#FFC107' },
  timeSlotBadge_night: { backgroundColor: '#0D6EFD' },
  timeSlotBadgeText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  
  // 空状態
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: { 
    textAlign: 'center',
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ADB5BD',
  }
});