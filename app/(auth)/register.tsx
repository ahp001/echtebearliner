import { registerWithEmail } from "@/lib/auth";
import { db } from "@/lib/firebase";
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

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    if (!firstName || !lastName || !phone || !email || !pw)
      return Alert.alert("Hinweis", "Bitte alle Felder ausfüllen.");

    if (pw.length < 6)
      return Alert.alert("Hinweis", "Passwort min. 6 Zeichen.");

    try {
      setLoading(true);

      const user = await registerWithEmail(email.trim(), pw);

      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Erfolgreich", "Konto erstellt!");
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Fehler", e?.message ?? "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 40 }}
    >
      <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: "900", marginBottom: 20 }}>
        Registrieren
      </Text>

      <Input placeholder="Vorname" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Nachname" value={lastName} onChangeText={setLastName} />
      <Input placeholder="Telefon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input placeholder="E-Mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input placeholder="Passwort (min. 6 Zeichen)" value={pw} onChangeText={setPw} secureTextEntry />

      <Pressable
        onPress={onRegister}
        disabled={loading}
        style={{
          backgroundColor: COLORS.accent,
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ fontWeight: "900", color: "#000" }}>
          {loading ? "..." : "Account erstellen"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
        <Text style={{ color: COLORS.muted }}>Zurück</Text>
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