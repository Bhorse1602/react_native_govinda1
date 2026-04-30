import { getCurrentSessionUser } from "@/lib/auth-db";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, BackHandler, Platform } from "react-native";

export default function PrashnavaliLayout() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [currentUserFullName, setCurrentUserFullName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const user = await getCurrentSessionUser();
      if (mounted) {
        setHasSession(Boolean(user));
        setCurrentUserFullName(user?.full_name ?? null);
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  // Prevent hardware back navigation from prashnavali to auth screens on Android
  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (hasSession !== true) return;

    const onBack = () => {
      // returning true prevents default back action
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [hasSession]);

  if (hasSession === null) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!hasSession) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <View className="absolute left-0 right-0 top-8 z-10 items-center">
        <View className="rounded-full bg-white/90 px-4 py-2 shadow-sm">
          <Text className="text-lg text-orange-900" style={{ fontFamily: "Sora" }}>
            {currentUserFullName ? `साधक: ${currentUserFullName}` : ""}
          </Text>
        </View>
      </View>
    </>
  );
}
