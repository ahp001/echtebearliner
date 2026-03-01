import { Stack, router } from "expo-router";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { auth } from "../lib/firebase";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  accent: "#F5C400",
  danger: "#FF5A5A",
};

function Btn({
  title,
  onPress,
  variant = "solid",
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline" | "danger";
  disabled?: boolean;
}) {
  const style = useMemo(() => {
    if (variant === "solid") {
      return { backgroundColor: COLORS.accent, borderWidth: 0 };
    }
    if (variant === "danger") {
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(255,90,90,0.8)",
      };
    }
    return {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: COLORS.border,
    };
  }, [variant]);

  const textStyle = useMemo(() => {
    if (variant === "solid") return { color: "#000", fontWeight: "900" as const };
    if (variant === "danger") return { color: COLORS.danger, fontWeight: "800" as const };
    return { color: COLORS.text, fontWeight: "800" as const };
  }, [variant]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingVertical: 12,
          borderRadius: 14,
          alignItems: "center",
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
      }}
    >
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  async function doLogout() {
    try {
      await signOut(auth);
      Alert.alert("Abgemeldet", "Du bist jetzt ausgeloggt.");
    } catch (e: any) {
      Alert.alert("Fehler", e?.message ?? "Logout fehlgeschlagen.");
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen
        options={{
          title: "Profil",
          headerShown: true,
          headerBackTitle: "Zurück",
        }}
      />

      <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: "900" }}>
        Profil
      </Text>
      <Text style={{ color: COLORS.muted, marginTop: 6 }}>
        Login / Konto
      </Text>

      <View style={{ height: 16 }} />

      {/* AUTH STATUS */}
      <Card>
        {loadingAuth ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator />
            <Text style={{ color: COLORS.muted }}>Prüfe Login…</Text>
          </View>
        ) : !user ? (
          <>
            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "800" }}>
              Du bist nicht eingeloggt
            </Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>
              Logge dich ein oder erstelle ein Konto.
            </Text>

            <View style={{ height: 12 }} />
            <Btn title="Login" onPress={() => router.push("/(auth)/login")} />
            <View style={{ height: 10 }} />
            <Btn
              title="Registrieren"
              variant="outline"
              onPress={() => router.push("/(auth)/register")}
            />
          </>
        ) : (
          <>
            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "800" }}>
              Angemeldet als
            </Text>

            <Text style={{ color: COLORS.muted, marginTop: 6 }}>
              Email: {user.email ?? "-"}
            </Text>

            <View style={{ height: 12 }} />
            <Btn title="Logout" variant="danger" onPress={doLogout} />
          </>
        )}
      </Card>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}