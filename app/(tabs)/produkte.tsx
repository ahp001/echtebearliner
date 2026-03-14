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

type LocalizedText = {
  de: string;
  en: string;
  hr: string;
  sq: string;
  tr: string;
};

type ProductItem = {
  key: string;
  section: "doener" | "durum" | "boxen" | "snacks" | "menues" | "kids" | "speziteller";
  image: any;
  title: LocalizedText;
  desc: LocalizedText;
};

type SectionConfig = {
  key: ProductItem["section"];
  title: LocalizedText;
  itemKeys: string[];
};

const getFirstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
};

const PRODUCTS: ProductItem[] = [
  {
    key: "doener_original",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_das_original.jpeg"),
    title: {
      de: "Das Original",
      en: "The Original",
      hr: "Das Original",
      sq: "Origjinali",
      tr: "Das Original",
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
    key: "doener_wedding",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_wedding_chicken.jpeg"),
    title: {
      de: "Wedding",
      en: "Wedding",
      hr: "Wedding",
      sq: "Wedding",
      tr: "Wedding",
    },
    desc: {
      de: "Für den großen Appetit mit einer extra Portion Hähnchen- oder Kalbfleisch. Vollendet mit erntefrischem Salat, Zwiebeln und unseren hausgemachten Saucen.",
      en: "For a big appetite with an extra portion of chicken or veal. Finished with fresh salad, onions, and our homemade sauces.",
      hr: "Za veliki apetit s dodatnom porcijom piletine ili teletine. Dovršeno svježom salatom, lukom i našim domaćim umacima.",
      sq: "Për oreks të madh me një porcion shtesë pule ose viçi. Përfundon me sallatë të freskët, qepë dhe salcat tona shtëpiake.",
      tr: "Büyük iştahlar için ekstra tavuk veya dana eti porsiyonu ile hazırlanır. Taze salata, soğan ve ev yapımı soslarımızla tamamlanır.",
    },
  },
  {
    key: "doener_kreuzberg",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_kreuzberg_kalb.jpeg"),
    title: {
      de: "Kreuzberg",
      en: "Kreuzberg",
      hr: "Kreuzberg",
      sq: "Kreuzberg",
      tr: "Kreuzberg",
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
    key: "doener_schoeneberg",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_schoeneberg_kalb.jpeg"),
    title: {
      de: "Schöneberg",
      en: "Schöneberg",
      hr: "Schöneberg",
      sq: "Schöneberg",
      tr: "Schöneberg",
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
    key: "doener_neukoeln",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_neukoeln_kalb.jpeg"),
    title: {
      de: "Neukölln",
      en: "Neukölln",
      hr: "Neukölln",
      sq: "Neukölln",
      tr: "Neukölln",
    },
    desc: {
      de: "Der Favorit mit dem gewissen Extra: Herzhaftes Kalbs- oder Hähnchenfleisch kombiniert mit knusprigen Pommes frites direkt im Sandwich. Abgerundet durch frisches Gemüse und hausgemachte Kräuter-, Knoblauch- oder scharfe Sauce.",
      en: "The favorite with that special extra: hearty veal or chicken combined with crispy fries right in the sandwich. Finished with fresh vegetables and homemade herb, garlic, or spicy sauce.",
      hr: "Favorit s posebnim dodatkom: obilno teleće ili pileće meso kombinirano s hrskavim pomfritom izravno u sendviču. Zaokruženo svježim povrćem i domaćim umakom.",
      sq: "I preferuari me diçka ekstra: mish i shijshëm i viçit ose pulës i kombinuar me patate të skuqura krokante direkt në sanduiç. Përfundon me perime të freskëta dhe salcë shtëpiake.",
      tr: "Ekstra dokunuşlu favori: doyurucu dana veya tavuk eti, çıtır patates kızartmasıyla sandviç içinde birleşir. Taze sebzeler ve ev yapımı sosla tamamlanır.",
    },
  },
  {
    key: "doener_tempelhof",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_das_original.jpeg"),
    title: {
      de: "Tempelhof",
      en: "Tempelhof",
      hr: "Tempelhof",
      sq: "Tempelhof",
      tr: "Tempelhof",
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
    key: "doener_moabit_veggie",
    section: "doener",
    image: require("../../assets/images/speisekarte/doener_moabit_veggie.jpeg"),
    title: {
      de: "Moabit Veggie",
      en: "Moabit Veggie",
      hr: "Moabit Veggie",
      sq: "Moabit Veggie",
      tr: "Moabit Veggie",
    },
    desc: {
      de: "Frische pur ohne Fleisch: Knackiges Gemüse und frische Salate im getoasteten Brot. Optional vegetarisch mit Halloumi oder Falafel.",
      en: "Pure freshness without meat: crunchy vegetables and fresh salads in toasted bread. Optional vegetarian with halloumi or falafel.",
      hr: "Čista svježina bez mesa: hrskavo povrće i svježe salate u tostiranom kruhu. Po želji vegetarijanski s halloumijem ili falafelom.",
      sq: "Pastërti e plotë pa mish: perime krokante dhe sallata të freskëta në bukë të tostuar. Opsionalisht vegjetarian me halloumi ose falafel.",
      tr: "Etsiz saf tazelik: kızarmış ekmek içinde çıtır sebzeler ve taze salatalar. İsteğe bağlı hellim veya falafel ile vejetaryen seçenek.",
    },
  },

  {
    key: "durum_original",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Das Original",
      en: "The Original",
      hr: "Das Original",
      sq: "Origjinali",
      tr: "Das Original",
    },
    desc: {
      de: "Frisch gerolltes Dürüm mit saftigem Hähnchen- oder Kalbfleisch. Serviert mit knackigem Salat, Tomaten, Zwiebeln und unseren hausgemachten Saucen.",
      en: "Freshly rolled durum with juicy chicken or veal. Served with crisp salad, tomatoes, onions, and our homemade sauces.",
      hr: "Svježe zarolani dürüm sa sočnom piletinom ili teletinom. Poslužen s hrskavom salatom, rajčicama, lukom i našim domaćim umacima.",
      sq: "Dürüm i mbështjellë i freskët me mish pule ose viçi të lëngshëm. Shërbehet me sallatë krokante, domate, qepë dhe salcat tona shtëpiake.",
      tr: "Sulu tavuk veya dana etiyle taze sarılmış dürüm. Çıtır salata, domates, soğan ve ev yapımı soslarımızla servis edilir.",
    },
  },
  {
    key: "durum_wedding",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Wedding",
      en: "Wedding",
      hr: "Wedding",
      sq: "Wedding",
      tr: "Wedding",
    },
    desc: {
      de: "Dürüm für den großen Appetit mit extra Fleisch nach Wahl. Frisch gerollt und mit buntem Salat sowie hausgemachten Saucen serviert.",
      en: "Durum for a big appetite with extra meat of your choice. Freshly rolled and served with colorful salad and homemade sauces.",
      hr: "Dürüm za veliki apetit s dodatnim mesom po izboru. Svježe zarolan i poslužen s raznobojnom salatom i domaćim umacima.",
      sq: "Dürüm për oreks të madh me mish shtesë sipas zgjedhjes. I mbështjellë i freskët dhe i shërbyer me sallatë shumëngjyrëshe dhe salca shtëpiake.",
      tr: "Büyük iştahlar için seçtiğiniz ekstra etli dürüm. Taze sarılır ve renkli salata ile ev yapımı soslarla servis edilir.",
    },
  },
  {
    key: "durum_kreuzberg",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_kreuzberg.jpeg"),
    title: {
      de: "Kreuzberg",
      en: "Kreuzberg",
      hr: "Kreuzberg",
      sq: "Kreuzberg",
      tr: "Kreuzberg",
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
    key: "durum_schoeneberg",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Schöneberg",
      en: "Schöneberg",
      hr: "Schöneberg",
      sq: "Schöneberg",
      tr: "Schöneberg",
    },
    desc: {
      de: "Mit feinem Grillgemüse und Fleisch nach Wahl frisch gerollt. Dazu frischer Salat und unsere hausgemachten Saucen für ein besonderes Geschmackserlebnis.",
      en: "Freshly rolled with fine grilled vegetables and meat of your choice. Served with fresh salad and our homemade sauces for a special taste experience.",
      hr: "Svježe zarolani dürüm s finim grilanim povrćem i mesom po izboru. Uz svježu salatu i naše domaće umake za posebno iskustvo okusa.",
      sq: "Dürüm i freskët i mbështjellë me perime të pjekura dhe mish sipas zgjedhjes. Shoqërohet me sallatë të freskët dhe salcat tona shtëpiake për një shije të veçantë.",
      tr: "İnce ızgara sebzeler ve seçtiğiniz et ile taze sarılır. Taze salata ve ev yapımı soslarla özel bir lezzet sunar.",
    },
  },
  {
    key: "durum_neukoeln",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Neukölln",
      en: "Neukölln",
      hr: "Neukölln",
      sq: "Neukölln",
      tr: "Neukölln",
    },
    desc: {
      de: "Dürüm mit dem gewissen Extra: Fleisch nach Wahl kombiniert mit knusprigen Pommes direkt im Wrap. Abgerundet mit frischem Gemüse und hausgemachter Sauce.",
      en: "Durum with that special extra: meat of your choice combined with crispy fries directly in the wrap. Finished with fresh vegetables and homemade sauce.",
      hr: "Dürüm s posebnim dodatkom: meso po izboru kombinirano s hrskavim pomfritom izravno u wrapu. Zaokruženo svježim povrćem i domaćim umakom.",
      sq: "Dürüm me diçka ekstra: mish sipas zgjedhjes i kombinuar me patate të skuqura krokante direkt në wrap. Përfundon me perime të freskëta dhe salcë shtëpiake.",
      tr: "Ekstra dokunuşlu dürüm: seçtiğiniz et, çıtır patatesle wrap içinde birleşir. Taze sebzeler ve ev yapımı sosla tamamlanır.",
    },
  },
  {
    key: "durum_tempelhof",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_das_original.jpeg"),
    title: {
      de: "Tempelhof",
      en: "Tempelhof",
      hr: "Tempelhof",
      sq: "Tempelhof",
      tr: "Tempelhof",
    },
    desc: {
      de: "Die harmonische Mischung aus Hähnchen- und Kalbfleisch frisch im Dürüm gerollt. Serviert mit knackigem Salat und unseren hausgemachten Saucen.",
      en: "The harmonious mix of chicken and veal freshly rolled in durum. Served with crisp salad and our homemade sauces.",
      hr: "Skladna mješavina piletine i teletine svježe zarolana u dürüm. Posluženo s hrskavom salatom i našim domaćim umacima.",
      sq: "Përzierja harmonike e mishit të pulës dhe viçit e mbështjellë e freskët në dürüm. Shërbehet me sallatë krokante dhe salcat tona shtëpiake.",
      tr: "Tavuk ve dana etinin uyumlu karışımı taze dürüm içinde sarılır. Çıtır salata ve ev yapımı soslarımızla servis edilir.",
    },
  },
  {
    key: "durum_moabit_veggie",
    section: "durum",
    image: require("../../assets/images/speisekarte/durum_halloumi.jpeg"),
    title: {
      de: "Moabit Veggie",
      en: "Moabit Veggie",
      hr: "Moabit Veggie",
      sq: "Moabit Veggie",
      tr: "Moabit Veggie",
    },
    desc: {
      de: "Die vegetarische Dürüm-Variante nach Speisekartenlogik: mit Halloumi oder Falafel, frischem Gemüse und fein abgestimmter Sauce.",
      en: "The vegetarian durum version based on the menu logic: with halloumi or falafel, fresh vegetables, and a well-balanced sauce.",
      hr: "Vegetarijanska dürüm varijanta prema logici jelovnika: s halloumijem ili falafelom, svježim povrćem i fino usklađenim umakom.",
      sq: "Varianti vegjetariane e dürüm sipas logjikës së menysë: me halloumi ose falafel, perime të freskëta dhe salcë të balancuar.",
      tr: "Menü mantığına göre vejetaryen dürüm seçeneği: hellim veya falafel, taze sebzeler ve dengeli sos ile hazırlanır.",
    },
  },

  {
    key: "box_original",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Das Original",
      en: "The Original",
      hr: "Das Original",
      sq: "Origjinali",
      tr: "Das Original",
    },
    desc: {
      de: "Der Klassiker für unterwegs wahlweise mit Kalbs- oder Hähnchenfleisch. Serviert mit knackigen Tomaten, Zwiebeln, Eisbergsalat, Gurken, Rotkohl und unseren hausgemachten Saucen.",
      en: "The classic to go with optional veal or chicken. Served with crisp tomatoes, onions, iceberg lettuce, cucumber, red cabbage, and our homemade sauces.",
      hr: "Klasični izbor za ponijeti po izboru s teletinom ili piletinom. Posluženo s hrskavim rajčicama, lukom, ledenom salatom, krastavcima, crvenim kupusom i našim domaćim umacima.",
      sq: "Klasikja për rrugë sipas zgjedhjes me mish viçi ose pule. Shërbehet me domate krokante, qepë, sallatë iceberg, kastravec, lakër të kuqe dhe salcat tona shtëpiake.",
      tr: "Klasik paket seçenek, isteğe göre dana veya tavuk eti ile hazırlanır. Domates, soğan, iceberg marul, salatalık, mor lahana ve ev yapımı soslarla servis edilir.",
    },
  },
  {
    key: "box_wedding",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Wedding",
      en: "Wedding",
      hr: "Wedding",
      sq: "Wedding",
      tr: "Wedding",
    },
    desc: {
      de: "Die herzhafte Box mit einer Fleischsorte nach Wahl. Frisch angerichtet mit buntem Salat, Zwiebeln und verfeinert mit unseren hausgemachten Saucen.",
      en: "The hearty box with a meat of your choice. Freshly prepared with colorful salad, onions, and refined with our homemade sauces.",
      hr: "Obilni box s mesom po izboru. Svježe pripremljen s raznobojnom salatom, lukom i oplemenjen našim domaćim umacima.",
      sq: "Kutia e bollshme me mish sipas zgjedhjes suaj. Përgatitet me sallatë shumëngjyrëshe, qepë dhe plotësohet me salcat tona shtëpiake.",
      tr: "İsteğe göre seçilen et ile doyurucu kutu seçeneği. Renkli salata, soğan ve ev yapımı soslarımızla hazırlanır.",
    },
  },
  {
    key: "box_kreuzberg",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_kreuzberg.jpeg"),
    title: {
      de: "Kreuzberg",
      en: "Kreuzberg",
      hr: "Kreuzberg",
      sq: "Kreuzberg",
      tr: "Kreuzberg",
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
    key: "box_schoeneberg",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_schoeneberg.jpeg"),
    title: {
      de: "Schöneberg",
      en: "Schöneberg",
      hr: "Schöneberg",
      sq: "Schöneberg",
      tr: "Schöneberg",
    },
    desc: {
      de: "Ein besonderes Highlight mit würzigem Grillgemüse und wahlweise Kalbs- oder Hähnchenfleisch. Begleitet von frischem Gemüse und unseren hausgemachten Saucen.",
      en: "A special highlight with spicy grilled vegetables and optional veal or chicken. Accompanied by fresh vegetables and our homemade sauces.",
      hr: "Poseban specijalitet s aromatičnim grilanim povrćem i po izboru teletinom ili piletinom. Uz svježe povrće i naše domaće umake.",
      sq: "Një veçanti me perime të pjekura me erëza dhe sipas zgjedhjes mish viçi ose pule. Shoqërohet me perime të freskëta dhe salcat tona shtëpiake.",
      tr: "Baharatlı ızgara sebzeler ve isteğe göre dana veya tavuk eti ile özel bir lezzet. Taze sebzeler ve ev yapımı soslarla sunulur.",
    },
  },
  {
    key: "box_neukoeln",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_neukoeln.jpeg"),
    title: {
      de: "Neukölln",
      en: "Neukölln",
      hr: "Neukölln",
      sq: "Neukölln",
      tr: "Neukölln",
    },
    desc: {
      de: "Herzhaftes Kalbs- oder Hähnchenfleisch trifft auf knusprige Pommes frites direkt in der Box. Abgerundet durch frischen Salat, Zwiebeln und unsere hausgemachten Saucen.",
      en: "Hearty veal or chicken meets crispy fries directly in the box. Finished with fresh salad, onions, and our homemade sauces.",
      hr: "Sočno teleće ili pileće meso susreće hrskavi pomfrit izravno u boxu. Zaokruženo svježom salatom, lukom i našim domaćim umacima.",
      sq: "Mishi i shijshëm i viçit ose pulës takohet me patate të skuqura krokante direkt në kuti. Plotësohet me sallatë të freskët, qepë dhe salcat tona shtëpiake.",
      tr: "Lezzetli dana veya tavuk eti, çıtır patates kızartmasıyla kutuda buluşuyor. Taze salata, soğan ve ev yapımı soslarla tamamlanır.",
    },
  },
  {
    key: "box_tempelhof",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_original_kalb.jpeg"),
    title: {
      de: "Tempelhof",
      en: "Tempelhof",
      hr: "Tempelhof",
      sq: "Tempelhof",
      tr: "Tempelhof",
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
    key: "box_moabit_veggie",
    section: "boxen",
    image: require("../../assets/images/speisekarte/box_moabit_veggie.png"),
    title: {
      de: "Moabit Veggie",
      en: "Moabit Veggie",
      hr: "Moabit Veggie",
      sq: "Moabit Veggie",
      tr: "Moabit Veggie",
    },
    desc: {
      de: "Die frische, fleischlose Alternative mit buntem Salat und knackigem Gemüse. Optional vegetarisch mit Halloumi oder Falafel.",
      en: "The fresh meat-free alternative with colorful salad and crunchy vegetables. Optional vegetarian with halloumi or falafel.",
      hr: "Svježa alternativa bez mesa s raznobojnom salatom i hrskavim povrćem. Po želji vegetarijanski s halloumijem ili falafelom.",
      sq: "Alternativa e freskët pa mish me sallatë shumëngjyrëshe dhe perime krokante. Opsionalisht vegjetariane me halloumi ose falafel.",
      tr: "Renkli salata ve çıtır sebzelerle taze, etsiz alternatif. İsteğe bağlı hellim veya falafel ile vejetaryen seçenek.",
    },
  },

  {
    key: "chicken_nuggets",
    section: "snacks",
    image: require("../../assets/images/speisekarte/chicken_nuggets.jpeg"),
    title: {
      de: "Chicken Nuggets",
      en: "Chicken Nuggets",
      hr: "Chicken Nuggets",
      sq: "Chicken Nuggets",
      tr: "Chicken Nuggets",
    },
    desc: {
      de: "Außen knusprig, innen zart. Wählen Sie zwischen Nuggets pur oder serviert mit einer Portion Pommes frites.",
      en: "Crispy on the outside, tender on the inside. Choose between nuggets on their own or served with a portion of fries.",
      hr: "Hrskavi izvana, mekani iznutra. Birajte između nuggetsa samostalno ili posluženih s porcijom pomfrita.",
      sq: "Krokante nga jashtë, të buta nga brenda. Zgjidhni mes nuggets vetëm ose të shërbyera me një porcion patatesh të skuqura.",
      tr: "Dışı çıtır, içi yumuşak. Nugget tek başına ya da patates kızartması ile servis seçeneği vardır.",
    },
  },
  {
    key: "currywurst_pommes",
    section: "snacks",
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
    key: "pommes_frites",
    section: "snacks",
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
  {
    key: "suesskartoffelpommes",
    section: "snacks",
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
    key: "menu_sandwich_original",
    section: "menues",
    image: require("../../assets/images/speisekarte/menu_sandwich_original.jpeg"),
    title: {
      de: "Das Original Sandwich Sparmenü",
      en: "The Original Sandwich Value Menu",
      hr: "Das Original Sandwich Sparmenü",
      sq: "Das Original Sandwich Sparmenü",
      tr: "Das Original Sandviç Menü",
    },
    desc: {
      de: "Unser Klassiker im knusprigen Fladenbrot mit saftigem Fleisch nach Wahl. Serviert mit Pommes frites und einem Getränk.",
      en: "Our classic in crispy flatbread with juicy meat of your choice. Served with fries and a drink.",
      hr: "Naš klasik u hrskavom somunu sa sočnim mesom po izboru. Poslužen s pomfritom i pićem.",
      sq: "Klasikja jonë në bukë krokante me mish të lëngshëm sipas zgjedhjes suaj. Shërbehet me patate të skuqura dhe një pije.",
      tr: "Çıtır pide ekmeğinde seçtiğiniz sulu et ile klasiğimiz. Patates kızartması ve içecek ile servis edilir.",
    },
  },
  {
    key: "menu_durum_original",
    section: "menues",
    image: require("../../assets/images/speisekarte/menu_durum_original.jpeg"),
    title: {
      de: "Das Original Dürüm Sparmenü",
      en: "The Original Durum Value Menu",
      hr: "Das Original Dürüm Sparmenü",
      sq: "Das Original Dürüm Sparmenü",
      tr: "Das Original Dürüm Menü",
    },
    desc: {
      de: "Die frisch gerollte Weizentortilla mit Fleisch nach Wahl. Dazu gibt es Pommes frites und ein Getränk.",
      en: "Freshly rolled wheat tortilla with meat of your choice. Served with fries and a drink.",
      hr: "Svježe zarolana pšenična tortilja s mesom po izboru. Uz to dolaze pomfrit i piće.",
      sq: "Tortilla gruri e mbështjellë e freskët me mish sipas zgjedhjes suaj. Shoqërohet me patate të skuqura dhe një pije.",
      tr: "Seçtiğiniz et ile taze sarılmış buğday tortillası. Yanında patates kızartması ve içecek bulunur.",
    },
  },
  {
    key: "menu_box_original",
    section: "menues",
    image: require("../../assets/images/speisekarte/menu_box_original.jpeg"),
    title: {
      de: "Das Original Box Sparmenü",
      en: "The Original Box Value Menu",
      hr: "Das Original Box Sparmenü",
      sq: "Das Original Box Sparmenü",
      tr: "Das Original Kutu Menü",
    },
    desc: {
      de: "Die praktische Dönerbox mit saftigem Fleisch nach Wahl. Im Menü enthalten sind zusätzlich Pommes frites und ein Getränk.",
      en: "The practical doner box with juicy meat of your choice. The menu also includes fries and a drink.",
      hr: "Praktični döner box sa sočnim mesom po izboru. U meniju su uključeni i pomfrit te piće.",
      sq: "Kutia praktike e dönerit me mish të lëngshëm sipas zgjedhjes suaj. Menuja përfshin edhe patate të skuqura dhe një pije.",
      tr: "Seçtiğiniz sulu et ile pratik döner kutusu. Menüye ayrıca patates kızartması ve içecek dahildir.",
    },
  },
  {
    key: "menu_currywurst",
    section: "menues",
    image: require("../../assets/images/speisekarte/menu_currywurst.jpeg"),
    title: {
      de: "Currywurst Sparmenü",
      en: "Currywurst Value Menu",
      hr: "Currywurst Sparmenü",
      sq: "Currywurst Sparmenü",
      tr: "Currywurst Menü",
    },
    desc: {
      de: "Der Berliner Kult-Klassiker: Currywurst, wahlweise mit klassischen Pommes frites oder feinen Süßkartoffelpommes, inklusive Getränk.",
      en: "The Berlin cult classic: currywurst, served with either classic fries or sweet potato fries, including a drink.",
      hr: "Berlinski kultni klasik: currywurst, poslužena po izboru s klasičnim pomfritom ili pomfritom od batata, uključujući piće.",
      sq: "Klasiku kult i Berlinit: currywurst, e shërbyer sipas zgjedhjes me patate të skuqura klasike ose patate të ëmbla, me pije të përfshirë.",
      tr: "Berlin’in kült klasiği: currywurst, klasik patates veya tatlı patates ile, içecek dahil servis edilir.",
    },
  },

  {
    key: "mokoko",
    section: "kids",
    image: require("../../assets/images/speisekarte/mokoko.jpeg"),
    title: {
      de: "Mokoko Kids Box",
      en: "Mokoko Kids Box",
      hr: "Mokoko Kids Box",
      sq: "Mokoko Kids Box",
      tr: "Mokoko Kids Box",
    },
    desc: {
      de: "Die perfekte Überraschung für kleine Gäste: Wahlweise knusprige Nuggets oder saftiges Dönerfleisch mit einer Portion Pommes. Inklusive Fruchtsaft, Luftballon, Lolli und Spielzeug.",
      en: "The perfect surprise for little guests: choose crispy nuggets or juicy doner meat with a portion of fries. Includes fruit juice, balloon, lollipop, and toy.",
      hr: "Savršeno iznenađenje za male goste: po izboru hrskavi nuggetsi ili sočno döner meso uz porciju pomfrita. Uključuje voćni sok, balon, lizalicu i igračku.",
      sq: "Surpriza perfekte për mysafirët e vegjël: sipas dëshirës nuggets krokante ose mish döner i lëngshëm me një porcion patatesh të skuqura. Përfshin lëng frutash, tullumbace, karamele dhe lodër.",
      tr: "Küçük misafirler için mükemmel sürpriz: isteğe göre çıtır nugget veya sulu döner eti, yanında bir porsiyon patates kızartması. Meyve suyu, balon, lolipop ve oyuncak dahildir.",
    },
  },

  {
    key: "bearliner_spezi_teller",
    section: "speziteller",
    image: require("../../assets/images/speisekarte/bearliner_spezi_teller.jpeg"),
    title: {
      de: "BÄRLINER Spezi Teller",
      en: "BÄRLINER Special Plate",
      hr: "BÄRLINER Spezi Teller",
      sq: "BÄRLINER Spezi Teller",
      tr: "BÄRLINER Özel Tabak",
    },
    desc: {
      de: "Unser Riesen-Dönerteller für den maximalen Hunger: knusprige Pommes, Fleisch nach Wahl, frisches Gemüse, hausgemachte Sauce, frisches Brot und ein Getränk.",
      en: "Our giant doner plate for maximum hunger: crispy fries, meat of your choice, fresh vegetables, homemade sauce, fresh bread, and a drink.",
      hr: "Naš veliki döner tanjur za maksimalan apetit: hrskavi pomfrit, meso po izboru, svježe povrće, domaći umak, svježi kruh i piće.",
      sq: "Pjata jonë gjigante me döner për uri maksimale: patate të skuqura krokante, mish sipas zgjedhjes, perime të freskëta, salcë shtëpiake, bukë e freskët dhe pije.",
      tr: "Maksimum iştah için dev döner tabağımız: çıtır patates, seçtiğiniz et, taze sebzeler, ev yapımı sos, taze ekmek ve içecek.",
    },
  },
];

const SECTION_ORDER: SectionConfig[] = [
  {
    key: "doener",
    title: {
      de: "Sandwiches in Bärliner Fladenbrot",
      en: "Sandwiches in Bärliner Flatbread",
      hr: "Sendviči u Bärliner Somunu",
      sq: "Sanduiçe në Bukë Bärliner",
      tr: "Bärliner Pide Ekmeğinde Sandviçler",
    },
    itemKeys: [
      "doener_original",
      "doener_wedding",
      "doener_kreuzberg",
      "doener_schoeneberg",
      "doener_neukoeln",
      "doener_tempelhof",
      "doener_moabit_veggie",
    ],
  },
  {
    key: "durum",
    title: {
      de: "Dürüm Wrap nach Bärliner Art",
      en: "Durum Wrap Bärliner Style",
      hr: "Dürüm Wrap na Bärliner Način",
      sq: "Dürüm Wrap në Stil Bärliner",
      tr: "Bärliner Usulü Dürüm Wrap",
    },
    itemKeys: [
      "durum_original",
      "durum_wedding",
      "durum_kreuzberg",
      "durum_schoeneberg",
      "durum_neukoeln",
      "durum_tempelhof",
      "durum_moabit_veggie",
    ],
  },
  {
    key: "boxen",
    title: {
      de: "Boxen",
      en: "Boxes",
      hr: "Boxevi",
      sq: "Kuti",
      tr: "Kutular",
    },
    itemKeys: [
      "box_original",
      "box_wedding",
      "box_kreuzberg",
      "box_schoeneberg",
      "box_neukoeln",
      "box_tempelhof",
      "box_moabit_veggie",
    ],
  },
  {
    key: "snacks",
    title: {
      de: "Snacks",
      en: "Snacks",
      hr: "Snackovi",
      sq: "Snacks",
      tr: "Atıştırmalıklar",
    },
    itemKeys: [
      "chicken_nuggets",
      "currywurst_pommes",
      "pommes_frites",
      "suesskartoffelpommes",
    ],
  },
  {
    key: "menues",
    title: {
      de: "Menüs",
      en: "Menus",
      hr: "Meniji",
      sq: "Menu",
      tr: "Menüler",
    },
    itemKeys: [
      "menu_sandwich_original",
      "menu_durum_original",
      "menu_box_original",
      "menu_currywurst",
    ],
  },
  {
    key: "kids",
    title: {
      de: "Für Kinder",
      en: "For Kids",
      hr: "Za Djecu",
      sq: "Për Fëmijë",
      tr: "Çocuklar İçin",
    },
    itemKeys: ["mokoko"],
  },
  {
    key: "speziteller",
    title: {
      de: "Speziteller",
      en: "Special Plates",
      hr: "Specijalni Tanjuri",
      sq: "Pjata Speciale",
      tr: "Özel Tabaklar",
    },
    itemKeys: ["bearliner_spezi_teller"],
  },
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
    const productMap = new Map(PRODUCTS.map((item) => [item.key, item]));

    return SECTION_ORDER.map((section) => ({
      key: section.key,
      title: section.title[lang],
      items: section.itemKeys
        .map((itemKey) => productMap.get(itemKey))
        .filter(Boolean) as ProductItem[],
    })).filter((section) => section.items.length > 0);
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
            <View key={group.key} style={styles.section}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderText}>{group.title}</Text>
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
    marginBottom: 14,
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
    textTransform: "uppercase",
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