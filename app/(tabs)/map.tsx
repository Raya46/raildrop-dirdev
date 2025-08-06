import LocationCard from "@/components/LocationCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
const Map = () => {
  const [location, setLocation] = useState("");
  return (
    <View className="flex flex-col bg-gray-500">
      <View className="h-1/2 bg-gray-500"></View>
      <ScrollView className="bg-[#004C98] h-1/2 rounded-t-2xl">
        <View className="flex flex-row items-center mt-6 mr-4 ml-1">
          <TextInput
            onChangeText={(text) => setLocation(text)}
            className="p-4 rounded-md bg-white mx-4 flex-1"
            placeholder="Search location or town name"
          />
          <TouchableOpacity
            className="bg-white p-3 rounded-lg"
            onPress={() => console.log("find")}
          >
            <MaterialIcons name="filter-list" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <LocationCard />
        <LocationCard />
        <LocationCard />
        <LocationCard />
        <LocationCard />
        <LocationCard />
      </ScrollView>
    </View>
  );
};

export default Map;
