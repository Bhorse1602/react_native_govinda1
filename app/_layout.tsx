import { Stack } from "expo-router";
import "@/global.css";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { LanguageProvider } from "@/lib/language-context";
import mobileAds from "react-native-google-mobile-ads";

// Load Devanagari-optimized fonts globally
import { useFonts, NotoSansDevanagari_400Regular, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_700Bold,
  });

  useEffect(() => {
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("AdMob initialized:", adapterStatuses);
      })
      .catch((error) => {
        console.log("AdMob initialization error:", error);
      });
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}
