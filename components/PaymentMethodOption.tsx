import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PaymentMethodOptionProps {
  methodName: string;
  iconUri?: string; // Optional for image-based icons
  fontAwesomeIcon?: string; // Optional for FontAwesome icons
  isSelected: boolean;
  onPress: () => void;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
  methodName,
  iconUri,
  fontAwesomeIcon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 mb-3 rounded-xl border ${isSelected ? "border-blue-500" : "border-gray-300"}`}
      style={{ backgroundColor: isSelected ? '' : "white" }}
      onPress={onPress}
    >
      <View className="w-12 h-12 items-center justify-center mr-3">
        {iconUri && (
          <Image
            source={{ uri: iconUri }}
            className="w-full h-full rounded-lg"
          />
        )}
        {fontAwesomeIcon && (
          <FontAwesome
            name={fontAwesomeIcon as any}
            size={30}
            color={''}
          />
        )}
      </View>
      <Text style={{ fontFamily: "Inter-Bold" }} className="text-lg flex-1">
        {methodName}
      </Text>
      {isSelected && (
        <FontAwesome name="check-circle" size={24} color="green" />
      )}
    </TouchableOpacity>
  );
};

export default PaymentMethodOption;