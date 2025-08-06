import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const OrderCard = () => {
  return (
    <View className="flex flex-col bg-[#D9E4F0] border border-[#B0C8DF] p-3 rounded-lg mb-4">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require("@/assets/images/shopee-logo.png")}
            className="w-[40px] h-[40px]"
          />
          <View className="flex flex-col">
            <Text>Shopee Products</Text>
            <Text className="mt-1">Package ID: #789123VRX</Text>
          </View>
        </View>
        <TouchableOpacity
          className="flex flex-row rounded-md bg-[#003972] px-4 py-2 items-center justify-between"
          onPress={() => router.push("/topup")}
        >
          <MaterialIcons
            name="train"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-white">In Transit</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row justify-between mt-4">
        <View className="flex flex-col gap-2">
          <View className="flex flex-row gap-2">
            <Feather
              name="calendar"
              size={24}
              color={"blue"}
              className="rounded-full bg-white p-2"
            />
            <View className="flex flex-col">
              <Text>Estimated Arrival</Text>
              <Text>29 Sep 2024</Text>
            </View>
          </View>
          <View className="flex flex-row gap-2">
            <Feather
              name="clock"
              size={24}
              color={"blue"}
              className="rounded-full bg-white p-2"
            />
            <View className="flex flex-col">
              <Text>Time</Text>
              <Text>02:00 PM</Text>
            </View>
          </View>
        </View>
        <View className="flex flex-row gap-3">
          <View className="flex flex-col items-center mt-2">
            <View className="rounded-full p-1 bg-gray-400"></View>
            <View className="bg-gray-400 h-11 w-0.5"></View>
            <View className="rounded-full p-1 bg-gray-400"></View>
          </View>
          <View className="flex flex-col gap-2">
            <View className="flex flex-col">
              <Text>From</Text>
              <Text>BSD Serpong</Text>
            </View>
            <View className="flex flex-row gap-2">
              <View className="flex flex-col">
                <Text>To</Text>
                <Text>Stasiun Serpong</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
