import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppLanguage, useLanguage } from "@/lib/language-context";

const landingCopy: Record<
  AppLanguage,
  {
    appTitle: string;
    subtitle: string;
    startLabel: string;
    startDescription: string;
    signUp: string;
    signIn: string;
    helper: string;
    languageLabel: string;
  }
> = {
  en: {
    appTitle: "Ramanandi Naam Jaap Counter",
    subtitle: "Join this simple path of devotion, chanting, and spiritual practice",
    startLabel: "Get Started",
    startDescription: "Create an account or sign in to continue.",
    signUp: "Create Account",
    signIn: "Sign In",
    helper: "If you already have an account, sign in above",
    languageLabel: "Choose Language",
  },
  hi: {
    appTitle: "Ramanandi Naam Jaap Counter",
    subtitle: "भक्ति, जप और साधना के इस सरल पथ से जुड़िए",
    startLabel: "प्रारम्भ करें",
    startDescription: "आगे बढ़ने के लिए खाता बनाइए या साइन इन कीजिए।",
    signUp: "खाता बनाइए",
    signIn: "साइन इन",
    helper: "यदि आपका खाता पहले से है, तो ऊपर साइन इन करें",
    languageLabel: "भाषा चुनें",
  },
};

export default function PublicLanding() {
  const { language, setLanguage } = useLanguage();
  const copy = landingCopy[language];

  return (
    <View className="flex-1 overflow-hidden bg-orange-50 px-6 pb-16 pt-16">
      <View className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-orange-200/60" />
      <View className="absolute -right-8 top-28 h-32 w-32 rounded-full bg-amber-300/40" />
      <View className="absolute bottom-32 left-6 h-24 w-24 rounded-full bg-yellow-200/50" />

      <View className="mb-10 rounded-[32px] border border-orange-200 bg-white/80 px-6 py-8">
        <Text
          className="mb-4 text-center text-4xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {copy.appTitle}
        </Text>
        <Text
          className="text-center text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          {copy.subtitle}
        </Text>
      </View>

      <View className="mb-6 rounded-[24px] border border-orange-200 bg-white/80 px-5 py-4">
        <Text
          className="mb-3 text-sm uppercase tracking-[2px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          {copy.languageLabel}
        </Text>
        <View className="flex-row gap-x-3">
          <TouchableOpacity
            onPress={() => setLanguage("en")}
            className={`flex-1 rounded-[16px] px-4 py-3 ${language === "en" ? "bg-orange-500" : "bg-orange-100"}`}
          >
            <Text
              className={`text-center ${language === "en" ? "text-white" : "text-orange-900"}`}
              style={{ fontFamily: "Sora" }}
            >
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage("hi")}
            className={`flex-1 rounded-[16px] px-4 py-3 ${language === "hi" ? "bg-orange-500" : "bg-orange-100"}`}
          >
            <Text
              className={`text-center ${language === "hi" ? "text-white" : "text-orange-900"}`}
              style={{ fontFamily: "Sora" }}
            >
              हिन्दी
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-8 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-2 text-sm uppercase tracking-[2px] text-orange-200"
          style={{ fontFamily: "Manrope" }}
        >
          {copy.startLabel}
        </Text>
        <Text
          className="text-2xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          {copy.startDescription}
        </Text>
      </View>

      <View className="w-full gap-y-4">
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity className="rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600">
            <Text
              className="text-center text-lg text-white"
              style={{ fontFamily: "Sora" }}
            >
              {copy.signUp}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-lg text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              {copy.signIn}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

    </View>
  );
}
