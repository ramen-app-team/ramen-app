import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, ImageURISource, Alert } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Image } from "expo-image";

// マーカーのデータ型
// 経度・緯度の情報と一意キー用のidで構成
type RamenShop = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  rating: number;
};

type Friend = {
	id: number,
	latitude: number,
	longitude: number,
	icon: ImageURISource,
}

type MyHistory = {
	id: number,
	ramen_shop_id: number,
	count: number,
}

// マーカー表示用データ
const ramenShops: RamenShop[] = [
  {
    id: 1,
    latitude: 35.662346819815305,
    longitude: 139.6991631860567,
    name: "らーめん山田家",
    description: "濃厚豚骨ラーメンが自慢の老舗店。チャーシューが絶品！",
    rating: 4.2,
  },
  {
    id: 2,
    latitude: 35.6640117157159,
    longitude: 139.6993884915927,
    name: "味噌の力",
    description: "北海道味噌を使った本格味噌ラーメン専門店。",
    rating: 4.5,
  },
  {
    id: 3,
    latitude: 35.663218497391604,
    longitude: 139.69760750497448,
    name: "塩ラーメン一番",
    description: "あっさり塩ラーメンと手作り餃子が人気。",
    rating: 4.0,
  },
  {
    id: 4,
    latitude: 35.661762790515354,
    longitude: 139.69710324972715,
    name: "つけ麺王国",
    description: "濃厚つけ汁と太麺のつけ麺が名物。大盛り無料！",
    rating: 4.3,
  },
  {
    id: 5,
    latitude: 35.66078649319146,
    longitude: 139.69840143876814,
    name: "醤油ラーメン本舗",
    description: "昔ながらの醤油ラーメン。シンプルで飽きのこない味。",
    rating: 3.8,
  },
];

const friends: Friend[] = [
	{
		id: 1,
		latitude: 35.658876,
		longitude: 139.702567,
		icon: { uri: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png" },
	}
];

const myHistory: MyHistory[] = [
	{
		id: 1,
		ramen_shop_id: 1, // らーめん山田家
		count: 3,
	},
	{
		id: 2,
		ramen_shop_id: 2, // 味噌の力
		count: 5,
	},
	{
		id: 3,
		ramen_shop_id: 4, // つけ麺王国
		count: 100,
	}
]

export default function MapSample() {
  // 現在地
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  // マーカー
  const [markers, setMarkers] = useState<RamenShop[]>([]);
  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ラーメン店IDから訪問回数を取得する関数
  const getVisitCount = (shopId: number): number => {
    const history = myHistory.find(h => h.ramen_shop_id === shopId);
    return history ? history.count : 0;
  };

  useEffect(() => {
    // 位置情報のアクセス許可を取り、現在地情報を取得する
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("位置情報へのアクセスが拒否されました");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        // 緯度・経度はgetCurrentPositionAsyncで取得した緯度・経度
        // 緯度・経度の表示範囲の縮尺は固定値にしてます
        setInitRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error("現在地情報取得エラー：", error);
      }
    };
    getCurrentLocation();
    // 固定で設定したマーカー情報を設定する
    setMarkers(ramenShops);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : (
          // MapViewではstyle設定は必須です。
          // （設定しないとMAP表示されません）
          // regionはinitRegion(Region型)を設定
          // showsUserLocationはtrueにすると、現在地が青い点で表示します。
          // providerをgoogleにするとiOSでもGoogleMapで表示してくれます。
          // （デフォルトはapple map）
          <MapView
            style={styles.mapContainer}
            region={initRegion || undefined}
            showsUserLocation={true}
            provider="google"
          >
            {markers.map((marker) => (
              // key指定は必須。
              // coordinateは緯度・経度を設定する。
              // Calloutでマーカー横に情報を表示
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor="orange"
              >
                <Callout style={styles.calloutContainer}>
                  <View style={styles.calloutContent}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.calloutTitle}>{marker.name}</Text>
                      <View style={styles.ramenBowlContainer}>
                        <View style={styles.bowlStack}>
                          {Array.from({ length: getVisitCount(marker.id) }, (_, index) => (
                            <Text
                              key={index}
                              style={[
                                styles.ramenBowl,
                                { bottom: index * 3 } // 縦に3pxずつずらして重ねる
                              ]}
                            >
                              🍜
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={styles.calloutRating}>⭐ {marker.rating}/5.0</Text>
                    <Text style={styles.calloutDescription}>{marker.description}</Text>
                    <Text style={styles.visitedText}>訪問回数: {getVisitCount(marker.id)}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
						{friends.map((friend) => (
              <Marker
                key={friend.id}
                coordinate={{
                  latitude: friend.latitude,
                  longitude: friend.longitude,
                }}
              >
								<Callout>
									<View style={styles.calloutContainer}>
										<Text style={styles.calloutTitle}>Friend {friend.id}</Text>
										<Text style={styles.calloutDescription}>Latitude: {friend.latitude}</Text>
										<Text style={styles.calloutDescription}>Longitude: {friend.longitude}</Text>
									</View>
								</Callout>
								<Image
									source={friend.icon}
									style={{ width: 40, height: 40 }}
								/>
							</Marker>
            ))}
          </MapView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    width: 250,
    padding: 0,
  },
  calloutContent: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    flex: 1,
  },
  calloutRating: {
    fontSize: 14,
    color: "#ff6b35",
    fontWeight: "600",
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  ramenBowlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  visitedText: {
    fontSize: 14,
    color: "#666",
  },
  bowlStack: {
    position: "relative",
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  ramenBowl: {
    fontSize: 20,
    position: "absolute",
    bottom: 0,
  },
});
