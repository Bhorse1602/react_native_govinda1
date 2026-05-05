import {
  clearCurrentSession,
  getActiveChantSummary,
  getCurrentSessionUser,
  type ChantSummary,
  type UserRecord,
} from "@/lib/auth-db";
import { useLanguage } from "@/lib/language-context";
import "@/global.css";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QUOTES = {
  hi: [
    { text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", source: "भगवद्गीता 2.47" },
    { text: "योगः कर्मसु कौशलम्।", source: "भगवद्गीता 2.50" },
    { text: "विद्याविनयसंपन्ने ब्राह्मणे गवि हस्तिनि। शुनि चैव श्वपाके च पण्डिताः समदर्शिनः॥", source: "भगवद्गीता 5.18" },
    { text: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥", source: "भगवद्गीता 4.7" },
    { text: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्। धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥", source: "भगवद्गीता 4.8" },
    { text: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते। क्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥", source: "भगवद्गीता 2.3" },
    { text: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥", source: "भगवद्गीता 2.23" },
    { text: "अच्छेद्योऽयमदाह्योऽयमक्लेद्योऽशोष्य एव च। नित्यः सर्वगतः स्थाणुरचलोऽयं सनातनः॥", source: "भगवद्गीता 2.24" },
    { text: "जातस्य हि ध्रुवो मृत्युर्ध्रुवं जन्म मृतस्य च। तस्मादपरिहार्येऽर्थे न त्वं शोचितुमर्हसि॥", source: "भगवद्गीता 2.27" },
    { text: "देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा। तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति॥", source: "भगवद्गीता 2.13" },
    { text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥", source: "भगवद्गीता 2.48" },
    { text: "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते। तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्॥", source: "भगवद्गीता 2.50" },
    { text: "कर्मजं बुद्धियुक्ता हि फलं त्यक्त्वा मनीषिणः। जन्मबन्धविनिर्मुक्ताः पदं गच्छन्त्यनामयम्॥", source: "भगवद्गीता 2.51" },
    { text: "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति। तदा गन्तासि निर्वेदं श्रोतव्यस्य श्रुतस्य च॥", source: "भगवद्गीता 2.52" },
    { text: "श्रद्धावान्ल्लभते ज्ञानं तत्परः संयतेन्द्रियः। ज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥", source: "भगवद्गीता 4.39" },
    { text: "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते। इति मत्वा भजन्ते मां बुधा भावसमन्विताः॥", source: "भगवद्गीता 10.8" },
    { text: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु। मामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥", source: "भगवद्गीता 18.65" },
    { text: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥", source: "भगवद्गीता 18.66" },
    { text: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः। तत्र श्रीर्विजयो भूतिध्रुवा नीतिर्मतिर्मम॥", source: "भगवद्गीता 18.78" },
    { text: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥", source: "भगवद्गीता 2.22" },
    { text: "मन चंगा तो कठौती में गंगा नहीं, राम नाम में ही शांति है।", source: "रामचरितमानस भावार्थ" },
    { text: "सिया राममय सब जग जानी।", source: "रामचरितमानस" },
  ],
  en: [
    { text: "You have a right to action, never to its fruits.", source: "Bhagavad Gita 2.47" },
    { text: "Yoga is excellence in action.", source: "Bhagavad Gita 2.50" },
    { text: "The wise see the same in a Brahmin, a cow, an elephant, a dog, and a dog-eater.", source: "Bhagavad Gita 5.18" },
    { text: "Whenever there is a decline of righteousness and rise of unrighteousness, I manifest myself.", source: "Bhagavad Gita 4.7" },
    { text: "For the protection of the good, destruction of the wicked, and establishment of righteousness, I am born in every age.", source: "Bhagavad Gita 4.8" },
    { text: "Do not yield to unmanliness, O son of Pritha. It does not befit you. Shake off this petty faint-heartedness and arise, O scorcher of foes.", source: "Bhagavad Gita 2.3" },
    { text: "Weapons cannot cut the soul, nor can fire burn it. Water cannot wet it, nor can wind dry it.", source: "Bhagavad Gita 2.23" },
    { text: "The soul is unbreakable, incombustible, unwettable, and undryable. It is eternal, all-pervading, stable, immovable, and everlasting.", source: "Bhagavad Gita 2.24" },
    { text: "Death is certain for the born, and rebirth is inevitable for the dead. Therefore, you should not grieve over the inevitable.", source: "Bhagavad Gita 2.27" },
    { text: "Just as the embodied soul continuously passes from childhood to youth to old age, similarly, at death, it passes into another body. The wise are not deluded by this.", source: "Bhagavad Gita 2.13" },
    { text: "Perform your duty equipoised, abandoning attachment, and remaining unconcerned with success or failure. Such equanimity is called Yoga.", source: "Bhagavad Gita 2.48" },
    { text: "One who is equipoised in success and failure is a yogi. Such equanimity is called Yoga.", source: "Bhagavad Gita 2.48" },
    { text: "The wise, endowed with equanimity, abandon the fruits of action and are freed from the bondage of birth, attaining the state beyond suffering.", source: "Bhagavad Gita 2.51" },
    { text: "When your intellect crosses the mire of delusion, you will become indifferent to what has been heard and what is yet to be heard.", source: "Bhagavad Gita 2.52" },
    { text: "The faithful, devoted, and self-controlled attains knowledge. Having attained knowledge, one quickly attains supreme peace.", source: "Bhagavad Gita 4.39" },
    { text: "I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who know this worship Me with devotion.", source: "Bhagavad Gita 10.8" },
    { text: "Fix your mind on Me, be devoted to Me, worship Me, and bow down to Me. Thus uniting with Me, you shall come to Me alone, I promise you truly, for you are dear to Me.", source: "Bhagavad Gita 18.65" },
    { text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.", source: "Bhagavad Gita 18.66" },
    { text: "Wherever there is Krishna, the Lord of Yoga, and Arjuna, the archer, there will be prosperity, victory, happiness, and sound morality.", source: "Bhagavad Gita 18.78" },
    { text: "As a person puts on new garments, giving up old ones, similarly, the soul accepts new material bodies, giving up the old and useless ones.", source: "Bhagavad Gita 2.22" },
    { text: "True peace is found in the divine name.", source: "Devotional reflection" },
    { text: "See the whole world pervaded by Sita-Ram.", source: "Ramcharitmanas" },
  ],
} as const;

export default function App() {
  const { language } = useLanguage();
  const isFocused = useIsFocused();
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [activeSummary, setActiveSummary] = useState<ChantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const user = await getCurrentSessionUser();
        if (!mounted) {
          return;
        }

        setCurrentUser(user ?? null);

        if (user) {
          const summary = await getActiveChantSummary(user.user_id);
          if (mounted) {
            setActiveSummary(summary);
            setQuoteIndex(Math.floor(Math.random() * QUOTES[language].length));
          }
        } else if (mounted) {
          setActiveSummary(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (isFocused) {
      setLoading(true);
      loadSession();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused, language]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!currentUser || !activeSummary) {
    return null;
  }

  const quote = QUOTES[language][quoteIndex] ?? QUOTES[language][0];

  return (
    <ScrollView
      className="flex-1 bg-orange-50"
      contentContainerClassName="px-7 pb-32 pt-20"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-10 rounded-[36px] bg-gradient-to-br from-white to-orange-50/90 px-9 py-10 shadow-xl shadow-orange-200/60 border border-orange-100">
        <View className="flex-row items-start mb-6">
          <View className="mr-4 mt-1">
            <Text className="text-2xl text-orange-500">"</Text>
          </View>
          <View className="flex-1">
            <Text
              className="text-lg leading-8 text-orange-900/90 italic"
              style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
            >
              {quote.text}
            </Text>
            <Text
              className="mt-3 text-sm text-orange-700/70"
              style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
            >
              — {quote.source}
            </Text>
          </View>
        </View>
        
        <View className="mt-6 pt-6 border-t border-orange-200/60">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text
                className="text-sm uppercase tracking-wider text-orange-700/80 mb-1"
                style={{ fontFamily: "NotoSansDevanagari_600SemiBold" }}
              >
                {language === "hi" ? "कुल जप" : "Total chants"}
              </Text>
              <Text
                className="text-3xl font-bold text-orange-900"
                style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
              >
                {activeSummary.totalChants}
              </Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-sm uppercase tracking-wider text-orange-700/80 mb-1"
                style={{ fontFamily: "NotoSansDevanagari_600SemiBold" }}
              >
                {language === "hi" ? "कुल माला" : "Total malas"}
              </Text>
              <Text
                className="text-3xl font-bold text-orange-900"
                style={{ fontFamily: "NotoSansDevanagari_700Bold" }}
              >
                {activeSummary.totalMalas}
              </Text>
            </View>
          </View>
          <Text
            className="mt-4 text-xs text-orange-600/70 text-center"
            style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
          >
            {language === "hi" ? "आपकी भक्ति यात्रा" : "Your devotional journey"}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/tabs/naam-jaap")}
        className="mb-8 min-h-52 justify-center rounded-[40px] bg-gradient-to-br from-orange-400 to-orange-600 px-10 py-12 active:opacity-95 shadow-2xl shadow-orange-500/40 border border-orange-300/40"
      >
        <View className="absolute top-5 right-5">
          <Text className="text-3xl text-orange-900/50">🕉️</Text>
        </View>
        <Text
          className="text-center text-5xl font-bold text-orange-950 mb-3"
          style={{
            fontFamily: "NotoSansDevanagari_800ExtraBold",
            textShadowColor: "rgba(255, 255, 255, 0.7)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {language === "hi" ? "नाम जप" : "Naam Jaap"}
        </Text>
        <Text
          className="text-center text-lg text-orange-900/80"
          style={{
            fontFamily: "NotoSansDevanagari_400Regular",
            textShadowColor: "rgba(255, 255, 255, 0.5)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1,
          }}
        >
          {language === "hi" ? "दिव्य नाम का स्मरण" : "Remembrance of the Divine Name"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/tabs/prashnavali")}
        className="mb-8 min-h-52 justify-center rounded-[40px] bg-gradient-to-br from-amber-400 to-amber-600 px-10 py-12 active:opacity-95 shadow-2xl shadow-amber-500/40 border border-amber-300/40"
      >
        <View className="absolute top-5 right-5">
          <Text className="text-3xl text-amber-900/50">📿</Text>
        </View>
        <Text
          className="text-center text-5xl font-bold text-orange-950 mb-3"
          style={{ fontFamily: "NotoSansDevanagari_800ExtraBold" }}
        >
          {language === "hi" ? "प्रश्नावली" : "Prashnavali"}
        </Text>
        <Text
          className="text-center text-lg text-orange-950/80"
          style={{ fontFamily: "NotoSansDevanagari_400Regular" }}
        >
          {language === "hi" ? "दिव्य मार्गदर्शन" : "Divine Guidance"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
