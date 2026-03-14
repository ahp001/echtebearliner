import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth } from "@/lib/firebase";

import { syncPushTokenToUser } from "@/lib/push";
// Splash direkt blockieren
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [authReady, setAuthReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return unsub;
  }, []);

  useEffect(() => {
  async function syncPush() {
    if (!authReady) return;
    if (!user?.uid) return;

    await syncPushTokenToUser(user.uid);
  }

  syncPush();
}, [authReady, user?.uid]);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!authReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inProfile = segments[0] === "profile";
    const inLanguage = segments[0] === "language";
    const inImpressum = segments[0] === "impressum";
    const inDsgvo = segments[0] === "dsgvo";
    const inPartnerWerden = segments[0] === "partnerwerden";
    const inAllergeneZusatzstoffe = segments[0] === "allergene-zusatzstoffe";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/register");
      return;
    }

    if (
      user &&
      !inTabsGroup &&
      !inProfile &&
      !inLanguage &&
      !inImpressum &&
      !inDsgvo &&
      !inPartnerWerden &&
      !inAllergeneZusatzstoffe
    ) {
      router.replace("/(tabs)");
      return;
    }

    setLayoutReady(true);
  }, [authReady, user, segments, navigationState?.key, router]);

  useEffect(() => {
  async function hideSplashWhenReady() {
    if (!layoutReady) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
    } catch (error) {
      console.log("Splash hide error:", error);
    }
  }

  hideSplashWhenReady();
}, [layoutReady]);

  // Solange Layout nicht fertig ist, Splash sichtbar lassen
  if (!layoutReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}