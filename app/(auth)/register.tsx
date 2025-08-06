import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  return (
    <View className="flex flex-col flex-1 justify-center mx-4">
      <Text className="text-3xl font-bold text-center">Sign Up</Text>
      <TextInput
        onChangeText={(text) => setName(text)}
        className="p-4 rounded-md bg-[#D9E4F0] mt-4"
        placeholder="Name"
      />
      <TextInput
        onChangeText={(text) => setEmail(text)}
        className="p-4 rounded-md bg-[#D9E4F0] mt-4"
        placeholder="Email"
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        className="p-4 rounded-md bg-[#D9E4F0] mt-4"
        placeholder="Password"
      />
      <TextInput
        onChangeText={(text) => setConfirmPassword(text)}
        className="p-4 rounded-md bg-[#D9E4F0] my-4"
        placeholder="Confirm Password"
      />
      <TouchableOpacity
        className="rounded-full w-full bg-blue-800 p-4"
        onPress={() => router.push("/home")}
      >
        <Text className="text-white text-center text-xl">Register</Text>
      </TouchableOpacity>
      <View className="flex flex-row gap-1 items-center justify-center mt-4">
        <Text>Already Have an Account?</Text>
        <Link href={"/"} className="text-[#004C98]">
          Login Now!
        </Link>
      </View>
    </View>
  );
};

export default Register;
