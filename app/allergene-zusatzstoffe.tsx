import { getLanguage } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  accent: "#C9A227",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

type SectionContent = {
  back: string;
  title: string;
  sections: {
    status: string;
    allergens: string;
    additives: string;
    notes: string;
    sandwich: string;
    durum: string;
    box: string;
    plateSnacks: string;
    sauces: string;
    drinks: string;
  };
  statusLines: string[];
  allergenLines: string[];
  additiveLines: string[];
  noteLines: string[];
  sandwichLines: string[];
  durumLines: string[];
  boxLines: string[];
  plateSnackLines: string[];
  sauceLines: string[];
  drinkLines: string[];
};

const CONTENT: Record<Lang, SectionContent> = {
  de: {
    back: "Zurück",
    title: "Allergene & Zusatzstoffe",
    sections: {
      status: "Stand",
      allergens: "Legende Allergene",
      additives: "Legende Zusatzstoffe",
      notes: "Wichtige Hinweise",
      sandwich: "Sandwich",
      durum: "Dürüm",
      box: "Box",
      plateSnacks: "Teller & Snacks",
      sauces: "Saucen & Extras",
      drinks: "Getränke",
    },
    statusLines: ["Betrieb: ECHTE BÄRLINER", "Stand: Februar 2026"],
    allergenLines: [
      "A = Weizen / Gluten",
      "C = Ei",
      "F = Milch / Laktose",
      "G = Soja",
      "I = Sellerie",
      "K = Senf",
      "L = Schwefeldioxid / Sulfite",
    ],
    additiveLines: [
      "1 = Mit Farbstoff",
      "2 = Mit Konservierungsstoff",
      "3 = Mit Antioxidationsmittel / Säuerungsmittel",
      "4 = Mit Geschmacksverstärker",
      "7 = Mit Phosphat / Stabilisator",
      "8 = Mit Säureregulator",
      "9 = Koffeinhaltig",
      "11 = Mit Süßungsmittel",
      "12 = Enthält eine Phenylalaninquelle",
    ],
    noteLines: [
      "Im Fleisch werden laut Dokument u. a. E621, E450, E451 verwendet; im Kalbfleisch zusätzlich E262 und E331.",
      "In Kräuter- und Knoblauchsaucen werden u. a. E202, E211, E385, E412 und E415 verwendet.",
      "Taurin ist nur bei Energy Drinks angegeben.",
    ],
    sandwichLines: [
      "Das Original Kalb: Allergene A, C, F, G, K · Zusatzstoffe 2, 3, 4, 7, 8",
      "Das Original Hähnchen: Allergene A, C, F, G, I, K · Zusatzstoffe 2, 3, 4, 7",
      "Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Kreuzberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof Kalb/Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Moabit Veggie: A, C, F, K, N · 2, 3 (Saucen), 5 (Jalapeños)",
    ],
    durumLines: [
      "Original Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg Kalb: A, C, F (Käse), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg Hähnchen: A, C, F (Käse), G, I, K · 2, 3, 4, 7",
      "Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Veggie (Moabit): A, C, F, K, N · 2, 3, 5",
    ],
    boxLines: [
      "Original Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg Kalb: A, C, F (Käse), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg Hähnchen: A, C, F (Käse), G, I, K · 2, 3, 4, 7",
      "Neukölln Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Veggie: A, C, F, K, N · 2, 3, 5",
      "Tempelhof Kalb/Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7, 8",
    ],
    plateSnackLines: [
      "Bärliner Spezi Teller Kalb: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Bärliner Spezi Teller Hähnchen: A, C, F, G, I, K · 2, 3, 4, 7",
      "Currywurst (Rind): A, F, I · 2, 3, 4",
      "Chicken Nuggets: A, G · 4 (E621)",
      "Crunchy Pommes: A (Weizenpanade)",
      "Süßkartoffel Pommes: A (Weizenpanade)",
    ],
    sauceLines: [
      "Extra Hirtenkäse: F (Milch)",
      "Kräutersauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Knoblauchsauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Scharfe Sauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Jalapeños: L (Sulfite) · 2 (E211), 3 (E330), 5 (E509)",
      "Mais: 3 (E330)",
    ],
    drinkLines: [
      "Coca-Cola: 1 (E150d), 3 (E338), 9 (Koffein)",
      "Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12",
      "Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12",
      "Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)",
      "Sprite: 3 (E330, E334, E331)",
      "Uludag (Gazoz): 2 (E211), 3 (E330)",
      "Uludag Zero: 2 (E211), 3 (E330), 11, 12",
      "Ayran: F",
      "Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (Koffein), Taurin",
      "Eistee (Pfirsich/Zitrone): 3 (E330), 11",
      "Apfelschorle: 3 (E300)",
      "Mineralwasser: keine deklarationspflichtigen Allergene/Zusatzstoffe",
    ],
  },

  en: {
    back: "Back",
    title: "Allergens & Additives",
    sections: {
      status: "Status",
      allergens: "Allergen legend",
      additives: "Additive legend",
      notes: "Important notes",
      sandwich: "Sandwich",
      durum: "Durum",
      box: "Box",
      plateSnacks: "Plates & Snacks",
      sauces: "Sauces & Extras",
      drinks: "Drinks",
    },
    statusLines: ["Business: ECHTE BÄRLINER", "Updated: February 2026"],
    allergenLines: [
      "A = Wheat / Gluten",
      "C = Egg",
      "F = Milk / Lactose",
      "G = Soy",
      "I = Celery",
      "K = Mustard",
      "L = Sulphur dioxide / Sulphites",
    ],
    additiveLines: [
      "1 = With colouring",
      "2 = With preservative",
      "3 = With antioxidant / acidifier",
      "4 = With flavour enhancer",
      "7 = With phosphate / stabilizer",
      "8 = With acidity regulator",
      "9 = Contains caffeine",
      "11 = With sweetener",
      "12 = Contains a source of phenylalanine",
    ],
    noteLines: [
      "According to the document, the meat contains E621, E450 and E451; veal additionally contains E262 and E331.",
      "Herb and garlic sauces contain, among other things, E202, E211, E385, E412 and E415.",
      "Taurine is only listed for energy drinks.",
    ],
    sandwichLines: [
      "The Original veal: Allergens A, C, F, G, K · Additives 2, 3, 4, 7, 8",
      "The Original chicken: Allergens A, C, F, G, I, K · Additives 2, 3, 4, 7",
      "Wedding veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Kreuzberg chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Neukölln veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof veal/chicken: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Moabit Veggie: A, C, F, K, N · 2, 3 (sauces), 5 (jalapeños)",
    ],
    durumLines: [
      "Original veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg veal: A, C, F (cheese), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg chicken: A, C, F (cheese), G, I, K · 2, 3, 4, 7",
      "Neukölln veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Veggie (Moabit): A, C, F, K, N · 2, 3, 5",
    ],
    boxLines: [
      "Original veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg veal: A, C, F (cheese), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg chicken: A, C, F (cheese), G, I, K · 2, 3, 4, 7",
      "Neukölln veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Veggie: A, C, F, K, N · 2, 3, 5",
      "Tempelhof veal/chicken: A, C, F, G, I, K · 2, 3, 4, 7, 8",
    ],
    plateSnackLines: [
      "Bärliner special plate veal: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Bärliner special plate chicken: A, C, F, G, I, K · 2, 3, 4, 7",
      "Currywurst (beef): A, F, I · 2, 3, 4",
      "Chicken nuggets: A, G · 4 (E621)",
      "Crunchy fries: A (wheat coating)",
      "Sweet potato fries: A (wheat coating)",
    ],
    sauceLines: [
      "Extra feta cheese: F (milk)",
      "Herb sauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Garlic sauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Hot sauce: A, C, K · 2 (E202, E211), 3 (E385)",
      "Jalapeños: L (sulphites) · 2 (E211), 3 (E330), 5 (E509)",
      "Corn: 3 (E330)",
    ],
    drinkLines: [
      "Coca-Cola: 1 (E150d), 3 (E338), 9 (caffeine)",
      "Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12",
      "Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12",
      "Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)",
      "Sprite: 3 (E330, E334, E331)",
      "Uludag (gazoz): 2 (E211), 3 (E330)",
      "Uludag Zero: 2 (E211), 3 (E330), 11, 12",
      "Ayran: F",
      "Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (caffeine), taurine",
      "Iced tea (peach/lemon): 3 (E330), 11",
      "Apple spritzer: 3 (E300)",
      "Mineral water: no declarable allergens/additives",
    ],
  },

  hr: {
    back: "Natrag",
    title: "Alergeni i aditivi",
    sections: {
      status: "Status",
      allergens: "Legenda alergena",
      additives: "Legenda aditiva",
      notes: "Važne napomene",
      sandwich: "Sendvič",
      durum: "Dürüm",
      box: "Box",
      plateSnacks: "Tanjuri i grickalice",
      sauces: "Umaci i dodaci",
      drinks: "Pića",
    },
    statusLines: ["Poslovnica: ECHTE BÄRLINER", "Stanje: veljača 2026"],
    allergenLines: [
      "A = Pšenica / gluten",
      "C = Jaje",
      "F = Mlijeko / laktoza",
      "G = Soja",
      "I = Celer",
      "K = Senf",
      "L = Sumporni dioksid / sulfiti",
    ],
    additiveLines: [
      "1 = S bojilom",
      "2 = S konzervansom",
      "3 = S antioksidansom / sredstvom za zakiseljavanje",
      "4 = S pojačivačem okusa",
      "7 = S fosfatom / stabilizatorom",
      "8 = S regulatorom kiselosti",
      "9 = Sadrži kofein",
      "11 = S zaslađivačem",
      "12 = Sadrži izvor fenilalanina",
    ],
    noteLines: [
      "Prema dokumentu, meso sadrži E621, E450 i E451; teletina dodatno sadrži E262 i E331.",
      "Biljni i češnjak umaci sadrže, između ostalog, E202, E211, E385, E412 i E415.",
      "Taurin je naveden samo kod energetskih pića.",
    ],
    sandwichLines: [
      "Das Original teletina: Alergeni A, C, F, G, K · Aditivi 2, 3, 4, 7, 8",
      "Das Original piletina: Alergeni A, C, F, G, I, K · Aditivi 2, 3, 4, 7",
      "Wedding teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Kreuzberg piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Neukölln teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof teletina/piletina: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Moabit Veggie: A, C, F, K, N · 2, 3 (umaci), 5 (jalapeños)",
    ],
    durumLines: [
      "Original teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg teletina: A, C, F (sir), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg piletina: A, C, F (sir), G, I, K · 2, 3, 4, 7",
      "Neukölln teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Veggie (Moabit): A, C, F, K, N · 2, 3, 5",
    ],
    boxLines: [
      "Original teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg teletina: A, C, F (sir), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg piletina: A, C, F (sir), G, I, K · 2, 3, 4, 7",
      "Neukölln teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Veggie: A, C, F, K, N · 2, 3, 5",
      "Tempelhof teletina/piletina: A, C, F, G, I, K · 2, 3, 4, 7, 8",
    ],
    plateSnackLines: [
      "Bärliner specijalni tanjur teletina: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Bärliner specijalni tanjur piletina: A, C, F, G, I, K · 2, 3, 4, 7",
      "Currywurst (govedina): A, F, I · 2, 3, 4",
      "Chicken Nuggets: A, G · 4 (E621)",
      "Hrskavi pomfrit: A (pšenični omotač)",
      "Pomfrit od batata: A (pšenični omotač)",
    ],
    sauceLines: [
      "Dodatni feta sir: F (mlijeko)",
      "Biljni umak: A, C, K · 2 (E202, E211), 3 (E385)",
      "Češnjak umak: A, C, K · 2 (E202, E211), 3 (E385)",
      "Ljuti umak: A, C, K · 2 (E202, E211), 3 (E385)",
      "Jalapeños: L (sulfiti) · 2 (E211), 3 (E330), 5 (E509)",
      "Kukuruz: 3 (E330)",
    ],
    drinkLines: [
      "Coca-Cola: 1 (E150d), 3 (E338), 9 (kofein)",
      "Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12",
      "Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12",
      "Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)",
      "Sprite: 3 (E330, E334, E331)",
      "Uludag (gazoz): 2 (E211), 3 (E330)",
      "Uludag Zero: 2 (E211), 3 (E330), 11, 12",
      "Ayran: F",
      "Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (kofein), taurin",
      "Ledeni čaj (breskva/limun): 3 (E330), 11",
      "Sok od jabuke s mineralnom vodom: 3 (E300)",
      "Mineralna voda: bez deklariranih alergena/aditiva",
    ],
  },

  sq: {
    back: "Kthehu",
    title: "Alergjenët & Shtesat",
    sections: {
      status: "Statusi",
      allergens: "Legenda e alergjenëve",
      additives: "Legenda e shtesave",
      notes: "Shënime të rëndësishme",
      sandwich: "Sanduiç",
      durum: "Dürüm",
      box: "Box",
      plateSnacks: "Pjata & Snacks",
      sauces: "Salca & Shtesa",
      drinks: "Pije",
    },
    statusLines: ["Biznesi: ECHTE BÄRLINER", "Përditësuar: Shkurt 2026"],
    allergenLines: [
      "A = Grurë / gluten",
      "C = Vezë",
      "F = Qumësht / laktozë",
      "G = Sojë",
      "I = Selino",
      "K = Mustardë",
      "L = Dioksid squfuri / sulfite",
    ],
    additiveLines: [
      "1 = Me ngjyrues",
      "2 = Me konservues",
      "3 = Me antioksidant / acidifikues",
      "4 = Me përforcues shijeje",
      "7 = Me fosfat / stabilizues",
      "8 = Me rregullues aciditeti",
      "9 = Përmban kafeinë",
      "11 = Me ëmbëltues",
      "12 = Përmban burim fenilalanine",
    ],
    noteLines: [
      "Sipas dokumentit, mishi përmban E621, E450 dhe E451; mishi i viçit përmban gjithashtu E262 dhe E331.",
      "Salcat me erëza dhe hudhër përmbajnë, ndër të tjera, E202, E211, E385, E412 dhe E415.",
      "Taurina është shënuar vetëm te pijet energjike.",
    ],
    sandwichLines: [
      "Das Original viç: Alergjenë A, C, F, G, K · Shtesa 2, 3, 4, 7, 8",
      "Das Original pulë: Alergjenë A, C, F, G, I, K · Shtesa 2, 3, 4, 7",
      "Wedding viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Kreuzberg pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Neukölln viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof viç/pulë: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Moabit Veggie: A, C, F, K, N · 2, 3 (salcat), 5 (jalapeños)",
    ],
    durumLines: [
      "Original viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg viç: A, C, F (djathë), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg pulë: A, C, F (djathë), G, I, K · 2, 3, 4, 7",
      "Neukölln viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Veggie (Moabit): A, C, F, K, N · 2, 3, 5",
    ],
    boxLines: [
      "Original viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg viç: A, C, F (djathë), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg pulë: A, C, F (djathë), G, I, K · 2, 3, 4, 7",
      "Neukölln viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Veggie: A, C, F, K, N · 2, 3, 5",
      "Tempelhof viç/pulë: A, C, F, G, I, K · 2, 3, 4, 7, 8",
    ],
    plateSnackLines: [
      "Pjata speciale Bärliner viç: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Pjata speciale Bärliner pulë: A, C, F, G, I, K · 2, 3, 4, 7",
      "Currywurst (viçi): A, F, I · 2, 3, 4",
      "Chicken Nuggets: A, G · 4 (E621)",
      "Patate krokante: A (veshje me grurë)",
      "Patate të ëmbla të skuqura: A (veshje me grurë)",
    ],
    sauceLines: [
      "Djathë ekstra: F (qumësht)",
      "Salcë me erëza: A, C, K · 2 (E202, E211), 3 (E385)",
      "Salcë hudhre: A, C, K · 2 (E202, E211), 3 (E385)",
      "Salcë djegëse: A, C, K · 2 (E202, E211), 3 (E385)",
      "Jalapeños: L (sulfite) · 2 (E211), 3 (E330), 5 (E509)",
      "Misër: 3 (E330)",
    ],
    drinkLines: [
      "Coca-Cola: 1 (E150d), 3 (E338), 9 (kafeinë)",
      "Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12",
      "Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12",
      "Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)",
      "Sprite: 3 (E330, E334, E331)",
      "Uludag (gazoz): 2 (E211), 3 (E330)",
      "Uludag Zero: 2 (E211), 3 (E330), 11, 12",
      "Ayran: F",
      "Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (kafeinë), taurinë",
      "Çaj i ftohtë (pjeshkë/limon): 3 (E330), 11",
      "Lëng molle me ujë mineral: 3 (E300)",
      "Ujë mineral: pa alergjenë/shtesa të deklarueshme",
    ],
  },

  tr: {
    back: "Geri",
    title: "Alerjenler & Katkı Maddeleri",
    sections: {
      status: "Durum",
      allergens: "Alerjen listesi",
      additives: "Katkı maddeleri listesi",
      notes: "Önemli notlar",
      sandwich: "Sandviç",
      durum: "Dürüm",
      box: "Box",
      plateSnacks: "Tabak & Atıştırmalık",
      sauces: "Soslar & Ekstralar",
      drinks: "İçecekler",
    },
    statusLines: ["İşletme: ECHTE BÄRLINER", "Güncelleme: Şubat 2026"],
    allergenLines: [
      "A = Buğday / gluten",
      "C = Yumurta",
      "F = Süt / laktoz",
      "G = Soya",
      "I = Kereviz",
      "K = Hardal",
      "L = Kükürt dioksit / sülfitler",
    ],
    additiveLines: [
      "1 = Renklendirici içerir",
      "2 = Koruyucu içerir",
      "3 = Antioksidan / asitlik düzenleyici içerir",
      "4 = Lezzet artırıcı içerir",
      "7 = Fosfat / stabilizatör içerir",
      "8 = Asitlik düzenleyici içerir",
      "9 = Kafein içerir",
      "11 = Tatlandırıcı içerir",
      "12 = Fenilalanin kaynağı içerir",
    ],
    noteLines: [
      "Belgeye göre ette E621, E450 ve E451 kullanılmaktadır; dana etinde ayrıca E262 ve E331 bulunur.",
      "Otlu ve sarımsaklı soslarda diğerlerinin yanında E202, E211, E385, E412 ve E415 kullanılır.",
      "Taurin sadece enerji içeceklerinde belirtilmiştir.",
    ],
    sandwichLines: [
      "Das Original dana: Alerjenler A, C, F, G, K · Katkılar 2, 3, 4, 7, 8",
      "Das Original tavuk: Alerjenler A, C, F, G, I, K · Katkılar 2, 3, 4, 7",
      "Wedding dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Kreuzberg tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Neukölln dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof dana/tavuk: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Moabit Veggie: A, C, F, K, N · 2, 3 (soslar), 5 (jalapeños)",
    ],
    durumLines: [
      "Original dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg dana: A, C, F (peynir), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg tavuk: A, C, F (peynir), G, I, K · 2, 3, 4, 7",
      "Neukölln dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Tempelhof: A, C, F, G, I, K · 2, 3, 4, 7, 8",
      "Veggie (Moabit): A, C, F, K, N · 2, 3, 5",
    ],
    boxLines: [
      "Original dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Original tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Wedding dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Wedding tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Kreuzberg dana: A, C, F (peynir), G, K · 2, 3, 4, 7, 8",
      "Kreuzberg tavuk: A, C, F (peynir), G, I, K · 2, 3, 4, 7",
      "Neukölln dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Neukölln tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Schöneberg dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Schöneberg tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Veggie: A, C, F, K, N · 2, 3, 5",
      "Tempelhof dana/tavuk: A, C, F, G, I, K · 2, 3, 4, 7, 8",
    ],
    plateSnackLines: [
      "Bärliner özel tabak dana: A, C, F, G, K · 2, 3, 4, 7, 8",
      "Bärliner özel tabak tavuk: A, C, F, G, I, K · 2, 3, 4, 7",
      "Currywurst (sığır): A, F, I · 2, 3, 4",
      "Chicken Nuggets: A, G · 4 (E621)",
      "Çıtır patates: A (buğday kaplama)",
      "Tatlı patates kızartması: A (buğday kaplama)",
    ],
    sauceLines: [
      "Ekstra beyaz peynir: F (süt)",
      "Otlu sos: A, C, K · 2 (E202, E211), 3 (E385)",
      "Sarımsak sosu: A, C, K · 2 (E202, E211), 3 (E385)",
      "Acı sos: A, C, K · 2 (E202, E211), 3 (E385)",
      "Jalapeños: L (sülfitler) · 2 (E211), 3 (E330), 5 (E509)",
      "Mısır: 3 (E330)",
    ],
    drinkLines: [
      "Coca-Cola: 1 (E150d), 3 (E338), 9 (kafein)",
      "Coca-Cola Zero: 1 (E150d), 3 (E338, E331), 9, 11, 12",
      "Coca-Cola Light: 1 (E150d), 3 (E338, E330), 9, 11, 12",
      "Fanta Orange: 1 (E160a), 3 (E330, E300), 7 (E414, E445)",
      "Sprite: 3 (E330, E334, E331)",
      "Uludag (gazoz): 2 (E211), 3 (E330)",
      "Uludag Zero: 2 (E211), 3 (E330), 11, 12",
      "Ayran: F",
      "Red Bull / Energy: 1 (E150), 3 (E331, E330), 9 (kafein), taurin",
      "Buzlu çay (şeftali/limon): 3 (E330), 11",
      "Elma spritzer: 3 (E300)",
      "Maden suyu: beyan zorunluluğu olan alerjen/katkı yok",
    ],
  },
};

