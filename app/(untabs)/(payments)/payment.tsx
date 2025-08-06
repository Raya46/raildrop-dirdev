import { useCreateTransaction } from "@/hooks/useTransaction";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PaymentMethodOption from "../../../components/PaymentMethodOption";

const paymentMethods = [
  {
    name: "Credit Card",
    value: "payment_gateway",
    icon: "credit-card",
  },
  {
    name: "Bank Transfer",
    value: "payment_gateway",
    icon: "bank",
  },
  {
    name: "E-Wallet",
    value: "payment_gateway",
    icon: "mobile",
  },
  {
    name: "Raildrop Balance",
    value: "wallet_balance",
    icon: "money",
  },
];

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { lockerSize, pickupTime, promoCode, totalPayment, packageId } = params;

  const [selectedMethodName, setSelectedMethodName] = useState("");

  const parsedTotalPayment = parseFloat((totalPayment as string) || "0");
  const shippingFee = 10000;
  const grandTotal = parsedTotalPayment + shippingFee;

  const handlePayNow = () => {
    if (!selectedMethodName) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }
    if (!packageId) {
      Alert.alert("Error", "Package ID not found.");
      return;
    }

    const selectedMethod = paymentMethods.find(
      (m) => m.name === selectedMethodName
    );
    if (!selectedMethod) {
      Alert.alert("Error", "Invalid payment method selected.");
      return;
    }

    createTransaction(
      {
        package_id: packageId as string,
        amount: grandTotal,
        payment_method: selectedMethod.value as any,
      },
      {
        onSuccess: (data) => {
          Alert.alert("Success", "Payment successful!");

          router.replace({
            pathname: "/payment-detail",
            params: { transactionId: data.id, package_id: packageId },
          });
        },
        onError: (err: any) => {
          Alert.alert("Payment Failed", err.message);
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Payment",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#004C98" },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-xl font-bold mb-4"
        >
          Payment Details
        </Text>
        <View className="flex flex-col gap-2 mb-8">
          <View className="flex flex-row items-center p-4 rounded-lg bg-gray-100 border border-gray-200">
            <Ionicons
              name="cube-outline"
              color={"#004C98"}
              size={20}
              className="mr-3"
            />
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="text-gray-600"
            >
              Locker Size:{" "}
            </Text>
            <Text
              style={{ fontFamily: "Inter-Bold" }}
              className="text-gray-900"
            >
              {lockerSize}
            </Text>
          </View>
          <View className="flex flex-row items-center p-4 rounded-lg bg-gray-100 border border-gray-200">
            <Ionicons
              name="time-outline"
              color={"#004C98"}
              size={20}
              className="mr-3"
            />
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="text-gray-600"
            >
              Pickup Time:{" "}
            </Text>
            <Text
              style={{ fontFamily: "Inter-Bold" }}
              className="text-gray-900"
            >
              {pickupTime}
            </Text>
          </View>
          {promoCode && (
            <View className="flex flex-row items-center p-4 rounded-lg bg-gray-100 border border-gray-200">
              <Ionicons
                name="pricetag-outline"
                color={"#004C98"}
                size={20}
                className="mr-3"
              />
              <Text
                style={{ fontFamily: "Inter-Regular" }}
                className="text-gray-600"
              >
                Promo Code:{" "}
              </Text>
              <Text
                style={{ fontFamily: "Inter-Bold" }}
                className="text-gray-900"
              >
                {promoCode}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-xl font-bold mb-4"
        >
          Summary
        </Text>
        <View
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "#E6EDF5" }}
        >
          <View className="flex-row justify-between mb-2">
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="text-gray-700"
            >
              Base Payment:
            </Text>
            <Text style={{ fontFamily: "Inter-Bold" }} className="text-base">
              Rp{parsedTotalPayment.toLocaleString("id-ID")}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="text-gray-700"
            >
              Shipping Fee:
            </Text>
            <Text style={{ fontFamily: "Inter-Bold" }} className="text-base">
              Rp{shippingFee.toLocaleString("id-ID")}
            </Text>
          </View>
          <View className="border-t border-gray-300 my-3" />
          <View className="flex-row justify-between">
            <Text style={{ fontFamily: "Inter-Bold" }} className="text-lg">
              Grand Total:
            </Text>
            <Text
              style={{ fontFamily: "Inter-Bold", color: "#004C98" }}
              className="text-xl"
            >
              Rp{grandTotal.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-xl font-bold mb-4"
        >
          Payment Method
        </Text>
        {paymentMethods.map((method, index) => (
          <PaymentMethodOption
            key={index}
            methodName={method.name}
            fontAwesomeIcon={method.icon}
            isSelected={selectedMethodName === method.name}
            onPress={() => setSelectedMethodName(method.name)}
          />
        ))}

        <TouchableOpacity
          className={`w-full p-4 rounded-xl items-center my-6 flex-row justify-center ${
            isPending ? "opacity-50" : ""
          }`}
          style={{ backgroundColor: "#004C98" }}
          onPress={handlePayNow}
          disabled={isPending}
        >
          {isPending && (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          )}
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            {isPending ? "Processing..." : "Pay Now"}
          </Text>
        </TouchableOpacity>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
