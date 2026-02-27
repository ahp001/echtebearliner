import { Image as ExpoImage } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  accent: "#F5C400",
};

export default function Produkte() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: 16 }}>

        {/* DAS ORIGINAL */}
        <View style={cardStyle}>
          <ExpoImage
            source={require("../../assets/images/das-original.jpg")}
            style={imageStyle}
            contentFit="cover"
            transition={150}
          />
          <Text style={titleStyle}>Das Original</Text>
          <Text style={descStyle}>
            Saftiges Kalbfleisch, frischer Salat, hausgemachte Sauce.
          </Text>
          <Pressable style={buttonStyle}>
            <Text style={{ fontWeight: "900" }}>Mehr Dazu</Text>
          </Pressable>
        </View>

        {/* KREUZBERG */}
        <View style={cardStyle}>
          <ExpoImage
            source={require("../../assets/images/kreuzberg.jpg")}
            style={imageStyle}
            contentFit="cover"
            transition={150}
          />
          <Text style={titleStyle}>Kreuzberg</Text>
          <Text style={descStyle}>
            Würzig, pikant, mit extra Schärfe und frischen Kräutern.
          </Text>
          <Pressable style={buttonStyle}>
            <Text style={{ fontWeight: "900" }}>Mehr Dazu</Text>
          </Pressable>
        </View>

        {/* MOABIT */}
        <View style={cardStyle}>
          <ExpoImage
            source={require("../../assets/images/moabit.jpg")}
            style={imageStyle}
            contentFit="cover"
            transition={150}
          />
          <Text style={titleStyle}>Moabit</Text>
          <Text style={descStyle}>
            Klassisch & ehrlich – der Allrounder für jeden Geschmack.
          </Text>
          <Pressable style={buttonStyle}>
            <Text style={{ fontWeight: "900" }}>Mehr Dazu</Text>
          </Pressable>
        </View>

        {/* NEUKÖLLN */}
        <View style={cardStyle}>
          <ExpoImage
            source={require("../../assets/images/neukoelln.jpg")}
            style={imageStyle}
            contentFit="cover"
            transition={150}
          />
          <Text style={titleStyle}>Neukölln</Text>
          <Text style={descStyle}>
            Mit Pommes im Brot – Berliner Streetstyle.
          </Text>
          <Pressable style={buttonStyle}>
            <Text style={{ fontWeight: "900" }}>Mehr Dazu</Text>
          </Pressable>
        </View>

        {/* TEMPELHOF */}
        <View style={cardStyle}>
          <ExpoImage
            source={require("../../assets/images/tempel.jpg")}
            style={imageStyle}
            contentFit="cover"
            transition={150}
          />
          <Text style={titleStyle}>Tempelhof</Text>
          <Text style={descStyle}>
            Leicht & knackig – perfekt für den schnellen Hunger.
          </Text>
          <Pressable style={buttonStyle}>
            <Text style={{ fontWeight: "900" }}>Mehr Dazu</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}

const cardStyle = {
  backgroundColor: COLORS.card,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 20,
  padding: 14,
  marginBottom: 16,
};

const imageStyle = {
  width: "100%" as const,
  height: 180,
  borderRadius: 16,
};

const titleStyle = {
  color: COLORS.text,
  fontSize: 18,
  fontWeight: "900" as const,
  marginTop: 12,
};

const descStyle = {
  color: COLORS.muted,
  marginTop: 6,
  fontSize: 13,
  lineHeight: 18,
};

const buttonStyle = {
  marginTop: 12,
  backgroundColor: COLORS.accent,
  paddingVertical: 10,
  borderRadius: 14,
  alignItems: "center" as const,
};