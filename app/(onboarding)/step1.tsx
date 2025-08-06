import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Step1 = () => {
  const [phone, setPhone] = useState("");
  return (
    <View className="flex-1 flex flex-col justify-center mx-4">
      <Image
        source={require("@/assets/images/onboarding.png")}
        className="w-[300px] h-[300px]"
      />
      <Text className="text-3xl font-bold text-center mt-4">
        Enter Your Phone Number:{" "}
      </Text>
      <TextInput
        onChangeText={(text) => setPhone(text)}
        className="p-4 rounded-md bg-[#D9E4F0] mt-4"
        placeholder="Phone Number"
      />
      <TouchableOpacity
        className="rounded-full w-full bg-blue-800 p-4"
        onPress={() => router.push("/(onboarding)/step2")}
      >
        <Text className="text-white text-center text-semibold text-xl">
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Step1;
