import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const NotificationPage = () => {
  return (
    <View>
      <View className="flex flex-row items-center justify-between bg-[#004C98] p-4">
        <Ionicons
          onPress={() => router.replace("/home")}
          name="arrow-back"
          size={24}
          color={"white"}
        />
        <Text className="text-white">Notification</Text>
        <View></View>
      </View>
      <ScrollView>
        <Text>Today, 20 June 2025</Text>
      </ScrollView>
    </View>
  );
};

export default NotificationPage;
