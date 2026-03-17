import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth } from "@/lib/firebase";
import { syncPushTokenToUser } from "@/lib/push";

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
  const [showAppLoading, setShowAppLoading] = useState(true);

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
  if (!layoutReady) return;

  let timer: ReturnType<typeof setTimeout>;

  async function prepareApp() {
    try {
      await SplashScreen.hideAsync();

      timer = setTimeout(() => {
        setShowAppLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Splash hide error:", error);
    }
  }

  prepareApp();

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [layoutReady]);

  if (!layoutReady || showAppLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ImageBackground
          source={require("../assets/images/loading/loading.jpeg")}
          style={styles.loadingImage}
          resizeMode="cover"
        />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});