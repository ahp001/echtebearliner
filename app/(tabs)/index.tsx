import { getLanguage, translations } from "@/lib/i18n";
import { getPushToken } from "@/lib/push";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Logo from "../../assets/das-original-spiess.svg";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  card: "rgba(0,0,0,0.65)",
  cardBorder: "rgba(255,255,255,0.10)",
  accent: "#C9A227",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

const ORDER_IMAGES: Record<Lang, ImageSourcePropType> = {
  de: require("../../assets/images/bestellenbild/jetztbestellen.png"),
  en: require("../../assets/images/bestellenbild/bestellen_english.png"),
  hr: require("../../assets/images/bestellenbild/bestellen_kroatisch.png"),
  sq: require("../../assets/images/bestellenbild/bestellen_albanisch.png"),
  tr: require("../../assets/images/bestellenbild/bestellen_türkish.png"),
};

const COUPON_IMAGES: Record<Lang, ImageSourcePropType> = {
  de: require("../../assets/images/coupons/coupons_deutsch.jpeg"),
  en: require("../../assets/images/coupons/coupons_english.jpeg"),
  hr: require("../../assets/images/coupons/coupons_kroatisch.jpeg"),
  sq: require("../../assets/images/coupons/coupons_albanisch.jpeg"),
  tr: require("../../assets/images/coupons/coupons_türkish.jpeg"),
};

const COUPON_BUTTON_TEXT: Record<Lang, string> = {
  de: "Coupons",
  en: "Coupons",
  hr: "Kuponi",
  sq: "Kupona",
  tr: "Kuponlar",
};

const FRANCHISE_IMAGES: Record<Lang, ImageSourcePropType> = {
  de: require("../../assets/images/frenchisepartnerwerden/frenchise_deutsch.jpeg"),
  en: require("../../assets/images/frenchisepartnerwerden/frenchise_english.jpeg"),
  hr: require("../../assets/images/frenchisepartnerwerden/frenchise_kroatisch.jpeg"),
  sq: require("../../assets/images/frenchisepartnerwerden/frenchise_albanisch.jpeg"),
  tr: require("../../assets/images/frenchisepartnerwerden/frenchise_türkish.jpeg"),
};

const FRANCHISE_BUTTON_TEXT: Record<Lang, string> = {
  de: "Franchise-Partner werden",
  en: "Become a Franchise Partner",
  hr: "Postanite franšizni partner",
  sq: "Bëhu partner franchise",
  tr: "Franchise ortağı olun",
};

