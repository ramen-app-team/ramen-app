// frontend/app/api.ts

import axios from 'axios';

// APIのベースURLを直接ここで定義
// !!! ここをあなたのDjangoバックエンドのIPアドレスとポートに置き換えてください !!!
// 例: 'http://192.168.1.100:8000/api'
const API_BASE_URL = 'http://localhost:8000/api'; // 開発環境に合わせて変更してください

// --- 型定義 ---
export interface TimeSlot {
  // TimeSlotの具体的な型定義をここに記述 (例: 'now' | 'lunch' | 'night')
}

export interface IkitaiFriend {
  userId: string;
  userName: string;
  userIconUrl: string;
  timeSlot: TimeSlot;
  municipality: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

// --- 認証関連API ---

/**
 * ユーザー登録を行うAPI呼び出し
 * @param username - ユーザー名
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns 成功: { success: true, user: ユーザーデータ }, 失敗: { success: false, error: エラー詳細 }
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: any }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register/`, {
      username,
      email,
      password,
    });
    console.log('API Call: registerUser successful', response.data);
    return { success: true, user: response.data.user };
  } catch (error: any) {
    console.error('API Call: registerUser failed', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * ユーザーログインを行い、認証トークンを取得するAPI呼び出し
 * @param username - ユーザー名
 * @param password - パスワード
 * @returns 成功: { success: true, tokens: AuthTokens }, 失敗: { success: false, error: エラー詳細 }
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; tokens?: AuthTokens; error?: any }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login/`, {
      username,
      password,
    });
    console.log('API Call: loginUser successful', response.data);
    return { success: true, tokens: response.data };
  } catch (error: any) {
    console.error('API Call: loginUser failed', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- イキタイ機能関連API (モック) ---

/**
 * 自分のイキタイステータスを更新するAPI
 * @param status - 'on' または 'off'
 * @param timeSlot - 希望の時間帯
 * @param latitude - 現在地の緯度
 * @param longitude - 現在地の経度
 * @returns { success: boolean }
 */
export const updateMyIkitaiStatus = async (
  status: 'on' | 'off',
  timeSlot: TimeSlot | null,
  latitude: number | null,
  longitude: number | null
): Promise<{ success: boolean }> => {
  console.log('API Call: updateMyIkitaiStatus', { status, timeSlot, latitude, longitude });
  // 本番環境では、ここでサーバーにPOSTリクエストを送信します
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

/**
 * イキタイ状態のフレンドリストを取得するAPI
 * @returns イキタイ状態のフレンドの配列
 */
export const fetchIkitaiFriends = async (): Promise<IkitaiFriend[]> => {
  console.log('API Call: fetchIkitaiFriends');
  // 本番環境では、ここでサーバーからGETリクエストでデータを取得します
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