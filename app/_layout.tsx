import { Stack } from "expo-router";
import "@/global.css";
import React from "react";
import { ActivityIndicator, View } from "react-native";

// Load Devanagari-optimized fonts globally
import { useFonts, NotoSansDevanagari_400Regular, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
