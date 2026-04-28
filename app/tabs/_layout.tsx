import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 24,
          height: 74,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: "#ffffff",
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 12,
          elevation: 0,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
        },
        sceneStyle: {
          backgroundColor: "#f8fafc",
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
                backgroundColor: focused ? "#dbeafe" : "transparent",
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
