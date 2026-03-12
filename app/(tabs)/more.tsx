import { logout } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { getLanguage } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  accent: "#C9A227",
  danger: "#D9534F",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

const UI_TEXT: Record<
  Lang,
  {
    pageTitle: string;
    unknown: string;
    profile: string;
    loggedInAs: string;
    languages: string;
    languagesSub: string;
    allergens: string;
    allergensSub: string;
    franchise: string;
    franchiseSub: string;
    privacy: string;
    privacySub: string;
    imprint: string;
    imprintSub: string;
    instagram: string;
    instagramSub: string;
    tiktok: string;
    tiktokSub: string;
    logout: string;
    error: string;
    logoutFailed: string;
    profileAlertTitle: string;
  }
> = {
  de: {
    pageTitle: "More",
    unknown: "Unbekannt",
    profile: "Profil",
    loggedInAs: "Eingeloggt als",
    languages: "Sprachen",
    languagesSub: "Deutsch, Englisch und mehr",
    allergens: "Allergene & Zusatzstoffe",
    allergensSub: "Hinweise zu Inhaltsstoffen und Allergenen",
    franchise: "Jetzt Franchise Partner werden",
    franchiseSub: "Interesse an einer Partnerschaft",
    privacy: "DSGVO",
    privacySub: "Datenschutz & rechtliche Informationen",
    imprint: "Impressum",
    imprintSub: "Anbieterkennzeichnung",
    instagram: "Instagram",
    instagramSub: "@echtebaerliner",
    tiktok: "TikTok",
    tiktokSub: "@echtebaerliner",
    logout: "Abmelden",
    error: "Fehler",
    logoutFailed: "Abmelden hat nicht funktioniert.",
    profileAlertTitle: "Profil",
  },
  en: {
    pageTitle: "More",
    unknown: "Unknown",
    profile: "Profile",
    loggedInAs: "Logged in as",
    languages: "Languages",
    languagesSub: "German, English and more",
    allergens: "Allergens & additives",
    allergensSub: "Information on ingredients and allergens",
    franchise: "Become a franchise partner",
    franchiseSub: "Interested in a partnership",
    privacy: "GDPR",
    privacySub: "Privacy & legal information",
    imprint: "Imprint",
    imprintSub: "Provider information",
    instagram: "Instagram",
    instagramSub: "@echtebaerliner",
    tiktok: "TikTok",
    tiktokSub: "@echtebaerliner",
    logout: "Log out",
    error: "Error",
    logoutFailed: "Log out failed.",
    profileAlertTitle: "Profile",
  },
  hr: {
    pageTitle: "Više",
    unknown: "Nepoznato",
    profile: "Profil",
    loggedInAs: "Prijavljeni kao",
    languages: "Jezici",
    languagesSub: "Njemački, engleski i više",
    allergens: "Alergeni i aditivi",
    allergensSub: "Informacije o sastojcima i alergenima",
    franchise: "Postanite franchise partner",
    franchiseSub: "Zainteresirani za partnerstvo",
    privacy: "GDPR",
    privacySub: "Zaštita podataka i pravne informacije",
    imprint: "Impresum",
    imprintSub: "Podaci o pružatelju",
    instagram: "Instagram",
    instagramSub: "@echtebaerliner",
    tiktok: "TikTok",
    tiktokSub: "@echtebaerliner",
    logout: "Odjava",
    error: "Greška",
    logoutFailed: "Odjava nije uspjela.",
    profileAlertTitle: "Profil",
  },
  sq: {
    pageTitle: "Më shumë",
    unknown: "I panjohur",
    profile: "Profili",
    loggedInAs: "I kyçur si",
    languages: "Gjuhët",
    languagesSub: "Gjermanisht, anglisht dhe më shumë",
    allergens: "Alergjenet dhe shtesat",
    allergensSub: "Informacion për përbërësit dhe alergjenet",
    franchise: "Bëhu partner franchise",
    franchiseSub: "Interes për bashkëpunim",
    privacy: "GDPR",
    privacySub: "Privatësia dhe informacion ligjor",
    imprint: "Impressum",
    imprintSub: "Të dhënat e ofruesit",
    instagram: "Instagram",
    instagramSub: "@echtebaerliner",
    tiktok: "TikTok",
    tiktokSub: "@echtebaerliner",
    logout: "Dil",
    error: "Gabim",
    logoutFailed: "Dalja nuk funksionoi.",
    profileAlertTitle: "Profili",
  },
  tr: {
    pageTitle: "Daha Fazla",
    unknown: "Bilinmiyor",
    profile: "Profil",
    loggedInAs: "Giriş yapan",
    languages: "Diller",
    languagesSub: "Almanca, İngilizce ve daha fazlası",
    allergens: "Alerjenler ve katkı maddeleri",
    allergensSub: "İçerikler ve alerjen bilgileri",
    franchise: "Şimdi franchise partneri olun",
    franchiseSub: "İş ortaklığına ilgi duyuyorum",
    privacy: "KVKK / GDPR",
    privacySub: "Gizlilik ve yasal bilgiler",
    imprint: "Künye",
    imprintSub: "Sağlayıcı bilgileri",
    instagram: "Instagram",
    instagramSub: "@echtebaerliner",
    tiktok: "TikTok",
    tiktokSub: "@echtebaerliner",
    logout: "Çıkış yap",
    error: "Hata",
    logoutFailed: "Çıkış yapılamadı.",
    profileAlertTitle: "Profil",
  },
};

