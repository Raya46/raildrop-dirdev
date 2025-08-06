import React from "react";
import { Text, View, ScrollView } from "react-native";

const PaymentDetail = () => {
  return (
    <ScrollView>
      <View className="flex flex-col justify-center">
        <Text className="text-2xl font-semibold mb-4">Payment Details</Text>
        <View className="flex flex-row items-center my-4 bg-[#D9E4F0] rounded-lg gap-10 py-3 border border-[#B0C8DF]">
          <View className="flex flex-row items-center gap-3">
            <Text>Package ID: #123456LKT</Text>
            <Text></Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentDetail;
