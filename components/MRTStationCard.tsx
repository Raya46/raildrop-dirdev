import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MRTStationCardProps {
  stationName: string;
  distance: string;
  availableLockers: number;
  onPress: () => void;
}

const MRTStationCard: React.FC<MRTStationCardProps> = ({
  stationName,
  distance,
  availableLockers,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            backgroundColor: "#b0c8df",
          }}
        >
          <FontAwesome name="building" size={24} />
        </View>
        <View>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 16 }}>
            {stationName}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: "Inter-Regular", color: "#666" }}>
              Available:{" "}
            </Text>
            <Text style={{ color: "#22c55e", fontWeight: "bold" }}>
              {availableLockers} Lockers
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome
              name="map-marker"
              size={16}
              color="gray"
              style={{ marginRight: 4 }}
            />
            <Text style={{ fontFamily: "Inter-Regular", color: "#666" }}>
              {distance}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MRTStationCard;
