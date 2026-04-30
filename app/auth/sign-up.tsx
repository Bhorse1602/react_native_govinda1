import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/auth-db";

const genderOptions = ["पुरुष", "महिला", "अन्य"];
const sampradayOptions = [
  "गौड़ीय",
  "रामानंदी",
  "माध्व",
  "श्री वैष्णव",
];

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

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [sampraday, setSampraday] = useState("Gaudiya");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateAccount() {
    const trimmedName = fullName.trim();
    const trimmedUserId = userId.trim();
    const parsedAge = Number(age);

    if (
      !trimmedName ||
      !trimmedUserId ||
      !age.trim() ||
      !dob.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("अपूर्ण जानकारी", "कृपया सभी आवश्यक जानकारी भरें।");
      return;
    }

    if (!Number.isFinite(parsedAge) || parsedAge <= 0) {
      Alert.alert("गलत आयु", "कृपया सही आयु दर्ज करें।");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "कमज़ोर पासवर्ड",
        "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("पासवर्ड मेल नहीं खाते", "दोनों पासवर्ड एक समान नहीं हैं।");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({
        fullName: trimmedName,
        userId: trimmedUserId,
        age: parsedAge,
        gender,
        sampraday,
        dob,
        password,
      });

      Alert.alert("खाता बन गया", "अब आप अपनी यूज़र आईडी से साइन इन कर सकते हैं।", [
        {
          text: "आगे बढ़ें",
          onPress: () =>
            router.push({
              pathname: "/auth/sign-in",
              params: { userId: trimmedUserId },
            }),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "खाता नहीं बन पाया।";
      Alert.alert("साइन अप असफल", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-orange-50"
      contentContainerClassName="px-6 pb-12 pt-14"
      keyboardShouldPersistTaps="handled"
    >
      <View className="rounded-[30px] border border-orange-200 bg-white/90 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          पंजीकरण
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          साइन अप
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          अपनी भक्ति-प्रोफ़ाइल बनाइए और यूज़र आईडी व पासवर्ड से खाता सुरक्षित कीजिए।
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>पूरा नाम</FormLabel>
            <FormInput
              placeholder="अपना नाम लिखें"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View>
            <FormLabel>यूज़र आईडी</FormLabel>
            <FormInput
              placeholder="एक अलग यूज़र आईडी चुनें"
              autoCapitalize="none"
              value={userId}
              onChangeText={setUserId}
            />
          </View>

          <View>
            <FormLabel>आयु</FormLabel>
            <FormInput
              placeholder="अपनी आयु लिखें"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View>
            <FormLabel>लिंग</FormLabel>
            <View className="flex-row flex-wrap gap-3">
              {genderOptions.map((option) => {
                const selected = gender === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setGender(option)}
                    className={`rounded-full px-4 py-3 ${
                      selected
                        ? "bg-orange-500"
                        : "border border-orange-200 bg-orange-50"
                    }`}
                  >
                    <Text
                      className={`text-sm ${selected ? "text-white" : "text-orange-900"}`}
                      style={{ fontFamily: "Manrope" }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <FormLabel>सम्प्रदाय</FormLabel>
            <View className="flex-row flex-wrap gap-3">
              {sampradayOptions.map((option) => {
                const selected = sampraday === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setSampraday(option)}
                    className={`rounded-full px-4 py-3 ${
                      selected
                        ? "bg-orange-500"
                        : "border border-orange-200 bg-orange-50"
                    }`}
                  >
                    <Text
                      className={`text-sm ${selected ? "text-white" : "text-orange-900"}`}
                      style={{ fontFamily: "Manrope" }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <FormLabel>जन्म तिथि</FormLabel>
            <FormInput
              placeholder="DD / MM / YYYY"
              keyboardType="number-pad"
              value={dob}
              onChangeText={setDob}
            />
          </View>

          <View>
            <FormLabel>पासवर्ड</FormLabel>
            <FormInput
              placeholder="पासवर्ड बनाइए"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <FormLabel>पासवर्ड की पुष्टि</FormLabel>
            <FormInput
              placeholder="पासवर्ड फिर से लिखें"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCreateAccount}
          disabled={isSubmitting}
          className="mt-8 rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600 disabled:opacity-60"
        >
          <Text
            className="text-center text-lg text-white"
            style={{ fontFamily: "Sora" }}
        >
            {isSubmitting ? "खाता बन रहा है..." : "खाता बनाइए"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              यदि यूज़र आईडी है, तो साइन इन करें
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
