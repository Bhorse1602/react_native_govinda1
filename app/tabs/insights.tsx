import {
  getChantSummariesForUser,
  getCurrentSessionUser,
  type ChantSummary,
} from "@/lib/auth-db";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Insights() {
  const isFocused = useIsFocused();
  const [summaries, setSummaries] = useState<ChantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadInsights() {
      try {
        const currentUser = await getCurrentSessionUser();
        if (!mounted || !currentUser) {
          return;
        }

        const data = await getChantSummariesForUser(currentUser.user_id);
        if (mounted) {
          setSummaries(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (isFocused) {
      setLoading(true);
      loadInsights();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  return (
    <ScrollView
      className="flex-1 bg-orange-50"
      contentContainerClassName="px-6 pb-28 pt-16"
    >
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          जानकारी
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          जप अवलोकन
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          प्रत्येक इष्ट नाम के लिए लोकल डेटाबेस में सहेजे गए जप और माला की प्रगति यहाँ देखें।
        </Text>
      </View>

      <View className="mt-6 gap-y-4">
        {loading ? (
          <View className="rounded-[28px] bg-amber-100 px-6 py-6">
            <Text style={{ fontFamily: "Manrope" }}>जानकारी लोड हो रही है...</Text>
          </View>
        ) : (
          summaries.map((summary) => (
            <View
              key={summary.deityId}
              className="rounded-[28px] bg-amber-100 px-6 py-6"
            >
              <Text
                className="mb-2 text-xl text-orange-900"
                style={{ fontFamily: "Sora" }}
              >
                {summary.deityName}
              </Text>
              <Text
                className="text-base leading-7 text-orange-800/85"
                style={{ fontFamily: "Manrope" }}
              >
                कुल जप: {summary.totalChants}
              </Text>
              <Text
                className="text-base leading-7 text-orange-800/85"
                style={{ fontFamily: "Manrope" }}
              >
                वर्तमान माला: {summary.currentLapCount} / 108
              </Text>
              <Text
                className="text-base leading-7 text-orange-800/85"
                style={{ fontFamily: "Manrope" }}
              >
                कुल माला: {summary.totalMalas}
              </Text>
              {summary.isActive ? (
                <Text
                  className="mt-2 text-sm uppercase tracking-[2px] text-orange-700"
                  style={{ fontFamily: "Manrope" }}
                >
                  सक्रिय इष्ट
                </Text>
              ) : null}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
