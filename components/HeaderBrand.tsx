import { View } from "react-native";
import Logo from "../assets/echtebaerliner-logo.svg";

export default function HeaderBrand() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Größe anpassen je nach SVG */}
      <Logo width={200} height={60} />
    </View>
  );
}