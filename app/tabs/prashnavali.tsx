import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import PRASHNAVALI from "@/data/prashnavali.json";


export default function PrashnavaliTab() {
  const router = useRouter();

  function renderItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/prashnavali/${item.id}`)}
        className="m-2 flex-1 rounded-xl border border-orange-200 bg-white/90 p-4"
      >
        <Text className="mb-2 text-sm text-orange-700" style={{ fontFamily: "NotoSansDevanagari_700Bold" }}>
          {item.title}
        </Text>
        <Text className="text-sm text-orange-900/85" style={{ fontFamily: "NotoSansDevanagari_400Regular" }}>
          {item.excerpt}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-orange-50 px-4 pt-16 pb-28">
      <View className="px-2">
        <Text className="mb-3 text-sm uppercase tracking-[3px] text-orange-700" style={{ fontFamily: "NotoSansDevanagari_400Regular" }}>
          प्रश्नावली
        </Text>
        <Text className="mb-4 text-3xl text-orange-950" style={{ fontFamily: "NotoSansDevanagari_700Bold" }}>
          रामचरितमानस — प्रश्नावली
        </Text>
      </View>

      <FlatList
        data={PRASHNAVALI_ITEMS}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}
