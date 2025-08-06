import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const step4 = () => {
  return (
    <View className="flex-1 flex-col justify-between">
      <View className=" flex-1 flex-col justify-center">
        <Image
          source={require("@/assets/images/onboarding-success.png")}
          className="w-[300px] h-[300px] mr-[-10px]"
        />
        <View className="mx-auto">
          <Text className="text-center text-semibold text-xl">
            Your Profile is Ready!
          </Text>
          <Text className="opacity-60">
            From now on, you can enjoy all available features and explore the
            best experience with us.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="rounded-full w-full bg-blue-800 p-4 mt-4 mb-4"
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text className="text-white text-center text-semibold text-xl">
          Let{" ' "}s Start
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default step4;
