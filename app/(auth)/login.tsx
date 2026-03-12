import { loginWithEmail } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { getPushToken } from "@/lib/push";
import { router } from "expo-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(255,255,255,0.15)",
  accent: "#F5C400",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!email || !pw) {
      return Alert.alert("Hinweis", "Bitte E-Mail und Passwort eingeben.");
    }

    try {
      setLoading(true);

      // 1) Firebase Login
      const user = await loginWithEmail(email.trim(), pw);

      // 2) Push Token holen (fragt Permission)
      const token = await getPushToken();
console.log("PUSH TOKEN:", token);

      // 3) Token in Firestore speichern
      if (token) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            pushToken: token,
            pushUpdatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      router.replace("/(tabs)");// Home
    } catch (e: any) {
      console.log("LOGIN ERROR:", e?.code, e?.message);
      Alert.alert("Login fehlgeschlagen", e?.message ?? "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 100 }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 26,
          fontWeight: "900",
          marginBottom: 20,
        }}
      >
        Login
      </Text>

      <Input
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Input
        placeholder="Passwort"
        value={pw}
        onChangeText={setPw}
        secureTextEntry
      />

      <Pressable
        onPress={onLogin}
        disabled={loading}
        style={{
          backgroundColor: COLORS.accent,
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 20,
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text style={{ fontWeight: "900", color: "#000" }}>
          {loading ? "..." : "Anmelden"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(auth)/register")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: COLORS.muted }}>Neu hier? Registrieren</Text>
      </Pressable>
    </ScrollView>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
}: any) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.4)"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        color: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
      }}
    />
  );
}