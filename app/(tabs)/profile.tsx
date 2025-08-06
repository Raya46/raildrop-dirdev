import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const Profile = () => {
  return (
    <SafeAreaView className="flex-1 flex flex-col bg-white justify-center">
      <View className="mx-4">
        <View className="flex flex-row items-center my-4 bg-[#D9E4F0] rounded-lg gap-10 py-3 border border-[#B0C8DF]">
          <View className="flex flex-row items-center gap-3">
            <Image
              source={require("@/assets/images/profile-mock.png")}
              className="w-[73px] h-[73px] ml-4"
            />
            <View className="flex flex-col">
              <Text>Indy Agustin</Text>
              <Text>indyagustin123@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="rounded-full bg-[#D9E4F0] p-2"
          >
            <Feather name="edit-3" color={"#003D7A"} size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col gap-4 my-4">
          <View className="flex flex-row justify-between">
            <Text>Nama Pengguna:</Text>
            <Text>Indy Agustin</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text>Email:</Text>
            <Text>Indygustin@gmail.com</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text>No Telepon:</Text>
            <Text>08878876554</Text>
          </View>
          <Text>Alamat:</Text>
          <Text>
            Jalan Gang Haji Ipin No. 11 , Pangkalan Jati, Cinere, Kota Depok,
            Jawa Barat 16514
          </Text>
        </View>
        <View className="flex flex-col rounded-lg mt-4 py-6 px-4 bg-[#D9E4F0] border border-[#B0C8DF] gap-8">
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <Feather name="bell" size={24} color={"black"} />
              <Text>Notification</Text>
            </View>
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <Feather name="settings" size={24} color={"black"} />
              <Text>Privacy and Security</Text>
            </View>
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <Feather name="globe" size={24} color={"black"} />
              <Text>Language</Text>
            </View>
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <AntDesign name="questioncircleo" size={24} color="black" />
              <Text>Report</Text>
            </View>
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <SimpleLineIcons name="logout" size={24} color="black" />
              <Text>Logout</Text>
            </View>
            <Feather name="chevron-right" size={24} color={"black"} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
