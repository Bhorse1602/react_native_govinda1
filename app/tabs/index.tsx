import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import "@/global.css";
import { Link } from "expo-router";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            {/* Header */}
            <View className="items-center mb-12">
                <Text className="text-4xl font-bold text-blue-600 mb-3">
                    Welcome to Govinda Naam jaap App👋
                </Text>
                <Text className="text-gray-600 text-center text-lg">
                    Join us and explore amazing features
                </Text>
            </View>

            {/* Buttons */}
            <View className="w-full max-w-sm gap-y-4">
                {/* Sign Up Button */}
                <Link href="/auth/sign-up" asChild>
                    <TouchableOpacity className="bg-blue-600 py-4 rounded-2xl active:bg-blue-700">
                        <Text className="text-white text-center text-lg font-semibold">
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </Link>

                {/* Sign In Button */}
                <Link href="/auth/sign-in" asChild>
                    <TouchableOpacity className="bg-white border-2 border-blue-600 py-4 rounded-2xl active:bg-gray-50">
                        <Text className="text-blue-600 text-center text-lg font-semibold">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Footer */}
            <Text className="text-gray-500 mt-10 text-sm">
                Already have an account? Sign in above
            </Text>
        </View>
    );
}
