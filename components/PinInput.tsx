import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface PinInputProps {
  pin: string;
  setPin: (pin: string) => void;
  maxLength: number;
}

const PinInput: React.FC<PinInputProps> = ({ pin, setPin, maxLength }) => {
  const pinDigits = Array(maxLength).fill("");
  pin.split("").forEach((digit, index) => {
    pinDigits[index] = digit;
  });

  return (
    <View className="flex-row justify-around items-center w-full p-4 rounded-xl">
      {pinDigits.map((digit, index) => (
        <View
          key={index}
          className="w-4 h-4 rounded-full mx-1"
          style={{ backgroundColor: digit ? "black" : "gray" }}
        />
      ))}
      <TextInput
        style={StyleSheet.absoluteFillObject}
        className="opacity-0"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={maxLength}
        caretHidden={true}
      />
    </View>
  );
};

export default PinInput;