import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ScanScreen = () => {
  const params = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");
    };

    requestPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert("QR Code Terbaca!", `Data: data`, [
      {
        text: "OK",
        onPress: () => {
          router.push({
            pathname: "/receive",
            params: { id: data, packageId: data },
          });
        },
      },
    ]);
  };

  const pickImageAndScan = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Izin Diperlukan",
        "Anda perlu memberikan izin untuk mengakses galeri."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      try {
        const scannedResults: BarcodeScanningResult[] =
          await Camera.scanFromURLAsync(pickerResult.assets[0].uri);
        if (scannedResults.length > 0) {
          handleBarCodeScanned({ data: scannedResults[0].data });
        } else {
          Alert.alert(
            "Tidak Ditemukan",
            "Tidak ada QR code yang ditemukan pada gambar yang dipilih."
          );
        }
      } catch (error) {
        console.error("Error scanning from gallery:", error);
        Alert.alert("Error", "Gagal memindai QR code dari gambar.");
      }
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.infoText}>Meminta izin kamera...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.infoText}>Akses kamera tidak diizinkan.</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Scan QR Code",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#004C98" },
          headerTintColor: "white",
        }}
      />

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickImageAndScan}
        >
          <Text style={styles.galleryButtonText}>Pilih dari Galeri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  infoText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  middleContainer: {
    flexDirection: "row",
    height: 280,
  },
  focusedContainer: {
    width: 280,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#004C98",
    borderWidth: 5,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 10,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    alignItems: "center",
  },
  galleryButton: {
    backgroundColor: "#004C98",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  galleryButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
});

export default ScanScreen;
