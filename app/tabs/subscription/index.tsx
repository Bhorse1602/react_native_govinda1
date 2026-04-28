import React from "react";
import { Text, View } from "react-native";

export default function Subscription() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-3 text-3xl font-bold text-blue-600">
        Subscription
      </Text>
      <Text className="text-center text-base text-gray-600">
        Manage your plan and access premium features here.
      </Text>
    </View>
  );
}
