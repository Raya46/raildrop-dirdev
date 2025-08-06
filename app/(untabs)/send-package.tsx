import { useAuth } from "@/context/AuthContext";
import LockerSizeOption from "@/hooks/LockerSizeOption";
import { useGetLockersByStation } from "@/hooks/useLocker";
import { getUserByEmail, useCreatePackage } from "@/hooks/usePackage";
import { FontAwesome } from "@expo/vector-icons";
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const lockerDetailsMap = {
  small: {
    size: "Small",
    dimensions: "30 cm x 30 cm x 30 cm",
    description: "Fits small packages (e.g., documents, small electronics).",
    iconName: "envelope" as const,
  },
  medium: {
    size: "Medium",
    dimensions: "50 cm x 50 cm x 50 cm.",
    description: "Ideal for medium packages (e.g., shoebox, small parcels).",
    iconName: "archive" as const,
  },
  large: {
    size: "Large",
    dimensions: "70 cm x 70 cm x 70 cm",
    description:
      "Suitable for larger packages (e.g., bulky items, larger boxes).",
    iconName: "dropbox" as const,
  },
};

const SendPackageScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { userData } = useAuth();

  const [selectedLockerSize, setSelectedLockerSize] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [description, setDescription] = useState("");

  const destinationStationId = params.destination_station_id as string;

  const { data: lockersAtStation, isLoading: isLoadingLockers } =
    useGetLockersByStation(destinationStationId);

  const createPackageMutation = useCreatePackage();

  const availableLockers = useMemo(() => {
    if (!lockersAtStation) return [];
    return lockersAtStation.filter((locker) => locker.status === "available");
  }, [lockersAtStation]);

  const availableSizes = useMemo(() => {
    if (!availableLockers) return [];
    const sizes = new Set(availableLockers.map((locker) => locker.size));
    return Array.from(sizes);
  }, [availableLockers]);

  const calculateTotalPayment = React.useCallback(() => {
    let basePrice = 0;
    switch (selectedLockerSize) {
      case "small":
        basePrice = 5000;
        break;
      case "medium":
        basePrice = 7500;
        break;
      case "large":
        basePrice = 10000;
        break;
      default:
        basePrice = 0;
    }

    const shippingFee = 10000;
    let finalPrice = basePrice + shippingFee;

    if (promoCode.toUpperCase() === "RAILDROP10" && finalPrice > 0) {
      finalPrice *= 0.9;
    }
    setTotalPayment(finalPrice);
  }, [selectedLockerSize, promoCode]);

  useEffect(() => {
    calculateTotalPayment();
  }, [selectedLockerSize, pickupTime, promoCode, calculateTotalPayment]);

  // const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  //   if (Platform.OS === "android") {
  //     setShowDatePicker(false);
  //   }
  //   if (event.type === "set" && selectedDate) {
  //     setDate(selectedDate);
  //     if (Platform.OS === "android") {
  //       setPickupTime(selectedDate.toLocaleString("id-ID", { hour12: false }));
  //     }
  //   }
  // };

  const confirmIosDate = () => {
    setPickupTime(date.toLocaleString("id-ID", { hour12: false }));
    setShowDatePicker(false);
  };

  const handleConfirmPayment = async () => {
    if (!selectedLockerSize) {
      Alert.alert("Error", "Please select a locker size.");
      return;
    }

    const selectedLocker = availableLockers?.find(
      (l) => l.size === selectedLockerSize
    );
    if (!selectedLocker) {
      Alert.alert(
        "Error",
        "Selected locker size is no longer available. Please choose another size."
      );
      return;
    }

    try {
      const receiver = await getUserByEmail(receiverEmail);
      if (!receiver) {
        Alert.alert("Error", "Receiver email not found.");
        return;
      }

      const newPackage = await createPackageMutation.mutateAsync({
        destination_station_id: destinationStationId,
        description: description,
        size: selectedLockerSize as any,
        receiver_id: receiver.id,
        locker_id: selectedLocker.id as string,
      });

      router.push({
        pathname: "/payment",
        params: {
          lockerSize: selectedLockerSize,
          pickupTime: pickupTime,
          promoCode: promoCode,
          totalPayment: totalPayment,
          packageId: newPackage.id,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Send Package",
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
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg font-bold mb-3"
        >
          Sender Details
        </Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <FontAwesome name="user" size={20} color="gray" className="mr-3" />
          <TextInput
            className="flex-1 text-base text-gray-500"
            value={userData?.email || ""}
            editable={false}
          />
        </View>
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg font-bold mb-3"
        >
          Receiver Details
        </Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-4 border border-gray-300">
          <FontAwesome
            name="envelope"
            size={20}
            color="gray"
            className="mr-3"
          />
          <TextInput
            className="flex-1 text-base"
            placeholder="Receiver Email"
            placeholderTextColor="#888"
            value={receiverEmail}
            onChangeText={setReceiverEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="flex-row items-start bg-white rounded-xl px-4 py-3 mb-4 border border-gray-300">
          <FontAwesome
            name="file-text"
            size={20}
            color="gray"
            className="mr-3 mt-1"
          />
          <TextInput
            className="flex-1 text-base"
            placeholder="Package Description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ minHeight: 60, textAlignVertical: "top" }}
          />
        </View>

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg font-bold mb-3 mt-4"
        >
          Select Locker Size
        </Text>
        {isLoadingLockers ? (
          <ActivityIndicator size="large" color={"#004C98"} />
        ) : availableSizes.length > 0 ? (
          availableSizes.map((sizeKey) => {
            const details =
              lockerDetailsMap[sizeKey as keyof typeof lockerDetailsMap];
            if (!details) return null;
            return (
              <LockerSizeOption
                key={sizeKey}
                iconName={details.iconName}
                size={details.size}
                dimensions={details.dimensions}
                description={details.description}
                isSelected={selectedLockerSize === sizeKey}
                onPress={() => setSelectedLockerSize(sizeKey)}
              />
            );
          })
        ) : (
          <Text className="text-center text-gray-500 my-4">
            No available lockers at this station.
          </Text>
        )}

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg font-bold mb-3 mt-4"
        >
          Select Pickup Time
        </Text>
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-xl px-4 py-4 mb-4 border border-gray-300"
          onPress={() => setShowDatePicker(true)}
        >
          <FontAwesome
            name="calendar"
            size={20}
            color="gray"
            className="mr-3"
          />
          <Text
            style={{ fontFamily: "Inter-Regular" }}
            className={`flex-1 text-base ${
              pickupTime ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {pickupTime || "Select Pick Up Time"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <>
            {/* <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="datetime"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            /> */}
            {Platform.OS === "ios" && (
              <View className="flex-row justify-around p-2">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="p-2"
                >
                  <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIosDate} className="p-2">
                  <Text
                    style={{
                      color: "#004C98",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-lg font-bold mb-3 mt-4"
        >
          Have a promo code?
        </Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-8 border border-gray-300">
          <TextInput
            className="flex-1 text-base"
            placeholder="Promo Code"
            placeholderTextColor="#888"
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity onPress={calculateTotalPayment}>
            <Text style={{ fontFamily: "Inter-Bold", color: "#004C98" }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="bg-white rounded-xl p-4 mb-4"
          style={{ backgroundColor: "#E6EDF5" }}
        >
          <Text
            style={{ fontFamily: "Inter-Bold", color: "#004C98" }}
            className="text-lg"
          >
            Total Payment: Rp{totalPayment.toLocaleString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity
          className={`w-full p-4 rounded-xl items-center my-6 ${
            totalPayment > 0 && !createPackageMutation.isPending
              ? ""
              : "opacity-50"
          }`}
          style={{ backgroundColor: "#004C98" }}
          onPress={handleConfirmPayment}
          disabled={
            totalPayment === 0 ||
            createPackageMutation.isPending ||
            isLoadingLockers
          }
        >
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            {createPackageMutation.isPending
              ? "Processing..."
              : "Confirm To Payment"}
          </Text>
        </TouchableOpacity>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default SendPackageScreen;
