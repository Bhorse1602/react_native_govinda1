import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createUser } from "@/lib/auth-db";
import { useLanguage } from "@/lib/language-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const genderOptions = {
  hi: ["पुरुष", "महिला", "अन्य"],
  en: ["Male", "Female", "Other"],
} as const;

const sampradayOptions = {
  hi: ["गौड़ीय", "रामानंदी", "माध्व", "श्री वैष्णव"],
  en: ["Gaudiya", "Ramanandi", "Madhva", "Sri Vaishnava"],
} as const;

type GenderOption = typeof genderOptions.hi[number] | typeof genderOptions.en[number];
type SampradayOption = typeof sampradayOptions.hi[number] | typeof sampradayOptions.en[number];

const PASSWORD_REGEX = /^[0-9]{4,}$/;

function parseDob(input: string) {
  const normalized = input.trim().replace(/\s+/g, "");
  const match = normalized.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  const validDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!validDate) {
    return null;
  }

  return { day, month, year, date };
}

function getAgeFromDob(dobDate: Date) {
  const today = new Date();
  let years = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }

  return years;
}

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

function PasswordInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onToggleVisibility,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <View className="flex-row items-center rounded-[18px] border border-orange-200 bg-orange-50 px-4">
      <TextInput
        placeholderTextColor="#9a7b5f"
        className="flex-1 py-4 text-base text-orange-950"
        style={{ fontFamily: "Manrope" }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType="number-pad"
        inputMode="numeric"
      />
      <TouchableOpacity
        onPress={onToggleVisibility}
        className="ml-2 p-1"
        accessibilityRole="button"
      >
        <Ionicons
          name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
          size={20}
          color="#9a3412"
        />
      </TouchableOpacity>
    </View>
  );
}

