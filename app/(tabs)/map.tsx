import MRTStationCard from "@/components/MRTStationCard";
import { useGetLockersWithStations } from "@/hooks/useLocker";
import { Station } from "@/types/station";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

interface ProcessedStation extends Station {
  availableLockers: number;
}

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: lockersWithStations,
    isLoading,
    error,
  } = useGetLockersWithStations();

  const filteredStations = useMemo(() => {
    if (!lockersWithStations) return [];

    const stationMap = new Map<string, ProcessedStation>();

    lockersWithStations.forEach((locker) => {
      if (locker.station) {
        if (!stationMap.has(locker.station.id as string)) {
          stationMap.set(locker.station.id as string, {
            ...locker.station,
            availableLockers: 0,
          });
        }

        const station = stationMap.get(locker.station.id as string);
        if (station && locker.status === "available") {
          station.availableLockers++;
        }
      }
    });

    const allStations = Array.from(stationMap.values());

    if (!searchQuery) {
      return allStations;
    }

    return allStations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lockersWithStations, searchQuery]);

  const initialRegion = {
    latitude: -6.2,
    longitude: 106.8167,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={"#004C98"} />
        <Text className="mt-2">Loading Stations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="relative flex-1">
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {filteredStations?.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude || 0,
                longitude: station.longitude || 0,
              }}
              title={station.name}
              description={`Available Lockers: ${station.availableLockers}`}
            >
              <View className="p-2 bg-white rounded-full shadow-md">
                <FontAwesome name="building" size={24} color={"#004C98"} />
              </View>
            </Marker>
          ))}
        </MapView>
        <View className="absolute top-4 left-4 right-4">
          <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
            <TextInput
              className="flex-1 text-base"
              placeholder="Search location..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <FontAwesome name="search" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        className="bg-white rounded-t-3xl p-4 -mt-8 z-10 shadow-lg"
        style={{ borderTopWidth: 1, borderTopColor: "#e0e0e0" }}
      >
        <View className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 280 }}
        >
          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <MRTStationCard
                key={station.id}
                stationName={station.name}
                distance={station.address}
                availableLockers={station.availableLockers}
                onPress={() =>
                  router.push({
                    pathname: "/send-package",
                    params: { destination_station_id: station.id },
                  })
                }
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              No stations found.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MapScreen;
