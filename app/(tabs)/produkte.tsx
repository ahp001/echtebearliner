import { getLanguage, translations } from "@/lib/i18n";
import { ResizeMode, Video } from "expo-av";
import { Image as ExpoImage } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  accent: "#C9A227",
  category: "rgba(201,162,39,0.9)",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

type ProductItem = {
  key: string;
  category: {
    de: string;
    en: string;
    hr: string;
    sq: string;
    tr: string;
  };
  image: any;
  title: {
    de: string;
    en: string;
    hr: string;
    sq: string;
    tr: string;
  };
  desc: {
    de: string;
    en: string;
    hr: string;
    sq: string;
    tr: string;
  };
};

const getFirstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
};

const PRODUCTS: ProductItem[] = [
  {
    key: "box_kreuzberg",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_kreuzberg.jpeg"),
    title: {
      de: "Box Kreuzberg",
      en: "Kreuzberg Box",
      hr: "Box Kreuzberg",
      sq: "Box Kreuzberg",
      tr: "Kreuzberg Kutu",
    },
    desc: {
      de: "Genuss mit der feinen Note von Schafskäse und wahlweise Kalbs- oder Hähnchenfleisch. Dazu knackiger Eisbergsalat, Tomaten, Gurken und Ihre Wahl unserer hausgemachten Saucen.",
      en: "Enjoyment with the fine note of feta cheese and optional veal or chicken. Served with crisp iceberg lettuce, tomatoes, cucumbers, and your choice of our homemade sauces.",
      hr: "Užitak s finom notom feta sira i po izboru teletinom ili piletinom. Posluženo s hrskavom ledenom salatom, rajčicama, krastavcima i izborom naših domaćih umaka.",
      sq: "Shije me notën e këndshme të djathit feta dhe sipas zgjedhjes mish viçi ose pule. Shërbehet me sallatë iceberg krokante, domate, kastravec dhe zgjedhjen tuaj të salcave tona shtëpiake.",
      tr: "Beyaz peynirin zarif dokunuşu ve isteğe göre dana veya tavuk eti ile lezzet dolu bir seçenek. Çıtır iceberg marul, domates, salatalık ve ev yapımı sos seçenekleriyle servis edilir.",
    },
  },
  {
    key: "box_moabit_veggie",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_moabit_veggie.png"),
    title: {
      de: "Box Moabit Veggie",
      en: "Moabit Veggie Box",
      hr: "Box Moabit Veggie",
      sq: "Box Moabit Veggie",
      tr: "Moabit Veggie Kutu",
    },
    desc: {
      de: "Die frische, fleischlose Alternative mit buntem Salat und knackigem Gemüse. Perfekt kombiniert mit unseren hausgemachten Saucen für den vollen Geschmack.",
      en: "The fresh meat-free alternative with colorful salad and crunchy vegetables. Perfectly combined with our homemade sauces for full flavor.",
      hr: "Svježa alternativa bez mesa s raznobojnom salatom i hrskavim povrćem. Savršeno kombinirano s našim domaćim umacima za puni okus.",
      sq: "Alternativa e freskët pa mish me sallatë shumëngjyrëshe dhe perime krokante. E kombinuar në mënyrë perfekte me salcat tona shtëpiake për shije të plotë.",
      tr: "Renkli salata ve çıtır sebzelerle taze, etsiz alternatif. Tam lezzet için ev yapımı soslarımızla mükemmel uyum sağlar.",
    },
  },
  {
    key: "box_neukoeln",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_neukoeln.jpeg"),
    title: {
      de: "Box Neukölln",
      en: "Neukölln Box",
      hr: "Box Neukölln",
      sq: "Box Neukölln",
      tr: "Neukölln Kutu",
    },
    desc: {
      de: "Herzhaftes Kalbs- oder Hähnchenfleisch trifft auf knusprige Pommes frites direkt in der Box. Abgerundet durch frischen Salat, Zwiebeln und unsere hausgemachten Saucen nach Ihrem Geschmack.",
      en: "Hearty veal or chicken meets crispy fries directly in the box. Finished with fresh salad, onions, and our homemade sauces to your taste.",
      hr: "Sočno teleće ili pileće meso susreće hrskavi pomfrit izravno u boxu. Zaokruženo svježom salatom, lukom i našim domaćim umacima po vašem ukusu.",
      sq: "Mishi i shijshëm i viçit ose pulës takohet me patate të skuqura krokante direkt në kuti. Plotësohet me sallatë të freskët, qepë dhe salcat tona shtëpiake sipas shijes suaj.",
      tr: "Lezzetli dana veya tavuk eti, çıtır patates kızartmasıyla kutuda buluşuyor. Taze salata, soğan ve damak zevkinize göre ev yapımı soslarla tamamlanır.",
    },
  },
  {
    key: "box_original",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Box Das Original",
      en: "Box The Original",
      hr: "Box Das Original",
      sq: "Box Origjinali",
      tr: "Kutu Das Original",
    },
    desc: {
      de: "Der Klassiker für unterwegs wahlweise mit Kalbs- oder Hähnchenfleisch. Serviert mit knackigen Tomaten, Zwiebeln, Eisbergsalat, Gurken, Rotkohl und unseren hausgemachten Saucen. Wahlweise mit Kräuter, Knoblauch oder Scharf.",
      en: "The classic to go with optional veal or chicken. Served with crisp tomatoes, onions, iceberg lettuce, cucumber, red cabbage, and our homemade sauces. Choose from herb, garlic, or spicy.",
      hr: "Klasični izbor za ponijeti po izboru s teletinom ili piletinom. Posluženo s hrskavim rajčicama, lukom, ledenom salatom, krastavcima, crvenim kupusom i našim domaćim umacima. Po izboru: začinsko bilje, češnjak ili ljuto.",
      sq: "Klasikja për rrugë sipas zgjedhjes me mish viçi ose pule. Shërbehet me domate krokante, qepë, sallatë iceberg, kastravec, lakër të kuqe dhe salcat tona shtëpiake. Sipas dëshirës: me bimë aromatike, hudhër ose djegës.",
      tr: "Klasik paket seçenek, isteğe göre dana veya tavuk eti ile hazırlanır. Domates, soğan, iceberg marul, salatalık, mor lahana ve ev yapımı soslarla servis edilir. Otlu, sarımsaklı veya acılı tercih edilebilir.",
    },
  },
  {
    key: "box_schoeneberg",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_schoeneberg.jpeg"),
    title: {
      de: "Box Schöneberg",
      en: "Schöneberg Box",
      hr: "Box Schöneberg",
      sq: "Box Schöneberg",
      tr: "Schöneberg Kutu",
    },
    desc: {
      de: "Ein besonderes Highlight mit würzigem Grillgemüse und wahlweise Kalbs- oder Hähnchenfleisch. Begleitet von frischem Gemüse und unseren hausgemachten Kräuter-, Knoblauch- oder scharfen Saucen.",
      en: "A special highlight with spicy grilled vegetables and optional veal or chicken. Accompanied by fresh vegetables and our homemade herb, garlic, or spicy sauces.",
      hr: "Poseban specijalitet s aromatičnim grilanim povrćem i po izboru teletinom ili piletinom. Uz svježe povrće i naše domaće umake: biljni, češnjak ili ljuti.",
      sq: "Një veçanti me perime të pjekura me erëza dhe sipas zgjedhjes mish viçi ose pule. Shoqërohet me perime të freskëta dhe salcat tona shtëpiake me erëza, hudhër ose pikante.",
      tr: "Baharatlı ızgara sebzeler ve isteğe göre dana veya tavuk eti ile özel bir lezzet. Taze sebzeler ve ev yapımı otlu, sarımsaklı veya acı soslarla sunulur.",
    },
  },
  {
    key: "box_wedding",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Box Wedding",
      en: "Wedding Box",
      hr: "Box Wedding",
      sq: "Box Wedding",
      tr: "Wedding Kutu",
    },
    desc: {
      de: "Die herzhafte Box mit einer Fleischsorte nach Wahl. Frisch angerichtet mit buntem Salat, Zwiebeln und verfeinert mit unseren hausgemachten Saucen (Kräuter, Knoblauch oder Scharf).",
      en: "The hearty box with a meat of your choice. Freshly prepared with colorful salad, onions, and refined with our homemade sauces (herb, garlic, or spicy).",
      hr: "Obilni box s mesom po izboru. Svježe pripremljen s raznobojnom salatom, lukom i oplemenjen našim domaćim umacima (biljni, češnjak ili ljuti).",
      sq: "Kutia e bollshme me mish sipas zgjedhjes suaj. Përgatitet me sallatë shumëngjyrëshe, qepë dhe plotësohet me salcat tona shtëpiake (me erëza, hudhër ose pikante).",
      tr: "İsteğe göre seçilen et ile doyurucu kutu seçeneği. Renkli salata, soğan ve ev yapımı soslarımızla hazırlanır (otlu, sarımsaklı veya acılı).",
    },
  },
  {
    key: "box_tempelhof",
    category: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Box Tempelhof",
      en: "Tempelhof Box",
      hr: "Box Tempelhof",
      sq: "Box Tempelhof",
      tr: "Tempelhof Kutu",
    },
    desc: {
      de: "Die ideale Mischung aus saftigem Hähnchen- und würzigem Kalbfleisch. Serviert mit erntefrischen Tomaten, Zwiebeln, Gurken, Rotkohl und Ihren liebsten hausgemachten Saucen.",
      en: "The ideal mix of juicy chicken and flavorful veal. Served with fresh tomatoes, onions, cucumbers, red cabbage, and your favorite homemade sauces.",
      hr: "Idealna mješavina sočne piletine i začinjene teletine. Posluženo sa svježim rajčicama, lukom, krastavcima, crvenim kupusom i vašim omiljenim domaćim umacima.",
      sq: "Përzierja ideale e mishit të lëngshëm të pulës dhe viçit me shije. Shërbehet me domate të freskëta, qepë, kastravec, lakër të kuqe dhe salcat tuaja të preferuara shtëpiake.",
      tr: "Sulu tavuk eti ve lezzetli dana etinin ideal karışımı. Taze domates, soğan, salatalık, mor lahana ve sevilen ev yapımı soslarla servis edilir.",
    },
  },
  {
    key: "chicken_nuggets",
    category: {
      de: "Snacks",
      en: "Snacks",
      hr: "Snackovi",
      sq: "Snacks",
      tr: "Atıştırmalıklar",
    },
    image: require("../../assets/images/speisekarte/chicken_nuggets.jpeg"),
    title: {
      de: "Chicken Nuggets",
      en: "Chicken Nuggets",
      hr: "Chicken Nuggets",
      sq: "Chicken Nuggets",
      tr: "Chicken Nuggets",
    },
    desc: {
      de: "Außen knusprig, innen zart. Wählen Sie zwischen 6 Stück pur oder 4 Stück serviert mit einer Portion Pommes frites.",
      en: "Crispy on the outside, tender on the inside. Choose between 6 pieces on their own or 4 pieces served with a portion of fries.",
      hr: "Hrskavi izvana, mekani iznutra. Birajte između 6 komada samostalno ili 4 komada poslužena s porcijom pomfrita.",
      sq: "Krokante nga jashtë, të buta nga brenda. Zgjidhni mes 6 copash vetëm ose 4 copash të shërbyera me një porcion patatesh të skuqura.",
      tr: "Dışı çıtır, içi yumuşak. Sade 6 adet ya da patates kızartması ile servis edilen 4 adet arasında seçim yapın.",
    },
  },
  {
    key: "doener_original",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/döner_das_original.jpeg"),
    title: {
      de: "Döner Das Original",
      en: "Doner The Original",
      hr: "Döner Das Original",
      sq: "Döner Origjinali",
      tr: "Döner Das Original",
    },
    desc: {
      de: "Der Klassiker im knusprigen Fladenbrot wahlweise mit Kalbs- oder Hähnchenfleisch. Frisch angerichtet mit buntem Salat, knackigem Gemüse und unseren hausgemachten Saucen – wahlweise Kräuter, Knoblauch oder Scharf.",
      en: "The classic in crispy flatbread with optional veal or chicken. Freshly prepared with colorful salad, crunchy vegetables, and our homemade sauces – herb, garlic, or spicy.",
      hr: "Klasik u hrskavom somunu po izboru s teletinom ili piletinom. Svježe pripremljen s raznobojnom salatom, hrskavim povrćem i našim domaćim umacima – biljni, češnjak ili ljuti.",
      sq: "Klasikja në bukë të freskët sipas zgjedhjes me mish viçi ose pule. E përgatitur me sallatë shumëngjyrëshe, perime krokante dhe salcat tona shtëpiake – me erëza, hudhër ose pikante.",
      tr: "Çıtır pide ekmeğinde klasik lezzet, isteğe göre dana veya tavuk eti ile hazırlanır. Renkli salata, çıtır sebzeler ve ev yapımı soslarımızla sunulur – otlu, sarımsaklı veya acılı.",
    },
  },
  {
    key: "doener_kreuzberg",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/doener_kreuzberg_kalb.jpeg"),
    title: {
      de: "Döner Kreuzberg",
      en: "Kreuzberg Doner",
      hr: "Döner Kreuzberg",
      sq: "Döner Kreuzberg",
      tr: "Kreuzberg Döner",
    },
    desc: {
      de: "Herzhafter Genuss mit cremigem Schafskäse und wahlweise Kalbs- oder Hähnchenfleisch im knusprigen Brot. Dazu knackiger Eisbergsalat, Tomaten und Gurken, abgerundet durch Ihre Wahl unserer hausgemachten Saucen.",
      en: "Hearty enjoyment with creamy feta cheese and optional veal or chicken in crispy bread. With crunchy iceberg lettuce, tomatoes, and cucumbers, rounded off with your choice of our homemade sauces.",
      hr: "Obilan užitak s kremastim feta sirom i po izboru teletinom ili piletinom u hrskavom kruhu. Uz hrskavu ledenu salatu, rajčice i krastavce, zaokruženo izborom naših domaćih umaka.",
      sq: "Shije e pasur me djathë feta kremoz dhe sipas zgjedhjes mish viçi ose pule në bukë krokante. Me sallatë iceberg, domate dhe kastravec, e plotësuar me zgjedhjen tuaj të salcave tona shtëpiake.",
      tr: "Çıtır ekmek içinde kremamsı beyaz peynir ve isteğe göre dana veya tavuk eti ile doyurucu lezzet. Çıtır iceberg marul, domates ve salatalık ile, ev yapımı sos seçeneklerinizle tamamlanır.",
    },
  },
  {
    key: "doener_moabit_veggie",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/doener_moabit_veggie.jpeg"),
    title: {
      de: "Döner Moabit Veggie",
      en: "Moabit Veggie Doner",
      hr: "Döner Moabit Veggie",
      sq: "Döner Moabit Veggie",
      tr: "Moabit Veggie Döner",
    },
    desc: {
      de: "Frische pur ohne Fleisch: Knackiges Gemüse und frische Salate im getoasteten Brot. Kombiniert mit unseren hausgemachten Saucen (Kräuter, Knoblauch oder Scharf) für den vollen Geschmack.",
      en: "Pure freshness without meat: crunchy vegetables and fresh salads in toasted bread. Combined with our homemade sauces (herb, garlic, or spicy) for full flavor.",
      hr: "Čista svježina bez mesa: hrskavo povrće i svježe salate u tostiranom kruhu. Kombinirano s našim domaćim umacima (biljni, češnjak ili ljuti) za puni okus.",
      sq: "Pastërti e plotë pa mish: perime krokante dhe sallata të freskëta në bukë të tostuar. E kombinuar me salcat tona shtëpiake (me erëza, hudhër ose pikante) për shije të plotë.",
      tr: "Etsiz saf tazelik: kızarmış ekmek içinde çıtır sebzeler ve taze salatalar. Tam lezzet için ev yapımı soslarımızla (otlu, sarımsaklı veya acılı) birleşir.",
    },
  },
  {
    key: "doener_neukoeln",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/doener_neukoeln_kalb.jpeg"),
    title: {
      de: "Döner Neukölln",
      en: "Neukölln Doner",
      hr: "Döner Neukölln",
      sq: "Döner Neukölln",
      tr: "Neukölln Döner",
    },
    desc: {
      de: "Der Favorit mit dem gewissen Extra: Herzhaftes Kalbs- oder Hähnchenfleisch kombiniert mit knusprigen Pommes frites direkt im Sandwich. Abgerundet durch frisches Gemüse und hausgemachte Kräuter-, Knoblauch- oder scharfe Sauce.",
      en: "The favorite with that special extra: hearty veal or chicken combined with crispy fries right in the sandwich. Finished with fresh vegetables and homemade herb, garlic, or spicy sauce.",
      hr: "Favorit s posebnim dodatkom: obilno teleće ili pileće meso kombinirano s hrskavim pomfritom izravno u sendviču. Zaokruženo svježim povrćem i domaćim biljnim, češnjak ili ljutim umakom.",
      sq: "I preferuari me diçka ekstra: mish i shijshëm i viçit ose pulës i kombinuar me patate të skuqura krokante direkt në sanduiç. Përfundon me perime të freskëta dhe salcë shtëpiake me erëza, hudhër ose pikante.",
      tr: "Ekstra dokunuşlu favori: doyurucu dana veya tavuk eti, çıtır patates kızartmasıyla sandviç içinde birleşir. Taze sebzeler ve ev yapımı otlu, sarımsaklı veya acı sosla tamamlanır.",
    },
  },
  {
    key: "doener_schoeneberg",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/doener_schoeneberg_kalb.jpeg"),
    title: {
      de: "Döner Schöneberg",
      en: "Schöneberg Doner",
      hr: "Döner Schöneberg",
      sq: "Döner Schöneberg",
      tr: "Schöneberg Döner",
    },
    desc: {
      de: "Ein besonderes Geschmackserlebnis durch feines Grillgemüse und wahlweise Kalbs- oder Hähnchenfleisch. Serviert mit frischem Rotkohl, Eisbergsalat und unseren hausgemachten Saucen.",
      en: "A special taste experience with fine grilled vegetables and optional veal or chicken. Served with fresh red cabbage, iceberg lettuce, and our homemade sauces.",
      hr: "Posebno iskustvo okusa zahvaljujući finom grilanom povrću i po izboru teletini ili piletini. Posluženo sa svježim crvenim kupusom, ledenom salatom i našim domaćim umacima.",
      sq: "Një përvojë e veçantë shijeje me perime të pjekura dhe sipas zgjedhjes mish viçi ose pule. Shërbehet me lakër të kuqe të freskët, sallatë iceberg dhe salcat tona shtëpiake.",
      tr: "İnce ızgara sebzeler ve isteğe göre dana veya tavuk eti ile özel bir lezzet deneyimi. Taze mor lahana, iceberg marul ve ev yapımı soslarımızla servis edilir.",
    },
  },
  {
    key: "doener_wedding",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/doener_wedding_chicken.jpeg"),
    title: {
      de: "Döner Wedding",
      en: "Wedding Doner",
      hr: "Döner Wedding",
      sq: "Döner Wedding",
      tr: "Wedding Döner",
    },
    desc: {
      de: "Für den großen Appetit mit einer extra Portion Hähnchen- oder Kalbfleisch. Vollendet mit erntefrischem Salat, Zwiebeln und unseren hausgemachten Saucen (Kräuter, Knoblauch oder Scharf).",
      en: "For a big appetite with an extra portion of chicken or veal. Finished with fresh salad, onions, and our homemade sauces (herb, garlic, or spicy).",
      hr: "Za veliki apetit s dodatnom porcijom piletine ili teletine. Dovršeno svježom salatom, lukom i našim domaćim umacima (biljni, češnjak ili ljuti).",
      sq: "Për oreks të madh me një porcion shtesë pule ose viçi. Përfundon me sallatë të freskët, qepë dhe salcat tona shtëpiake (me erëza, hudhër ose pikante).",
      tr: "Büyük iştahlar için ekstra tavuk veya dana eti porsiyonu ile hazırlanır. Taze salata, soğan ve ev yapımı soslarımızla (otlu, sarımsaklı veya acılı) tamamlanır.",
    },
  },
  {
    key: "doener_tempelhof",
    category: {
      de: "Döner",
      en: "Doner",
      hr: "Döner",
      sq: "Döner",
      tr: "Döner",
    },
    image: require("../../assets/images/speisekarte/döner_das_original.jpeg"),
    title: {
      de: "Döner Tempelhof",
      en: "Tempelhof Doner",
      hr: "Döner Tempelhof",
      sq: "Döner Tempelhof",
      tr: "Tempelhof Döner",
    },
    desc: {
      de: "Das Beste aus beiden Welten: Eine harmonische Mischung aus saftigem Hähnchen- und Kalbfleisch. Serviert mit knackigem Salat und unseren hausgemachten Saucen nach Ihrem Wunsch.",
      en: "The best of both worlds: a harmonious mix of juicy chicken and veal. Served with crisp salad and our homemade sauces according to your preference.",
      hr: "Najbolje iz oba svijeta: skladna mješavina sočne piletine i teletine. Posluženo s hrskavom salatom i našim domaćim umacima po vašoj želji.",
      sq: "Më e mira nga të dyja botët: një përzierje harmonike e mishit të lëngshëm të pulës dhe viçit. Shërbehet me sallatë krokante dhe salcat tona shtëpiake sipas dëshirës suaj.",
      tr: "İki dünyanın en iyisi: sulu tavuk ve dana etinin uyumlu karışımı. Çıtır salata ve isteğinize göre ev yapımı soslarımızla servis edilir.",
    },
  },
  {
    key: "durum_original",
    category: {
      de: "Dürüm",
      en: "Durum",
      hr: "Dürüm",
      sq: "Dürüm",
      tr: "Dürüm",
    },
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Dürüm Das Original",
      en: "Durum The Original",
      hr: "Dürüm Das Original",
      sq: "Dürüm Origjinali",
      tr: "Dürüm Das Original",
    },
    desc: {
      de: "Frisch gerolltes Dürüm mit saftigem Hähnchen- oder Kalbfleisch. Serviert mit knackigem Salat, Tomaten, Zwiebeln und unseren hausgemachten Saucen – wahlweise Kräuter, Knoblauch oder Scharf.",
      en: "Freshly rolled durum with juicy chicken or veal. Served with crisp salad, tomatoes, onions, and our homemade sauces – herb, garlic, or spicy.",
      hr: "Svježe zarolani dürüm sa sočnom piletinom ili teletinom. Poslužen s hrskavom salatom, rajčicama, lukom i našim domaćim umacima – biljni, češnjak ili ljuti.",
      sq: "Dürüm i mbështjellë i freskët me mish pule ose viçi të lëngshëm. Shërbehet me sallatë krokante, domate, qepë dhe salcat tona shtëpiake – me erëza, hudhër ose pikante.",
      tr: "Sulu tavuk veya dana etiyle taze sarılmış dürüm. Çıtır salata, domates, soğan ve ev yapımı soslarımızla servis edilir – otlu, sarımsaklı veya acılı.",
    },
  },
  {
    key: "durum_falafel",
    category: {
      de: "Dürüm",
      en: "Durum",
      hr: "Dürüm",
      sq: "Dürüm",
      tr: "Dürüm",
    },
    image: require("../../assets/images/speisekarte/durum_falafel.jpeg"),
    title: {
      de: "Dürüm Falafel",
      en: "Falafel Durum",
      hr: "Dürüm Falafel",
      sq: "Dürüm Falafel",
      tr: "Falafel Dürüm",
    },
    desc: {
      de: "Frisch gerollter Dürüm mit knusprigen Falafeln und frischem Gemüse. Serviert mit knackigem Salat und fein abgestimmter Sauce.",
      en: "Freshly rolled durum with crispy falafel and fresh vegetables. Served with crunchy salad and a well-balanced sauce.",
      hr: "Svježe zarolani dürüm s hrskavim falafelom i svježim povrćem. Poslužen s hrskavom salatom i fino usklađenim umakom.",
      sq: "Dürüm i freskët i mbështjellë me falafel krokant dhe perime të freskëta. Shërbehet me sallatë krokante dhe salcë të balancuar.",
      tr: "Çıtır falafel ve taze sebzelerle taze sarılmış dürüm. Çıtır salata ve dengeli bir sosla servis edilir.",
    },
  },
  {
    key: "durum_halloumi",
    category: {
      de: "Dürüm",
      en: "Durum",
      hr: "Dürüm",
      sq: "Dürüm",
      tr: "Dürüm",
    },
    image: require("../../assets/images/speisekarte/durum_halloumi.jpeg"),
    title: {
      de: "Dürüm Halloumi",
      en: "Halloumi Durum",
      hr: "Dürüm Halloumi",
      sq: "Dürüm Halloumi",
      tr: "Hellim Dürüm",
    },
    desc: {
      de: "Frisch gerollter Dürüm mit Halloumi, frischem Salat und fein abgestimmter Sauce. Ein vegetarischer Genuss mit vollem Geschmack.",
      en: "Freshly rolled durum with halloumi, fresh salad, and a well-balanced sauce. A vegetarian delight with full flavor.",
      hr: "Svježe zarolani dürüm s halloumijem, svježom salatom i fino usklađenim umakom. Vegetarijanski užitak punog okusa.",
      sq: "Dürüm i freskët me halloumi, sallatë të freskët dhe salcë të balancuar. Kënaqësi vegjetariane me shije të plotë.",
      tr: "Hellim, taze salata ve dengeli sosla taze sarılmış dürüm. Dolgun lezzetli vejetaryen bir seçenek.",
    },
  },
  {
    key: "durum_kreuzberg",
    category: {
      de: "Dürüm",
      en: "Durum",
      hr: "Dürüm",
      sq: "Dürüm",
      tr: "Dürüm",
    },
    image: require("../../assets/images/speisekarte/durum_kreuzberg.jpeg"),
    title: {
      de: "Dürüm Kreuzberg",
      en: "Kreuzberg Durum",
      hr: "Dürüm Kreuzberg",
      sq: "Dürüm Kreuzberg",
      tr: "Kreuzberg Dürüm",
    },
    desc: {
      de: "Ein geschmackvolles Highlight mit cremigem Schafskäse und saftigem Fleisch. Frisch angerichtet mit buntem Gemüse und Ihren liebsten hausgemachten Saucen.",
      en: "A flavorful highlight with creamy feta cheese and juicy meat. Freshly prepared with colorful vegetables and your favorite homemade sauces.",
      hr: "Ukusan specijalitet s kremastim feta sirom i sočnim mesom. Svježe pripremljen s raznobojnim povrćem i vašim omiljenim domaćim umacima.",
      sq: "Një veçanti plot shije me djathë feta kremoz dhe mish të lëngshëm. E përgatitur me perime shumëngjyrëshe dhe salcat tuaja të preferuara shtëpiake.",
      tr: "Kremamsı beyaz peynir ve sulu et ile lezzetli bir özel seçenek. Renkli sebzeler ve sevilen ev yapımı soslarla hazırlanır.",
    },
  },
  {
    key: "bearliner_spezi_teller",
    category: {
      de: "Speziteller",
      en: "Special Plates",
      hr: "Specijalni Tanjuri",
      sq: "Pjata Speciale",
      tr: "Özel Tabaklar",
    },
    image: require("../../assets/images/speisekarte/bearliner_spezi_teller.jpeg"),
    title: {
      de: "BÄRLINER Spezi Teller",
      en: "BÄRLINER Special Plate",
      hr: "BÄRLINER Spezi Teller",
      sq: "BÄRLINER Spezi Teller",
      tr: "BÄRLINER Özel Tabak",
    },
    desc: {
      de: "Unser Riesen-Dönerteller für den maximalen Hunger: Eine Schicht knusprige Pommes, belegt mit saftigem Fleisch nach Wahl (Kalb oder Hähnchen). Garniert mit frischem Gemüse und unserer hausgemachten Sauce in Gitterform. Inklusive frischem Brot und einem Getränk Ihrer Wahl.",
      en: "Our giant doner plate for maximum hunger: a layer of crispy fries topped with your choice of juicy meat (veal or chicken). Garnished with fresh vegetables and our homemade sauce in a lattice pattern. Includes fresh bread and a drink of your choice.",
      hr: "Naš veliki döner tanjur za maksimalan apetit: sloj hrskavog pomfrita, obložen sočnim mesom po izboru (teletina ili piletina). Ukrašen svježim povrćem i našim domaćim umakom u mrežastom uzorku. Uključuje svježi kruh i piće po izboru.",
      sq: "Pjata jonë gjigante me döner për uri maksimale: një shtresë patatesh të skuqura krokante, e mbuluar me mish të lëngshëm sipas zgjedhjes (viç ose pulë). E zbukuruar me perime të freskëta dhe salcën tonë shtëpiake në formë rrjete. Përfshin bukë të freskët dhe një pije sipas zgjedhjes suaj.",
      tr: "Maksimum iştah için dev döner tabağımız: çıtır patates kızartması tabanı üzerinde isteğe göre sulu et (dana veya tavuk). Taze sebzeler ve ızgara desenli ev yapımı sosumuzla süslenir. Taze ekmek ve seçtiğiniz bir içecek dahildir.",
    },
  },
  {
    key: "currywurst_pommes",
    category: {
      de: "Snacks",
      en: "Snacks",
      hr: "Snackovi",
      sq: "Snacks",
      tr: "Atıştırmalıklar",
    },
    image: require("../../assets/images/speisekarte/currywurst_pommes.jpeg"),
    title: {
      de: "Currywurst mit Pommes frites",
      en: "Currywurst with French Fries",
      hr: "Currywurst s Pommes frites",
      sq: "Currywurst me Pommes frites",
      tr: "Patates Kızartmalı Currywurst",
    },
    desc: {
      de: "Herzhafte Currywurst, serviert mit einer Portion goldgelber knuspriger Pommes frites.",
      en: "Hearty currywurst served with a portion of golden crispy fries.",
      hr: "Obilna currywurst poslužena s porcijom zlatno hrskavog pomfrita.",
      sq: "Currywurst e shijshme e servirur me një porcion patatesh të skuqura krokante e të arta.",
      tr: "Lezzetli currywurst, altın sarısı çıtır patates kızartması ile servis edilir.",
    },
  },
  {
    key: "suesskartoffelpommes",
    category: {
      de: "Snacks",
      en: "Snacks",
      hr: "Snackovi",
      sq: "Snacks",
      tr: "Atıştırmalıklar",
    },
    image: require("../../assets/images/speisekarte/suesskartoffelpommes.jpeg"),
    title: {
      de: "Süßkartoffelpommes",
      en: "Sweet Potato Fries",
      hr: "Pomfrit od Batata",
      sq: "Patate të Ëmbla të Skuqura",
      tr: "Tatlı Patates Kızartması",
    },
    desc: {
      de: "Die aromatische Alternative: Knusprig frittierte Süßkartoffelstäbchen für den besonderen Knabberspaß.",
      en: "The aromatic alternative: crispy fried sweet potato sticks for a special snacking experience.",
      hr: "Aromatična alternativa: hrskavo prženi štapići batata za poseban užitak grickanja.",
      sq: "Alternativa aromatike: shkopinj krokantë të patates së ëmbël të skuqur për një kënaqësi të veçantë.",
      tr: "Aromatik alternatif: özel bir atıştırmalık keyfi için çıtır kızarmış tatlı patates çubukları.",
    },
  },
  
  {
  key: "mokoko",
  category: {
    de: "Für Kinder",
    en: "For Kids",
    hr: "Za Djecu",
    sq: "Për Fëmijë",
    tr: "Çocuklar İçin",
  },
  image: require("../../assets/images/speisekarte/mokoko.jpeg"),
  title: {
    de: "Mokoko Kids Box",
    en: "Mokoko Kids Box",
    hr: "Mokoko Kids Box",
    sq: "Mokoko Kids Box",
    tr: "Mokoko Kids Box",
  },
  desc: {
    de: "Die perfekte Überraschung für kleine Gäste: Wahlweise knusprige Nuggets oder saftiges Dönerfleisch mit einer Portion Pommes. Inklusive eines Fruchtsafts (0,2l), einem bunten Luftballon, einem Chupa Chups Lolli und einem tollen Spielzeug.",
    en: "The perfect surprise for little guests: choose crispy nuggets or juicy doner meat with a portion of fries. Includes a fruit juice (0.2l), a colorful balloon, a Chupa Chups lollipop, and a great toy.",
    hr: "Savršeno iznenađenje za male goste: po izboru hrskavi nuggetsi ili sočno döner meso uz porciju pomfrita. Uključuje voćni sok (0,2 l), šareni balon, Chupa Chups lizalicu i sjajnu igračku.",
    sq: "Surpriza perfekte për mysafirët e vegjël: sipas dëshirës nuggets krokante ose mish döner i lëngshëm me një porcion patatesh të skuqura. Përfshin një lëng frutash (0,2l), një tullumbace shumëngjyrëshe, një Chupa Chups dhe një lodër të bukur.",
    tr: "Küçük misafirler için mükemmel sürpriz: isteğe göre çıtır nugget veya sulu döner eti, yanında bir porsiyon patates kızartması. İçerisinde bir meyve suyu (0,2l), renkli bir balon, bir Chupa Chups lolipop ve harika bir oyuncak bulunur.",
  },
},
  {
    key: "menu_sandwich_original",
    category: {
      de: "Menüs",
      en: "Menus",
      hr: "Meniji",
      sq: "Menu",
      tr: "Menüler",
    },
    image: require("../../assets/images/speisekarte/menu_sandwich_original.jpeg"),
    title: {
      de: "Das Original Sandwich Sparmenü",
      en: "The Original Sandwich Value Menu",
      hr: "Das Original Sandwich Sparmenü",
      sq: "Das Original Sandwich Sparmenü",
      tr: "Das Original Sandviç Menü",
    },
    desc: {
      de: "Unser Klassiker im knusprigen Fladenbrot mit saftigem Fleisch nach Wahl. Serviert mit goldgelben Pommes frites und einem erfrischenden 0,33l Getränk. Verfeinert mit unseren hausgemachten Saucen (Kräuter, Knoblauch oder Scharf).",
      en: "Our classic in crispy flatbread with juicy meat of your choice. Served with golden fries and a refreshing 0.33l drink. Refined with our homemade sauces (herb, garlic, or spicy).",
      hr: "Naš klasik u hrskavom somunu sa sočnim mesom po izboru. Poslužen s pomfritom zlatne boje i osvježavajućim pićem od 0,33 l. Upotpunjen našim domaćim umacima (biljni, češnjak ili ljuti).",
      sq: "Klasikja jonë në bukë krokante me mish të lëngshëm sipas zgjedhjes suaj. Shërbehet me patate të skuqura të arta dhe një pije freskuese 0,33l. Plotësohet me salcat tona shtëpiake (me erëza, hudhër ose pikante).",
      tr: "Çıtır pide ekmeğinde seçtiğiniz sulu et ile klasiğimiz. Altın sarısı patates kızartması ve ferahlatıcı 0,33l içecek ile servis edilir. Ev yapımı soslarımızla tamamlanır (otlu, sarımsaklı veya acılı).",
    },
  },
  {
    key: "menu_durum_original",
    category: {
      de: "Menüs",
      en: "Menus",
      hr: "Meniji",
      sq: "Menu",
      tr: "Menüler",
    },
    image: require("../../assets/images/speisekarte/menu_durum_original.jpeg"),
    title: {
      de: "Das Original Dürüm Sparmenü",
      en: "The Original Durum Value Menu",
      hr: "Das Original Dürüm Sparmenü",
      sq: "Das Original Dürüm Sparmenü",
      tr: "Das Original Dürüm Menü",
    },
    desc: {
      de: "Die frisch gerollte Weizentortilla mit Fleisch nach Wahl. Dazu gibt es knusprige Pommes frites und ein 0,33l Getränk. Perfekt abgerundet durch unsere hausgemachten Saucen (Kräuter, Knoblauch oder Scharf).",
      en: "Freshly rolled wheat tortilla with meat of your choice. Served with crispy fries and a 0.33l drink. Perfectly rounded off with our homemade sauces (herb, garlic, or spicy).",
      hr: "Svježe zarolana pšenična tortilja s mesom po izboru. Uz to dolazi hrskavi pomfrit i piće od 0,33 l. Savršeno zaokruženo našim domaćim umacima (biljni, češnjak ili ljuti).",
      sq: "Tortilla gruri e mbështjellë e freskët me mish sipas zgjedhjes suaj. Shoqërohet me patate të skuqura krokante dhe një pije 0,33l. Përfundon në mënyrë perfekte me salcat tona shtëpiake (me erëza, hudhër ose pikante).",
      tr: "Seçtiğiniz et ile taze sarılmış buğday tortillası. Yanında çıtır patates kızartması ve 0,33l içecek bulunur. Ev yapımı soslarımızla mükemmel şekilde tamamlanır (otlu, sarımsaklı veya acılı).",
    },
  },
  {
    key: "menu_box_original",
    category: {
      de: "Menüs",
      en: "Menus",
      hr: "Meniji",
      sq: "Menu",
      tr: "Menüler",
    },
    image: require("../../assets/images/speisekarte/menu_box_original.jpeg"),
    title: {
      de: "Das Original Box Sparmenü",
      en: "The Original Box Value Menu",
      hr: "Das Original Box Sparmenü",
      sq: "Das Original Box Sparmenü",
      tr: "Das Original Kutu Menü",
    },
    desc: {
      de: "Die praktische Dönerbox mit saftigem Fleisch nach Wahl. Im Menü enthalten sind zusätzlich knusprige Pommes frites und ein 0,33l Getränk. Genießen Sie dazu unsere hausgemachten Saucen (Kräuter, Knoblauch oder Scharf).",
      en: "The practical doner box with juicy meat of your choice. The menu also includes crispy fries and a 0.33l drink. Enjoy it with our homemade sauces (herb, garlic, or spicy).",
      hr: "Praktični döner box sa sočnim mesom po izboru. U meniju su dodatno uključeni hrskavi pomfrit i piće od 0,33 l. Uživajte uz naše domaće umake (biljni, češnjak ili ljuti).",
      sq: "Kutia praktike e dönerit me mish të lëngshëm sipas zgjedhjes suaj. Menuja përfshin edhe patate të skuqura krokante dhe një pije 0,33l. Shijojeni me salcat tona shtëpiake (me erëza, hudhër ose pikante).",
      tr: "Seçtiğiniz sulu et ile pratik döner kutusu. Menüye ayrıca çıtır patates kızartması ve 0,33l içecek dahildir. Ev yapımı soslarımızla birlikte keyfini çıkarın (otlu, sarımsaklı veya acılı).",
    },
  },
  {
    key: "menu_currywurst",
    category: {
      de: "Menüs",
      en: "Menus",
      hr: "Meniji",
      sq: "Menu",
      tr: "Menüler",
    },
    image: require("../../assets/images/speisekarte/menu_currywurst.jpeg"),
    title: {
      de: "Currywurst Sparmenü",
      en: "Currywurst Value Menu",
      hr: "Currywurst Sparmenü",
      sq: "Currywurst Sparmenü",
      tr: "Currywurst Menü",
    },
    desc: {
      de: "Der Berliner Kult-Klassiker: Herzhafte Currywurst, wahlweise mit klassischen Pommes frites oder feinen Süßkartoffelpommes serviert. Inklusive eines Getränks für die perfekte Pause.",
      en: "The Berlin cult classic: hearty currywurst, served with either classic fries or fine sweet potato fries. Includes a drink for the perfect break.",
      hr: "Berlinski kultni klasik: obilna currywurst, poslužena po izboru s klasičnim pomfritom ili finim pomfritom od batata. Uključuje piće za savršenu pauzu.",
      sq: "Klasiku kult i Berlinit: currywurst e shijshme, e shërbyer sipas zgjedhjes me patate të skuqura klasike ose me patate të ëmbla. Përfshin një pije për pushimin perfekt.",
      tr: "Berlin’in kült klasiği: klasik patates kızartması veya nefis tatlı patates kızartması ile servis edilen lezzetli currywurst. Mükemmel mola için bir içecek dahildir.",
    },
  },
  {
    key: "pommes_frites",
    category: {
      de: "Snacks",
      en: "Snacks",
      hr: "Snackovi",
      sq: "Snacks",
      tr: "Atıştırmalıklar",
    },
    image: require("../../assets/images/speisekarte/pommes_frites.jpeg"),
    title: {
      de: "Pommes frites",
      en: "French Fries",
      hr: "Pommes frites",
      sq: "Pommes frites",
      tr: "Patates Kızartması",
    },
    desc: {
      de: "Unsere klassischen Kartoffelstäbchen. Außen kross gebacken und innen herrlich soft.",
      en: "Our classic potato sticks. Crispy on the outside and wonderfully soft on the inside.",
      hr: "Naši klasični krumpirići. Izvana hrskavi, a iznutra divno mekani.",
      sq: "Patatet tona klasike të prera. Krokante jashtë dhe mrekullisht të buta brenda.",
      tr: "Klasik patates çubuklarımız. Dışı çıtır, içi ise harika yumuşaktır.",
    },
  },
];