export default function SignUp() {
  const { language } = useLanguage();
  const currentGenderOptions = genderOptions[language];
  const currentSampradayOptions = sampradayOptions[language];
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState<GenderOption>(currentGenderOptions[0]);
  const [sampraday, setSampraday] = useState<SampradayOption>(currentSampradayOptions[0]);
  const [dob, setDob] = useState("01/01/2000");
  const [dobDate, setDobDate] = useState(new Date(2000, 0, 1));
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!(currentGenderOptions as readonly string[]).includes(gender)) {
      setGender(currentGenderOptions[0]);
    }
    if (!(currentSampradayOptions as readonly string[]).includes(sampraday)) {
      setSampraday(currentSampradayOptions[0]);
    }
  }, [currentGenderOptions, currentSampradayOptions, gender, sampraday]);

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function buildUserIdFromName(name: string) {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s._-]/gu, "")
      .replace(/\s+/g, "-")
      .slice(0, 16);
    const fallback = normalized.length >= 4 ? normalized : "bhakt";
    const suffix = String(Date.now()).slice(-6);
    return `${fallback}-${suffix}`;
  }

  function handleDobValueChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    if (!selectedDate) {
      return;
    }
    setDobDate(selectedDate);
    setDob(formatDate(selectedDate));
    setShowDobPicker(false);
  }

  function openDobPicker() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dobDate,
        mode: "date",
        display: "calendar",
        maximumDate: new Date(),
        minimumDate: new Date(1900, 0, 1),
        onChange: (event, selectedDate) => {
          if (event.type !== "set" || !selectedDate) {
            return;
          }
          setDobDate(selectedDate);
          setDob(formatDate(selectedDate));
        },
      });
      return;
    }

    setShowDobPicker((prev) => !prev);
  }

  async function handleCreateAccount() {
    const trimmedName = fullName.trim();
    const trimmedMobile = mobileNumber.trim();
    const parsedDob = parseDob(dob);
    const generatedUserId = buildUserIdFromName(trimmedName);
    const parsedAge = parsedDob ? getAgeFromDob(parsedDob.date) : NaN;

    if (
      !trimmedName ||
      !trimmedMobile ||
      !dob.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("अपूर्ण जानकारी", "कृपया सभी आवश्यक जानकारी भरें।");
      return;
    }

    if (trimmedName.length < 2 || !/^[\p{L}\s.'-]+$/u.test(trimmedName)) {
      Alert.alert(
        "गलत नाम",
        "कृपया सही पूरा नाम दर्ज करें (कम से कम 2 अक्षर, केवल अक्षर/स्पेस)।"
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(trimmedMobile)) {
      Alert.alert("गलत मोबाइल नंबर", "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।");
      return;
    }

    if (!(currentGenderOptions as readonly string[]).includes(gender)) {
      Alert.alert("गलत लिंग", "कृपया सूची में से सही लिंग चुनें।");
      return;
    }

    if (!(currentSampradayOptions as readonly string[]).includes(sampraday)) {
      Alert.alert("गलत सम्प्रदाय", "कृपया सूची में से सही सम्प्रदाय चुनें।");
      return;
    }

    if (!parsedDob) {
      Alert.alert(
        "गलत जन्म तिथि",
        "कृपया जन्म तिथि DD/MM/YYYY या DD-MM-YYYY के सही प्रारूप में दर्ज करें।"
      );
      return;
    }

    const today = new Date();
    if (parsedDob.date > today) {
      Alert.alert("गलत जन्म तिथि", "जन्म तिथि भविष्य की नहीं हो सकती।");
      return;
    }

    if (parsedDob.year < 1900) {
      Alert.alert("गलत जन्म तिथि", "कृपया 1900 के बाद की सही जन्म तिथि दर्ज करें।");
      return;
    }

    if (!Number.isFinite(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      Alert.alert("गलत जन्म तिथि", "कृपया 5 से 120 वर्ष के बीच की सही जन्म तिथि चुनें।");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      Alert.alert(
        "कमज़ोर पासवर्ड",
        "फिलहाल पासवर्ड केवल अंकों में रखें (कम से कम 4 अंक)।"
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
        userId: generatedUserId,
        mobileNumber: trimmedMobile,
        age: parsedAge,
        gender,
        sampraday,
        dob: `${String(parsedDob.day).padStart(2, "0")}/${String(
          parsedDob.month
        ).padStart(2, "0")}/${parsedDob.year}`,
        password,
      });

      Alert.alert("खाता बन गया", "अब आप अपने नाम और पासवर्ड से साइन इन कर सकते हैं।", [
        {
          text: "आगे बढ़ें",
          onPress: () => router.push("/auth/sign-in"),
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
          {language === "hi" ? "पंजीकरण" : "Register"}
        </Text>
        <Text
          className="mb-3 text-3xl text-orange-950"
          style={{ fontFamily: "Sora" }}
        >
          {language === "hi" ? "साइन अप" : "Sign Up"}
        </Text>
        <Text
          className="mb-8 text-base leading-7 text-orange-900/80"
          style={{ fontFamily: "Manrope" }}
        >
          {language === "hi"
            ? "अपनी भक्ति-प्रोफ़ाइल बनाइए। नाम और पासवर्ड से सुरक्षित साइन इन करें।"
            : "Create your devotional profile and sign in securely with mobile and password."}
        </Text>

        <View className="gap-y-5">
          <View>
            <FormLabel>{language === "hi" ? "पूरा नाम" : "Full Name"}</FormLabel>
            <FormInput
              placeholder={language === "hi" ? "अपना नाम लिखें" : "Enter your name"}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View>
            <FormLabel>{language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}</FormLabel>
            <FormInput
              placeholder={language === "hi" ? "जैसे 9876543210" : "e.g. 9876543210"}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
          </View>

          <View>
            <FormLabel>{language === "hi" ? "लिंग" : "Gender"}</FormLabel>
            <View className="flex-row flex-wrap gap-3">
              {currentGenderOptions.map((option) => {
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
            <FormLabel>{language === "hi" ? "सम्प्रदाय" : "Sampraday"}</FormLabel>
            <View className="flex-row flex-wrap gap-3">
              {currentSampradayOptions.map((option) => {
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
            <FormLabel>{language === "hi" ? "जन्म तिथि" : "Date of Birth"}</FormLabel>
            <TouchableOpacity
              onPress={openDobPicker}
              className="rounded-[18px] border border-orange-300 bg-orange-100/80 px-4 py-4"
            >
              <Text className="text-base text-orange-950" style={{ fontFamily: "Manrope" }}>
                {dob}
                {Number.isFinite(getAgeFromDob(dobDate))
                  ? language === "hi"
                    ? `   (आयु: ${getAgeFromDob(dobDate)})`
                    : `   (Age: ${getAgeFromDob(dobDate)})`
                  : ""}
              </Text>
            </TouchableOpacity>
            {showDobPicker ? (
              <View className="mt-3 overflow-hidden rounded-[18px] border border-orange-300 bg-orange-100 px-2 py-2">
                <DateTimePicker
                  value={dobDate}
                  mode="date"
                  display="inline"
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  themeVariant="light"
                  textColor="#f97316"
                  accentColor="#f97316"
                  onChange={handleDobValueChange}
                />
              </View>
            ) : null}
          </View>

          <View>
            <FormLabel>{language === "hi" ? "पासवर्ड" : "Password"}</FormLabel>
            <PasswordInput
              placeholder={language === "hi" ? "पासवर्ड बनाइए" : "Create password"}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onToggleVisibility={() => setShowPassword((prev) => !prev)}
            />
          </View>

          <View>
            <FormLabel>{language === "hi" ? "पासवर्ड की पुष्टि" : "Confirm Password"}</FormLabel>
            <PasswordInput
              placeholder={language === "hi" ? "पासवर्ड फिर से लिखें" : "Re-enter password"}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onToggleVisibility={() => setShowPassword((prev) => !prev)}
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
            {isSubmitting
              ? language === "hi"
                ? "खाता बन रहा है..."
                : "Creating account..."
              : language === "hi"
                ? "खाता बनाइए"
                : "Create Account"}
          </Text>
        </TouchableOpacity>

        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity className="mt-4 rounded-[24px] border border-orange-300 bg-orange-100/80 px-6 py-4 active:bg-orange-200">
            <Text
              className="text-center text-base text-orange-900"
              style={{ fontFamily: "Sora" }}
            >
              {language === "hi" ? "यदि खाता है, तो साइन इन करें" : "Already have an account? Sign in"}
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
