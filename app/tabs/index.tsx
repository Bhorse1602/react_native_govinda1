import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "@/global.css";
import { Link } from "expo-router";
import {
  clearCurrentSession,
  getCurrentSessionUser,
  type UserRecord,
} from "@/lib/auth-db";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const user = await getCurrentSessionUser();
        if (mounted) {
          setCurrentUser(user ?? null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await clearCurrentSession();
    setCurrentUser(null);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (currentUser) {
    return (
      <View className="flex-1 overflow-hidden bg-orange-50 px-6 pb-28 pt-16">
        <View className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-orange-200/60" />
        <View className="absolute -right-8 top-28 h-32 w-32 rounded-full bg-amber-300/40" />

        <View className="mb-6 rounded-[32px] border border-orange-200 bg-white/90 px-6 py-8">
          <Text
            className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
            style={{ fontFamily: "Manrope" }}
          >
            Home
          </Text>
          <Text
            className="mb-3 text-3xl text-orange-950"
            style={{ fontFamily: "Sora" }}
          >
            Jai Shri Ram, {currentUser.full_name}
          </Text>
          <Text
            className="text-base leading-7 text-orange-900/80"
            style={{ fontFamily: "Manrope" }}
          >
            Your account is active and this is now a working logged-in home
            page for your daily devotional journey.
          </Text>
        </View>

        <View className="mb-5 rounded-[28px] bg-orange-900 px-6 py-6">
          <Text
            className="mb-2 text-sm uppercase tracking-[2px] text-orange-200"
            style={{ fontFamily: "Manrope" }}
          >
            Your Profile
          </Text>
          <Text
            className="mb-1 text-xl text-orange-50"
            style={{ fontFamily: "Sora" }}
          >
            User ID: {currentUser.user_id}
          </Text>
          <Text
            className="text-base leading-7 text-orange-100/85"
            style={{ fontFamily: "Manrope" }}
          >
            Age {currentUser.age} • {currentUser.gender} •{" "}
            {currentUser.sampraday}
          </Text>
          <Text
            className="mt-1 text-base leading-7 text-orange-100/85"
            style={{ fontFamily: "Manrope" }}
          >
            Date of birth: {currentUser.dob}
          </Text>
        </View>

        <View className="mb-5 rounded-[28px] border border-orange-200 bg-white/85 px-6 py-6">
          <Text
            className="mb-2 text-xl text-orange-950"
            style={{ fontFamily: "Sora" }}
          >
            What you can do now
          </Text>
          <Text
            className="text-base leading-7 text-orange-900/80"
            style={{ fontFamily: "Manrope" }}
          >
            Explore insights, manage settings, and continue into subscription
            flows from the tabs below.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200"
        >
          <Text
            className="text-center text-lg text-orange-900"
            style={{ fontFamily: "Sora" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 overflow-hidden bg-orange-50 px-6 pb-28 pt-16">
      <View className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-orange-200/60" />
      <View className="absolute -right-8 top-28 h-32 w-32 rounded-full bg-amber-300/40" />
      <View className="absolute bottom-32 left-6 h-24 w-24 rounded-full bg-yellow-200/50" />

      <View className="mb-10 rounded-[32px] border border-orange-200 bg-white/80 px-6 py-8">
        <Text
          className="mb-3 text-center text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          Welcome
        </Text>
        <Text
          className="mb-4 text-center text-4xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Welcome to Govinda Naam jaap App
        </Text>
        <Text
          className="text-center text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Join us and explore amazing features
        </Text>
      </View>

      <View className="mb-8 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-2 text-sm uppercase tracking-[2px] text-orange-200"
          style={{ fontFamily: "Manrope" }}
        >
          Start Here
        </Text>
        <Text
          className="text-2xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          Create an account or sign in to continue.
        </Text>
      </View>

      <View className="w-full gap-y-4">
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600">
            <Text
              className="text-center text-lg text-white"
              style={{ fontFamily: "Sora" }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-lg text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text
        className="mt-8 text-center text-sm text-orange-800/75"
        style={{ fontFamily: "Manrope" }}
      >
        Already have an account? Sign in above
      </Text>
    </View>
  );
}
