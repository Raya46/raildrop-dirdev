import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OrderTabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

const OrderTabButton: React.FC<OrderTabButtonProps> = ({
  label,
  count,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-2 py-0 mr-2`}
      onPress={onPress}
      style={{ alignItems: "center", backgroundColor: "transparent" }}
    >
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontFamily: isActive ? "Inter-Bold" : "Inter-Regular",
            color: isActive ? "#004C98" : "#B0B8C1",
            fontSize: 15,
          }}
        >
          {label}
        </Text>
        {isActive && (
          <View
            style={{
              height: 3,
              width: "70%",
              backgroundColor: "#f59e42",
              borderRadius: 2,
              marginTop: 2,
              alignSelf: "center",
            }}
          />
        )}
      </View>
      {count > 0 && (
        <View
          style={{
            marginLeft: 8,
            backgroundColor: isActive ? "#f59e42" : "#d1d5db",
            borderRadius: 9999,
            minWidth: 16,
            minHeight: 16,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 4,
            paddingVertical: 1,
          }}
        >
          <Text
            style={{ fontFamily: "Inter-Bold", fontSize: 11, color: "white" }}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderTabButton;
