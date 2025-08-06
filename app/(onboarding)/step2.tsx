import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Step2 = () => {
  const [note, setNote] = useState("");
  const [labelAddress, setLabelAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  return (
    <View className="flex-1 flex flex-col justify-center mx-4">
        <View className="flex justify-center ml-8">
            <Image
                source={require("@/assets/images/onboarding.png")}
                className="w-[300px] h-[300px]"
            />
        </View>
        <Text className="text-3xl font-bold text-center mt-4">
            Enter Your Address :{" "}
        </Text>
        <TextInput
            onChangeText={(text) => setFullAddress(text)}
            className="p-4 rounded-md bg-[#D9E4F0] mt-4"
            placeholder="Full Address"
        />
        <TextInput
            onChangeText={(text) => setNote(text)}
            className="p-4 rounded-md bg-[#D9E4F0] mt-4"
            placeholder="Note"
        />
        <TextInput
            onChangeText={(text) => setLabelAddress(text)}
            className="p-4 rounded-md bg-[#D9E4F0] mt-4"
            placeholder="Label Address"
        />
        
        <View className="flex mt-4 justify-center mx-4 ">
               
            <Text className="opacity-60">By clicking the button below, you acknowledge that you have read and agreed to the terms and conditions.</Text>
        </View>

        <TouchableOpacity
            className="rounded-full w-full bg-blue-800 p-4 mt-4"
            onPress={() => router.push("/(onboarding)/step3")}
        >
            <Text className="text-white text-center text-semibold text-xl">
            Submit
            </Text>
        </TouchableOpacity>
    </View>
  );
};

export default Step2;
