import React from "react";
import { Text, View } from "react-native";

export default function Insights() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-3 text-3xl font-bold text-blue-600">Insights</Text>
      <Text className="text-center text-base text-gray-600">
        View your activity, progress, and recent trends here.
      </Text>
    </View>
  );
}
