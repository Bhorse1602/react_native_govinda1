import React, { useMemo, useState, useRef } from "react";
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
  Animated,
  Easing,
} from "react-native";

// Canonical 15x15 Ram Shalaka grid (provided)
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
  ["र", "सा", "ा", "ला", "धी", "ा", "री", "जा", "हू", "हीं", "षा", "जू", "ई", "रा", "रे"],
];

const GRID_15x15: string[] = ramShalakaGrid.flat();

// 9 canonical chaupais for Ram Shalaka Prashnavali (kept as provided)
const CHAUPAIS = [
  { id: 1, devanagari: "सुनु सिय सत्य असीस हमारी। पूजहि मन कामना तुम्हारी॥", roman: "Sunu siya satya asis hamari, pujahi mana kamana tumhari", meaning: "Listen Sita, my blessing is true. Worship with sincerity and your wishes shall be fulfilled.", source: "Bal Kand", interpretation: "Very Positive", color: "green" },
  { id: 2, devanagari: "प्रबिसि नगर कीजे सब काजा। हृदय राखि कोसलपुर राजा॥", roman: "Prabisi nagar kijey sab kaja, hriday rakhi kosalpur raja", meaning: "Enter the city and do all tasks while keeping the King of Kosala (Lord Ram) in your heart.", source: "Sundar Kand", interpretation: "Positive", color: "green" },
  { id: 3, devanagari: "उघरें अंत न होइ निबाहू। कालनेमि जिमि रावन राहू॥", roman: "Ugharen anta na hoi nibahu, kalnemi jimi ravana rahu", meaning: "In the end it will not last. Like Kalnemi and Ravana-Rahu, evil cannot sustain.", source: "Bal Kand", interpretation: "Caution / Negative", color: "orange" },
  { id: 4, devanagari: "बिधि बस सुजन कुसंगत परहीं। फनि मनि सम निज गुन अनुसरहीं॥", roman: "Bidhi bas sujan kusangat parahi, phani mani sam nij gun anusarahi", meaning: "Even the virtuous may fall into bad company due to fate, but like a gem among snakes, they retain their quality.", source: "Bal Kand", interpretation: "Caution", color: "orange" },
  { id: 5, devanagari: "होइ है सोई जो राम रचि राखा। को करि तरक बढ़ावहिं साखा॥", roman: "Hoi hai soi jo ram rachi rakha, ko kari tarak badhavahi sakha", meaning: "Whatever Lord Ram has ordained will happen. Why increase arguments?", source: "Ayodhya Kand", interpretation: "Neutral / Surrender to God", color: "blue" },
  { id: 6, devanagari: "मुद मंगलमय संत समाजू। जिमि जग जंगम तीरथ राजू॥", roman: "Mud mangalmay sant samaju, jimi jag jangam tirath raju", meaning: "The company of saints is full of joy and auspiciousness, like the king of moving pilgrimages.", source: "Bal Kand", interpretation: "Very Positive", color: "green" },
  { id: 7, devanagari: "गरल सुधा रिपु करय मिताई। गोपद सिंधु अनल सितलाई॥", roman: "Garal sudha ripu karay mitai, gopad sindhu anal sitalai", meaning: "Poison becomes nectar, enemy becomes friend, ocean becomes as small as a cow's hoof, fire becomes cool.", source: "Sundar Kand", interpretation: "Very Positive", color: "green" },
  { id: 8, devanagari: "बरुन कुबेर सुरेस समीरा। रण सनमुख धरि काह न धीरा॥", roman: "Varun kuber sures samira, ran sanmukh dhari kah na dhira", meaning: "Even gods like Varun, Kuber, Indra and Vayu could not face him in battle.", source: "Lanka Kand", interpretation: "Caution / Doubtful", color: "orange" },
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

function normalizeText(s: string) {
  return (s || "").toString().replace(/[\s\u0964\u0965\.,;:!\?\-–—"'«»]/g, "").toLowerCase();
}

// Precompute a mapping from startIndex -> chaupai index when possible.
const START_TO_CHAUPAI: number[] = (() => {
  const map: number[] = Array(GRID_15x15.length).fill(-1);
  const norms = CHAUPAIS.map((c) => ({ ...c, norm: normalizeText(c.devanagari) }));

  for (let i = 0; i < GRID_15x15.length; i++) {
    const formed = computeSequenceFromIndex(i);
    const nFormed = normalizeText(formed);

    // Try direct substring/equality match with chaupai devanagari text
    let found = -1;
    for (let j = 0; j < norms.length; j++) {
      const nc = norms[j].norm;
      if (!nc) continue;
      if (nFormed === nc || nFormed.includes(nc) || nc.includes(nFormed)) {
        found = j;
        break;
      }
    }

    // Fallback: deterministic hash to keep mapping stable
    if (found === -1) {
      let hash = 0;
      for (let k = 0; k < nFormed.length; k++) {
        hash = (hash * 31 + nFormed.charCodeAt(k)) >>> 0;
      }
      found = hash % CHAUPAIS.length;
    }

    map[i] = found;
  }
  return map;
})();

function pickChaupaiForStartIndex(startIndex: number, formed?: string) {
  const idx = START_TO_CHAUPAI[startIndex];
  if (idx != null && idx >= 0 && idx < CHAUPAIS.length) return CHAUPAIS[idx];

  // safety fallback: use hash of formed string
  if (formed) {
    let hash = 0;
    for (let i = 0; i < formed.length; i++) hash = (hash * 31 + formed.charCodeAt(i)) >>> 0;
    return CHAUPAIS[hash % CHAUPAIS.length];
  }

  return CHAUPAIS[0];
}

export default function PrashnavaliTab() {
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<null | any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [lastIndices, setLastIndices] = useState<number[] | null>(null);

  const cellSize = useMemo(() => {
    const width = Dimensions.get("window").width - 32; // padding
    return Math.floor(width / 15) - 4; // spacing
  }, []);

  // animated value per cell (0..1), 1 means highlighted
  const animatedValuesRef = useRef<Animated.Value[]>([]);
  if (animatedValuesRef.current.length === 0) {
    animatedValuesRef.current = Array(GRID_15x15.length).fill(null).map(() => new Animated.Value(0));
  }

  // store cell centers for line drawing
  const positionsRef = useRef<{ x: number; y: number }[]>(Array(GRID_15x15.length).fill({ x: 0, y: 0 }));

  function onCellLayout(idx: number, e: any) {
    const { x, y, width, height } = e.nativeEvent.layout;
    // layout is relative to grid container; compute center
    positionsRef.current[idx] = { x: x + width / 2, y: y + height / 2 };
  }

  function renderConnectionLines(indices: number[]) {
    // render animated thin views between consecutive centers
    if (!indices || indices.length < 2) return null;
    return indices.slice(0, -1).map((fromIdx, i) => {
      const toIdx = indices[i + 1];
      const a = positionsRef.current[fromIdx];
      const b = positionsRef.current[toIdx];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const left = a.x + dx / 2 - length / 2;
      const top = a.y + dy / 2 - 2; // line thickness ~4
      return (
        <Animated.View
          key={`line-${fromIdx}-${toIdx}`}
          style={{
            position: "absolute",
            left,
            top,
            width: length,
            height: 4,
            backgroundColor: "rgba(250,204,21,0.95)",
            borderRadius: 4,
            transform: [{ rotate: `${angle}deg` }],
            zIndex: 5,
            shadowColor: "#f59e0b",
            shadowOpacity: 0.6,
            shadowRadius: 8,
          }}
        />
      );
    });
  }

  async function runSequenceAnimation(indices: number[]) {
    setAnimating(true);
    setSelectedIndices([]);

    // fade non-selected: handled via styles using animating + selectedIndices state

    const totalDuration = 2000; // target total 2s
    const perStep = Math.max(150, Math.floor(totalDuration / Math.max(1, indices.length))); // ms

    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      // immediate: mark selectedIndices so cell is bright
      setSelectedIndices((prev) => [...prev, idx]);
      // animate scale/glow: animate value to 1
      await new Promise((resolve) => {
        Animated.timing(animatedValuesRef.current[idx], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1)),
        }).start(() => {
          // keep it at 1 (bright)
          resolve(null);
        });
      });
      // small pause before next
      await new Promise((r) => setTimeout(r, perStep - 60));
    }

    setAnimating(false);
    // leave values at 1 to keep highlighted
  }

  async function handleCellPress(index: number) {
    if (animating) return;
    setLoading(true);
    try {
      // compute indices
      const indices: number[] = [];
      const total = GRID_15x15.length;
      let idx = index;
      do {
        indices.push(idx);
        idx = (idx + 9) % total;
      } while (idx !== index);

      setLastIndices(indices);

      // instant tap feedback on tapped cell
      Animated.sequence([
        Animated.timing(animatedValuesRef.current[index], { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(animatedValuesRef.current[index], { toValue: 0.9, duration: 120, useNativeDriver: true }),
      ]).start();

      // ensure layout positions captured (small delay)
      await new Promise((r) => setTimeout(r, 60));

      // run sequential highlight + lines
      await runSequenceAnimation(indices);

      // build formed string & pick chaupai
      const formed = indices.map((i) => GRID_15x15[i]).join("");
      const chaupai = pickChaupaiForStartIndex(index, formed);

      setSelectedResult({ formed, chaupai, indices });
      setModalVisible(true);
    } catch (e) {
      Alert.alert("त्रुटि", "पढ़ने में समस्या हुई। कृपया पुनः प्रयास करें。");
    } finally {
      setLoading(false);
    }
  }

  async function replayAnimation() {
    if (!lastIndices) return;
    // reset animated values for those indices
    lastIndices.forEach((i) => animatedValuesRef.current[i].setValue(0));
    setSelectedIndices([]);
    await runSequenceAnimation(lastIndices);
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
    // clear highlights
    animatedValuesRef.current.forEach((av) => av.setValue(0));
    setSelectedIndices([]);
    setLastIndices(null);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff7ed", paddingHorizontal: 16, paddingTop: 24, paddingBottom: 28 }}>
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <Text style={[styles.headerTitle, { fontFamily: "NotoSansDevanagari_700Bold" }]}>श्री राम शलाका प्रश्नावली</Text>
        <Text style={[styles.instructions, { fontFamily: "NotoSansDevanagari_400Regular" }]}>आँखें बंद करें, श्री राम का ध्यान करें, और किसी भी अक्षर को स्पर्श करें।</Text>
      </View>

      <View style={{ position: "relative" }}>
        {/* grid container */}
        <View style={styles.gridContainer}>
          {GRID_15x15.map((akshar, idx) => {
            const av = animatedValuesRef.current[idx];
            const scale = av.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
            const borderWidth = av.interpolate({ inputRange: [0, 1], outputRange: [0, 3] });
            const isBright = selectedIndices.includes(idx) || animating && selectedIndices.includes(idx);
            const opacity = animating ? (selectedIndices.includes(idx) ? 1 : 0.35) : 1;
            return (
              <Animated.View
                key={`${akshar}-${idx}`}
                onLayout={(e) => onCellLayout(idx, e)}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize, transform: [{ scale }], opacity, borderColor: isBright ? "#f59e0b" : "#fcd34d", borderWidth: isBright ? 3 : 1 },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
                  onPress={() => handleCellPress(idx)}
                  disabled={animating}
                >
                  <Text style={{ fontFamily: "NotoSansDevanagari_400Regular", fontSize: 14, color: "#92400e" }}>{akshar}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* connection lines overlay (absolute) */}
        <View style={{ position: "absolute", left: 16, right: 16, top: 0, bottom: 0, pointerEvents: "none" }}>
          {renderConnectionLines(selectedIndices)}
        </View>
      </View>

      <Text style={[styles.disclaimer, { fontFamily: "NotoSansDevanagari_400Regular" }]}>यह एक श्रद्धाभाव से किया जाने वाला साधना-आधारित उपकरण है। परिणाम मार्गदर्शक हैं।</Text>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8, gap: 8 }}>
        {lastIndices ? (
          <TouchableOpacity onPress={replayAnimation} style={[styles.smallButton, { backgroundColor: "#fde68a" }]}>
            <Text style={{ fontFamily: "NotoSansDevanagari_700Bold", color: "#92400e" }}>Replay Animation</Text>
          </TouchableOpacity>
        ) : null}
      </View>

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
  headerTitle: { fontSize: 22, color: "#b45309", marginBottom: 6 },
  instructions: { fontSize: 13, color: "#92400e", textAlign: "center", paddingHorizontal: 24 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 6, paddingHorizontal: 8, marginTop: 12 },
  cell: { alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#fcd34d", backgroundColor: "#fffaf0", margin: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
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
  smallButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
});
