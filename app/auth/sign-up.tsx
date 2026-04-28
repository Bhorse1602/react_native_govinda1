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

const genderOptions = ["Male", "Female", "Other"];
const sampradayOptions = ["Gaudiya", "Ramanandi", "Madhva", "Sri Vaishnava"];

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
      Alert.alert("Missing details", "Please fill all required fields.");
      return;
    }

    if (!Number.isFinite(parsedAge) || parsedAge <= 0) {
      Alert.alert("Invalid age", "Please enter a valid age.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak password",
        "Password should be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
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

      Alert.alert("Account created", "You can now sign in with your user ID.", [
        {
          text: "Continue",
          onPress: () =>
            router.push({
              pathname: "/auth/sign-in",
              params: { userId: trimmedUserId },
            }),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create account.";
      Alert.alert("Sign up failed", message);
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
          Auth
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          Sign Up
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          Create your devotional profile and secure your account with a user ID
          and password.
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>Full Name</FormLabel>
            <FormInput
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View>
            <FormLabel>User ID</FormLabel>
            <FormInput
              placeholder="Choose a unique user ID"
              autoCapitalize="none"
              value={userId}
              onChangeText={setUserId}
            />
          </View>

          <View>
            <FormLabel>Age</FormLabel>
            <FormInput
              placeholder="Enter your age"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View>
            <FormLabel>Gender</FormLabel>
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
            <FormLabel>Sampraday</FormLabel>
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
            <FormLabel>Date of Birth</FormLabel>
            <FormInput
              placeholder="DD / MM / YYYY"
              keyboardType="number-pad"
              value={dob}
              onChangeText={setDob}
            />
          </View>

          <View>
            <FormLabel>Password</FormLabel>
            <FormInput
              placeholder="Create password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <FormLabel>Confirm Password</FormLabel>
            <FormInput
              placeholder="Re-enter password"
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              Already have a user ID? Sign In
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
