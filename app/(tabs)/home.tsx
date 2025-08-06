import { useAuth } from "@/context/AuthContext";
import { useGetLockersWithStations } from "@/hooks/useLocker";
import { useGetReceivedPackages } from "@/hooks/usePackage";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import OrderCard from "../../components/OrderCard";

const HomeScreen = () => {
  const { userData } = useAuth();
  const { data: receivedPackages, isLoading: isLoadingReceivedPackages } =
    useGetReceivedPackages();
  const { data: lockersWithStations } = useGetLockersWithStations();

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location", error);
      }
    })();
  }, []);

  const initialRegion = {
    latitude: location?.latitude ?? -6.2088,
    longitude: location?.longitude ?? 106.8456,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-10 pb-4 bg-white">
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                userData?.profile_picture ||
                "https://example.com/default_avatar.png",
            }}
            className="w-8 h-8 rounded-full mr-2"
          />
          <Text
            style={{ fontFamily: "Inter-Bold", fontSize: 14 }}
            className="text-sm text-gray-800"
          >
            {userData
              ? `Good Morning, ${userData.full_name?.split(" ")[0]}`
              : "Good Morning"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          className="w-8 h-8 rounded-full items-center justify-center border border-gray-200"
        >
          <FontAwesome name="bell" size={18} color={"#004C98"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View
          className="bg-white rounded-xl p-4 mx-4 my-4 flex-row items-center justify-between"
          style={{ backgroundColor: "#D9E4F0" }}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="credit-card"
              size={24}
              color={"#004C98"}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text
                style={{ fontFamily: "Inter-Regular" }}
                className="text-xs text-gray-600 mb-1"
              >
                Active Balance
              </Text>
              <Text
                style={{ fontFamily: "Inter-Bold", color: "#004C98" }}
                className="text-lg"
              >
                {userData?.balance != null
                  ? `Rp${userData.balance.toLocaleString("id-ID")}`
                  : "Rp0"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/topup")}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: "#004C98" }}
          >
            <Text style={{ fontFamily: "Inter-Bold" }} className="text-white">
              Top Up +
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="mx-4 my-4 rounded-xl overflow-hidden"
          style={{ backgroundColor: "#004C98" }}
        >
          <MapView
            className="w-full h-48"
            initialRegion={initialRegion}
            showsUserLocation={false}
          >
            {location && (
              <Marker coordinate={location} title="Your Location">
                <View className="p-2 bg-blue-500 rounded-full border-2 border-white">
                  <FontAwesome name="user" size={20} color="white" />
                </View>
              </Marker>
            )}
            {lockersWithStations?.map(({ station }) =>
              station ? (
                <Marker
                  key={station.id}
                  coordinate={{
                    latitude: station.latitude || 0,
                    longitude: station.longitude || 0,
                  }}
                  title={station.name}
                >
                  <View className="p-2 bg-white rounded-full shadow-md">
                    <FontAwesome name="building" size={20} color={"#004C98"} />
                  </View>
                </Marker>
              ) : null
            )}
          </MapView>
          <View className="p-4">
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
              <TextInput
                className="flex-1 text-base"
                placeholder="Search location..."
                placeholderTextColor="#888"
              />
              <TouchableOpacity>
                <FontAwesome name="search" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg mb-3 mx-4 mt-4"
        >
          Packages Sent To You
        </Text>
        {isLoadingReceivedPackages ? (
          <Text className="mx-4">Loading packages...</Text>
        ) : receivedPackages && receivedPackages.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={receivedPackages}
            keyExtractor={(item) => item.id as string}
            renderItem={({ item: pkg }) => (
              <OrderCard
                onPress={() => {
                  if (pkg.status !== "completed") {
                    router.push({
                      pathname: "/scan-pickup",
                      params: { packageId: pkg.id },
                    });
                  }
                }}
                type={pkg.status === "in_transit" ? "inTransit" : "pickup"}
                iconName={
                  pkg.status === "in_locker_destination" ? "cube" : "inbox"
                }
                iconBgColor={
                  pkg.status === "in_locker_destination" ? "#004C98" : "#FF6347"
                }
                title={`Package from ${pkg.sender?.full_name || "Unknown"}`}
                packageId={pkg.id as string}
                details={[
                  { label: "Description", value: pkg.description as string },
                ]}
                statusText={pkg.status.replace(/_/g, " ")}
                statusBgColor={
                  pkg.status === "in_locker_destination" ? "#004C98" : "#32CD32"
                }
                isCurrentOrder={pkg.status !== "completed"}
              />
            )}
          />
        ) : (
          <Text className="mx-4">No packages sent to you yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
