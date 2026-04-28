import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const PRASHNAVALI_CONTENT: Record<string, { title: string; body: string }> = {
  "1": {
    title: "संकट मोचन सीता",
    body: `
श्रीराम की स्तुति और संकट मोचन की कथा।

यहाँ प्रश्‍न और उसके अर्थ का विस्तृत पाठ प्रदर्शित होगा।
    `,
  },
  "2": { title: "अयोध्या के प्रश्न", body: "राज्य और धर्म पर राम का विचार..." },
  "3": { title: "वनवास प्रश्न", body: "वनवास का सारांश और विषय-वस्तु..." },
  "4": { title: "किष्किन्धा प्रश्न", body: "हनुमान, सुग्रीव और प्रेम की कथाएँ..." },
  "5": { title: "लंका विजय प्रश्न", body: "लंका विजय का वर्णन और स्मरण..." },
  "6": { title: "अन्तिम प्रश्न", body: "समापन एवं आशय..." },
};

export default function PrashnavaliDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = PRASHNAVALI_CONTENT[id ?? "1"] ?? PRASHNAVALI_CONTENT["1"];

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
