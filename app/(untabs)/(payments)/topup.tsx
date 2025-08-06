import { useAuth } from "@/context/AuthContext";
import { useTopUpBalance } from "@/hooks/useTransaction";
import { mainColor } from "@/utils/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const topUpOptions = [50000, 100000, 200000, 500000];

const TopUpScreen = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const [amount, setAmount] = useState("");
  const { mutate: topUp, isPending } = useTopUpBalance();

  const handleTopUp = () => {
    const topUpAmount = parseInt(amount, 10);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid top-up amount.");
      return;
    }

    topUp(
      { amount: topUpAmount },
      {
        onSuccess: () => {
          Alert.alert(
            "Success",
            `Successfully topped up Rp${topUpAmount.toLocaleString("id-ID")}.`
          );
          setAmount(""); // Reset input
          router.back(); // Kembali ke halaman sebelumnya
        },
        onError: (error) => {
          Alert.alert("Top-Up Failed", error.message);
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Top Up Balance",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: mainColor },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="p-5">
        {/* Current Balance Display */}
        <View className="mb-8 p-6 rounded-xl bg-white shadow-sm border border-gray-200">
          <Text
            style={{ fontFamily: "Inter-Regular" }}
            className="text-gray-500 text-base"
          >
            Current Balance
          </Text>
          <Text style={{ fontFamily: "Inter-Bold" }} className="text-4xl mt-1">
            Rp{userData?.balance?.toLocaleString("id-ID") ?? "0"}
          </Text>
        </View>

        {/* Top-Up Options */}
        <Text style={{ fontFamily: "Inter-SemiBold" }} className="text-lg mb-3">
          Choose Amount
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {topUpOptions.map((option) => (
            <TouchableOpacity
              key={option}
              className="w-[48%] bg-white border-2 border-gray-200 rounded-lg p-4 mb-3 items-center"
              style={
                amount === String(option) ? { borderColor: mainColor } : {}
              }
              onPress={() => setAmount(String(option))}
            >
              <Text style={{ fontFamily: "Inter-Bold" }} className="text-base">
                Rp{option.toLocaleString("id-ID")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount Input */}
        <Text style={{ fontFamily: "Inter-SemiBold" }} className="text-lg mb-3">
          Or Enter Custom Amount
        </Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-8 border-2 border-gray-200 focus:border-blue-500">
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-lg text-gray-500 mr-2"
          >
            Rp
          </Text>
          <TextInput
            className="flex-1 text-lg"
            placeholder="0"
            placeholderTextColor="#ccc"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            style={{ fontFamily: "Inter-Bold" }}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className={`w-full p-4 rounded-xl items-center flex-row justify-center ${isPending ? "opacity-50" : ""}`}
          style={{ backgroundColor: mainColor }}
          onPress={handleTopUp}
          disabled={isPending}
        >
          {isPending && (
            <ActivityIndicator size="small" color="white" className="mr-3" />
          )}
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            {isPending ? "Processing..." : "Top Up Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopUpScreen;