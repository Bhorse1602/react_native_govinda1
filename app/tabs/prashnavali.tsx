import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";

// This screen implements the 15x15 Prashnavali grid and reading logic.
// NOTE: Replace GRID_15x15 below with the canonical grid from an authoritative source.

const ramShalakaGrid = [
  ["सु", "प्र", "उ", "बि", "हो", "मु", "ग", "ब", "सु", "नु", "बि", "घ", "धि", "इ", "द"],
  ["र", "रु", "फ", "सि", "सि", "रें", "बस", "है", "मं", "ल", "न", "ल", "य", "न", "अं"],
  ["सुज", "सो", "ग", "सु", "कु", "मम", "स", "ग", "त", "न", "ई", "ल", "धा", "बे", "नो"],
  ["त्य", "र", "न", "कु", "जो", "म", "रि", "र", "र", "अ", "की", "हो", "सं", "रा", "य"],
  ["पु", "सु", "थ", "सी", "जे", "इ", "ग", "म", "सं", "क", "रे", "हो", "स", "स", "नि"],
  ["त", "र", "त", "र", "स", "इ", "ह", "ब", "ब", "प", "चि", "स", "य", "स", "तु"],
  ["म", "का", "ा", "र", "र", "मा", "मि", "मी", "म्हा", "ा", "जा", "हू", "हीं", "ा", "जू"],
  ["ता", "रा", "रे", "री", "हृ", "का", "फ", "खा", "जि", "ई", "र", "रा", "पू", "द", "ल"],
  ["नि", "को", "मि", "गो", "न", "मु", "जि", "य", "ने", "मनि", "क", "ज", "प", "स", "ल"],
  ["हि", "रा", "म", "स", "रि", "ग", "द", "न", "ष", "म", "खि", "जि", "मनि", "त", "जं"],
  ["सिं", "मु", "न", "न", "कौ", "मि", "निज", "र", "ग", "धु", "ख", "सु", "का", "स", "र"],
  ["गु", "क", "म", "अ", "ध", "नि", "म", "ल", "ा", "न", "ब", "ती", "न", "रि", "भ"],
  ["ना", "पु", "व", "अ", "ढा", "र", "त", "का", "ए", "तु", "र", "न", "नु", "व", "थ"],
  ["सि", "ह", "सु", "म्ह", "रा", "र", "स", "हिं", "र", "त", "न", "ष", "ा", "ज", "ा"],
  ["र", "सा", "ा", "ला", "धी", "ा", "री", "जा", "हू", "हीं", "षा", "जू", "ई", "रा", "रे"]
];

const GRID_15x15: string[] = ramShalakaGrid.flat();

