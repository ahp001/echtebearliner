import { getLanguage } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  accent: "#C9A227",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

const UI_TEXT: Record<
  Lang,
  {
    back: string;
    pageTitle: string;
    intro: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    bullet5: string;
    bullet6: string;
    headquarters: string;
    phone: string;
    email: string;
  }
> = {
  de: {
    back: "Zurück",
    pageTitle: "Franchise Partner werden",
    intro:
      "Werden Sie Teil eines erfolgreichen Geschäftsmodells mit klaren Prozessen und bewährten Standards.",
    bullet1: "Lukrative Geschäftsmöglichkeit",
    bullet2: "Bewährtes Konzept",
    bullet3: "Umfassende Schulung",
    bullet4: "Marketingunterstützung",
    bullet5: "Exklusive Gebietsrechte",
    bullet6: "Starkes Netzwerk",
    headquarters: "Zentrale",
    phone: "Telefon",
    email: "Email",
  },
  en: {
    back: "Back",
    pageTitle: "Become a Franchise Partner",
    intro:
      "Become part of a successful business model with clear processes and proven standards.",
    bullet1: "Attractive business opportunity",
    bullet2: "Proven concept",
    bullet3: "Comprehensive training",
    bullet4: "Marketing support",
    bullet5: "Exclusive territorial rights",
    bullet6: "Strong network",
    headquarters: "Headquarters",
    phone: "Phone",
    email: "Email",
  },
  hr: {
    back: "Natrag",
    pageTitle: "Postanite franchise partner",
    intro:
      "Postanite dio uspješnog poslovnog modela s jasnim procesima i provjerenim standardima.",
    bullet1: "Lukrativna poslovna prilika",
    bullet2: "Provjeren koncept",
    bullet3: "Sveobuhvatna obuka",
    bullet4: "Marketinška podrška",
    bullet5: "Ekskluzivna teritorijalna prava",
    bullet6: "Snažna mreža",
    headquarters: "Središnjica",
    phone: "Telefon",
    email: "Email",
  },
  sq: {
    back: "Kthehu",
    pageTitle: "Bëhu partner franchise",
    intro:
      "Bëhuni pjesë e një modeli biznesi të suksesshëm me procese të qarta dhe standarde të provuara.",
    bullet1: "Mundësi fitimprurëse biznesi",
    bullet2: "Koncept i provuar",
    bullet3: "Trajnim i plotë",
    bullet4: "Mbështetje marketingu",
    bullet5: "Të drejta ekskluzive territori",
    bullet6: "Rrjet i fortë",
    headquarters: "Qendra",
    phone: "Telefon",
    email: "Email",
  },
  tr: {
    back: "Geri",
    pageTitle: "Franchise Partneri Olun",
    intro:
      "Net süreçlere ve kanıtlanmış standartlara sahip başarılı bir iş modelinin parçası olun.",
    bullet1: "Kazançlı iş fırsatı",
    bullet2: "Kanıtlanmış konsept",
    bullet3: "Kapsamlı eğitim",
    bullet4: "Pazarlama desteği",
    bullet5: "Bölgesel ayrıcalıklar",
    bullet6: "Güçlü ağ",
    headquarters: "Merkez",
    phone: "Telefon",
    email: "Email",
  },
};

export default function PartnerWerdenScreen() {
  const [lang, setLang] = useState<Lang>("de");

  useFocusEffect(
    useCallback(() => {
      async function loadLanguage() {
        const currentLang = await getLanguage();
        setLang((currentLang as Lang) || "de");
      }

      loadLanguage();
    }, [])
  );

  const t = UI_TEXT[lang];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 90, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        <Text style={styles.backText}>{t.back}</Text>
      </Pressable>

      <Text style={styles.pageTitle}>{t.pageTitle}</Text>

      <View style={styles.card}>
        <Text style={styles.paragraph}>{t.intro}</Text>

        <View style={styles.list}>
          <Bullet text={t.bullet1} />
          <Bullet text={t.bullet2} />
          <Bullet text={t.bullet3} />
          <Bullet text={t.bullet4} />
          <Bullet text={t.bullet5} />
          <Bullet text={t.bullet6} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.headquarters}</Text>

        <Text style={styles.textBlock}>
          Zollernstraße 11{"\n"}
          86154 Augsburg
        </Text>

        <Text style={styles.sectionTitle}>{t.phone}</Text>
        <Text style={styles.textBlock}>0821 - 209 566 64</Text>

        <Text style={styles.sectionTitle}>{t.email}</Text>
        <Text style={styles.textBlock}>info@echtebaerliner.de</Text>
      </View>
    </ScrollView>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 4,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 6,
  },
  paragraph: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  textBlock: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  list: {
    marginTop: 10,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    color: COLORS.accent,
    fontSize: 18,
    marginRight: 8,
  },
  bulletText: {
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
});