function InfoCard({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {lines.map((line, index) => (
        <Text key={`${title}-${index}`} style={styles.text}>
          {line}
        </Text>
      ))}
    </View>
  );
}

export default function AllergeneZusatzstoffeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("de");

  useFocusEffect(
    useCallback(() => {
      async function loadLanguage() {
        const currentLang = await getLanguage();
        const safeLang: Lang = ["de", "en", "hr", "sq", "tr"].includes(
          currentLang as Lang
        )
          ? (currentLang as Lang)
          : "de";

        setLang(safeLang);
      }

      loadLanguage();
    }, [])
  );

  const t = CONTENT[lang] || CONTENT.de;

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
        <Text style={styles.backText}>{t.back}</Text>
      </Pressable>

      <Text style={styles.pageTitle}>{t.title}</Text>

      <InfoCard title={t.sections.status} lines={t.statusLines} />
      <InfoCard title={t.sections.allergens} lines={t.allergenLines} />
      <InfoCard title={t.sections.additives} lines={t.additiveLines} />
      <InfoCard title={t.sections.notes} lines={t.noteLines} />
      <InfoCard title={t.sections.sandwich} lines={t.sandwichLines} />
      <InfoCard title={t.sections.durum} lines={t.durumLines} />
      <InfoCard title={t.sections.box} lines={t.boxLines} />
      <InfoCard title={t.sections.plateSnacks} lines={t.plateSnackLines} />
      <InfoCard title={t.sections.sauces} lines={t.sauceLines} />
      <InfoCard title={t.sections.drinks} lines={t.drinkLines} />
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