import React from "react";
import { Text, View } from "react-native";

export default function Insights() {
  return (
    <View className="flex-1 bg-orange-50 px-6 pb-28 pt-16">
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          Insights
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Insights
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          View your activity, progress, and recent trends here.
        </Text>
      </View>

      <View className="mt-6 rounded-[28px] bg-amber-100 px-6 py-6">
        <Text
          className="mb-2 text-xl text-orange-900"
          style={{ fontFamily: "Sora" }}
        >
          Overview
        </Text>
        <Text
          className="text-base leading-7 text-orange-800/85"
          style={{ fontFamily: "Manrope" }}
        >
          Keep an eye on your devotional progress from this screen.
        </Text>
      </View>
    </View>
  );
}
