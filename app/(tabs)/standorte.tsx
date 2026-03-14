import { getLanguage } from "@/lib/i18n";
import { Image as ExpoImage } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  gold: "#C9A227",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.55)",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

type LocationItem = {
  title: string;
  street: string;
  zipCity: string;
};

const COUNTRY_NAMES: Record<string, Record<Lang, string>> = {
  Deutschland: {
    de: "Deutschland",
    en: "Germany",
    hr: "Njemačka",
    sq: "Gjermania",
    tr: "Almanya",
  },
  Österreich: {
    de: "Österreich",
    en: "Austria",
    hr: "Austrija",
    sq: "Austria",
    tr: "Avusturya",
  },
  Schweiz: {
    de: "Schweiz",
    en: "Switzerland",
    hr: "Švicarska",
    sq: "Zvicra",
    tr: "İsviçre",
  },
  Kosovo: {
    de: "Kosovo",
    en: "Kosovo",
    hr: "Kosovo",
    sq: "Kosova",
    tr: "Kosova",
  },
  Kroatien: {
    de: "Kroatien",
    en: "Croatia",
    hr: "Hrvatska",
    sq: "Kroacia",
    tr: "Hırvatistan",
  },
  Türkei: {
    de: "Türkei",
    en: "Turkey",
    hr: "Turska",
    sq: "Turqia",
    tr: "Türkiye",
  },
};

const COUNTRY_FLAGS: Record<string, string> = {
  Deutschland: "🇩🇪",
  Österreich: "🇦🇹",
  Schweiz: "🇨🇭",
  Kosovo: "🇽🇰",
  Kroatien: "🇭🇷",
  Türkei: "🇹🇷",
};

const UI_TEXT: Record<
  Lang,
  {
    openRoute: string;
  }
> = {
  de: {
    openRoute: "Route öffnen →",
  },
  en: {
    openRoute: "Open route →",
  },
  hr: {
    openRoute: "Otvori rutu →",
  },
  sq: {
    openRoute: "Hap rrugën →",
  },
  tr: {
    openRoute: "Rotayı aç →",
  },
};

