import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  TextInput as PaperTextInput,
  Button,
  Card,
  Surface,
  useTheme,
  Chip,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

// レストラン情報の型定義(仮)
interface RestaurantInfo {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  priceLevel?: string;
  photoUrl?: string;
}

export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const restaurantInfo: RestaurantInfo = {
    id: (params.id as string) || "",
    name: (params.name as string) || "",
    address: (params.address as string) || "",
    rating: params.rating ? parseFloat(params.rating as string) : undefined,
    priceLevel: (params.priceLevel as string) || "",
    photoUrl: (params.photoUrl as string) || "",
  };

  const [menuName, setMenuName] = useState("");
  const [rating, setRating] = useState(5);
  const [noodleHardness, setNoodleHardness] = useState<string>("");
  const [soupRichness, setSoupRichness] = useState<string>("");
  const [review, setReview] = useState("");
  const [photoUri, setPhotoUri] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    router.back();
  };

  // 空のAPI関数（後で実装）
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
    if (!menuName) {
      Alert.alert("メニュー名を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: レビュー投稿API実装
      console.log("レビュー投稿:", {
        restaurantId: restaurantInfo.id,
        restaurantName: restaurantInfo.name,
        menu: menuName,
        rating,
        noodleHardness,
        soupRichness,
        review,
        photo: photoUri,
      });

      Alert.alert("成功", "レビューを投稿しました！");
      // フォームをリセット
      setMenuName("");
      setRating(5);
      setNoodleHardness("");
      setSoupRichness("");
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

  const renderNoodleHardness = () => {
    const options = ["やわめ", "普通", "硬め"];
    return (
      <View style={styles.optionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.subSectionTitle}>
          麺の硬さ
        </ThemedText>
        <View style={styles.buttonGroup}>
          {options.map((option) => (
            <Button
              key={option}
              mode={noodleHardness === option ? "contained" : "outlined"}
              onPress={() => setNoodleHardness(option)}
              style={styles.optionButton}
              labelStyle={styles.optionButtonLabel}
            >
              {option}
            </Button>
          ))}
        </View>
      </View>
    );
  };

  const renderSoupRichness = () => {
    const options = ["あっさり", "ふつう", "こってり"];
    return (
      <View style={styles.optionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.subSectionTitle}>
          スープの濃さ
        </ThemedText>
        <View style={styles.buttonGroup}>
          {options.map((option) => (
            <Button
              key={option}
              mode={soupRichness === option ? "contained" : "outlined"}
              onPress={() => setSoupRichness(option)}
              style={styles.optionButton}
              labelStyle={styles.optionButtonLabel}
            >
              {option}
            </Button>
          ))}
        </View>
      </View>
    );
  };

  const renderRestaurantInfo = () => {
    return (
      <Card style={styles.restaurantCard}>
        <Card.Content>
          <ThemedText type="title" style={styles.restaurantName}>
            {restaurantInfo.name}
          </ThemedText>
          {restaurantInfo.address && (
            <ThemedText style={styles.restaurantAddress}>
              📍 {restaurantInfo.address}
            </ThemedText>
          )}
          <View style={styles.restaurantChips}>
            {restaurantInfo.rating && (
              <Chip icon="star" style={styles.chip}>
                {restaurantInfo.rating.toFixed(1)}
              </Chip>
            )}
            {restaurantInfo.priceLevel && (
              <Chip icon="currency-jpy" style={styles.chip}>
                {restaurantInfo.priceLevel}
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      {/* ヘッダー */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={handleClose}
          style={styles.closeButton}
          iconColor="#333"
        />
        <ThemedText type="title" style={styles.headerTitle}>
          ラーメン記録
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface} elevation={2}>
          {/* レストラン情報 */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            店名
          </ThemedText>
          {renderRestaurantInfo()}

          {/* メニュー名 */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            メニュー名 *
          </ThemedText>
          <PaperTextInput
            label="入力してください"
            value={menuName}
            onChangeText={setMenuName}
            placeholder="例: 醤油ラーメン"
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          {/* 評価 */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            評価
          </ThemedText>
          {renderStarRating()}

          {/*味の詳細*/}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            味の詳細
          </ThemedText>
          {renderNoodleHardness()}
          {renderSoupRichness()}

          {/* 写真 */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            写真
          </ThemedText>
          <View style={styles.photoButtonsContainer}>
            <Button
              mode="outlined"
              icon="camera"
              onPress={takePhoto}
              style={styles.photoButton}
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              撮影
            </Button>
            <Button
              mode="outlined"
              icon="image"
              onPress={selectPhotoFromGallery}
              style={styles.photoButton}
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              選択
            </Button>
          </View>
          {photoUri ? (
            <Card style={styles.photoPreview}>
              <Card.Content>
                <ThemedText>写真が選択されました</ThemedText>
              </Card.Content>
            </Card>
          ) : null}

          {/* 感想 */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            感想
          </ThemedText>
          <PaperTextInput
            label="入力してください(任意)"
            value={review}
            onChangeText={setReview}
            placeholder="ラーメンの感想を書いてください..."
            mode="outlined"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />

          {/* 投稿ボタン */}
          <Button
            mode="contained"
            onPress={submitReview}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            contentStyle={{ height: 56 }}
            labelStyle={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}
          >
            {isSubmitting ? "投稿中..." : "レビューを投稿"}
          </Button>
        </Surface>
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
  closeButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 48, // closeButtonと同じ幅
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    alignItems: "center",
  },
  surface: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 30,
    elevation: 2,
  },
  restaurantCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  restaurantChips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
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
    padding: 5,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  optionButton: {
    borderRadius: 8,
    minWidth: 90,
    paddingHorizontal: 0,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0,
  },
  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  photoPreview: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    minHeight: 56,
    justifyContent: "center",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#333",
  },
});
