import PublicLanding from "@/components/public-landing";
import { getCurrentSessionUser } from "@/lib/auth-db";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const user = await getCurrentSessionUser();
      if (mounted) {
        setHasSession(Boolean(user));
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (hasSession === null) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (hasSession) {
    return <Redirect href="/tabs" />;
  }

  return <PublicLanding />;
}
