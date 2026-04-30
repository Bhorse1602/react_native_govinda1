import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PublicLanding() {
  return (
    <View className="flex-1 overflow-hidden bg-orange-50 px-6 pb-16 pt-16">
      <View className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-orange-200/60" />
      <View className="absolute -right-8 top-28 h-32 w-32 rounded-full bg-amber-300/40" />
      <View className="absolute bottom-32 left-6 h-24 w-24 rounded-full bg-yellow-200/50" />

      <View className="mb-10 rounded-[32px] border border-orange-200 bg-white/80 px-6 py-8">
        <Text
          className="mb-3 text-center text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          स्वागत
        </Text>
        <Text
          className="mb-4 text-center text-4xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          गोविन्द नाम जप ऐप में आपका स्वागत है
        </Text>
        <Text
          className="text-center text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          भक्ति, जप और साधना के इस सरल पथ से जुड़िए
        </Text>
      </View>

      <View className="mb-8 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-2 text-sm uppercase tracking-[2px] text-orange-200"
          style={{ fontFamily: "Manrope" }}
        >
          प्रारम्भ करें
        </Text>
        <Text
          className="text-2xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          आगे बढ़ने के लिए खाता बनाइए या साइन इन कीजिए।
        </Text>
      </View>

      <View className="w-full gap-y-4">
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600">
            <Text
              className="text-center text-lg text-white"
              style={{ fontFamily: "Sora" }}
            >
              खाता बनाइए
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-lg text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              साइन इन
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text
        className="mt-8 text-center text-sm text-orange-800/75"
        style={{ fontFamily: "Manrope" }}
      >
        यदि आपका खाता पहले से है, तो ऊपर साइन इन करें
      </Text>
    </View>
  );
}
