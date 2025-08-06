import { FontAwesome } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LockerSizeOptionProps {
  iconName: ComponentProps<typeof FontAwesome>["name"];
  size: string;
  dimensions: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}

const LockerSizeOption: React.FC<LockerSizeOptionProps> = ({
  iconName,
  size,
  dimensions,
  description,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 mb-3 rounded-xl border ${
        isSelected ? "border-blue-500" : "border-gray-300"
      }`}
      style={{ backgroundColor: isSelected ? "#E6EDF5" : "white" }}
      onPress={onPress}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: isSelected ? "#004C98" : "#E6EDF5" }}
      >
        <FontAwesome
          name={iconName}
          size={24}
          color={isSelected ? "white" : "#004C98"}
        />
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: "Inter-Bold" }} className="text-lg">
          {size}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular" }} className="text-gray-600">
          {dimensions}
        </Text>
        <Text
          style={{ fontFamily: "Inter-Regular" }}
          className="text-gray-500 text-xs mt-1"
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LockerSizeOption;