const CATEGORY_ORDER_DE = [
  "Döner",
  "Dürüm",
  "Boxen",
  "Snacks",
  "Menüs",
  "Für Kinder",
  "Speziteller",
];

export default function Produkte() {
  const [lang, setLang] = useState<Lang>("de");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const videoOpacity = useRef(new Animated.Value(0)).current;

  const posterOpacity = videoOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  useFocusEffect(
    useCallback(() => {
      async function loadLanguage() {
        const currentLang = await getLanguage();
        setLang((currentLang as Lang) || "de");
      }
      loadLanguage();
    }, [])
  );

  const handleReady = () => {
    Animated.timing(videoOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const pageTitle = translations[lang]?.products || "Produkte";

  const moreText = {
    de: "Mehr dazu",
    en: "Learn more",
    hr: "Više detalja",
    sq: "Më shumë",
    tr: "Daha fazla",
  }[lang];

  const lessText = {
    de: "Weniger anzeigen",
    en: "Show less",
    hr: "Prikaži manje",
    sq: "Shfaq më pak",
    tr: "Daha az göster",
  }[lang];

  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductItem[]> = {};

    PRODUCTS.forEach((product) => {
      const categoryName = product.category[lang];
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(product);
    });

    const orderedGermanCategories = CATEGORY_ORDER_DE.map((deCategory) => {
      const sample = PRODUCTS.find((p) => p.category.de === deCategory);
      return sample ? sample.category[lang] : null;
    }).filter(Boolean) as string[];

    const existingCategories = Object.keys(groups);
    const remainingCategories = existingCategories.filter(
      (cat) => !orderedGermanCategories.includes(cat)
    );

    return [...orderedGermanCategories, ...remainingCategories].map((category) => ({
      category,
      items: groups[category] || [],
    }));
  }, [lang]);

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
        style={[StyleSheet.absoluteFillObject, { opacity: videoOpacity }]}
      >
        <Video
          source={require("../../assets/hero.mp4")}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onReadyForDisplay={handleReady}
          onError={(e) => console.log("VIDEO ERROR", e)}
        />
      </Animated.View>

      <View style={styles.overlay} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.pageTitle}>{pageTitle}</Text>

          {groupedProducts.map((group) => (
            <View key={group.category} style={styles.section}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderText}>{group.category}</Text>
              </View>

              {group.items.map((product) => {
                const isExpanded = !!expandedItems[product.key];
                const fullText = product.desc[lang];
                const visibleText = isExpanded
                  ? fullText
                  : getFirstSentence(fullText);

                return (
                  <View key={product.key} style={styles.card}>
                    <ExpoImage
                      source={product.image}
                      style={styles.image}
                      contentFit="cover"
                      transition={150}
                    />

                    <Text style={styles.title}>{product.title[lang]}</Text>
                    <Text style={styles.desc}>{visibleText}</Text>

                    <Pressable
                      style={styles.button}
                      onPress={() => toggleExpanded(product.key)}
                    >
                      <Text style={styles.buttonText}>
                        {isExpanded ? lessText : moreText}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  inner: {
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  section: {
    marginBottom: 12,
  },
  categoryHeader: {
    backgroundColor: COLORS.category,
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.35)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  categoryHeaderText: {
  color: "#0B0B0B",
  fontWeight: "900",
  fontSize: 14,
},
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  desc: {
    color: COLORS.muted,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#0B0B0B",
    fontWeight: "900",
    fontSize: 14,
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