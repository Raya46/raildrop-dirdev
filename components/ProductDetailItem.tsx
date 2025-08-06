import React from "react";
import { Image, Text, View } from "react-native";

interface ProductDetailItemProps {
  imageUri: string;
  productName: string;
  price: string;
  quantity: number;
}

const ProductDetailItem: React.FC<ProductDetailItemProps> = ({
  imageUri,
  productName,
  price,
  quantity,
}) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: imageUri }}
          className="w-16 h-16 rounded-lg mr-3"
        />
        <View>
          <Text style={{ fontFamily: "Inter-Bold" }} className="text-lg">
            {productName}
          </Text>
          <Text
            style={{ fontFamily: "Inter-Regular" }}
            className="text-gray-600"
          >
            {price}
          </Text>
        </View>
      </View>
      <Text style={{ fontFamily: "Inter-Bold" }} className="text-lg">
        x{quantity}
      </Text>
    </View>
  );
};

export default ProductDetailItem;