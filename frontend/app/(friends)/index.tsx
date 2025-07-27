import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  Button,
  Card,
  Surface,
  useTheme,
  Chip,
  IconButton,
  Searchbar,
  Avatar,
  Divider,
} from "react-native-paper";

// バックエンドのUserRelationshipモデルに合わせた型定義
interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface UserRelationship {
  id: number;
  follower: User;
  followed: User;
  status: "PENDING" | "APPROVED" | "DENIED";
  created_at: string;
  updated_at: string;
}

// フロントエンド用の表示型定義
interface Friend {
  id: number;
  name: string;
  avatar?: string;
  ikitaiStatus?: boolean; // 現在イキタイ状態かどうか
  ikitaiLocation?: string; // イキタイ位置
}

interface FriendRequest {
  id: number;
  fromUser: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    ramenCount?: number; // 食べたラーメン数
  };
  status: "PENDING" | "APPROVED" | "DENIED";
  createdAt: string;
  message?: string; // フレンドリクエスト時のメッセージ
}

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  // 仮のフレンドデータ
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "田中太郎",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      ikitaiStatus: true,
      ikitaiLocation: "渋谷区",
    },
    {
      id: 2,
      name: "佐藤花子",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      ikitaiStatus: false,
    },
    {
      id: 3,
      name: "鈴木一郎",
      ikitaiStatus: true,
      ikitaiLocation: "新宿区",
    },
    {
      id: 4,
      name: "山田次郎",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      ikitaiStatus: true,
      ikitaiLocation: "池袋区",
    },
    {
      id: 5,
      name: "高橋美咲",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      ikitaiStatus: false,
    },
  ]);

  // 仮のフレンドリクエストデータ
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 1,
      fromUser: {
        id: 4,
        name: "山田次郎",
        email: "yamada@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        ramenCount: 35,
      },
      status: "PENDING",
      createdAt: "2024-01-15T10:30:00Z",
      message: "ラーメン好きな友達が欲しいです！",
    },
    {
      id: 2,
      fromUser: {
        id: 5,
        name: "高橋美咲",
        email: "takahashi@example.com",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        ramenCount: 19,
      },
      status: "PENDING",
      createdAt: "2024-01-14T15:45:00Z",
      message: "一緒にラーメン巡りしませんか？",
    },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 検索結果をフィルタリング
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 検索結果をイキタイ状態で分類
  const filteredIkitaiFriends = filteredFriends.filter(
    (friend) => friend.ikitaiStatus
  );
  const filteredNormalFriends = filteredFriends.filter(
    (friend) => !friend.ikitaiStatus
  );

  // フレンドリクエストの検索結果をフィルタリング
  const filteredFriendRequests = friendRequests.filter(
    (request) =>
      request.fromUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.message &&
        request.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAcceptRequest = async (requestId: number) => {
    try {
      // バックエンドAPIを呼び出してフレンドリクエストを承認
      const response = await fetch(
        `http://localhost:8000/api/relationships/approve/${requestId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // TODO: 認証トークンを追加
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "approve" }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setFriendRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" as const } : req
        )
      );
      Alert.alert("成功", "フレンドリクエストを承認しました");
    } catch (error) {
      console.error("Accept Request Error:", error);
      Alert.alert("エラー", "リクエストの承認に失敗しました");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      // バックエンドAPIを呼び出してフレンドリクエストを拒否
      const response = await fetch(
        `http://localhost:8000/api/relationships/approve/${requestId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // TODO: 認証トークンを追加
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "deny" }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      Alert.alert("拒否", "フレンドリクエストを拒否しました");
    } catch (error) {
      console.error("Reject Request Error:", error);
      Alert.alert("エラー", "リクエストの拒否に失敗しました");
    }
  };

  const handleRemoveFriend = (friendId: number) => {
    Alert.alert("フレンド削除", "このフレンドを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          try {
            // バックエンドAPIを呼び出してフレンドを削除
            const response = await fetch(
              `http://localhost:8000/api/relationships/unfollow/${friendId}/`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  // TODO: 認証トークンを追加
                  // 'Authorization': `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            setFriends((prev) =>
              prev.filter((friend) => friend.id !== friendId)
            );
            Alert.alert("削除", "フレンドを削除しました");
          } catch (error) {
            console.error("Remove Friend Error:", error);
            Alert.alert("エラー", "フレンドの削除に失敗しました");
          }
        },
      },
    ]);
  };

  // イキタイ状態のフレンドを取得
  const ikitaiFriends = friends.filter((friend) => friend.ikitaiStatus);
  const normalFriends = friends.filter((friend) => !friend.ikitaiStatus);

  const renderFriendItem = (friend: Friend) => (
    <Card key={friend.id} style={styles.friendCard}>
      <Card.Content>
        <View style={styles.friendItem}>
          <View style={styles.friendInfo}>
            <View style={styles.avatarContainer}>
              {friend.avatar ? (
                <Avatar.Image size={50} source={{ uri: friend.avatar }} />
              ) : (
                <Avatar.Text size={50} label={friend.name.charAt(0)} />
              )}
              {friend.ikitaiStatus && (
                <View style={styles.ikitaiIndicator}>
                  <IconSymbol size={16} name="flame.fill" color="#FF6B35" />
                </View>
              )}
            </View>
            <View style={styles.friendDetails}>
              <View style={styles.friendHeader}>
                <ThemedText type="defaultSemiBold" style={styles.friendName}>
                  {friend.name}
                </ThemedText>
              </View>
              {friend.ikitaiStatus && friend.ikitaiLocation && (
                <ThemedText style={styles.ikitaiLocation}>
                  📍 {friend.ikitaiLocation}でイキタイ中
                </ThemedText>
              )}
            </View>
          </View>
          <View style={styles.friendActions}>
            <IconButton
              icon="message"
              size={20}
              onPress={() =>
                Alert.alert("メッセージ", "メッセージ機能は後で実装予定")
              }
              iconColor="#0a7ea4"
            />
            <IconButton
              icon="account-remove"
              size={20}
              onPress={() => handleRemoveFriend(friend.id)}
              iconColor="#f44336"
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFriendRequestItem = (request: FriendRequest) => (
    <Card key={request.id} style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <View style={styles.avatarContainer}>
              {request.fromUser.avatar ? (
                <Avatar.Image
                  size={50}
                  source={{ uri: request.fromUser.avatar }}
                />
              ) : (
                <Avatar.Text
                  size={50}
                  label={request.fromUser.name.charAt(0)}
                />
              )}
            </View>
            <View style={styles.requestDetails}>
              <ThemedText type="defaultSemiBold" style={styles.requestName}>
                {request.fromUser.name}
              </ThemedText>
              {request.message && (
                <ThemedText style={styles.requestMessage}>
                  💬 {request.message}
                </ThemedText>
              )}
            </View>
          </View>
          <View style={styles.requestActions}>
            <Button
              mode="contained"
              onPress={() => handleAcceptRequest(request.id)}
              style={styles.acceptButton}
              buttonColor="#4CAF50"
            >
              承認
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleRejectRequest(request.id)}
              style={styles.rejectButton}
              textColor="#f44336"
            >
              拒否
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTabButton = (
    tab: "friends" | "requests",
    label: string,
    count?: number
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.activeTabButtonText,
        ]}
      >
        {label}
      </ThemedText>
      {count !== undefined && count > 0 && (
        <View style={styles.tabBadge}>
          <ThemedText style={styles.tabBadgeText}>{count}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      {/* ヘッダー */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          フレンド
        </ThemedText>
        <IconButton
          icon="account-plus"
          size={24}
          onPress={() =>
            Alert.alert("フレンド追加", "フレンド追加機能は後で実装予定")
          }
          iconColor="#0a7ea4"
        />
      </View>

      {/* タブ */}
      <View style={styles.tabContainer}>
        {renderTabButton("friends", "🍜 フレンド", friends.length)}
        {renderTabButton(
          "requests",
          "📨 リクエスト",
          friendRequests.filter((r) => r.status === "PENDING").length
        )}
      </View>

      {/* 検索バー */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={
            activeTab === "friends"
              ? "フレンドを検索..."
              : "リクエストを検索..."
          }
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "friends" ? (
          <View style={styles.contentContainer}>
            {filteredFriends.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol size={64} name="person.2" color="#ccc" />
                <ThemedText style={styles.emptyStateText}>
                  {searchQuery
                    ? "検索結果が見つかりません"
                    : "フレンドがいません"}
                </ThemedText>
                <ThemedText style={styles.emptyStateSubtext}>
                  {searchQuery
                    ? "別のキーワードで検索してみてください"
                    : "フレンドを追加してラーメン情報を共有しましょう"}
                </ThemedText>
              </View>
            ) : (
              <>
                {/* イキタイ状態のフレンド */}
                {filteredIkitaiFriends.length > 0 && (
                  <View style={styles.ikitaiSection}>
                    {filteredIkitaiFriends.map(renderFriendItem)}
                  </View>
                )}

                {/* 通常のフレンド */}
                {filteredNormalFriends.length > 0 && (
                  <View style={styles.normalSection}>
                    {filteredNormalFriends.map(renderFriendItem)}
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {filteredFriendRequests.filter((r) => r.status === "PENDING")
              .length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol size={64} name="person.badge.plus" color="#ccc" />
                <ThemedText style={styles.emptyStateText}>
                  {searchQuery
                    ? "検索結果が見つかりません"
                    : "新しいリクエストはありません"}
                </ThemedText>
                {searchQuery && (
                  <ThemedText style={styles.emptyStateSubtext}>
                    別のキーワードで検索してみてください
                  </ThemedText>
                )}
              </View>
            ) : (
              filteredFriendRequests
                .filter((r) => r.status === "PENDING")
                .map(renderFriendRequestItem)
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0a7ea4",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabButtonText: {
    color: "#0a7ea4",
    fontWeight: "bold",
  },
  tabBadge: {
    position: "absolute",
    top: 8,
    right: 20,
    backgroundColor: "#f44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  friendCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  requestCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  friendDetails: {
    flex: 1,
  },
  requestDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  requestEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  friendMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  lastActive: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  requestDate: {
    fontSize: 12,
    color: "#666",
  },
  mutualFriendsChip: {
    alignSelf: "flex-start",
    height: 24,
  },
  mutualFriendsText: {
    fontSize: 12,
  },
  friendActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  acceptButton: {
    minWidth: 60,
  },
  rejectButton: {
    minWidth: 60,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  ikitaiIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
  },
  friendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ikitaiChip: {
    backgroundColor: "#FF6B35",
    height: 24,
  },
  ikitaiChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  ikitaiLocation: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "bold",
    marginBottom: 2,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  requestMessage: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  ikitaiSection: {
    marginBottom: 20,
  },
  normalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: "#333",
  },
});
