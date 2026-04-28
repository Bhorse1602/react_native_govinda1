import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const PRASHNAVALI_ITEMS = [
  { id: "1", title: "संकट मोचन सीता", excerpt: "राम जी की स्तुति..." },
  { id: "2", title: "अयोध्या के प्रश्न", excerpt: "राज्य और धर्म पर विचार..." },
  { id: "3", title: "वनवास प्रश्न", excerpt: "वनवास का सार..." },
  { id: "4", title: "किष्किन्धा प्रश्न", excerpt: "हनुमान और सुग्रीव की कथा..." },
  { id: "5", title: "लंका विजय प्रश्न", excerpt: "लंका का विवरण..." },
  { id: "6", title: "अन्तिम प्रश्न", excerpt: "समापन और सीताराम" },
];

export default function PrashnavaliTab() {
  const router = useRouter();

  function renderItem({ item }: { item: typeof PRASHNAVALI_ITEMS[0] }) {
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
