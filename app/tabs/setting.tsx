import React from "react";
import { Text, View } from "react-native";

export default function Setting() {
  return (
    <View className="flex-1 bg-orange-50 px-6 pb-28 pt-16">
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          Settings
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Setting
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Update your preferences, account options, and app settings here.
        </Text>
      </View>

      <View className="mt-6 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-2 text-xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          Preferences
        </Text>
        <Text
          className="text-base leading-7 text-orange-100/85"
          style={{ fontFamily: "Manrope" }}
        >
          Manage the way the app works for you from this screen.
        </Text>
      </View>
    </View>
  );
}
