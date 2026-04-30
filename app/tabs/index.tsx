import {
  clearCurrentSession,
  getActiveChantSummary,
  getCurrentSessionUser,
  type ChantSummary,
  type UserRecord,
} from "@/lib/auth-db";
import { getHindiDeityName } from "@/lib/deity-display";
import "@/global.css";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QUOTES = [
  {
    text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    source: "भगवद्गीता 2.47",
  },
  {
    text: "योगः कर्मसु कौशलम्।",
    source: "भगवद्गीता 2.50",
  },
  {
    text: "मन चंगा तो कठौती में गंगा नहीं, राम नाम में ही शांति है।",
    source: "रामचरितमानस भावार्थ",
  },
  {
    text: "सिया राममय सब जग जानी।",
    source: "रामचरितमानस",
  },
];

export default function App() {
  const isFocused = useIsFocused();
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [activeSummary, setActiveSummary] = useState<ChantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const user = await getCurrentSessionUser();
        if (!mounted) {
          return;
        }

        setCurrentUser(user ?? null);

        if (user) {
          const summary = await getActiveChantSummary(user.user_id);
          if (mounted) {
            setActiveSummary(summary);
            setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
          }
        } else if (mounted) {
          setActiveSummary(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (isFocused) {
      setLoading(true);
      loadSession();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  async function handleLogout() {
    await clearCurrentSession();
    setCurrentUser(null);
    router.replace("/");
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!currentUser || !activeSummary) {
    return null;
  }

  const deityName = getHindiDeityName(activeSummary.deityName);

  return (
    <View className="flex-1 overflow-hidden bg-orange-50 px-6 pb-28 pt-16">
      <View className="mb-6 rounded-[28px] border border-orange-200 bg-white/90 px-6 py-7">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
        >
          गृह
        </Text>
        <Text
          className="mb-3 text-3xl font-bold text-orange-950"
          style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
        >
          जय {deityName}
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          साधक: {currentUser.full_name}
        </Text>
        <Text
          className="mt-4 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          {QUOTES[quoteIndex]?.text}
        </Text>
        <Text
          className="mt-2 text-sm text-orange-700/80"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          {QUOTES[quoteIndex]?.source}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/tabs/naam-jaap")}
        className="mb-5 min-h-44 justify-center rounded-[30px] bg-orange-600 px-7 py-8 active:opacity-90"
      >
        <Text
          className="text-center text-4xl font-bold text-white"
          style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
        >
          नाम जप
        </Text>
        <Text
          className="mt-3 text-center text-lg text-orange-50"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          {deityName}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/tabs/prashnavali")}
        className="mb-6 min-h-44 justify-center rounded-[30px] bg-amber-500 px-7 py-8 active:opacity-90"
      >
        <Text
          className="text-center text-4xl font-bold text-orange-950"
          style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
        >
          प्रश्नावली
        </Text>
        <Text
          className="mt-3 text-center text-lg text-orange-950/80"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          राम शलाका
        </Text>
      </Pressable>

      <View className="mb-5 rounded-[24px] bg-orange-900 px-6 py-5">
        <Text
          className="text-base leading-7 text-orange-100/85"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          कुल जप: {activeSummary.totalChants}
        </Text>
        <Text
          className="mt-1 text-base leading-7 text-orange-100/85"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          कुल माला: {activeSummary.totalMalas}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200"
      >
        <Text
          className="text-center text-lg text-orange-900"
          style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
        >
          लॉगआउट
        </Text>
      </TouchableOpacity>
    </View>
  );
}
