import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  accent: "#C9A227",
};

export default function AllergeneZusatzstoffeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: 28 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        <Text style={styles.backText}>Zurück</Text>
      </Pressable>

      <Text style={styles.pageTitle}>Allergene & Zusatzstoffe</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stand</Text>
        <Text style={styles.text}>Betrieb: ECHTE BÄRLINER</Text>
        <Text style={styles.text}>Stand: Februar 2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Legende Allergene</Text>
        <Text style={styles.text}>A = Weizen / Gluten</Text>
        <Text style={styles.text}>C = Ei</Text>
        <Text style={styles.text}>F = Milch / Laktose</Text>
        <Text style={styles.text}>G = Soja</Text>
        <Text style={styles.text}>I = Sellerie</Text>
        <Text style={styles.text}>K = Senf</Text>
        <Text style={styles.text}>L = Schwefeldioxid / Sulfite</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Legende Zusatzstoffe</Text>
        <Text style={styles.text}>1 = Mit Farbstoff</Text>
        <Text style={styles.text}>2 = Mit Konservierungsstoff</Text>
        <Text style={styles.text}>3 = Mit Antioxidationsmittel / Säuerungsmittel</Text>
        <Text style={styles.text}>4 = Mit Geschmacksverstärker</Text>
        <Text style={styles.text}>7 = Mit Phosphat / Stabilisator</Text>
        <Text style={styles.text}>8 = Mit Säureregulator</Text>
        <Text style={styles.text}>9 = Koffeinhaltig</Text>
        <Text style={styles.text}>11 = Mit Süßungsmittel</Text>
        <Text style={styles.text}>12 = Enthält eine Phenylalaninquelle</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Wichtige Hinweise</Text>
        <Text style={styles.text}>
          Im Fleisch werden laut Dokument u. a. E621, E450, E451 verwendet;
          im Kalbfleisch zusätzlich E262 und E331.
        </Text>
        <Text style={styles.text}>
          In Kräuter- und Knoblauchsaucen werden u. a. E202, E211, E385,
          E412 und E415 verwendet.
        </Text>
        <Text style={styles.text}>
          Taurin ist nur bei Energy Drinks angegeben.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sandwich</Text>
        <Text style={styles.text}>
          Das Original Kalb: Allergene A, C, F, G, K · Zusatzstoffe 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Das Original Hähnchen: Allergene A, C, F, G, I, K · Zusatzstoffe 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Kreuzberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Kreuzberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Tempelhof Kalb/Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Moabit Veggie: A, C, F, K, N · 2, 3 (Saucen), 5 (Jalapeños)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dürüm</Text>
        <Text style={styles.text}>
          Original Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Original Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Kreuzberg Kalb: A, C, F (Käse), G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Kreuzberg Hähnchen: A, C, F (Käse), G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Veggie (Moabit): A, C, F, K, N · 2, 3, 5
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Box</Text>
        <Text style={styles.text}>
          Original Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Original Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Kreuzberg Kalb: A, C, F (Käse), G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Kreuzberg Hähnchen: A, C, F (Käse), G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Veggie: A, C, F, K, N · 2, 3, 5
        </Text>
        <Text style={styles.text}>
          Tempelhof Kalb/Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7, 8
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Teller & Snacks</Text>
        <Text style={styles.text}>
          Bärliner Spezi Teller Kalb: A, C, F, G, K · 2, 3, 4, 7, 8
        </Text>
        <Text style={styles.text}>
          Bärliner Spezi Teller Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7
        </Text>
        <Text style={styles.text}>
          Currywurst (Rind): A, F, I · 2, 3, 4
        </Text>
        <Text style={styles.text}>
          Chicken Nuggets: A, G · 4 (E621)
        </Text>
        <Text style={styles.text}>
          Crunchy Pommes: A (Weizenpanade)
        </Text>
        <Text style={styles.text}>
          Süßkartoffel Pommes: A (Weizenpanade)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Saucen & Extras</Text>
        <Text style={styles.text}>
          Extra Hirtenkäse: F (Milch)
        </Text>
        <Text style={styles.text}>
          Kräutersauce: A, C, K · 2 (E202, E211), 3 (E385)
        </Text>
        <Text style={styles.text}>
          Knoblauchsauce: A, C, K · 2 (E202, E211), 3 (E385)
        </Text>
        <Text style={styles.text}>
          Scharfe Sauce: A, C, K · 2 (E202, E211), 3 (E385)
        </Text>
        <Text style={styles.text}>
          Jalapeños: L (Sulfite) · 2 (E211), 3 (E330), 5 (E509)
        </Text>
        <Text style={styles.text}>
          Mais: 3 (E330)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Getränke</Text>
        <Text style={styles.text}>
          Coca-Cola: 1 (E150d), 3 (E338), 9 (Koffein)
        </Text>
        <Text style={styles.text}>
          Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12
        </Text>
        <Text style={styles.text}>
          Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12
        </Text>
        <Text style={styles.text}>
          Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)
        </Text>
        <Text style={styles.text}>
          Sprite: 3 (E330, E334, E331)
        </Text>
        <Text style={styles.text}>
          Uludag (Gazoz): 2 (E211), 3 (E330)
        </Text>
        <Text style={styles.text}>
          Uludag Zero: 2 (E211), 3 (E330), 11, 12
        </Text>
        <Text style={styles.text}>
          Ayran: F
        </Text>
        <Text style={styles.text}>
          Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (Koffein), Taurin
        </Text>
        <Text style={styles.text}>
          Eistee (Pfirsich/Zitrone): 3 (E330), 11
        </Text>
        <Text style={styles.text}>
          Apfelschorle: 3 (E300)
        </Text>
        <Text style={styles.text}>
          Mineralwasser: keine deklarationspflichtigen Allergene/Zusatzstoffe
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
  },
});