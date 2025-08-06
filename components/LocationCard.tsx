import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

const LocationCard = () => {
  return (
    <View className="flex flex-row bg-white mx-4 rounded-lg p-4 mt-4 justify-between">
      <View className="flex flex-row items-center gap-3">
        <MaterialCommunityIcons
          name="locker-multiple"
          size={24}
          color="black"
        />
        <View className="flex flex-col">
          <Text>Stasiun Serpong</Text>
          <View className="flex flex-row">
            <Text>Available: </Text>
            <Text>5 Lockers</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row gap-1">
        <FontAwesome6
          name="location-pin"
          size={12}
          color={"#9CA3AF"}
          className="mt-1"
        />
        <Text>450 m</Text>
      </View>
    </View>
  );
};

export default LocationCard;
