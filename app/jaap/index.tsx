import {
  getActiveChantSummary,
  getCurrentSessionUser,
  incrementActiveDeityChant,
  type ChantSummary,
  type UserRecord,
} from "@/lib/auth-db";
import { getHindiDeityName } from "@/lib/deity-display";
import { useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

export default function JaapScreen() {
  const isFocused = useIsFocused();
  const pulse = useRef(new Animated.Value(0)).current;
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [activeSummary, setActiveSummary] = useState<ChantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
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
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const deityName = useMemo(
    () => getHindiDeityName(activeSummary?.deityName ?? ""),
    [activeSummary?.deityName]
  );

  const progressPercent = activeSummary
    ? (activeSummary.currentLapCount / 108) * 100
    : 0;

  async function handleJaap() {
    if (!currentUser || saving) {
      return;
    }

    setSaving(true);
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();

    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => undefined);
    }

    try {
      const summary = await incrementActiveDeityChant(currentUser.user_id);
      setActiveSummary(summary);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "जप की गिनती अपडेट नहीं हो पाई।";
      Alert.alert("जप असफल", message);
    } finally {
      setSaving(false);
    }
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

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1.35],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.38, 0.18, 0],
  });

  return (
    <Pressable
      onPress={handleJaap}
      className="flex-1 overflow-hidden bg-[#7c2d12] px-6 pb-28 pt-16"
    >
      <View className="absolute inset-0 bg-orange-950" />
      <View className="absolute left-[-90px] top-[-80px] h-72 w-72 rounded-full bg-orange-500/25" />
      <View className="absolute bottom-[-120px] right-[-90px] h-96 w-96 rounded-full bg-amber-300/25" />
      <View className="absolute inset-x-6 top-16 flex-row items-center justify-between">
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            router.push("/tabs");
          }}
          className="rounded-full bg-white/15 px-5 py-3 active:bg-white/25"
        >
          <Text
            className="text-base text-orange-50"
            style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
          >
            वापस
          </Text>
        </Pressable>
        <View className="rounded-full bg-white/15 px-5 py-3">
          <Text
            className="text-base text-orange-50"
            style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
          >
            माला {activeSummary.totalMalas}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <Animated.View
          pointerEvents="none"
          className="absolute h-72 w-72 rounded-full border border-amber-200/70"
          style={{ opacity: pulseOpacity, transform: [{ scale: pulseScale }] }}
        />
        <View className="h-72 w-72 items-center justify-center rounded-full border border-amber-200/40 bg-orange-100/10 px-6">
          <Text
            adjustsFontSizeToFit
            numberOfLines={3}
            className="text-center text-6xl font-bold leading-[78px] text-orange-50"
            style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
          >
            {deityName}
          </Text>
        </View>
      </View>

      <View className="rounded-[28px] bg-white/12 px-6 py-5">
        <View className="mb-4 h-3 overflow-hidden rounded-full bg-orange-100/20">
          <View
            className="h-full rounded-full bg-amber-300"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
        <View className="flex-row justify-between">
          <View>
            <Text
              className="text-sm text-orange-100/75"
              style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
            >
              वर्तमान माला
            </Text>
            <Text
              className="mt-1 text-2xl font-bold text-orange-50"
              style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
            >
              {activeSummary.currentLapCount} / 108
            </Text>
          </View>
          <View className="items-end">
            <Text
              className="text-sm text-orange-100/75"
              style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
            >
              कुल जप
            </Text>
            <Text
              className="mt-1 text-2xl font-bold text-orange-50"
              style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
            >
              {activeSummary.totalChants}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
