import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View className="flex-1 flex flex-col mx-4 justify-center">
      <Text className="text-3xl font-bold text-center">Welcome Back</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        className="p-4 rounded-md bg-[#D9E4F0] mt-4"
        placeholder="Email"
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        className="p-4 rounded-md bg-[#D9E4F0] my-4"
        placeholder="Password"
      />
      <TouchableOpacity
        className="rounded-full w-full bg-blue-800 p-4"
        onPress={() => router.push("/home")}
      >
        <Text className="text-white text-center text-xl">Login</Text>
      </TouchableOpacity>
      <View className="flex flex-row gap-1 items-center justify-center mt-4">
        <Text>Don{"t"} Have an Account?</Text>
        <Link href={"/register"} className="text-[#004C98]">
          Sign Up Now!
        </Link>
      </View>
    </View>
  );
};

export default Login;
