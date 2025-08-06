import PinInput from "@/components/PinInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Step3 = () => {
  const [pin, setPin] = useState("");

  return (
    <View className="flex-1 flex flex-col justify-center mx-4">
      <View className="flex justify-center ml-8">
        <Image
          source={require("@/assets/images/onboarding.png")}
          className="w-[300px] h-[300px]"
        />
      </View>
      <Text>Enter your PIN</Text>
      <PinInput maxLength={6} pin={pin} setPin={setPin} />

      <TouchableOpacity
        className="rounded-full w-full bg-blue-800 p-4 mt-4"
        onPress={() => router.push("/(onboarding)/step4")}
      >
        <Text className="text-white text-center text-semibold text-xl">
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Step3;