export default function HomeScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const videoOpacity = useRef(new Animated.Value(0)).current;

  const [countText, setCountText] = useState("0");
  const [currentLang, setCurrentLang] = useState<Lang>("de");
  const [t, setT] = useState(translations["de"]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    async function loadLang() {
      const lang = (await getLanguage()) as Lang;
      const safeLang: Lang = ["de", "en", "hr", "sq", "tr"].includes(lang)
        ? lang
        : "de";

      setCurrentLang(safeLang);
      setT(translations[safeLang] || translations["de"]);
    }
    loadLang();
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 950;
    const toValue = 26;

    const interval = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / duration);
      setCountText(String(Math.floor(progress * toValue)));
      if (progress >= 1) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const token = await getPushToken();
      if (token) console.log("EXPO TOKEN:", token);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  const fadeInVideo = () => {
    if (videoLoaded) return;

    setVideoLoaded(true);

    Animated.timing(videoOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const posterOpacity = useMemo(
    () =>
      videoOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [videoOpacity]
  );

  const openImageModal = (imageSource: any) => {
    setSelectedImage(imageSource);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const openExternalLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log("Link open error:", error);
    }
  };

  const orderImage = ORDER_IMAGES[currentLang] || ORDER_IMAGES.de;
  const couponImage = COUPON_IMAGES[currentLang] || COUPON_IMAGES.de;
  const couponButtonText =
    COUPON_BUTTON_TEXT[currentLang] || COUPON_BUTTON_TEXT.de;
  const franchiseImage = FRANCHISE_IMAGES[currentLang] || FRANCHISE_IMAGES.de;
  const franchiseButtonText =
    FRANCHISE_BUTTON_TEXT[currentLang] || FRANCHISE_BUTTON_TEXT.de;

  return (
    <View style={styles.screen}>
      <View style={styles.posterWrapper}>
  <Animated.Image
    source={require("../../assets/images/loading/loading.jpeg")}
    style={[styles.posterImage, { opacity: posterOpacity }]}
    resizeMode="contain"
  />
</View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { opacity: videoOpacity }]}
      >
        <Video
          ref={videoRef}
          source={require("../../assets/hero.mp4")}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onLoad={fadeInVideo}
          onReadyForDisplay={fadeInVideo}
        />
      </Animated.View>

      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      >
        <View style={styles.container}>
          <Logo width={260} height={120} />

          <View style={styles.content}>
            <Pressable
              onPress={() =>
                openImageModal(require("../../assets/images/main1.png"))
              }
            >
              <Image
                source={require("../../assets/images/main1.png")}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </Pressable>

            <View style={styles.card}>
              <View style={styles.accentLine} />

              <View style={styles.row}>
                <Text style={styles.big}>{countText}</Text>
                <Text style={styles.label}>{t.locations}</Text>
              </View>

              <Text style={styles.desc}>{t.find_location}</Text>

              <Pressable
                onPress={() =>
                  openImageModal(require("../../assets/images/main2.jpeg"))
                }
              >
                <Image
                  source={require("../../assets/images/main2.jpeg")}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </Pressable>

              <Pressable
                onPress={() => router.push("/(tabs)/standorte")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t.locations}</Text>
              </Pressable>
            </View>

            <View style={[styles.card, styles.couponCard]}>
              <View style={styles.accentLine} />

              <Pressable onPress={() => openImageModal(couponImage)}>
                <Image
                  source={couponImage}
                  style={styles.couponImage}
                  resizeMode="cover"
                />
              </Pressable>

              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>{couponButtonText}</Text>
              </Pressable>
            </View>

            <View style={[styles.card, styles.couponCard]}>
              <View style={styles.accentLine} />

              <Pressable onPress={() => openImageModal(franchiseImage)}>
                <Image
                  source={franchiseImage}
                  style={styles.couponImage}
                  resizeMode="cover"
                />
              </Pressable>

              <Pressable
                onPress={() => router.push("/(tabs)/more")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{franchiseButtonText}</Text>
              </Pressable>
            </View>

            <Image
              source={require("../../assets/images/main3.png")}
              style={styles.bottomImage}
              resizeMode="cover"
            />

            <Image
              source={require("../../assets/images/krauter_knoblauch_scharf.png")}
              style={styles.saucesImage}
              resizeMode="contain"
            />

            <Image
              source={orderImage}
              style={styles.orderImage}
              resizeMode="contain"
            />

            <View style={styles.deliveryRow}>
              <Pressable
                onPress={() => openExternalLink("https://www.lieferando.de/")}
                style={styles.deliveryLogoPress}
              >
                <Image
                  source={require("../../assets/images/lieferketten/lieferandoo.png")}
                  style={styles.deliveryLogo}
                  resizeMode="cover"
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  openExternalLink(
                    "https://www.ubereats.com/de?srsltid=AfmBOopLouCDv9qwsPtSX_ll9JmPQKEk2g2gW7bEVGcLCxTQEKFNcfBc"
                  )
                }
                style={styles.deliveryLogoPress}
              >
                <Image
                  source={require("../../assets/images/lieferketten/uber eats+.png")}
                  style={styles.deliveryLogo}
                  resizeMode="cover"
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  openExternalLink(
                    "https://wolt.com/de/deu?srsltid=AfmBOoqChTBxmgIpOcW845-3HdbNsE-2hJqZfUeJur7gOSw11ec87m1k"
                  )
                }
                style={styles.deliveryLogoPress}
              >
                <Image
                  source={require("../../assets/images/lieferketten/wolt.png")}
                  style={styles.deliveryLogo}
                  resizeMode="cover"
                />
              </Pressable>
            </View>

            <Text style={styles.brandLine}>ECHTE BÄRLINER • DAS ORIGINAL</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={closeImageModal} />
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={closeImageModal}>
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </Pressable>

            {selectedImage && (
              <Image
                source={selectedImage}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingTop: 18,
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 40,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  heroImage: {
    width: "60%",
    height: 200,
    marginBottom: 15,
    alignSelf: "center",
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 8,
    marginBottom: 20,
  },
  deliveryLogoPress: {
    borderRadius: 12,
  },
  deliveryLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 22,
    padding: 16,
    overflow: "hidden",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#C9A227",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  big: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  desc: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#C9A227",
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "900",
    color: "#0B0B0B",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  brandLine: {
    color: "rgba(255,255,255,0.35)",
    marginTop: 14,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    textAlign: "center",
  },
  bottomImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 18,
  },
  saucesImage: {
    width: "100%",
    height: 70,
    marginTop: 25,
    marginBottom: 6,
  },
  orderImage: {
    width: "100%",
    height: 35,
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: 55,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 8,
  },
  fullscreenImage: {
    width: "100%",
    height: "75%",
  },
  couponImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  couponCard: {
    marginTop: 10,
  },
  posterWrapper: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "#0B0B0B",
  justifyContent: "center",
  alignItems: "center",
},
posterImage: {
  width: "100%",
  height: "100%",
},
});