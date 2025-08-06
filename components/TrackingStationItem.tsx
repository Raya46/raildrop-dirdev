import React from "react";
import { Text, View } from "react-native";

interface TrackingStatusItemProps {
  status: string;
  location: string;
  isCurrent: boolean;
  isLast: boolean;
}

const TrackingStatusItem: React.FC<TrackingStatusItemProps> = ({
  status,
  location,
  isCurrent,
  isLast,
}) => {
  return (
    <View className="flex-row mb-4">
      <View className="items-center mr-3">
        <View
          className={`w-3 h-3 rounded-full ${isCurrent ? "bg-green-500" : "bg-gray-400"}`}
        />
        {!isLast && (
          <View
            className={`w-px flex-1 ${isCurrent ? "bg-green-500" : "bg-gray-400"}`}
          />
        )}
      </View>
      <View>
        <Text
          style={{ fontFamily: "Inter-Regular" }}
          className={`text-base ${isCurrent ? "text-gray-900" : "text-gray-600"}`}
        >
          {status}
        </Text>
        <Text style={{ fontFamily: "Inter-Bold" }} className="text-base">
          {location}
        </Text>
      </View>
    </View>
  );
};

export default TrackingStatusItem;