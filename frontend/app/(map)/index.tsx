import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, ImageURISource } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Image } from "expo-image";

// マーカーのデータ型
// 経度・緯度の情報と一意キー用のidで構成
type Marker = {
  id: number;
  latitude: number;
  longitude: number;
};

type Friend = {
	id: number,
	latitude: number,
	longitude: number,
	icon: ImageURISource,
}

// マーカー表示用データ
const markersData: Marker[] = [
  {
    id: 1,
    latitude: 35.662346819815305,
    longitude: 139.6991631860567,
  },
  {
    id: 2,
    latitude: 35.6640117157159,
    longitude: 139.6993884915927,
  },
  {
    id: 3,
    latitude: 35.663218497391604,
    longitude: 139.69760750497448,
  },
  {
    id: 4,
    latitude: 35.661762790515354,
    longitude: 139.69710324972715,
  },
  {
    id: 5,
    latitude: 35.66078649319146,
    longitude: 139.69840143876814,
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

export default function MapSample() {
  // 現在地
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  // マーカー
  const [markers, setMarkers] = useState<Marker[]>([]);
  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setMarkers(markersData);
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
              // pinColorでマーカーの色指定可能
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor="orange"
              ></Marker>
            ))}
						{friends.map((friend) => (
              <Marker
                key={friend.id}
                coordinate={{
                  latitude: friend.latitude,
                  longitude: friend.longitude,
                }}
              >
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
});
