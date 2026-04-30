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
      Alert.alert("अपूर्ण जानकारी", "कृपया यूज़र आईडी और पासवर्ड भरें।");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signInWithCredentials(userId, password);

      if (!user) {
        Alert.alert("लॉगिन असफल", "यूज़र आईडी या पासवर्ड सही नहीं है।");
        return;
      }

      await setCurrentSession(user.user_id);

      Alert.alert("स्वागत है", `${user.full_name} के रूप में लॉगिन हुआ।`, [
        {
          text: "आगे बढ़ें",
          onPress: () => router.replace("/tabs"),
        },
      ]);
    } catch {
      Alert.alert("लॉगिन असफल", "साइन इन करते समय कुछ गड़बड़ हुई।");
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
          प्रवेश
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          साइन इन
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          अपनी यूज़र आईडी और पासवर्ड से प्रवेश करें।
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>यूज़र आईडी</FormLabel>
            <FormInput
              placeholder="अपनी यूज़र आईडी लिखें"
              autoCapitalize="none"
              value={userId}
              onChangeText={setUserId}
            />
          </View>

          <View>
            <FormLabel>पासवर्ड</FormLabel>
            <FormInput
              placeholder="अपना पासवर्ड लिखें"
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
            {isSubmitting ? "लॉगिन हो रहा है..." : "लॉगिन"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              नए हैं? खाता बनाइए
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity className="mt-4">
            <Text
              className="text-center text-sm text-orange-800/80"
              style={{ fontFamily: "Manrope" }}
            >
              मुख्य पृष्ठ पर जाएँ
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
