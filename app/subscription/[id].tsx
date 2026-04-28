import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SubscriptionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-3 text-3xl font-bold text-blue-600">
        Subscription Details
      </Text>
      <Text className="text-center text-base text-gray-600">
        Viewing subscription ID: {id}
      </Text>
    </View>
  );
}
