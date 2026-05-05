import {
  addDeityForUser,
  getCurrentSessionUser,
  getDeitiesForUser,
  setActiveDeityForUser,
  clearCurrentSession,
  getAllUsersForDebug,
  resetAllLocalData,
  type DebugUserRecord,
  type DeityRecord,
} from "@/lib/auth-db";
import { useLanguage } from "@/lib/language-context";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DEFAULT_DEITY_SUGGESTIONS = ["श्री राम", "श्री राधा", "शिव", "राम", "दुर्गा", "सीता राम"] as const;

export default function Setting() {
  const { language, setLanguage } = useLanguage();
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState<string | null>(null);
  const [deities, setDeities] = useState<DeityRecord[]>([]);
  const [newDeityName, setNewDeityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [debugUsers, setDebugUsers] = useState<DebugUserRecord[]>([]);
  const [loadingDebugUsers, setLoadingDebugUsers] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const currentUser = await getCurrentSessionUser();
        if (!mounted) {
          return;
        }

        if (!currentUser) {
          setUserId(null);
          setDeities([]);
          return;
        }

        setUserId(currentUser.user_id);
        const userDeities = await getDeitiesForUser(currentUser.user_id);
        
        // If user has no deities, pre-populate with default deities
        if (userDeities.length === 0) {
          for (const deityName of DEFAULT_DEITY_SUGGESTIONS) {
            try {
              await addDeityForUser(currentUser.user_id, deityName);
            } catch (error) {
              // Ignore errors (e.g., duplicate names)
              // The addDeityForUser function already handles duplicates
            }
          }
          // Refresh the list after adding default deities
          const updatedDeities = await getDeitiesForUser(currentUser.user_id);
          // Set the first deity as active if we have any
          if (updatedDeities.length > 0) {
            await setActiveDeityForUser(currentUser.user_id, updatedDeities[0].id);
          }
          if (mounted) {
            setDeities(updatedDeities);
          }
        } else {
          if (mounted) {
            setDeities(userDeities);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (isFocused) {
      setLoading(true);
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  async function refreshDeities(activeUserId: string) {
    const userDeities = await getDeitiesForUser(activeUserId);
    setDeities(userDeities);
  }

  async function handleAddDeity() {
    if (!userId) {
      return;
    }

    setSaving(true);
    const trimmedName = newDeityName.trim();

    try {
      await addDeityForUser(userId, trimmedName);
      setNewDeityName("");

      // Refresh to get the updated list with the new deity
      const updatedDeities = await getDeitiesForUser(userId);
      const addedDeity = updatedDeities.find((d) => d.name === trimmedName);
      if (addedDeity) {
        await setActiveDeityForUser(userId, addedDeity.id);
      }

      // Refresh UI
      await refreshDeities(userId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : language === "hi"
            ? "इष्ट नाम जोड़ा नहीं जा सका।"
            : "Could not add deity name.";
      Alert.alert(
        language === "hi" ? "इष्ट नाम जोड़ना असफल" : "Add deity failed",
        message
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSelectDeity(deityId: number) {
    if (!userId) {
      return;
    }

    await setActiveDeityForUser(userId, deityId);
    await refreshDeities(userId);
  }

  function confirmLogout() {
    Alert.alert(
      language === "hi" ? "लॉग आउट" : "Logout",
      language === "hi"
        ? "क्या आप वाकई लॉग आउट करना चाहते हैं?"
        : "Are you sure you want to log out?",
      [
      { text: language === "hi" ? "नहीं" : "No", style: "cancel" },
      {
        text: language === "hi" ? "हाँ, लॉग आउट" : "Yes, logout",
        onPress: async () => {
          try {
            await clearCurrentSession();
          } catch (e) {
            // ignore errors while clearing session
          }
          // Navigate back to public landing
          router.replace("/");
        },
      },
      ]
    );
  }

  async function handleLoadAllUsers() {
    setLoadingDebugUsers(true);
    try {
      const users = await getAllUsersForDebug();
      setDebugUsers(users);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : language === "hi"
            ? "यूज़र डेटा लोड नहीं हो पाया।"
            : "Could not load user data.";
      Alert.alert(language === "hi" ? "त्रुटि" : "Error", message);
    } finally {
      setLoadingDebugUsers(false);
    }
  }

  function confirmResetLocalDb() {
    Alert.alert(
      language === "hi" ? "लोकल डेटा रीसेट करें" : "Reset local data",
      language === "hi"
        ? "यह सभी यूज़र, जप, इष्ट और सेशन डेटा हटा देगा। क्या जारी रखें?"
        : "This will delete all users, chants, deity, and session data on this device. Continue?",
      [
        { text: language === "hi" ? "रद्द करें" : "Cancel", style: "cancel" },
        {
          text: language === "hi" ? "हाँ, रीसेट" : "Yes, reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetAllLocalData();
              setDebugUsers([]);
              setUserId(null);
              setDeities([]);
              Alert.alert(
                language === "hi" ? "रीसेट पूर्ण" : "Reset complete",
                language === "hi"
                  ? "डिवाइस का लोकल डेटा साफ कर दिया गया है।"
                  : "Device local data has been cleared."
              );
              router.replace("/");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : language === "hi"
                    ? "डेटाबेस रीसेट नहीं हो पाया।"
                    : "Could not reset database.";
              Alert.alert(language === "hi" ? "त्रुटि" : "Error", message);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <Text style={{ fontFamily: "Manrope" }}>
          {language === "hi" ? "सेटिंग्स लोड हो रही है..." : "Loading settings..."}
        </Text>
        
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-orange-50"
      contentContainerClassName="px-6 pb-28 pt-16"
      keyboardShouldPersistTaps="handled"
    >
      <View className="rounded-[30px] border border-orange-200 bg-white/85 px-6 py-8">
        <Text
          className="mb-2 text-sm uppercase tracking-[3px] text-orange-700"
          style={{ fontFamily: "Manrope" }}
        >
          {language === "hi" ? "सेटिंग्स" : "Settings"}
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "इष्ट विन्यास" : "Deity Setup"}
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          {language === "hi"
            ? "यहाँ इष्ट नाम जोड़ें और चुनें कि होम पेज के जप बटन पर कौन-सा नाम दिखे।"
            : "Add deity names and choose which name appears on the home jaap button."}
        </Text>
      </View>

      <View className="mt-6 rounded-[28px] border border-orange-200 bg-white/85 px-6 py-6">
        <Text
          className="mb-4 text-xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "भाषा" : "Language"}
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

      <View className="mt-6 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-3 text-xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "नया इष्ट जोड़ें" : "Add New Deity"}
        </Text>
        <TextInput
          value={newDeityName}
          onChangeText={setNewDeityName}
          placeholder={language === "hi" ? "इष्ट नाम लिखें" : "Enter deity name"}
          placeholderTextColor="#fed7aa"
          className="rounded-[18px] bg-orange-50 px-4 py-4 text-base text-orange-950"
          style={{ fontFamily: "Manrope" }}
        />
        <TouchableOpacity
          onPress={handleAddDeity}
          disabled={saving}
          className="mt-4 rounded-[24px] bg-orange-500 px-6 py-4 active:bg-orange-600 disabled:opacity-70"
        >
          <Text
            className="text-center text-lg text-white"
            style={{ fontFamily: "Sora" }}
          >
            {saving
              ? language === "hi"
                ? "सहेजा जा रहा है..."
                : "Saving..."
              : language === "hi"
                ? "इष्ट जोड़ें"
                : "Add Deity"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 rounded-[28px] border border-orange-200 bg-white/85 px-6 py-6">
        <Text
          className="mb-4 text-xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "उपलब्ध इष्ट नाम" : "Available Deities"}
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {deities.map((deity) => {
            const active = deity.is_active === 1;

            return (
              <Pressable
                key={deity.id}
                onPress={() => handleSelectDeity(deity.id)}
                className={`rounded-full px-4 py-3 ${
                  active
                    ? "bg-orange-500"
                    : "border border-orange-200 bg-orange-50"
                }`}
              >
                <Text
                  className={`text-sm ${active ? "text-white" : "text-orange-900"}`}
                  style={{ fontFamily: "Manrope" }}
                >
                  {deity.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text
          className="mt-4 text-sm text-orange-800/80"
          style={{ fontFamily: "Manrope" }}
        >
          {language === "hi"
            ? "किसी भी नाम पर टैप करके उसे होम पेज का सक्रिय जप नाम बनाइए।"
            : "Tap any deity name to make it the active home jaap name."}
        </Text>
      </View>

      <View className="mt-6">
        <TouchableOpacity
          onPress={confirmLogout}
          className="rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200"
        >
          <Text
            className="text-center text-lg text-orange-900"
            style={{ fontFamily: "Sora" }}
          >
            {language === "hi" ? "लॉगआउट" : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>

      {__DEV__ ? (
        <View className="mt-6 rounded-[28px] border border-orange-300 bg-amber-50 px-6 py-6">
          <Text className="mb-2 text-lg text-orange-950" style={{ fontFamily: "Sora" }}>
            {language === "hi" ? "डेवलपर टूल्स" : "Developer Tools"}
          </Text>
          <Text
            className="mb-4 text-sm text-orange-800/85"
            style={{ fontFamily: "Manrope" }}
          >
            {language === "hi"
              ? "यह सेक्शन केवल डेवलपमेंट मोड में दिखाई देता है।"
              : "This section is visible only in development mode."}
          </Text>

          <View className="flex-row gap-x-3">
            <TouchableOpacity
              onPress={handleLoadAllUsers}
              disabled={loadingDebugUsers}
              className="flex-1 rounded-[18px] bg-orange-500 px-4 py-3 active:bg-orange-600 disabled:opacity-70"
            >
              <Text className="text-center text-white" style={{ fontFamily: "Sora" }}>
                {loadingDebugUsers
                  ? language === "hi"
                    ? "लोड हो रहा..."
                    : "Loading..."
                  : language === "hi"
                    ? "सभी यूज़र दिखाएँ"
                    : "Show All Users"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmResetLocalDb}
              className="flex-1 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 active:bg-red-100"
            >
              <Text className="text-center text-red-700" style={{ fontFamily: "Sora" }}>
                {language === "hi" ? "लोकल DB रीसेट" : "Reset Local DB"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 gap-y-3">
            {debugUsers.map((user) => (
              <View
                key={user.id}
                className="rounded-[16px] border border-orange-200 bg-white px-4 py-3"
              >
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  ID: {user.id}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  User ID: {user.user_id}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  Mobile: {user.mobile_number}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  Age: {user.age} | Gender: {user.gender}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  Sampraday: {user.sampraday}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  DOB: {user.dob}
                </Text>
                <Text className="text-sm text-orange-950" style={{ fontFamily: "Manrope" }}>
                  Password: {user.password}
                </Text>
              </View>
            ))}
            {!loadingDebugUsers && debugUsers.length === 0 ? (
              <Text className="text-sm text-orange-800/80" style={{ fontFamily: "Manrope" }}>
                {language === "hi"
                  ? "यूज़र सूची खाली है।"
                  : "User list is empty."}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
