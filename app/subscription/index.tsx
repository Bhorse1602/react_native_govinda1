import React from "react";
import { Text, View } from "react-native";

export default function Subscription() {
  return (
    <View className="flex-1 bg-orange-50 px-6 pt-16">
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          Subscription
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Premium devotional access
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Manage your plan and unlock premium features without breaking the warm
          devotional atmosphere of the app.
        </Text>
      </View>
    </View>
  );
}
