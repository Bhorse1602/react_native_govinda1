const HINDI_DEITY_NAMES: Record<string, string> = {
  "shri ram": "श्री राम",
  "sri ram": "श्री राम",
  ram: "राम",
  rama: "राम",
  "jai shree ram": "जय श्री राम",
  "jai shri ram": "जय श्री राम",
  krishna: "कृष्ण",
  "shri krishna": "श्री कृष्ण",
  "sri krishna": "श्री कृष्ण",
  radha: "राधा",
  "radha krishna": "राधा कृष्ण",
  shiva: "शिव",
  "mahadev": "महादेव",
  hanuman: "हनुमान",
  ganesh: "गणेश",
  "ganesha": "गणेश",
  durga: "दुर्गा",
  lakshmi: "लक्ष्मी",
  saraswati: "सरस्वती",
};

export function getHindiDeityName(name: string) {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return HINDI_DEITY_NAMES[normalized] ?? name;
}
