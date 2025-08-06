import OrderCard from "@/components/OrderCard";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Order = () => {
  return (
    <View className="flex flex-col">
      <View className="bg-[#004C98]">
        <Text className="text-white text-center py-7">My Orders</Text>
      </View>
      <View className="flex flex-row justify-center gap-6 mx-1 my-2">
        <View className="flex flex-row items-center gap-2">
          <Text>All</Text>
          <Text className="bg-[#B0C8DF] rounded-full px-3 py-1">2</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text>In Transit</Text>
          <Text className="bg-[#B0C8DF] rounded-full px-3 py-1">2</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text>Pick Up</Text>
          <Text className="bg-[#B0C8DF] rounded-full px-3 py-1">2</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text>Completed</Text>
          <Text className="bg-[#B0C8DF] rounded-full px-3 py-1">2</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mx-4 mt-4 mb-28"
      >
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </ScrollView>
    </View>
  );
};

export default Order;
