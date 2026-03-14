import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { getLanguage, translations } from "@/lib/i18n";
import HeaderBrand from "../../components/HeaderBrand";


const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "#BDBDBD",
  accent: "#C9A227",
};

export default function TabsLayout() {
  const [t, setT] = useState(translations.de);

  useEffect(() => {
    async function loadLang() {
      const lang = await getLanguage();
      setT(translations[lang] || translations.de);
    }

    loadLang();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: "rgba(255,255,255,0.10)",
          height: 100,
          paddingTop: 8,
          paddingBottom: 40,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        headerTitle: () => <HeaderBrand />,
        headerRight: () => (
          <View style={{ paddingRight: 14 }}>
            <Pressable
              onPress={() => router.push("/profile")}
              hitSlop={10}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={COLORS.text}
              />
            </Pressable>
          </View>
        ),
        headerLeft: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarLabel: t.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="produkte"
        options={{
          title: "",
          tabBarLabel: t.products,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="standorte"
        options={{
          title: "",
          tabBarLabel: t.locations,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "",
          tabBarLabel: t.more,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}