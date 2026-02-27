import React from "react";
import {
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  yellow: "#F5C400",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.55)",
};

type LocationItem = {
  title: string;
  street: string;
  zipCity: string;
};

const LOCATIONS: LocationItem[] = [
  { title: "Augsburg-Oberhausen", street: "Zollernstraße 11", zipCity: "86154 Augsburg" },
  { title: "Augsburg-Innenstadt", street: "Pilgerhausstraße 35a", zipCity: "86152 Augsburg" },
  { title: "Augsburg-Hochfeld", street: "Johann-Georg-Halske-Straße 20", zipCity: "86159 Augsburg" },
  { title: "Augsburg-Göggingen", street: "Gögginger Str. 119", zipCity: "86199 Augsburg" },

  { title: "Augsburg-Hochzoll", street: "Friedberger Str. 122", zipCity: "86163 Augsburg" },
  { title: "Königsbrunn", street: "Messerschmittring 11", zipCity: "86343 Königsbrunn" },
  { title: "Diedorf", street: "Hauptstraße 2", zipCity: "86420 Diedorf" },
  { title: "Friedberg", street: "Ludwigstraße 33", zipCity: "86316 Friedberg" },

  { title: "Gersthofen", street: "Donauwörther Str. 22", zipCity: "86368 Gersthofen" },
  { title: "München-Giesing", street: "Humboldtstraße 19", zipCity: "81543 München" },
  { title: "München-Riem", street: "Phantasiestraße 2", zipCity: "81827 München" },
  { title: "München-Bogenhausen", street: "Meistersingerstraße 154", zipCity: "81927 München" },

  { title: "München-Schwabing", street: "Leopoldstraße 43", zipCity: "80802 München" },
  { title: "München-Laim", street: "Fürstenriederstraße 32", zipCity: "80686 München" },
  { title: "Kaufbeuren", street: "Schmiedgasse 15", zipCity: "87600 Kaufbeuren" },
  { title: "Untermeitingen", street: "Lechfelderstraße 52", zipCity: "86836 Untermeitingen" },

  { title: "Dachau", street: "Danziger Str. 1", zipCity: "85221 Dachau" },
  { title: "Kempten", street: "Kaufbeurer Str. 93", zipCity: "87437 Kempten" },
  { title: "Mering", street: "Gaußring 34–36", zipCity: "86415 Mering" },
  { title: "Neuss", street: "Kaarster Str. 84", zipCity: "41462 Neuss" },

  { title: "Ulm", street: "Karlstraße 63/1", zipCity: "89073 Ulm" },
  { title: "Nürnberg", street: "", zipCity: "90403 Nürnberg" },
  { title: "Regensburg", street: "", zipCity: "93047 Regensburg" },
  { title: "Wien / Österreich", street: "Quellenstraße 156", zipCity: "1100 Wien" },

  { title: "St. Gallen / Schweiz", street: "Rorschacherstraße 58", zipCity: "9000 St. Gallen" },
  { title: "Pristina / Kosovo", street: "Nënkalimi, Bill Clinton", zipCity: "Prishtina 10000" },
  { title: "Side / Türkiye", street: "618 Sok No:2, 07330", zipCity: "Manavgat/Antalya" },
  { title: "Zagreb / Kroatien", street: "Z Centar, Ljubljanska avenija 2b", zipCity: "10000 Zagreb" },
];

function openRoute(street: string, zipCity: string, title: string) {
  const q = encodeURIComponent(`${title} ${street} ${zipCity}`.trim());
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${q}`
      : `https://www.google.com/maps/search/?api=1&query=${q}`;

  Linking.openURL(url);
}

export default function Standorte() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 10, paddingTop: 10 }}>
      <FlatList
        data={LOCATIONS}
        keyExtractor={(item, idx) => `${item.title}-${idx}`}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        renderItem={({ item }) => {
          const addressLine = [item.street, item.zipCity].filter(Boolean).join("\n");

          return (
            <Pressable
              onPress={() => openRoute(item.street, item.zipCity, item.title)}
              style={{ flex: 1 }}
            >
              <ImageBackground
                source={require("../../assets/images/grafik.png")}
                resizeMode="cover"
                style={{
                  height: 170,
                  borderRadius: 14,
                  overflow: "hidden",
                  justifyContent: "center",
                  paddingHorizontal: 12,
                }}
              >
                {/* dunkles Overlay */}
                <View
                  style={{
                    ...StyleSheetFill,
                    backgroundColor: COLORS.overlay,
                  }}
                />

                {/* Textblock */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: COLORS.yellow,
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                      textDecorationLine: "underline",
                      textDecorationColor: COLORS.yellow,
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      color: COLORS.white,
                      fontWeight: "800",
                      fontSize: 14,
                      textAlign: "center",
                      textShadowColor: "rgba(0,0,0,0.85)",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                    numberOfLines={3}
                  >
                    {addressLine}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: "900",
                      fontSize: 12,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Route öffnen →
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

// mini helper, damit kein StyleSheet import nötig ist
const StyleSheetFill = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};