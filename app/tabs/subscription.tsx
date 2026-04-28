import React from "react";
import { Text, View } from "react-native";

export default function SubscriptionTab() {
  return (
    <View className="flex-1 bg-orange-50 px-6 pb-28 pt-16">
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
          Subscription
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Access your subscription tab overview here.
        </Text>
      </View>

      <View className="mt-6 rounded-[28px] bg-amber-100 px-6 py-6">
        <Text
          className="mb-2 text-xl text-orange-900"
          style={{ fontFamily: "Sora" }}
        >
          Plans
        </Text>
        <Text
          className="text-base leading-7 text-orange-800/85"
          style={{ fontFamily: "Manrope" }}
        >
          Review your subscription-related options from this tab.
        </Text>
      </View>
    </View>
  );
}
