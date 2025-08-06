import OrderCard from "@/components/OrderCard";
import {
  useCompletePackage,
  useFindReceivablePackage,
} from "@/hooks/usePackage";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Print from "expo-print";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const ReceiveScreen = () => {
  const params = useLocalSearchParams();
  const { packageId, id } = params;

  const {
    data: pkg,
    isLoading,
    error,
  } = useFindReceivablePackage({
    packageId: packageId as string | undefined,
    qrCode: id as string | undefined,
  });

  const { data: transaction } = useQuery<Transaction | null>({
    queryKey: ["transaction-for-package", pkg?.id],
    queryFn: async () => {
      if (!pkg?.id) return null;
      const { data } = await supabase
        .from("transactions")
        .select("amount")
        .eq("package_id", pkg.id)
        .eq("status", "completed")
        .maybeSingle();
      return data as Transaction | null;
    },
    enabled: !!pkg?.id,
  });

  const { mutateAsync: completePackage } = useCompletePackage();
  let qrRef = React.useRef<any>(null);

  const handlePrint = async () => {
    if (!pkg || !qrRef.current) return;
    let qrDataUrl = await new Promise<string>((resolve) => {
      qrRef.current.toDataURL((data: string) =>
        resolve(`data:image/png;base64,data`)
      );
    });
    const html = `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 400px; margin: auto; border: 1px solid #ddd;">
                <h2 style="text-align: center; color: #00529B;">Raildrop Package Receipt</h2>
                <p><b>Package ID:</b> ${pkg.id}</p>
                <p><b>Sender:</b> ${pkg.sender?.full_name || "N/A"}</p>
                <p><b>Receiver:</b> ${pkg.receiver?.full_name || "N/A"}</p>
                <p><b>Destination:</b> ${
                  pkg.destination_station?.name || "N/A"
                }</p>
                <p><b>Locker Size:</b> ${pkg.size}</p>
                <p><b>Cost:</b> Rp${
                  transaction?.amount?.toLocaleString("id-ID") || "-"
                }</p>
                <div style="margin: 24px 0; text-align: center;">
                    <img src='qrDataUrl' width='200' height='200' alt='QR Code' />
                </div>
                <p style="text-align: center; font-size: 12px; color: #555;">Scan to open locker</p>
            </div>
        `;
    await Print.printAsync({ html });
  };

  const handleComplete = async () => {
    if (!pkg) return;
    try {
      await completePackage({ id: pkg.id as string });
      Alert.alert("Success", "Package has been marked as received.");
      router.replace("/(tabs)/order");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Receive Package",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#004C98" },
            headerTintColor: "white",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.replace("/home")}
                className="ml-4"
              >
                <FontAwesome name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <ActivityIndicator size="large" color={"#004C98"} />
        <Text className="mt-2 text-gray-600">Finding Your Package...</Text>
      </View>
    );
  }
  if (error || !pkg) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Error",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#004C98" },
            headerTintColor: "white",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.replace("/home")}
                className="ml-4"
              >
                <FontAwesome name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Text className="text-red-500 text-lg font-bold">
          Package Not Found
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          {error?.message || "Please check the ID and try again."}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="mt-6 bg-blue-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="p-4 pt-12">
        <Text
          style={{ fontFamily: "Inter-Bold" }}
          className="text-2xl font-bold mb-2 text-center"
        >
          Your Package is Ready!
        </Text>
        <Text
          style={{ fontFamily: "Inter-Regular" }}
          className="text-gray-600 text-center mb-8"
        >
          Scan this QR Code to access your Locker
        </Text>
        <View className="items-center mb-8 p-4 bg-white rounded-lg shadow-md">
          <QRCode
            value={pkg.qr_code || "no-qr"}
            size={220}
            getRef={(c) => (qrRef.current = c)}
          />
        </View>
        <TouchableOpacity
          className="w-full p-4 rounded-xl items-center mb-4 flex-row justify-center"
          style={{ backgroundColor: "#004C98" }}
          onPress={handlePrint}
        >
          <FontAwesome
            name="share-alt"
            size={20}
            color="white"
            className="mr-2"
          />
          <Text
            style={{ fontFamily: "Inter-Bold" }}
            className="text-white text-lg"
          >
            Share Receipt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full p-4 rounded-xl items-center mb-8 border"
          style={{ borderColor: "#004C98" }}
          onPress={handleComplete}
        >
          <Text
            style={{ fontFamily: "Inter-Bold", color: "#004C98" }}
            className="text-lg"
          >
            Mark as Received
          </Text>
        </TouchableOpacity>
        <OrderCard
          type="pickup"
          iconName="cube"
          iconBgColor={"#004C98"}
          title={pkg.description || "Package"}
          packageId={pkg.id as string}
          details={[
            { label: "From", value: pkg.sender?.full_name ?? "N/A" },
            { label: "To", value: pkg.receiver?.full_name ?? "N/A" },
            {
              label: "Destination",
              value: pkg.destination_station?.name ?? "N/A",
            },
            { label: "Locker Size", value: pkg.size },
            {
              label: "Cost",
              value: transaction
                ? `Rp${transaction.amount.toLocaleString("id-ID")}`
                : "Loading...",
            },
          ]}
          statusText={pkg.status.replace(/_/g, " ")}
          statusBgColor="#32CD32"
          isCurrentOrder={true}
        />
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default ReceiveScreen;