// 9 canonical chaupais for Ram Shalaka Prashnavali
const CHAUPAIS = [
  { id: 1, devanagari: "सुनु सिय सत्य असीस हमारी। पूजहि मन कामना तुम्हारी॥", roman: "Sunu siya satya asis hamari, pujahi mana kamana tumhari", meaning: "Listen Sita, my blessing is true. Worship with sincerity and your wishes shall be fulfilled.", source: "Bal Kand", interpretation: "Very Positive", color: "green" },
  { id: 2, devanagari: "प्रबिसि नगर कीजे सब काजा। हृदय राखि कोसलपुर राजा॥", roman: "Prabisi nagar kijey sab kaja, hriday rakhi kosalpur raja", meaning: "Enter the city and do all tasks while keeping the King of Kosala (Lord Ram) in your heart.", source: "Sundar Kand", interpretation: "Positive", color: "green" },
  { id: 3, devanagari: "उघरें अंत न होइ निबाहू। कालनेमि जिमि रावन राहू॥", roman: "Ugharen anta na hoi nibahu, kalnemi jimi ravana rahu", meaning: "In the end it will not last. Like Kalnemi and Ravana-Rahu, evil cannot sustain.", source: "Bal Kand", interpretation: "Caution / Negative", color: "orange" },
  { id: 4, devanagari: "बिधि बस सुजन कुसंगत परहीं। फनि मनि सम निज गुन अनुसरहीं॥", roman: "Bidhi bas sujan kusangat parahi, phani mani sam nij gun anusarahi", meaning: "Even the virtuous may fall into bad company due to fate, but like a gem among snakes, they retain their quality.", source: "Bal Kand", interpretation: "Caution", color: "orange" },
  { id: 5, devanagari: "होइ है सोई जो राम रचि राखा। को करि तरक बढ़ावहिं साखा॥", roman: "Hoi hai soi jo ram rachi rakha, ko kari tarak badhavahi sakha", meaning: "Whatever Lord Ram has ordained will happen. Why increase arguments?", source: "Ayodhya Kand", interpretation: "Neutral / Surrender to God", color: "blue" },
  { id: 6, devanagari: "मुद मंगलमय संत समाजू। जिमि जग जंगम तीरथ राजू॥", roman: "Mud mangalmay sant samaju, jimi jag jangam tirath raju", meaning: "The company of saints is full of joy and auspiciousness, like the king of moving pilgrimages.", source: "Bal Kand", interpretation: "Very Positive", color: "green" },
  { id: 7, devanagari: "गरल सुधा रिपु करय मिताई। गोपद सिंधु अनल सितलाई॥", roman: "Garal sudha ripu karay mitai, gopad sindhu anal sitalai", meaning: "Poison becomes nectar, enemy becomes friend, ocean becomes as small as a cow's hoof, fire becomes cool.", source: "Sundar Kand", interpretation: "Very Positive", color: "green" },
  { id: 8, devanagari: "बरुन कुबेर सुरेस समीरा। रन सनमुख धरि काह न धीरा॥", roman: "Varun kuber sures samira, ran sanmukh dhari kah na dhira", meaning: "Even gods like Varun, Kuber, Indra and Vayu could not face him in battle.", source: "Lanka Kand", interpretation: "Caution / Doubtful", color: "orange" },
  { id: 9, devanagari: "सुफल मनोरथ होहुँ तुम्हारे। राम लखनु सुनि भए सुखारे॥", roman: "Sufal manorath hohu tumhare, ramu lakhanu suni bhaye sukhare", meaning: "May your desires be fulfilled. Ram and Lakshman became happy on hearing this.", source: "Bal Kand", interpretation: "Very Positive", color: "green" }
];

function computeSequenceFromIndex(startIndex: number) {
  // Start at startIndex (0..224), take every 9th akshar, wrap around, until back to start.
  const total = GRID_15x15.length; // should be 225
  const step = 9;
  const seq: string[] = [];
  let idx = startIndex;
  do {
    seq.push(GRID_15x15[idx]);
    idx = (idx + step) % total;
  } while (idx !== startIndex);
  return seq.join("");
}

function pickChaupaiForString(s: string) {
  // Deterministic mapping: hash the string and map to one of 9 chaupais.
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  const idx = hash % CHAUPAIS.length;
  return CHAUPAIS[idx];
}

