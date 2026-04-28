import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { setCurrentSession, signInWithCredentials } from "@/lib/auth-db";

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="mb-2 text-sm text-orange-900"
      style={{ fontFamily: "Manrope" }}
    >
      {children}
    </Text>
  );
}

function FormInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor="#9a7b5f"
      className="rounded-[18px] border border-orange-200 bg-orange-50 px-4 py-4 text-base text-orange-950"
      style={{ fontFamily: "Manrope" }}
      {...props}
    />
  );
}

export default function SignIn() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const [userId, setUserId] = useState(params.userId ?? "");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!userId.trim() || !password) {
      Alert.alert("Missing details", "Enter your user ID and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signInWithCredentials(userId, password);

      if (!user) {
        Alert.alert("Login failed", "Invalid user ID or password.");
        return;
      }

      await setCurrentSession(user.user_id);

      Alert.alert("Welcome", `Signed in as ${user.full_name}.`, [
        {
          text: "Continue",
          onPress: () => router.replace("/tabs"),
        },
      ]);
    } catch {
      Alert.alert("Login failed", "Something went wrong while signing in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-orange-50"
      contentContainerClassName="px-6 pb-12 pt-20"
      keyboardShouldPersistTaps="handled"
    >
      <View className="rounded-[30px] border border-orange-200 bg-white/90 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          Auth
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Sign In
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Sign in using your user ID and password.
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>User ID</FormLabel>
            <FormInput
              placeholder="Enter your user ID"
              autoCapitalize="none"
              value={userId}
              onChangeText={setUserId}
            />
          </View>

          <View>
            <FormLabel>Password</FormLabel>
            <FormInput
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isSubmitting}
          className="mt-8 rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600 disabled:opacity-60"
        >
          <Text
            className="text-center text-lg text-white"
            style={{ fontFamily: "Sora" }}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              New here? Create Account
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity className="mt-4">
            <Text
              className="text-center text-sm text-orange-800/80"
              style={{ fontFamily: "Manrope" }}
            >
              Back to Home
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