const LOCATIONS_BY_COUNTRY: { country: string; locations: LocationItem[] }[] = [
  {
    country: "Deutschland",
    locations: [
      { title: "Augsburg-Oberhausen", street: "Zollernstraße 11", zipCity: "86154 Augsburg" },
      { title: "Augsburg-Innenstadt", street: "Pilgerhausstraße 35a", zipCity: "86152 Augsburg" },
      { title: "Augsburg-Hochfeld", street: "Johann-Georg-Halske-Straße 20", zipCity: "86159 Augsburg" },
      { title: "Augsburg-Göggingen", street: "Gögginger Str. 119", zipCity: "86199 Augsburg" },
      { title: "Augsburg-Hochzoll", street: "Friedberger Str. 122", zipCity: "86163 Augsburg" },
      { title: "Königsbrunn", street: "Messerschmittring 11", zipCity: "86343 Königsbrunn" },
      { title: "Diedorf", street: "Hauptstraße 2", zipCity: "86420 Diedorf" },
      { title: "Friedberg", street: "Ludwigstraße 33", zipCity: "86316 Friedberg" },
      { title: "Gersthofen", street: "Donauwörther Str. 22", zipCity: "86368 Gersthofen" },
      { title: "München-Giesing", street: "Humboldtstraße 19", zipCity: "81543 München" },
      { title: "München-Riem", street: "Phantasiestraße 2", zipCity: "81827 München" },
      { title: "München-Bogenhausen", street: "Meistersingerstraße 154", zipCity: "81927 München" },
      { title: "München-Schwabing", street: "Leopoldstraße 43", zipCity: "80802 München" },
      { title: "München-Laim", street: "Fürstenriederstraße 32", zipCity: "80686 München" },
      { title: "Kaufbeuren", street: "Schmiedgasse 15", zipCity: "87600 Kaufbeuren" },
      { title: "Untermeitingen", street: "Lechfelderstraße 52", zipCity: "86836 Untermeitingen" },
      { title: "Dachau", street: "Danziger Str. 1", zipCity: "85221 Dachau" },
      { title: "Kempten", street: "Kaufbeurer Str. 93", zipCity: "87437 Kempten" },
      { title: "Mering", street: "Gaußring 34–36", zipCity: "86415 Mering" },
      { title: "Neuss", street: "Kaarster Str. 84", zipCity: "41462 Neuss" },
      { title: "Ulm", street: "Karlstraße 63/1", zipCity: "89073 Ulm" },
      { title: "Nürnberg", street: "", zipCity: "90403 Nürnberg" },
      { title: "Regensburg", street: "", zipCity: "93047 Regensburg" },
    ],
  },
  {
    country: "Österreich",
    locations: [
      { title: "Wien / Österreich", street: "Quellenstraße 156", zipCity: "1100 Wien" },
    ],
  },
  {
    country: "Schweiz",
    locations: [
      { title: "St. Gallen / Schweiz", street: "Rorschacherstraße 58", zipCity: "9000 St. Gallen" },
    ],
  },
  {
    country: "Kosovo",
    locations: [
      { title: "Pristina / Kosovo", street: "Nënkalimi, Bill Clinton", zipCity: "Prishtina 10000" },
    ],
  },
  {
    country: "Kroatien",
    locations: [
      { title: "Zagreb / Kroatien", street: "Z Centar, Ljubljanska avenija 2b", zipCity: "10000 Zagreb" },
    ],
  },
  {
    country: "Türkei",
    locations: [
      { title: "Side / Türkiye", street: "618 Sok No:2, 07330", zipCity: "Manavgat/Antalya" },
    ],
  },
];

const BG = require("../../assets/images/grafik-optimiert.jpg");

function openRoute(street: string, zipCity: string, title: string) {
  const q = encodeURIComponent(`${title} ${street} ${zipCity}`.trim());
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${q}`
      : `https://www.google.com/maps/search/?api=1&query=${q}`;

  Linking.openURL(url);
}

function LocationCard({
  item,
  lang,
}: {
  item: LocationItem;
  lang: Lang;
}) {
  const addressLine = [item.street, item.zipCity].filter(Boolean).join("\n");

  return (
    <Pressable
      onPress={() => openRoute(item.street, item.zipCity, item.title)}
      style={styles.cardPressable}
    >
      <View style={styles.card}>
        <ExpoImage
          source={BG}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />

        <View style={styles.cardOverlay} />

        <View style={{ alignItems: "center" }}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.address} numberOfLines={3}>
            {addressLine}
          </Text>

          <Text style={styles.cta}>{UI_TEXT[lang].openRoute}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Standorte() {
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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.bg }}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {LOCATIONS_BY_COUNTRY.map((group) => (
          <View key={group.country} style={styles.section}>
            <Text style={styles.countryHeader}>
  {COUNTRY_NAMES[group.country]?.[lang] ?? group.country}
  {COUNTRY_FLAGS[group.country] ? ` ${COUNTRY_FLAGS[group.country]}` : ""}
</Text>

            <FlatList
              data={group.locations}
              keyExtractor={(item, idx) => `${group.country}-${item.title}-${idx}`}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={group.locations.length > 1 ? styles.row : undefined}
              contentContainerStyle={{ gap: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => <LocationCard item={item} lang={lang} />}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  row: {
    justifyContent: "space-between",
  },
  countryHeader: {
    color: COLORS.gold,
    fontWeight: "900",
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  cardPressable: {
    width: "48.5%",
  },
  card: {
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  title: {
    color: COLORS.gold,
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationColor: COLORS.gold,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  address: {
    marginTop: 6,
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cta: {
    marginTop: 10,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});