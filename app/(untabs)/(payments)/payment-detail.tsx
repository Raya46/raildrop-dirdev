import { useAuth } from "@/context/AuthContext";
import { useUpdatePackage } from "@/hooks/usePackage";
import {
  useGetTransactionById,
  useUpdateTransactionStatus,
} from "@/hooks/useTransaction";
import {
  useGetUserById,
  useUpdateUserBalance,
  useUpdateUserPin,
} from "@/hooks/useUser";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PinInput from "../../../components/PinInput";

const PaymentDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { transactionId } = params;

  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [isPinSetupModalVisible, setPinSetupModalVisible] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const { userData } = useAuth();
  const { data: userBalanceData, isLoading: isLoadingUserBalance } =
    useGetUserById(userData?.id || "");
  const { data: transactionData, isLoading: isLoadingTransaction } =
    useGetTransactionById(transactionId as string);

  const { mutateAsync: updateTransactionStatus } = useUpdateTransactionStatus();
  const { mutateAsync: updateUserBalance } = useUpdateUserBalance();
  const { mutateAsync: updatePackageStatus } = useUpdatePackage();
  const { mutateAsync: updateUserPin, isPending: isUpdatingPin } =
    useUpdateUserPin();

  useEffect(() => {
    if (userData && userData.pin === null) {
      setPinSetupModalVisible(true);
    }
  }, [userData]);

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 6) {
      setPin((prev) => prev + key);
    }
  };

  const handleSavePin = async () => {
    if (newPin.length !== 6) {
      Alert.alert("Invalid PIN", "PIN must be 6 digits.");
      return;
    }
    if (newPin !== confirmNewPin) {
      Alert.alert("PIN Mismatch", "The PINs you entered do not match.");
      return;
    }
    if (!userData?.id) return;

    try {
      await updateUserPin({ userId: userData.id, pin: parseInt(newPin) });
      Alert.alert("Success", "Your PIN has been set successfully.");
      setPinSetupModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", `Failed to set PIN: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    if (pin.length !== 6) {
      Alert.alert("Error", "Please enter your 6-digit PIN.");
      return;
    }
    if (userData?.pin !== parseInt(pin)) {
      Alert.alert("Error", "Incorrect PIN.");
      return;
    }
    if (!transactionData || !userBalanceData) {
      Alert.alert("Error", "Data is not loaded yet.");
      return;
    }
    if (userBalanceData.balance < transactionData.amount) {
      Alert.alert("Error", "Insufficient balance.");
      return;
    }

    setIsProcessing(true);
    try {
      await updateTransactionStatus({
        transactionId: transactionId as string,
        status: "completed",
      });
      if (transactionData.package_id) {
        await updatePackageStatus({
          id: transactionData.package_id as string,
          status: "awaiting_dropoff",
        });
      }
      await updateUserBalance({
        userId: userData.id as string,
        newBalance: userBalanceData.balance - transactionData.amount,
      });
      Alert.alert("Success", "Payment completed successfully.");
      router.replace({
        pathname: "/payment-result",
        params: {
          packageId: transactionData.package_id,
        },
      });
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = isLoadingUserBalance || isLoadingTransaction;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Payment Detail",
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
      <ScrollView className="p-4">
        <View
          className="rounded-xl p-4 my-4 flex-row items-center justify-between"
          style={{ backgroundColor: "#D9E4F0" }}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="credit-card"
              size={24}
              color={"#004C98"}
              className="mr-3"
            />
            <View>
              <Text
                style={{ fontFamily: "Inter-Regular" }}
                className="text-gray-600"
              >
                Active Balance
              </Text>
              <Text
                style={{ fontFamily: "Inter-Bold", color: "#004C98" }}
                className="text-xl font-bold"
              >
                {isLoadingUserBalance
                  ? "Loading..."
                  : `Rp${
                      userBalanceData?.balance?.toLocaleString("id-ID") || "0"
                    }`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: "#004C98" }}
            onPress={() => router.push("/topup")}
          >
            <Text style={{ fontFamily: "Inter-Bold" }} className="text-white">
              Top Up +
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{ fontFamily: "Inter-Regular" }}
          className="text-gray-700 text-lg mt-4"
        >
          Total Payment
        </Text>
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-4xl font-bold mb-8"
        >
          {isLoading
            ? "Loading..."
            : `Rp${transactionData?.amount?.toLocaleString("id-ID") || "0"}`}
        </Text>

        {/* Input PIN */}
        <View className="mb-8 bg-gray-100 rounded-lg p-4">
          <Text
            style={{ fontFamily: "Inter-Regular" }}
            className="text-gray-600 mb-2 text-center"
          >
            Input your 6 Digit PIN
          </Text>
          <PinInput pin={pin} setPin={setPin} maxLength={6} />
        </View>

        {/* Keypad */}
        <View className="flex-row flex-wrap justify-around">
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ",",
            "0",
            "backspace",
          ].map((key) => (
            <TouchableOpacity
              key={key}
              className="w-1/3 items-center justify-center py-4"
              onPress={() => handleKeyPress(key)}
            >
              {key === "backspace" ? (
                <FontAwesome name="long-arrow-left" size={28} color="black" />
              ) : (
                <Text
                  style={{ fontFamily: "Inter-Regular" }}
                  className="text-3xl"
                >
                  {key}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tombol Bayar */}
        <TouchableOpacity
          className="w-full p-4 rounded-xl items-center mt-8 flex-row justify-center"
          style={{
            backgroundColor: "#004C98",
            opacity: isProcessing || isLoading ? 0.5 : 1,
          }}
          onPress={handlePayment}
          disabled={isProcessing || isLoading}
        >
          {isProcessing && (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          )}
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            {isProcessing ? "Processing..." : "Pay"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal untuk Setup PIN */}
      <Modal
        visible={isPinSetupModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View className="flex-1 justify-center items-center bg-black/60 p-5">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text
              style={{ fontFamily: "Inter-Bold" }}
              className="text-xl text-center mb-2"
            >
              Setup Your Security PIN
            </Text>
            <Text
              style={{ fontFamily: "Inter-Regular" }}
              className="text-gray-600 text-center mb-6"
            >
              You need to set a 6-digit PIN before you can make a payment.
            </Text>
            <Text className="text-gray-500 mb-1 ml-1">Enter New PIN</Text>
            <PinInput pin={newPin} setPin={setNewPin} maxLength={6} />
            <Text className="text-gray-500 mb-1 ml-1 mt-4">
              Confirm New PIN
            </Text>
            <PinInput
              pin={confirmNewPin}
              setPin={setConfirmNewPin}
              maxLength={6}
            />
            <TouchableOpacity
              className="w-full p-4 rounded-xl items-center mt-8 flex-row justify-center"
              style={{
                backgroundColor: "#004C98",
                opacity: isUpdatingPin ? 0.5 : 1,
              }}
              onPress={handleSavePin}
              disabled={isUpdatingPin}
            >
              {isUpdatingPin && (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="mr-2"
                />
              )}
              <Text
                style={{ fontFamily: "Inter-Bold" }}
                className="text-white text-lg"
              >
                {isUpdatingPin ? "Saving..." : "Save PIN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentDetailScreen;
