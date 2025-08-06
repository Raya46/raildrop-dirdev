import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { type ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";


interface ActionButtonProps {
  iconName: ComponentProps<typeof FontAwesome>["name"];
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  label,
  onPress,
}) => (
  <TouchableOpacity className="items-center flex-1" onPress={onPress}>
    <View
      className="w-16 h-16 rounded-xl items-center justify-center mb-2"
      
    >
      <FontAwesome name={iconName} size={24} />
    </View>
    <Text style={{ fontFamily: "Inter-Regular" }} className="text-gray-700">
      {label}
    </Text>
  </TouchableOpacity>
);

const ActionButtons = () => {
  return (
    <View className="flex-row justify-around mx-4 my-4 p-4 rounded-xl bg-white">
      <ActionButton
        iconName="send"
        label="Send"
        onPress={() => router.push('/')}
      />
      <ActionButton
        iconName="map-marker"
        label="Find"
        onPress={() => router.push('/')}
      />
      <ActionButton
        iconName="truck"
        label="Track"
        onPress={() => console.log("Track")}
      />
    </View>
  );
};

export default ActionButtons;