export default function MoreScreen() {
  const [lang, setLang] = useState<Lang>("de");

  useFocusEffect(
    useCallback(() => {
      async function loadLanguage() {
        const currentLang = await getLanguage();
        setLang((currentLang as Lang) || "de");
      }

      loadLanguage();
    }, [])
  );

  const t = UI_TEXT[lang];
  const user = auth.currentUser;
  const email = user?.email ?? t.unknown;

  async function openInstagram() {
    const url = "https://www.instagram.com/echtebaerliner";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }

  async function openTikTok() {
    const url = "https://www.tiktok.com/@echtebaerliner";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }

  async function onLogout() {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert(t.error, t.logoutFailed);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
    >
      <Text style={styles.pageTitle}>{t.pageTitle}</Text>

      <View style={styles.group}>
        <MenuRow
          icon="person-circle-outline"
          title={t.profile}
          subtitle={`${t.loggedInAs}: ${email}`}
          onPress={() =>
            Alert.alert(t.profileAlertTitle, `${t.loggedInAs}:\n${email}`)
          }
        />

        <MenuRow
          icon="language-outline"
          title={t.languages}
          subtitle={t.languagesSub}
          onPress={() => router.push("/language")}
        />

        <MenuRow
          icon="restaurant-outline"
          title={t.allergens}
          subtitle={t.allergensSub}
          onPress={() => router.push("/allergene-zusatzstoffe")}
        />

        <MenuRow
          icon="briefcase-outline"
          title={t.franchise}
          subtitle={t.franchiseSub}
          onPress={() => router.push("/partnerwerden")}
        />

        <MenuRow
          icon="shield-checkmark-outline"
          title={t.privacy}
          subtitle={t.privacySub}
          onPress={() => router.push("/dsgvo")}
        />

        <MenuRow
          icon="document-text-outline"
          title={t.imprint}
          subtitle={t.imprintSub}
          onPress={() => router.push("/impressum")}
        />

        <MenuRow
          icon="logo-instagram"
          title={t.instagram}
          subtitle={t.instagramSub}
          onPress={openInstagram}
        />

        <MenuRow
          icon="logo-tiktok"
          title={t.tiktok}
          subtitle={t.tiktokSub}
          onPress={openTikTok}
        />
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </Pressable>
    </ScrollView>
  );
}

function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={24} color={COLORS.accent} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  group: {
    gap: 12,
  },
  row: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },
  rowSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});