import { useGetLockersByStation, useGetStations } from "@/hooks/useLocker";
import { Station } from "@/types/station";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CheckLockersScreen = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: allStations, isLoading: isLoadingStations } = useGetStations();

  const { data: lockers, isLoading: isLoadingLockers } = useGetLockersByStation(
    selectedStation?.id || ""
  );

  const availableLockers = useMemo(() => {
    if (!lockers) return [];
    return lockers.filter((locker) => locker.status === "available");
  }, [lockers]);

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    setModalVisible(false);
  };

  const handleChooseLockers = () => {
    if (!selectedStation || availableLockers.length === 0) {
      alert("No available lockers at this station.");
      return;
    }

    router.push({
      pathname: "/send-package",
      params: {
        destination_station_id: selectedStation.id,
        locker_id: availableLockers[0].id,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Check Lockers",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#004C98" },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={{ padding: 20 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-bold text-base text-gray-700">
            Selected Station
          </Text>
          <TouchableOpacity
            className="border border-blue-600 rounded-lg px-3 py-1"
            onPress={() => setModalVisible(true)}
          >
            <Text className="font-bold text-sm text-blue-600">Change</Text>
          </TouchableOpacity>
        </View>

        {selectedStation ? (
          <View className="bg-white rounded-2xl p-4 flex-row items-center mb-6 shadow-sm">
            <FontAwesome name="subway" size={32} color={"#004C98"} />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-base text-gray-800">
                {selectedStation.name}
              </Text>
              <Text
                className="font-semibold text-sm"
                style={{ color: "#004C98" }}
              >
                Available: {availableLockers.length} Lockers
              </Text>
              <Text className="text-xs text-gray-500">
                {selectedStation.address}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-4 items-center justify-center mb-6 h-24 border-2 border-dashed border-gray-300">
            <Text className="text-gray-500">Please select a station</Text>
          </View>
        )}

        <Text className="font-bold text-base text-gray-700 mb-3">
          Lockers Availability
        </Text>
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm min-h-[150px]">
          {isLoadingLockers ? (
            <ActivityIndicator size="large" color={"#004C98"} />
          ) : availableLockers.length > 0 ? (
            <FlatList
              data={availableLockers}
              keyExtractor={(item) => item.id as string}
              numColumns={3}
              renderItem={({ item }) => (
                <View className="flex-1 items-center p-2 m-1 border border-green-200 rounded-lg bg-green-50">
                  <Ionicons name="cube" size={32} color="green" />
                  <Text className="font-bold capitalize mt-1 text-green-800">
                    {item.size}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">
                {selectedStation
                  ? "No available lockers"
                  : "Select a station to see availability"}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#004C98",
            opacity: availableLockers.length > 0 ? 1 : 0.5,
          }}
          className="rounded-xl p-4 items-center"
          onPress={handleChooseLockers}
          disabled={availableLockers.length === 0}
        >
          <Text className="text-white font-bold text-base">Choose Lockers</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-5 h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-lg">Select a Station</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="gray" />
              </TouchableOpacity>
            </View>
            {isLoadingStations ? (
              <ActivityIndicator size="large" color={"#004C98"} />
            ) : (
              <FlatList
                data={allStations}
                keyExtractor={(item) => item.id as string}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-4 border-b border-gray-200"
                    onPress={() => handleSelectStation(item)}
                  >
                    <Text className="text-base font-semibold">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckLockersScreen;
