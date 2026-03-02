import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import Logo from "../../assets/das-original-spiess.svg";

import { getPushToken } from "@/lib/push";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.10)",
  accent: "#F5C400",
};

export default function HomeScreen() {
  const router = useRouter();

  const handleGetToken = async () => {
  const t = await getPushToken();
  console.log("EXPO TOKEN:", t);
  alert(t ?? "no token");
};

  // ✅ echte CountUp-Zahl (wie “Raffer”)
  const countAnim = useRef(new Animated.Value(0)).current;
  const [countText, setCountText] = useState("0");

  useEffect(() => {
    const id = countAnim.addListener(({ value }) => {
      setCountText(String(Math.floor(value)));
    });

    countAnim.setValue(0);
    Animated.timing(countAnim, {
      toValue: 28,
      duration: 950,
      useNativeDriver: false,
    }).start();

    return () => {
      countAnim.removeListener(id);
    };
  }, [countAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* HERO oben */}
      <View style={{ paddingTop: 18, alignItems: "center" }}>
        <Logo width={260} height={120} />

      </View>

      {/* Content darunter */}
      <View style={{ paddingHorizontal: 16, marginTop: 70 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderWidth: 1,
            borderColor: COLORS.cardBorder,
            borderRadius: 22,
            padding: 16,
            overflow: "hidden",
          }}
        >
          {/* Accent line */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: COLORS.accent,
              opacity: 0.95,
            }}
          />

          {/* Brand-eyebrow */}
          <Text
            style={{
              color: COLORS.muted,
              fontWeight: "900",
              letterSpacing: 1.8,
              textTransform: "uppercase",
            }}
          >
            DEUTSCHLANDWEIT
          </Text>

          {/* Zahl + Label */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 58,
                fontWeight: "900",
                lineHeight: 60,
                letterSpacing: -1, // “condensed” vibe
              }}
            >
              {countText}
            </Text>

            <Text
              style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: "900",
                marginBottom: 10,
                letterSpacing: 0.6,
                textTransform: "uppercase",
              }}
            >
              Standorte
            </Text>
          </View>

          <Text
            style={{
              color: COLORS.muted,
              marginTop: 10,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Finde deinen Standort in der Nähe und starte direkt deine Route.
          </Text>

          {/* ✅ nur 1 Button */}
          <Pressable
            onPress={() => router.push("/(tabs)/standorte")}
            style={{
              marginTop: 14,
              backgroundColor: COLORS.accent,
              paddingVertical: 13,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "900", letterSpacing: 0.4 }}>
              Zu Standorten
            </Text>
          </Pressable>
          <Pressable
  onPress={handleGetToken}
  style={{
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  }}
>
  <Text style={{ color: COLORS.text, fontWeight: "900", letterSpacing: 0.4 }}>
    Push Token anzeigen
  </Text>
</Pressable>
        </View>

        {/* Brand line */}
        <Text
          style={{
            color: "rgba(255,255,255,0.35)",
            marginTop: 14,
            fontSize: 12,
            fontWeight: "900",
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          ECHTEBÄRLINER • DAS ORIGINAL
        </Text>
      </View>
    </View>
  );
}