import {
  addDeityForUser,
  getCurrentSessionUser,
  getDeitiesForUser,
  setActiveDeityForUser,
  clearCurrentSession,
  type DeityRecord,
} from "@/lib/auth-db";
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

export default function Setting() {
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState<string | null>(null);
  const [deities, setDeities] = useState<DeityRecord[]>([]);
  const [newDeityName, setNewDeityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        if (mounted) {
          setDeities(userDeities);
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

    try {
      await addDeityForUser(userId, newDeityName);
      setNewDeityName("");
      await refreshDeities(userId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "इष्ट नाम जोड़ा नहीं जा सका।";
      Alert.alert("इष्ट नाम जोड़ना असफल", message);
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
    Alert.alert("लॉग आउट", "क्या आप वाकई लॉग आउट करना चाहते हैं?", [
      { text: "नहीं", style: "cancel" },
      {
        text: "हाँ, लॉग आउट",
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
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <Text style={{ fontFamily: "Manrope" }}>Loading settings...</Text>
        
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
          सेटिंग्स
        </Text>
        <Text
          className="mb-4 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          इष्ट विन्यास
        </Text>
        <Text
          className="text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          यहाँ इष्ट नाम जोड़ें और चुनें कि होम पेज के जप बटन पर कौन-सा नाम दिखे।
        </Text>
      </View>

      <View className="mt-6 rounded-[28px] bg-orange-900 px-6 py-6">
        <Text
          className="mb-3 text-xl text-orange-50"
          style={{ fontFamily: "Sora" }}
        >
          नया इष्ट जोड़ें
        </Text>
        <TextInput
          value={newDeityName}
          onChangeText={setNewDeityName}
          placeholder="इष्ट नाम लिखें"
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
            {saving ? "सहेजा जा रहा है..." : "इष्ट जोड़ें"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 rounded-[28px] border border-orange-200 bg-white/85 px-6 py-6">
        <Text
          className="mb-4 text-xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          उपलब्ध इष्ट नाम
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
          किसी भी नाम पर टैप करके उसे होम पेज का सक्रिय जप नाम बनाइए।
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
            लॉगआउट
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
