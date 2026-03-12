import AsyncStorage from "@react-native-async-storage/async-storage";

export const LANG_KEY = "app_language";

let currentLang = "de";

export const translations: any = {
  de: {
    home: "Home",
    locations: "Standorte",
    more: "Mehr",
    products: "Produkte",
    language: "Sprache",
    find_location: "Finde deinen Standort in der Nähe",
    order_now: "Jetzt bestellen",
  },

  en: {
    home: "Home",
    locations: "Locations",
    more: "More",
    products: "Products",
    language: "Language",
    find_location: "Find a location near you",
    order_now: "Order now",
  },

  hr: {
    home: "Početna",
    locations: "Lokacije",
    more: "Više",
    products: "Proizvodi",
    language: "Jezik",
    find_location: "Pronađite lokaciju u blizini",
    order_now: "Naruči sada",
  },

  sq: {
    home: "Ballina",
    locations: "Lokacionet",
    more: "Më shumë",
    products: "Produktet",
    language: "Gjuha",
    find_location: "Gjeni një lokacion pranë jush",
    order_now: "Porosit tani",
  },

  tr: {
    home: "Ana Sayfa",
    locations: "Şubeler",
    more: "Daha Fazla",
    products: "Ürünler",
    language: "Dil",
    find_location: "Size en yakın şubeyi bulun",
    order_now: "Şimdi sipariş ver",
  },
};

export async function getLanguage() {
  const lang = await AsyncStorage.getItem(LANG_KEY);
  currentLang = lang ?? "de";
  return currentLang;
}

export async function setLanguage(lang: string) {
  currentLang = lang;
  await AsyncStorage.setItem(LANG_KEY, lang);
}

export function t(key: string) {
  return translations[currentLang]?.[key] ?? key;
}