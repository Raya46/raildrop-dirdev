import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { User } from "@/types/users.type";

interface ProfileInfoCardProps {
  userData?: Partial<User> | null;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ userData }) => {
  return (
    <View
      className="bg-white rounded-xl p-4 mx-4 my-4 flex-row items-center"
    >
      <Image
        source={{
          uri:
            userData?.avatar_url ||
            "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
        }}
        className="w-16 h-16 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text style={{ fontFamily: "Inter-Bold" }} className="text-xl">
          {userData?.full_name || "-"}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular" }} className="text-gray-600">
          {userData?.email || "-"}
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/step1")}>
        <FontAwesome name="pencil" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileInfoCard;