import { getLanguage, setLanguage } from "@/lib/i18n";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  border: "rgba(255,255,255,0.10)",
  accent: "#C9A227",
  card: "rgba(255,255,255,0.04)",
};

const langs = [
  { code: "de", name: "Deutsch", flag: "🇩🇪", confirm: "Auswählen", title: "Sprache wählen" },
  { code: "en", name: "English", flag: "🇬🇧", confirm: "Select", title: "Choose language" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷", confirm: "Odaberi", title: "Odaberite jezik" },
  { code: "sq", name: "Shqip", flag: "🇦🇱", confirm: "Zgjidh", title: "Zgjidh gjuhën" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", confirm: "Seç", title: "Dil seç" },
];

export default function LanguageScreen() {
  const [currentLang, setCurrentLang] = useState("de");
  const [selectedLang, setSelectedLang] = useState("de");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCurrentLanguage() {
      const lang = await getLanguage();
      setCurrentLang(lang);
      setSelectedLang(lang);
    }

    loadCurrentLanguage();
  }, []);

  const selectedMeta =
    langs.find((l) => l.code === selectedLang) ?? langs[0];

  const hasChanged = selectedLang !== currentLang;

  async function handleApplyLanguage() {
    try {
      setLoading(true);
      await setLanguage(selectedLang);

      // sorgt dafür, dass Layout/Screens neu aufgebaut werden
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        padding: 20,
        paddingTop: 120,
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 26,
          fontWeight: "900",
          marginBottom: 30,
        }}
      >
        {selectedMeta.title}
      </Text>

      <View
        style={{
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: COLORS.card,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        {langs.map((l, index) => {
          const active = selectedLang === l.code;

          return (
            <Pressable
              key={l.code}
              onPress={() => setSelectedLang(l.code)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 18,
                borderBottomWidth: index !== langs.length - 1 ? 1 : 0,
                borderColor: "rgba(255,255,255,0.08)",
                backgroundColor: active ? "rgba(201,162,39,0.10)" : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 24, marginRight: 14 }}>{l.flag}</Text>
                <Text style={{ color: COLORS.text, fontSize: 18 }}>{l.name}</Text>
              </View>

              {active ? (
                <Text
                  style={{
                    color: COLORS.accent,
                    fontSize: 20,
                    fontWeight: "900",
                  }}
                >
                  ✓
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {hasChanged ? (
        <Pressable
          onPress={handleApplyLanguage}
          disabled={loading}
          style={{
            marginTop: 26,
            backgroundColor: COLORS.accent,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            {loading ? "..." : selectedMeta.confirm}
          </Text>
        </Pressable>
      ) : (
        <Text
          style={{
            marginTop: 20,
            color: COLORS.muted,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {selectedMeta.flag} {selectedMeta.name}
        </Text>
      )}
    </View>
  );
}