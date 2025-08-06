import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const EditProfile = () => {
  return (
    <View className="flex flex-col">
      <View className="flex flex-row items-center justify-between bg-[#004C98] p-4">
        <Ionicons
          onPress={() => router.replace("/profile")}
          name="arrow-back"
          size={24}
          color={"white"}
        />
        <Text className="text-white">Edit Profile</Text>
        <View></View>
      </View>
      <View className="flex flex-col items-center mt-8 gap-4">
        <Image
          source={require("@/assets/images/profile-mock.png")}
          className="w-[73px] h-[73px]"
        />
        <Text>Edit Your Profile</Text>
      </View>
      <Text className="mx-3 mt-4">Profile Information</Text>
      <View className="flex flex-col mx-3 rounded-lg mt-4 py-6 px-4 bg-[#D9E4F0] border border-[#B0C8DF] gap-8">
        <View className="flex flex-row justify-between">
          <View className="flex flex-row items-center gap-4">
            <Text>Name: Indy Agustin</Text>
          </View>
          <Feather name="chevron-right" size={24} color={"black"} />
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-row items-center gap-4">
            <Text>Email: indyagustin123@gmail.com</Text>
          </View>
          <Feather name="chevron-right" size={24} color={"black"} />
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-row items-center gap-4">
            <Text>Phone Number: 088701290412</Text>
          </View>
          <Feather name="chevron-right" size={24} color={"black"} />
        </View>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-col w-2/3">
            <Text>Address:</Text>
            <Text>
              Jalan Gang Haji Ipin No. 11 , Pangkalan Jati, Cinere, Kota Depok,
              Jawa Barat 16514
            </Text>
          </View>
          <View className="w-1/3 items-end">
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;

