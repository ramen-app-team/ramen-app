import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ReviewScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [menuName, setMenuName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [photoUri, setPhotoUri] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 空のAPI関数（後で実装）
  const searchRestaurants = async (query: string) => {
    // TODO: 店舗検索API実装
    console.log("店舗検索:", query);
    return [];
  };

  const takePhoto = async () => {
    // TODO: カメラ機能実装
    console.log("写真撮影");
    Alert.alert("写真撮影", "カメラ機能は後で実装予定");
  };

  const selectPhotoFromGallery = async () => {
    // TODO: ギャラリーから写真選択実装
    console.log("ギャラリーから選択");
    Alert.alert("写真選択", "ギャラリー機能は後で実装予定");
  };

  const submitReview = async () => {
    if (!selectedRestaurant || !menuName) {
      Alert.alert("エラー", "店舗名とメニュー名は必須です");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: レビュー投稿API実装
      console.log("レビュー投稿:", {
        restaurant: selectedRestaurant,
        menu: menuName,
        rating,
        review,
        photo: photoUri,
      });

      Alert.alert("成功", "レビューを投稿しました！");
      // フォームをリセット
      setSelectedRestaurant("");
      setMenuName("");
      setRating(5);
      setReview("");
      setPhotoUri("");
    } catch (error) {
      Alert.alert("エラー", "投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <ThemedText style={styles.ratingLabel}>評価:</ThemedText>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
              activeOpacity={0.7}
            >
              <IconSymbol
                size={32}
                name={star <= rating ? "star.fill" : "star"}
                color={star <= rating ? "#FFD700" : "#C0C0C0"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <ThemedText style={styles.ratingText}>{rating}/5</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          ラーメン記録
        </ThemedText>

        {/* 店舗選択 */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            店舗名 *
          </ThemedText>
          <TextInput
            style={styles.input}
            value={selectedRestaurant}
            onChangeText={setSelectedRestaurant}
            placeholder="店舗名を入力"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* メニュー名 */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            メニュー名 *
          </ThemedText>
          <TextInput
            style={styles.input}
            value={menuName}
            onChangeText={setMenuName}
            placeholder="例: 醤油ラーメン"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* 評価 */}
        <View style={styles.section}>{renderStarRating()}</View>

        {/* 写真 */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            写真
          </ThemedText>
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <IconSymbol size={28} name="camera.fill" color="#007AFF" />
              <ThemedText style={styles.photoButtonText}>撮影</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={selectPhotoFromGallery}
              activeOpacity={0.8}
            >
              <IconSymbol size={28} name="photo.fill" color="#007AFF" />
              <ThemedText style={styles.photoButtonText}>選択</ThemedText>
            </TouchableOpacity>
          </View>
          {photoUri ? (
            <View style={styles.photoPreview}>
              <ThemedText>写真が選択されました</ThemedText>
            </View>
          ) : null}
        </View>

        {/* 感想 */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            感想
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={review}
            onChangeText={setReview}
            placeholder="ラーメンの感想を書いてください..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />
        </View>

        {/* 投稿ボタン */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={submitReview}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? "投稿中..." : "レビューを投稿"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // タブバーの高さ分余白を追加
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 50, // タッチしやすい高さ
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  ratingLabel: {
    marginRight: 15,
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 15,
  },
  starButton: {
    marginHorizontal: 5,
    padding: 5, // タッチ領域を広げる
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 56, // タッチしやすい高さ
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  photoButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  photoPreview: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    minHeight: 56, // タッチしやすい高さ
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
