import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const Home = () => {
  const [location, setLocation] = useState("");
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
      <View className="flex flex-col gap-4 mx-4 mt-6">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-4">
            <Image
              source={require("@/assets/images/profile-mock.png")}
              className="w-[34px] h-[34px]"
            />
            <Text>Good Morning, Indy</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="rounded-full bg-[#D9E4F0] p-2"
          >
            <Feather name="bell" color={"#003D7A"} size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-between rounded-md border border-[#B0C8DF] p-3 bg-[#D9E4F0]">
          <View className="flex flex-row items-center gap-6">
            <Ionicons name="wallet" color={"#003D7A"} size={24} />
            <View className="flex flex-col">
              <Text>Active Balance</Text>
              <Text>Rp 150.000</Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex flex-row rounded-md bg-[#003972] px-4 py-2 items-center justify-between"
            onPress={() => router.push("/topup")}
          >
            <Text className="text-white">Top Up</Text>
            <Feather name="plus" color={"#fff"} size={18} className="ml-2" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col rounded-md bg-[#004C98] p-4">
          {/* map placeholder */}
          <View className="bg-gray-300 rounded-md py-16"></View>
          <TextInput
            onChangeText={(text) => setLocation(text)}
            className="p-4 rounded-md bg-white mt-6"
            placeholder="Search location or town name"
          />
        </View>
        <View className="flex flex-row py-3 px-6 justify-between border border-[#B0C8DF] rounded-md bg-[#D9E4F0]">
          <View className="flex flex-col items-center gap-2">
            <TouchableOpacity className="rounded-full bg-white p-2">
              <Feather name="package" size={24} color={"#004C98"} />
            </TouchableOpacity>
            <Text>Send</Text>
          </View>
          <View className="flex flex-col items-center gap-2">
            <TouchableOpacity className="rounded-full bg-white p-2">
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                color="#004C98"
              />
            </TouchableOpacity>
            <Text>Find</Text>
          </View>
          <View className="flex flex-col items-center gap-2">
            <TouchableOpacity className="rounded-full bg-white p-2">
              <FontAwesome5 name="map-marked-alt" size={24} color="#004C98" />
            </TouchableOpacity>
            <Text>Track</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
