import TrackingStatusItem from "@/components/TrackingStatusItem";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const LiveTrackingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const packageId = params.packageId;

  const origin = {
    latitude: -6.3195,
    longitude: 106.6617,
    name: "Stasiun KRL Serpong",
  };
  const destination = {
    latitude: -6.2098,
    longitude: 106.8503,
    name: "Stasiun Manggarai",
  };
  const routeCoordinates = [origin, destination];

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: false,
      })
    );

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [animatedValue]);

  const movingLatitude = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [origin.latitude, destination.latitude],
  });
  const movingLongitude = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [origin.longitude, destination.longitude],
  });

  const trackingStatuses = [
    { status: "In Transit", location: "Stasiun KRL Serpong", isCurrent: true },
    { status: "Transit", location: "Transit Hub Tangerang", isCurrent: false },
    {
      status: "Arrive to Sorting Center",
      location: "Sorting Tangerang",
      isCurrent: false,
    },
    {
      status: "Picked Up",
      location: "Seller Location, BSD City, Serpong",
      isCurrent: false,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <View className="items-center">
              <Text
                style={{ fontFamily: "Inter-Bold" }}
                className="text-white text-lg"
              >
                Live Tracking
              </Text>
              <View className="flex-row items-center mt-1">
                <FontAwesome
                  name="barcode"
                  size={12}
                  color="white"
                  className="mr-1"
                />
                <Text
                  style={{ fontFamily: "Inter-Regular" }}
                  className="text-white text-xs"
                >
                  Package ID: #{packageId || "N/A"}
                </Text>
              </View>
            </View>
          ),
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
      <View className="relative flex-1">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 2,
            longitudeDelta:
              Math.abs(origin.longitude - destination.longitude) * 2,
          }}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={"#004C98"}
            strokeWidth={4}
          />
          <Marker coordinate={origin} title="Origin" description={origin.name}>
            <FontAwesome name="building" size={24} color="green" />
          </Marker>
          <Marker
            coordinate={destination}
            title="Destination"
            description={destination.name}
          >
            <FontAwesome name="flag-checkered" size={24} color="red" />
          </Marker>
          {/* Marker paket yang bergerak */}
          <AnimatedMarker
            coordinate={
              { latitude: movingLatitude, longitude: movingLongitude } as any
            }
          >
            <FontAwesome name="archive" size={24} color={"#004C98"} />
          </AnimatedMarker>
        </MapView>
      </View>

      <View className="bg-white rounded-t-3xl p-4 -mt-8 z-10 shadow-lg">
        <View className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-xl font-bold mb-4"
        >
          Detail Status
        </Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {trackingStatuses.map((item, index) => (
            <TrackingStatusItem
              key={index}
              status={item.status}
              location={item.location}
              isCurrent={item.isCurrent}
              isLast={index === trackingStatuses.length - 1}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

export default LiveTrackingScreen;
