import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { lightColor, mainColor } from "../../../utils/colors";

const PaymentResultScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Payment Status",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: mainColor,
          },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="p-4">
        <View
          className="w-32 h-32 rounded-full border-4 self-center items-center justify-center mt-8 mb-6"
          style={{ borderColor: mainColor }}
        >
          <FontAwesome name="check" size={80} color={mainColor} />
        </View>
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-3xl font-bold mb-2 text-center"
        >
          Payment Successful!
        </Text>
        <Text
          style={{ fontFamily: "Inter-Regular" }}
          className="text-gray-600 text-center mb-8"
        >
          Your transaction has been successfully processed.
        </Text>
        <View
          className="bg-white rounded-xl p-4 my-4 w-full"
          style={{ backgroundColor: lightColor }}
        >
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-xl font-bold mb-4"
          >
            What&apos;s Next?
          </Text>
          <View className="flex-row items-start mb-4">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: "#FFD700" }}
            >
              <FontAwesome name="cube" size={20} color="white" />
            </View>
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="flex-1 text-gray-700"
            >
              Your package is now ready to be dropped off at the selected
              station.
            </Text>
          </View>
          <View className="flex-row items-start">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: "#32CD32" }}
            >
              <FontAwesome name="qrcode" size={20} color="white" />
            </View>
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="flex-1 text-gray-700"
            >
              Share the QR code with the recipient for them to pick up their
              package.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-full p-4 rounded-xl items-center mt-8 mb-4"
          style={{ backgroundColor: mainColor }}
          onPress={() => router.push("/live-tracking")}
        >
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full p-4 rounded-xl items-center border-2"
          style={{ borderColor: mainColor }}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text
            style={{ fontFamily: "Inter-Bold", color: mainColor }}
            className="text-lg"
          >
            Back To Home
          </Text>
        </TouchableOpacity>
        <View className="h-20" /> {/* Spacer for bottom navigation */}
      </ScrollView>
    </View>
  );
};

export default PaymentResultScreen;