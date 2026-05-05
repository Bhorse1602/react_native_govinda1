import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { setCurrentSession, signInWithMobileAndPassword } from "@/lib/auth-db";
import { useLanguage } from "@/lib/language-context";

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
  const { language } = useLanguage();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!mobileNumber.trim() || !password) {
      Alert.alert(
        language === "hi" ? "अपूर्ण जानकारी" : "Missing information",
        language === "hi"
          ? "कृपया मोबाइल नंबर और पासवर्ड भरें।"
          : "Please enter mobile number and password."
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      Alert.alert(
        language === "hi" ? "गलत मोबाइल नंबर" : "Invalid mobile number",
        language === "hi"
          ? "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signInWithMobileAndPassword(mobileNumber, password);

      if (!user) {
        Alert.alert(
          language === "hi" ? "लॉगिन असफल" : "Login failed",
          language === "hi"
            ? "मोबाइल नंबर या पासवर्ड सही नहीं है।"
            : "Mobile number or password is incorrect."
        );
        return;
      }

      await setCurrentSession(user.user_id);

      Alert.alert(
        language === "hi" ? "स्वागत है" : "Welcome",
        language === "hi"
          ? `${user.full_name} के रूप में लॉगिन हुआ।`
          : `Logged in as ${user.full_name}.`,
        [
        {
          text: language === "hi" ? "आगे बढ़ें" : "Continue",
          onPress: () => router.replace("/tabs"),
        },
      ]);
    } catch {
      Alert.alert(
        language === "hi" ? "लॉगिन असफल" : "Login failed",
        language === "hi"
          ? "साइन इन करते समय कुछ गड़बड़ हुई।"
          : "Something went wrong while signing in."
      );
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
          {language === "hi" ? "प्रवेश" : "Access"}
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "साइन इन" : "Sign In"}
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          {language === "hi"
            ? "अपने मोबाइल नंबर और पासवर्ड से प्रवेश करें।"
            : "Sign in with your mobile number and password."}
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>{language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}</FormLabel>
            <FormInput
              placeholder={
                language === "hi"
                  ? "अपना 10 अंकों का मोबाइल नंबर लिखें"
                  : "Enter your 10-digit mobile number"
              }
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
          </View>

          <View>
            <FormLabel>{language === "hi" ? "पासवर्ड" : "Password"}</FormLabel>
            <FormInput
              placeholder={language === "hi" ? "अपना पासवर्ड लिखें" : "Enter password"}
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
            {isSubmitting
              ? language === "hi"
                ? "लॉगिन हो रहा है..."
                : "Signing in..."
              : language === "hi"
                ? "लॉगिन"
                : "Sign In"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              {language === "hi" ? "नए हैं? खाता बनाइए" : "New here? Create account"}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity className="mt-4">
            <Text
              className="text-center text-sm text-orange-800/80"
              style={{ fontFamily: "Manrope" }}
            >
              {language === "hi" ? "मुख्य पृष्ठ पर जाएँ" : "Go to home page"}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
