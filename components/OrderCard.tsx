import { FontAwesome } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OrderCardProps {
  type: "inTransit" | "pickup";
  iconName: ComponentProps<typeof FontAwesome>["name"];
  iconBgColor: string;
  title: string;
  packageId: string;
  details: {
    label: string;
    value: string;
    icon?: ComponentProps<typeof FontAwesome>["name"];
  }[];
  statusText: string;
  statusBgColor: string;
  onPress?: () => void;
  isCurrentOrder?: boolean;
  titleProps?: {
    numberOfLines?: number;
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  };
}

const OrderCard: React.FC<OrderCardProps> = ({
  type,
  iconName,
  iconBgColor,
  title,
  packageId,
  details,
  statusText,
  statusBgColor,
  onPress,
  isCurrentOrder = false,
  titleProps,
}) => {
  return (
    <TouchableOpacity
      className="bg-[#D9E4F0] border border-[#B0C8DF] rounded-xl p-4 mx-4 my-2"
      onPress={onPress}
    >
      {isCurrentOrder && (
        <View className="flex flex-row items-center justify-between mb-4">
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-xl font-bold"
          >
            Current Order
          </Text>
          <TouchableOpacity
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: isCurrentOrder ? "#004C98" : statusBgColor,
            }}
          >
            <Text
              style={{ fontFamily: "Inter-Bold" }}
              className="text-white text-xs"
            >
              {statusText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: isCurrentOrder ? "#E6EDF5" : iconBgColor,
            }}
          >
            <FontAwesome
              name={iconName}
              size={24}
              color={isCurrentOrder ? "#004C98" : "white"}
            />
          </View>
          <View>
            <Text
              style={{ fontFamily: "Inter-Bold" }}
              className="text-lg"
              numberOfLines={titleProps?.numberOfLines}
              ellipsizeMode={titleProps?.ellipsizeMode}
            >
              {title}
            </Text>
            <View className="flex-row items-center">
              <FontAwesome
                name="barcode"
                size={14}
                color="gray"
                className="mr-1"
              />
              <Text
                style={{ fontFamily: "Inter-Regular" }}
                className="text-gray-600"
              >
                Package ID:{" "}
                {packageId.length > 5
                  ? `${packageId.substring(0, 5)}...`
                  : packageId}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {details.map((item, index) => (
        <View key={index} className="flex-row mb-2">
          <View className="w-6 items-center mr-2">
            {item.icon && (
              <FontAwesome name={item.icon} size={16} color="#004C98" />
            )}
            {(type === "inTransit" && item.label === "Estimated Arrival") ||
            (isCurrentOrder && item.label === "Estimated Arrival") ? (
              <View className="w-px h-8 bg-[#004C98] my-1" />
            ) : null}
          </View>
          <Text
            style={{ fontFamily: "Inter-Regular" }}
            className="text-gray-700"
          >
            {item.label}
          </Text>
          <Text style={{ fontFamily: "Inter-Bold" }} className="ml-auto">
            {item.value}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );
};

export default OrderCard;
