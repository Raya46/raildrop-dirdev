import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const MIDTRANS_CLIENT_KEY =
  process.env.EXPO_MIDTRANS_CLIENT_KEY || "SB-Mid-client-6nVp9w_Xc4Ghak7I";

const MidtransPage = () => {
  const { userData } = useAuth();

  const [snapToken, setSnapToken] = useState("");
  const [loading, setLoading] = useState(false);
  const webviewRef = useRef(null);

  const createTransaction = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.1.9:3000/create-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData?.full_name,
            email: userData?.email,
            phone: userData?.phone_number,
            grossAmount: 50000,
          }),
        }
      );
      const data = await response.json();
      if (data.token) {
        setSnapToken(data.token);
      } else {
        Alert.alert("Error", "Gagal membuat transaksi.");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan pada server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateHtmlContent = (token: string) => {
    return `
            <html>
                <head>
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
                    <script type=\"text/javascript\" src=\"https://app.sandbox.midtrans.com/snap/snap.js\" data-client-key=\"${MIDTRANS_CLIENT_KEY}\"></script>
                </head>
                <body onload=\"pay()\">
                    <script type=\"text/javascript\">
                        function pay() {
                            window.snap.embed('token', {
                                embedId: 'snap-container',
                                onSuccess: function (result) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', data: result }));
                                },
                                onPending: function (result) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'pending', data: result }));
                                },
                                onError: function (result) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'error', data: result }));
                                },
                                onClose: function () {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'close' }));
                                }
                            });
                        }
                    </script>
                    <div id=\"snap-container\"></div>
                </body>
            </html>
            `;
  };

  const handleMessage = (event: any) => {
    const message = JSON.parse(event.nativeEvent.data);

    switch (message.status) {
      case "success":
        Alert.alert(
          "Sukses",
          `Pembayaran berhasil! ID Pesanan: ${message.data.order_id}`
        );
        setSnapToken("");
        break;
      case "pending":
        Alert.alert(
          "Pending",
          `Pembayaran menunggu! ID Pesanan: ${message.data.order_id}`
        );
        setSnapToken("");
        break;
      case "error":
        Alert.alert("Gagal", "Pembayaran gagal.");
        setSnapToken("");
        break;
      case "close":
        Alert.alert("Popup Ditutup", "Anda menutup popup pembayaran.");
        setSnapToken("");
        break;
    }
  };

  if (!snapToken) {
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            title="Bayar Sekarang (Rp 50.000)"
            onPress={createTransaction}
          />
        )}
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      source={{ html: generateHtmlContent(snapToken) }}
      onMessage={handleMessage}
      style={{ flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default MidtransPage;
