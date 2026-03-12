import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  accent: "#C9A227",
};

export default function DsgvoScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 90, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        <Text style={styles.backText}>Zurück</Text>
      </Pressable>

      <Text style={styles.pageTitle}>DSGVO</Text>

      <View style={styles.card}>
        <SectionTitle title="ECHTE BÄRLINER®" />
        <Text style={styles.highlight}>EINE MARKE DER MARAS GROUP®</Text>

        <Text style={styles.textBlock}>
          Zollern Str. 11{"\n"}
          86154 Augsburg
        </Text>

        <Text style={styles.textBlock}>
          Büro: 0821 - 209 566 64{"\n"}
          Mobil: 0176 - 822 712 25
        </Text>

        <Text style={styles.textBlock}>
          Inhaber: Ugur Maras{"\n"}
          Steuer-Nr. 103/248/00110
        </Text>

        <Text style={styles.textBlock}>
          Amtsgericht Augsburg{"\n"}
          Sitz: Augsburg
        </Text>

        <Text style={styles.textBlock}>
          info@echtebaerliner.de{"\n"}
          www.echtebaerliner.de
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Allgemeine Geschäftsbedingungen" />
        <Text style={styles.paragraph}>
          Wir verweisen Sie gerne auch auf unseren Haftungsausschluss und unsere
          Datenschutzbestimmungen.
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Urheberrecht" />
        <Text style={styles.paragraph}>
          Copyright 2024 ECHTE BÄRLINER®. Alle Rechte vorbehalten.
        </Text>
        <Text style={styles.paragraph}>
          Alle Texte, Bilder, Graphiken, Ton-, Video- und Animationsdateien
          sowie ihre Arrangements unterliegen dem Urheberrecht und anderen
          Gesetzen zum Schutz geistigen Eigentums. Sie dürfen weder für
          Handelszwecke oder zur Weitergabe kopiert, noch verändert und auf
          anderen Web-Sites verwendet werden.
        </Text>
        <Text style={styles.paragraph}>
          Einige ECHTE BÄRLINER®-Internet-Seiten enthalten auch Bilder, die dem
          Urheberrecht derjenigen unterliegen, die diese zur Verfügung gestellt
          haben.
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Gewährleistung" />
        <Text style={styles.paragraph}>
          Die Informationen stellt ECHTE BÄRLINER® ohne jegliche Zusicherung
          oder Gewährleistung jedweder Art, sei sie ausdrücklich oder
          stillschweigend, zur Verfügung.
        </Text>
        <Text style={styles.paragraph}>
          Ausgeschlossen sind auch alle stillschweigenden Gewährleistungen
          betreffend die Handlungsfähigkeit, die Eignung für bestimmte Zwecke
          oder den Nicht verstoß gegen Gesetze und Patente.
        </Text>
        <Text style={styles.paragraph}>
          Auch wenn wir davon ausgehen, dass die von uns gegebenen Informationen
          zutreffend sind, können sie dennoch Fehler oder Ungenauigkeiten
          enthalten.
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Lizenzrechte" />
        <Text style={styles.paragraph}>
          ECHTE BÄRLINER® möchte Ihnen ein innovatives und informatives
          Internet-Programm anbieten. Wir hoffen deshalb, dass Sie sich über
          unsere kreative Gestaltung genauso freuen wie wir.
        </Text>
        <Text style={styles.paragraph}>
          Wir bitten Sie aber dennoch um Verständnis dafür, dass die ECHTE
          BÄRLINER® ihr geistiges Eigentum, einschließlich Patente,
          Handelsmarken und Urheberrechte, schützen muss und diese
          Internet-Seiten keinerlei Lizenzrechte an dem geistigen Eigentum der
          ECHTE BÄRLINER® gewähren können.
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Externe Verweise und Links" />
        <Text style={styles.paragraph}>
          Mit Urteil vom 12. Mai 1998 hat das LG Hamburg entschieden, dass man
          durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf.
          mit zu verantworten hat.
        </Text>
        <Text style={styles.paragraph}>
          Dies kann, so das LG, nur dadurch verhindert werden, dass man sich
          ausdrücklich von diesen Inhalten distanziert.
        </Text>
        <Text style={styles.paragraph}>
          Wir haben auf unseren Seiten Links zu Seiten im Internet gelegt, deren
          Inhalt und Aktualisierung nicht dem Einflussbereich der ECHTE
          BÄRLINER® unterliegen.
        </Text>
        <Text style={styles.paragraph}>Für alle diese Links gilt:</Text>
        <Text style={styles.paragraph}>
          ECHTE BÄRLINER® hat keinen Einfluss auf Gestaltung und Inhalte fremder
          Internetseiten. Sie distanziert sich daher von allen fremden
          Inhalten, auch wenn von Seiten der ECHTE BÄRLINER® auf diese externe
          Seiten ein Link gesetzt wurden.
        </Text>
        <Text style={styles.paragraph}>
          Diese Erklärung gilt für alle auf unserer Homepage angezeigten Links
          und für alle Inhalte der Seiten, zu denen die bei uns angemeldeten
          Banner und Links führen.
        </Text>
      </View>
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
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
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  highlight: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },
  textBlock: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 14,
  },
  paragraph: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});