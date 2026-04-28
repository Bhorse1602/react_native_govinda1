import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";

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
  const [gender, setGender] = useState("Male");
  const [sampraday, setSampraday] = useState("Gaudiya");

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
            <FormInput placeholder="Enter your name" />
          </View>

          <View>
            <FormLabel>User ID</FormLabel>
            <FormInput
              placeholder="Choose a unique user ID"
              autoCapitalize="none"
            />
          </View>

          <View>
            <FormLabel>Age</FormLabel>
            <FormInput placeholder="Enter your age" keyboardType="number-pad" />
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
            <FormInput placeholder="DD / MM / YYYY" keyboardType="number-pad" />
          </View>

          <View>
            <FormLabel>Password</FormLabel>
            <FormInput placeholder="Create password" secureTextEntry />
          </View>

          <View>
            <FormLabel>Confirm Password</FormLabel>
            <FormInput placeholder="Re-enter password" secureTextEntry />
          </View>
        </View>

        <TouchableOpacity className="mt-8 rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600">
          <Text
            className="text-center text-lg text-white"
            style={{ fontFamily: "Sora" }}
          >
            Create Account
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
