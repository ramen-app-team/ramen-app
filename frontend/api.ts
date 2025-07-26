import { TimeSlot, IkitaiFriend } from './types';

// 自分のステータスを更新するAPI（モック）
export const updateMyIkitaiStatus = async (
  status: 'on' | 'off',
  timeSlot: TimeSlot | null,
  latitude: number | null,
  longitude: number | null
): Promise<{ success: boolean }> => {
  console.log('API Call: updateMyIkitaiStatus', { status, timeSlot, latitude, longitude });
  // 本来はここでサーバーにPOSTリクエストを送信する
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

// イキタイ状態のフレンドリストを取得するAPI（モック）
export const fetchIkitaiFriends = async (): Promise<IkitaiFriend[]> => {
  console.log('API Call: fetchIkitaiFriends');
  // 本来はここでサーバーからGETリクエストでデータを取得する
  await new Promise(resolve => setTimeout(resolve, 500)); // 通信をシミュレート
  
  // ダミーデータ
  const dummyFriends: IkitaiFriend[] = [
    { userId: '1', userName: 'ラーメン大好き鈴木さん', userIconUrl: 'icon_url', timeSlot: 'now', municipality: '渋谷区' },
    { userId: '2', userName: 'つけ麺好きの佐藤さん', userIconUrl: 'icon_url', timeSlot: 'lunch', municipality: '新宿区' },
    { userId: '3', userName: '家系マスター田中くん', userIconUrl: 'icon_url', timeSlot: 'night', municipality: '渋谷区' },
    { userId: '4', userName: 'あっさり派の高橋さん', userIconUrl: 'icon_url', timeSlot: 'now', municipality: '豊島区' },
  ];
  return dummyFriends;
};