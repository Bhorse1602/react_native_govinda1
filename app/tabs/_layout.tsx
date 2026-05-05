import Ionicons from "@expo/vector-icons/Ionicons";
import { getCurrentSessionUser } from "@/lib/auth-db";
import { useLanguage } from "@/lib/language-context";
import { Redirect, Tabs, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, BackHandler, Platform } from "react-native";

export default function TabsLayout() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [currentUserFullName, setCurrentUserFullName] = useState<string | null>(null);
  const showUserHeader =
    pathname !== "/tabs/naam-jaap" && pathname !== "/tabs/prashnavali";
  const hideTabBar = pathname === "/tabs/naam-jaap" || pathname === "/tabs/prashnavali";

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

  // Prevent hardware back navigation from tabs to auth screens on Android
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
      {/* Devotee name header removed as per user request - no transparent bubble */}

      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#b45309",
          tabBarInactiveTintColor: "#9a7b5f",
          tabBarStyle: hideTabBar
            ? {
                display: "none",
              }
            : {
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
            height: 74,
            borderTopWidth: 0,
            borderRadius: 28,
            backgroundColor: "#fff7ed",
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
            elevation: 0,
            shadowColor: "#7c2d12",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.16,
            shadowRadius: 24,
          },
          sceneStyle: {
            backgroundColor: "#fff7ed",
          },
          tabBarIcon: ({ color, focused }) => {
            const iconName =
              route.name === "index"
                ? focused
                  ? "home"
                  : "home-outline"
                : route.name === "prashnavali"
                  ? focused
                    ? "book"
                    : "book-outline"
                  : route.name === "insights"
                    ? focused
                      ? "analytics"
                      : "analytics-outline"
                    : focused
                      ? "settings"
                      : "settings-outline";

            return (
              <View
                style={{
                  minWidth: 52,
                  minHeight: 46,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? "#fed7aa" : "transparent",
                }}
              >
                <Ionicons name={iconName} size={24} color={color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: language === "hi" ? "गृह" : "Home",
          }}
        />
        <Tabs.Screen
          name="prashnavali"
          options={{
            title: language === "hi" ? "प्रश्नावली" : "Prashnavali",
          }}
        />
        <Tabs.Screen
          name="naam-jaap"
          options={{
            href: null,
            title: language === "hi" ? "नाम जप" : "Naam Jaap",
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: language === "hi" ? "जानकारी" : "Insights",
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: language === "hi" ? "सेटिंग्स" : "Settings",
          }}
        />
      </Tabs>
    </>
  );
}