export default function PrashnavaliTab() {
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<null | any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const cellSize = useMemo(() => {
    const width = Dimensions.get("window").width - 32; // padding
    return Math.floor(width / 15) - 4; // spacing
  }, []);

  async function handleCellPress(index: number) {
    if (disabled) return;
    setDisabled(true);
    setLoading(true);

    try {
      // compute the sequence using step=9
      const formed = computeSequenceFromIndex(index);
      const chaupai = pickChaupaiForString(formed);

      // construct full chaupai object
      const result = {
        formed,
        chaupai,
        source: chaupai.source,
        devanagari: chaupai.devanagari,
        translation: chaupai.translation,
        interpretation: chaupai.interpretation,
      };

      // small delay to show animation
      await new Promise((r) => setTimeout(r, 250));

      setSelectedResult(result);
      setModalVisible(true);
    } catch (e) {
      Alert.alert("त्रुटि", "पढ़ने में समस्या हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  }

  function interpretationColor(level: string) {
    if (level === "Very Positive") return "#16a34a"; // green
    if (level === "Positive") return "#ea580c"; // amber
    if (level === "Caution") return "#dc2626"; // red
    return "#6b7280"; // gray
  }

  async function handleShare() {
    if (!selectedResult) return;
    try {
      await Share.share({
        message: `${selectedResult.chaupai.devanagari}\n\n${selectedResult.chaupai.meaning}\n\n-- ${selectedResult.chaupai.source}`,
      });
    } catch (e) {
      // ignore
    }
  }

  function resetReading() {
    setSelectedResult(null);
    setModalVisible(false);
  }

  return (
    <View className="flex-1 bg-orange-50 px-4 pt-8 pb-28">
      <View className="items-center mb-4">
        <Text style={[styles.headerTitle, { fontFamily: "NotoSansDevanagari_700Bold" }]}>जय श्री राम</Text>
        <Text style={[styles.instructions, { fontFamily: "NotoSansDevanagari_400Regular" }]}>श्री राम का ध्यान करें। एक स्पष्ट प्रश्न मन में रखें। आँखें बंद करके ग्रिड पर कहीं भी स्पर्श करें।</Text>
      </View>

      <View style={styles.gridContainer}>
        {GRID_15x15.map((akshar, idx) => (
          <TouchableOpacity
            key={`${akshar}-${idx}`}
            style={[styles.cell, { width: cellSize, height: cellSize }]}
            onPress={() => handleCellPress(idx)}
            disabled={disabled}
          >
            <Text style={{ fontFamily: "NotoSansDevanagari_400Regular", fontSize: 12, color: "#92400e" }}>{akshar}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.disclaimer, { fontFamily: "NotoSansDevanagari_400Regular" }]}>यह एक श्रद्धाभाव से किया जाने वाला साधना-आधारित उपकरण है। परिणाम मात्र मार्गदर्शक हैं।</Text>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#ea580c" />
              ) : selectedResult ? (
                <ScrollView>
                  <Text style={[styles.modalTitle, { fontFamily: "NotoSansDevanagari_700Bold" }]}>{selectedResult.chaupai.devanagari}</Text>
                  <Text style={[styles.sourceText, { fontFamily: "NotoSansDevanagari_400Regular" }]}>स्रोत: {selectedResult.chaupai.source}</Text>

                  <View style={styles.interpretRow}>
                    <View style={[styles.badge, { backgroundColor: interpretationColor(selectedResult.chaupai.interpretation) }]}>
                      <Text style={[styles.badgeText, { fontFamily: "NotoSansDevanagari_400Regular" }]}>{selectedResult.chaupai.interpretation}</Text>
                    </View>
                  </View>

                  <Text style={[styles.translation, { fontFamily: "NotoSansDevanagari_400Regular" }]}>{selectedResult.chaupai.meaning}</Text>

                  <Text style={[styles.explanationTitle, { fontFamily: "NotoSansDevanagari_700Bold" }]}>व्याख्या</Text>
                  <Text style={[styles.explanation, { fontFamily: "NotoSansDevanagari_400Regular" }]}>{selectedResult.chaupai.meaning}</Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                      <Text style={{ color: "white", fontFamily: "NotoSansDevanagari_700Bold" }}>शेयर करें</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={resetReading} style={[styles.actionButton, { backgroundColor: "#f3f4f6" }] }>
                      <Text style={{ color: "#92400e", fontFamily: "NotoSansDevanagari_700Bold" }}>नई पठन</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.reminder, { fontFamily: "NotoSansDevanagari_400Regular" }]}>एक ही प्रश्न को 24 घंटे बाद ही पुनः पूछें।</Text>
                </ScrollView>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 24, color: "#b45309" , marginBottom: 6},
  instructions: { fontSize: 13, color: "#92400e", textAlign: "center", paddingHorizontal: 24 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 4, paddingHorizontal: 8, marginTop: 12 },
  cell: { alignItems: "center", justifyContent: "center", borderRadius: 6, borderWidth: 1, borderColor: "#fed7aa", backgroundColor: "#fff7ed", margin: 2 },
  disclaimer: { fontSize: 12, color: "#6b7280", marginTop: 12, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: "80%" },
  modalTitle: { fontSize: 20, color: "#92400e", marginBottom: 6 },
  sourceText: { fontSize: 12, color: "#a16207", marginBottom: 8 },
  interpretRow: { flexDirection: "row", justifyContent: "flex-start", marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: "white", fontSize: 13 },
  translation: { fontSize: 14, color: "#374151", marginBottom: 10 },
  explanationTitle: { fontSize: 16, color: "#92400e", marginTop: 8 },
  explanation: { fontSize: 14, color: "#374151", marginBottom: 12 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  actionButton: { flex: 1, backgroundColor: "#ea580c", padding: 12, borderRadius: 12, alignItems: "center", marginRight: 8 },
  reminder: { fontSize: 12, color: "#6b7280", marginTop: 10, textAlign: "center" },
});
