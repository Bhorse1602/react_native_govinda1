import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import PRASHNAVALI from "../data/prashnavali.json";


export default function PrashnavaliDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = (PRASHNAVALI as any).find((p: any) => p.id === id) ?? (PRASHNAVALI as any)[0];
  const fullChaupai = Array.isArray(content.chaupaiLines) ? content.chaupaiLines.join('\n') : (content.body ?? '');

  return (
    <ScrollView className="flex-1 bg-orange-50 px-6 pt-16 pb-28">
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text className="mb-2 text-sm uppercase tracking-[3px] text-orange-700" style={{ fontFamily: "NotoSansDevanagari_400Regular" }}>
          प्रश्नावली
        </Text>
        <Text className="mb-4 text-3xl text-orange-950" style={{ fontFamily: "NotoSansDevanagari_700Bold" }}>
          {content.title}
        </Text>
        <Text className="text-base leading-7 text-orange-900/80" style={{ fontFamily: "NotoSansDevanagari_400Regular" }}>
          {content.body}
        </Text>
      </View>
    </ScrollView>
  );
}
