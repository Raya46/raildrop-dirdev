import OrderCard from "@/components/OrderCard";
import OrderTabButton from "@/components/OrderTabButton";
import { useGetPackageCounts, useGetPackages } from "@/hooks/usePackage";
import { PackageStatus } from "@/types/packageStatus";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

type OrderTab = {
  label: string;
  status: PackageStatus | "All";
};

const TABS: OrderTab[] = [
  { label: "All", status: "All" },
  { label: "Awaiting Payment", status: "awaiting_payment" },
  { label: "Awaiting Dropoff", status: "awaiting_dropoff" },
  { label: "In Locker Origin", status: "in_locker_origin" },
  { label: "In Transit", status: "in_transit" },
  { label: "Pick Up", status: "in_locker_destination" },
  { label: "Completed", status: "completed" },
];

const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>(TABS[0]);

  const {
    data: packages,
    isLoading,
    error,
  } = useGetPackages(activeTab.status === "All" ? undefined : activeTab.status);

  const { data: allPackagesForCount } = useGetPackageCounts();

  const tabCounts = useMemo(() => {
    const counts = TABS.reduce(
      (acc, tab) => ({ ...acc, [tab.label]: 0 }),
      {} as Record<string, number>
    );
    if (!allPackagesForCount) return counts;

    allPackagesForCount.forEach((pkg) => {
      const tab = TABS.find((t) => t.status === pkg.status);
      if (tab) {
        counts[tab.label]++;
      }
    });
    counts["All"] = allPackagesForCount.length;
    return counts;
  }, [allPackagesForCount]);

  const renderEmptyListComponent = () => (
    <View className="flex-1 justify-center items-center mt-20">
      <Text className="text-gray-500 text-lg">
        No orders found for this status.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "My Orders",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#004C98" },
          headerTintColor: "white",
        }}
      />

      <View className="bg-white p-2 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((tab) => (
            <OrderTabButton
              key={tab.label}
              label={tab.label}
              count={tabCounts[tab.label] || 0}
              isActive={activeTab.label === tab.label}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={"#004C98"} />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">
            Error: {error.message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id as string}
          renderItem={({ item: pkg }) => (
            <OrderCard
              type={
                pkg.status === "in_transit" || pkg.status === "in_locker_origin"
                  ? "inTransit"
                  : "pickup"
              }
              iconName={
                pkg.status === "in_locker_destination"
                  ? "cube"
                  : pkg.status === "awaiting_payment"
                  ? "credit-card"
                  : pkg.status === "awaiting_dropoff"
                  ? "truck"
                  : "shopping-bag"
              }
              iconBgColor={
                pkg.status === "in_locker_destination"
                  ? "#004C98"
                  : pkg.status === "awaiting_payment"
                  ? "#FFD700"
                  : pkg.status === "awaiting_dropoff"
                  ? "#FFA500"
                  : "#FF6347"
              }
              title={pkg.description || "Package"}
              packageId={pkg.id as string}
              details={[
                { label: "From", value: pkg.sender?.full_name ?? "N/A" },
                { label: "To", value: pkg.receiver?.full_name ?? "N/A" },
                {
                  label: "Destination",
                  value: pkg.destination_station?.name ?? "N/A",
                },
              ]}
              statusText={pkg.status.replace(/_/g, " ")}
              statusBgColor={
                pkg.status === "completed"
                  ? "#32CD32"
                  : pkg.status === "in_locker_destination"
                  ? "#004C98"
                  : "#FFD700"
              }
              isCurrentOrder={
                pkg.status !== "completed" && pkg.status !== "cancelled"
              }
              onPress={() => {
                router.push({
                  pathname: "/live-tracking",
                  params: { packageId: pkg.id },
                });
              }}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ListEmptyComponent={renderEmptyListComponent}
        />
      )}
    </View>
  );
};

export default OrderScreen;
