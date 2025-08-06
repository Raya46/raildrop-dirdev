import { FontAwesome } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileOptionItemProps {
  iconName: ComponentProps<typeof FontAwesome>["name"];
  label: string;
  onPress: () => void;
}

const ProfileOptionItem: React.FC<ProfileOptionItemProps> = ({
  iconName,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-2 rounded-xl"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <FontAwesome
          name={iconName}
          size={24}
          color={""}
          className="mr-3"
        />
        <Text style={{ fontFamily: "Inter-Regular" }} className="text-lg">
          {label}
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="gray" />
    </TouchableOpacity>
  );
};

export default ProfileOptionItem;