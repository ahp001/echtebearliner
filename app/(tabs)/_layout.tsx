import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";

import HeaderBrand from "../../components/HeaderBrand";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "#BDBDBD",
  accent: "#F5C400",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: "rgba(255,255,255,0.10)",
          height: 66,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,

        // 👇 Mitte: Logo
        headerTitle: () => <HeaderBrand />,

        // 👇 Rechts: Profil Icon
        headerRight: () => (
          <View style={{ paddingRight: 14 }}>
            <Pressable
              onPress={() => {
                // TODO: später zu Profil/Account Screen navigieren
              }}
              hitSlop={10}
            >
              <Ionicons name="person-circle-outline" size={28} color={COLORS.text} />
            </Pressable>
          </View>
        ),

        // Links nix (wie bei vielen Brand-Apps)
        headerLeft: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produkte"
        options={{
          title: "",
          tabBarLabel: "Produkte",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="standorte"
        options={{
          title: "",
          tabBarLabel: "Standorte",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "",
          tabBarLabel: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}