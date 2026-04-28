import Ionicons from "@expo/vector-icons/Ionicons";
import { getCurrentSessionUser } from "@/lib/auth-db";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
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

  if (!hasSession) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#b45309",
        tabBarInactiveTintColor: "#9a7b5f",
        tabBarStyle: {
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
              : route.name === "subscription"
                ? focused
                  ? "card"
                  : "card-outline"
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
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Subscription",
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
        }}
      />
    </Tabs>
  );
}
