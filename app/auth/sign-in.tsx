import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const SignIn = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="mb-6 text-3xl font-bold text-blue-600">Sign In</Text>
            <Link href="/" asChild>
                <TouchableOpacity className="rounded-2xl bg-blue-600 px-6 py-4 active:bg-blue-700">
                    <Text className="text-lg font-semibold text-white">Back to Home</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default SignIn;
