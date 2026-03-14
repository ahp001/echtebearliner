import { getLanguage } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  bg: "#0B0B0B",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.72)",
  accent: "#C9A227",
};

type Lang = "de" | "en" | "hr" | "sq" | "tr";

type DsgvoContent = {
  back: string;
  pageTitle: string;
  brandTitle: string;
  brandSub: string;
  address: string[];
  contact: string[];
  owner: string[];
  court: string[];
  web: string[];
  sections: {
    terms: string;
    copyright: string;
    warranty: string;
    license: string;
    links: string;
  };
  termsText: string[];
  copyrightText: string[];
  warrantyText: string[];
  licenseText: string[];
  linksText: string[];
};

const CONTENT: Record<Lang, DsgvoContent> = {
  de: {
    back: "Zurück",
    pageTitle: "DSGVO",
    brandTitle: "ECHTE BÄRLINER®",
    brandSub: "EINE MARKE DER MARAS GROUP®",
    address: ["Zollern Str. 11", "86154 Augsburg"],
    contact: ["Büro: 0821 - 209 566 64", "Mobil: 0176 - 822 712 25"],
    owner: ["Inhaber: Ugur Maras", "Steuer-Nr. 103/248/00110"],
    court: ["Amtsgericht Augsburg", "Sitz: Augsburg"],
    web: ["info@echtebaerliner.de", "www.echtebaerliner.de"],
    sections: {
      terms: "Allgemeine Geschäftsbedingungen",
      copyright: "Urheberrecht",
      warranty: "Gewährleistung",
      license: "Lizenzrechte",
      links: "Externe Verweise und Links",
    },
    termsText: [
      "Wir verweisen Sie gerne auch auf unseren Haftungsausschluss und unsere Datenschutzbestimmungen.",
    ],
    copyrightText: [
      "Copyright 2024 ECHTE BÄRLINER®. Alle Rechte vorbehalten.",
      "Alle Texte, Bilder, Graphiken, Ton-, Video- und Animationsdateien sowie ihre Arrangements unterliegen dem Urheberrecht und anderen Gesetzen zum Schutz geistigen Eigentums. Sie dürfen weder für Handelszwecke oder zur Weitergabe kopiert, noch verändert und auf anderen Web-Sites verwendet werden.",
      "Einige ECHTE BÄRLINER®-Internet-Seiten enthalten auch Bilder, die dem Urheberrecht derjenigen unterliegen, die diese zur Verfügung gestellt haben.",
    ],
    warrantyText: [
      "Die Informationen stellt ECHTE BÄRLINER® ohne jegliche Zusicherung oder Gewährleistung jedweder Art, sei sie ausdrücklich oder stillschweigend, zur Verfügung.",
      "Ausgeschlossen sind auch alle stillschweigenden Gewährleistungen betreffend die Handlungsfähigkeit, die Eignung für bestimmte Zwecke oder den Nicht verstoß gegen Gesetze und Patente.",
      "Auch wenn wir davon ausgehen, dass die von uns gegebenen Informationen zutreffend sind, können sie dennoch Fehler oder Ungenauigkeiten enthalten.",
    ],
    licenseText: [
      "ECHTE BÄRLINER® möchte Ihnen ein innovatives und informatives Internet-Programm anbieten. Wir hoffen deshalb, dass Sie sich über unsere kreative Gestaltung genauso freuen wie wir.",
      "Wir bitten Sie aber dennoch um Verständnis dafür, dass die ECHTE BÄRLINER® ihr geistiges Eigentum, einschließlich Patente, Handelsmarken und Urheberrechte, schützen muss und diese Internet-Seiten keinerlei Lizenzrechte an dem geistigen Eigentum der ECHTE BÄRLINER® gewähren können.",
    ],
    linksText: [
      "Mit Urteil vom 12. Mai 1998 hat das LG Hamburg entschieden, dass man durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf. mit zu verantworten hat.",
      "Dies kann, so das LG, nur dadurch verhindert werden, dass man sich ausdrücklich von diesen Inhalten distanziert.",
      "Wir haben auf unseren Seiten Links zu Seiten im Internet gelegt, deren Inhalt und Aktualisierung nicht dem Einflussbereich der ECHTE BÄRLINER® unterliegen.",
      "Für alle diese Links gilt:",
      "ECHTE BÄRLINER® hat keinen Einfluss auf Gestaltung und Inhalte fremder Internetseiten. Sie distanziert sich daher von allen fremden Inhalten, auch wenn von Seiten der ECHTE BÄRLINER® auf diese externe Seiten ein Link gesetzt wurden.",
      "Diese Erklärung gilt für alle auf unserer Homepage angezeigten Links und für alle Inhalte der Seiten, zu denen die bei uns angemeldeten Banner und Links führen.",
    ],
  },

  en: {
    back: "Back",
    pageTitle: "GDPR",
    brandTitle: "ECHTE BÄRLINER®",
    brandSub: "A BRAND OF MARAS GROUP®",
    address: ["Zollern Str. 11", "86154 Augsburg"],
    contact: ["Office: 0821 - 209 566 64", "Mobile: 0176 - 822 712 25"],
    owner: ["Owner: Ugur Maras", "Tax No. 103/248/00110"],
    court: ["District Court Augsburg", "Registered office: Augsburg"],
    web: ["info@echtebaerliner.de", "www.echtebaerliner.de"],
    sections: {
      terms: "General Terms and Conditions",
      copyright: "Copyright",
      warranty: "Warranty",
      license: "Licensing rights",
      links: "External references and links",
    },
    termsText: [
      "We also gladly refer you to our disclaimer and our data protection provisions.",
    ],
    copyrightText: [
      "Copyright 2024 ECHTE BÄRLINER®. All rights reserved.",
      "All texts, images, graphics, audio, video and animation files as well as their arrangements are subject to copyright and other laws protecting intellectual property. They may not be copied for commercial purposes or distribution, nor modified and used on other websites.",
      "Some ECHTE BÄRLINER® web pages also contain images that are subject to the copyright of those who provided them.",
    ],
    warrantyText: [
      "ECHTE BÄRLINER® provides the information without any representation or warranty of any kind, whether express or implied.",
      "This also excludes all implied warranties regarding merchantability, fitness for a particular purpose or non-infringement of laws and patents.",
      "Even though we assume that the information we provide is correct, it may nevertheless contain errors or inaccuracies.",
    ],
    licenseText: [
      "ECHTE BÄRLINER® would like to offer you an innovative and informative internet program. We therefore hope that you enjoy our creative design as much as we do.",
      "However, we ask for your understanding that ECHTE BÄRLINER® must protect its intellectual property, including patents, trademarks and copyrights, and that these web pages cannot grant any license rights to the intellectual property of ECHTE BÄRLINER®.",
    ],
    linksText: [
      "In its ruling of 12 May 1998, the Regional Court of Hamburg decided that by placing a link, one may under certain circumstances share responsibility for the content of the linked page.",
      "According to the court, this can only be prevented by expressly distancing oneself from such content.",
      "We have placed links on our pages to websites on the internet whose content and updates are not within the sphere of influence of ECHTE BÄRLINER®.",
      "The following applies to all these links:",
      "ECHTE BÄRLINER® has no influence on the design and content of external websites. It therefore distances itself from all external content, even if a link to these external pages has been set from ECHTE BÄRLINER® pages.",
      "This declaration applies to all links displayed on our homepage and to all content of the pages to which the banners and links registered with us lead.",
    ],
  },

  hr: {
    back: "Natrag",
    pageTitle: "GDPR",
    brandTitle: "ECHTE BÄRLINER®",
    brandSub: "BREND MARAS GROUP®",
    address: ["Zollern Str. 11", "86154 Augsburg"],
    contact: ["Ured: 0821 - 209 566 64", "Mobitel: 0176 - 822 712 25"],
    owner: ["Vlasnik: Ugur Maras", "Porezni broj: 103/248/00110"],
    court: ["Općinski sud Augsburg", "Sjedište: Augsburg"],
    web: ["info@echtebaerliner.de", "www.echtebaerliner.de"],
    sections: {
      terms: "Opći uvjeti poslovanja",
      copyright: "Autorsko pravo",
      warranty: "Jamstvo",
      license: "Licencna prava",
      links: "Vanjske reference i poveznice",
    },
    termsText: [
      "Rado vas upućujemo i na naše odricanje od odgovornosti te na naše odredbe o zaštiti podataka.",
    ],
    copyrightText: [
      "Copyright 2024 ECHTE BÄRLINER®. Sva prava pridržana.",
      "Svi tekstovi, slike, grafike, audio, video i animacijske datoteke kao i njihov raspored podliježu autorskom pravu i drugim zakonima za zaštitu intelektualnog vlasništva. Ne smiju se kopirati u komercijalne svrhe niti za prosljeđivanje, niti mijenjati i koristiti na drugim web stranicama.",
      "Neke ECHTE BÄRLINER® internetske stranice također sadrže slike koje podliježu autorskim pravima osoba koje su ih stavile na raspolaganje.",
    ],
    warrantyText: [
      "ECHTE BÄRLINER® pruža informacije bez ikakvih izjava ili jamstava bilo koje vrste, bilo izričitih ili prešutnih.",
      "Isključena su i sva prešutna jamstva koja se odnose na prikladnost za tržište, prikladnost za određenu svrhu ili nekršenje zakona i patenata.",
      "Iako pretpostavljamo da su informacije koje pružamo točne, one ipak mogu sadržavati pogreške ili netočnosti.",
    ],
    licenseText: [
      "ECHTE BÄRLINER® želi vam ponuditi inovativan i informativan internetski program. Zato se nadamo da ćete uživati u našem kreativnom dizajnu jednako kao i mi.",
      "Ipak, molimo za razumijevanje da ECHTE BÄRLINER® mora štititi svoje intelektualno vlasništvo, uključujući patente, zaštitne znakove i autorska prava, te da ove internetske stranice ne mogu dodijeliti nikakva licencna prava na intelektualno vlasništvo ECHTE BÄRLINER®.",
    ],
    linksText: [
      "Presudom od 12. svibnja 1998. Zemaljski sud u Hamburgu odlučio je da se postavljanjem poveznice po potrebi može snositi i odgovornost za sadržaj povezane stranice.",
      "Prema sudu, to se može spriječiti samo izričitim ograđivanjem od tih sadržaja.",
      "Na našim stranicama postavili smo poveznice na stranice na internetu čiji sadržaj i ažuriranje nisu u području utjecaja ECHTE BÄRLINER®.",
      "Za sve te poveznice vrijedi:",
      "ECHTE BÄRLINER® nema utjecaja na dizajn i sadržaj stranih internetskih stranica. Stoga se ograđuje od svih stranih sadržaja, čak i ako je s ECHTE BÄRLINER® stranica postavljena poveznica na te vanjske stranice.",
      "Ova izjava vrijedi za sve poveznice prikazane na našoj početnoj stranici i za sav sadržaj stranica do kojih vode kod nas registrirani banneri i poveznice.",
    ],
  },

  sq: {
    back: "Kthehu",
    pageTitle: "GDPR",
    brandTitle: "ECHTE BÄRLINER®",
    brandSub: "NJË MARKË E MARAS GROUP®",
    address: ["Zollern Str. 11", "86154 Augsburg"],
    contact: ["Zyra: 0821 - 209 566 64", "Celular: 0176 - 822 712 25"],
    owner: ["Pronari: Ugur Maras", "Nr. tatimor: 103/248/00110"],
    court: ["Gjykata e Augsburgut", "Selia: Augsburg"],
    web: ["info@echtebaerliner.de", "www.echtebaerliner.de"],
    sections: {
      terms: "Kushtet e përgjithshme të biznesit",
      copyright: "E drejta e autorit",
      warranty: "Garancia",
      license: "Të drejtat e licencës",
      links: "Referenca dhe lidhje të jashtme",
    },
    termsText: [
      "Ju referojmë me kënaqësi edhe te mohimi ynë i përgjegjësisë dhe te dispozitat tona për mbrojtjen e të dhënave.",
    ],
    copyrightText: [
      "Copyright 2024 ECHTE BÄRLINER®. Të gjitha të drejtat e rezervuara.",
      "Të gjitha tekstet, imazhet, grafikat, skedarët audio, video dhe animacionet si dhe rregullimi i tyre janë të mbrojtura nga e drejta e autorit dhe nga ligje të tjera për mbrojtjen e pronësisë intelektuale. Ato nuk lejohen të kopjohen për qëllime tregtare ose për shpërndarje, as të ndryshohen dhe të përdoren në faqe të tjera interneti.",
      "Disa faqe interneti të ECHTE BÄRLINER® përmbajnë gjithashtu imazhe që i nënshtrohen të drejtës së autorit të atyre që i kanë vënë në dispozicion.",
    ],
    warrantyText: [
      "ECHTE BÄRLINER® i ofron informacionet pa asnjë garanci ose sigurim të çfarëdo lloji, qoftë të shprehur apo të nënkuptuar.",
      "Përjashtohen gjithashtu të gjitha garancitë e nënkuptuara lidhur me përdorshmërinë tregtare, përshtatshmërinë për qëllime të caktuara ose mosshkeljen e ligjeve dhe patentave.",
      "Edhe pse supozojmë se informacionet që japim janë të sakta, ato mund të përmbajnë gabime ose pasaktësi.",
    ],
    licenseText: [
      "ECHTE BÄRLINER® dëshiron t'ju ofrojë një program interneti inovativ dhe informues. Prandaj shpresojmë që të kënaqeni me dizajnin tonë kreativ po aq sa edhe ne.",
      "Megjithatë, kërkojmë mirëkuptimin tuaj që ECHTE BÄRLINER® duhet të mbrojë pronën e saj intelektuale, duke përfshirë patentat, markat tregtare dhe të drejtat e autorit, dhe se këto faqe interneti nuk mund të japin asnjë të drejtë licence mbi pronën intelektuale të ECHTE BÄRLINER®.",
    ],
    linksText: [
      "Me vendimin e 12 majit 1998, Gjykata Rajonale e Hamburgut vendosi se duke vendosur një lidhje, në rrethana të caktuara mund të mbash përgjegjësi edhe për përmbajtjen e faqes së lidhur.",
      "Sipas gjykatës, kjo mund të parandalohet vetëm duke u distancuar shprehimisht nga ajo përmbajtje.",
      "Në faqet tona kemi vendosur lidhje me faqe interneti, përmbajtja dhe përditësimi i të cilave nuk janë nën ndikimin e ECHTE BÄRLINER®.",
      "Për të gjitha këto lidhje vlen:",
      "ECHTE BÄRLINER® nuk ka asnjë ndikim mbi dizajnin dhe përmbajtjen e faqeve të huaja të internetit. Prandaj ajo distancohet nga çdo përmbajtje e huaj, edhe nëse nga faqet e ECHTE BÄRLINER® është vendosur një lidhje drejt këtyre faqeve të jashtme.",
      "Kjo deklaratë vlen për të gjitha lidhjet e paraqitura në faqen tonë kryesore dhe për të gjithë përmbajtjen e faqeve ku të çojnë bannerat dhe lidhjet e regjistruara tek ne.",
    ],
  },

  tr: {
    back: "Geri",
    pageTitle: "KVKK / GDPR",
    brandTitle: "ECHTE BÄRLINER®",
    brandSub: "MARAS GROUP® MARKASIDIR",
    address: ["Zollern Str. 11", "86154 Augsburg"],
    contact: ["Ofis: 0821 - 209 566 64", "Mobil: 0176 - 822 712 25"],
    owner: ["Sahibi: Ugur Maras", "Vergi No. 103/248/00110"],
    court: ["Augsburg Yerel Mahkemesi", "Merkez: Augsburg"],
    web: ["info@echtebaerliner.de", "www.echtebaerliner.de"],
    sections: {
      terms: "Genel iş şartları",
      copyright: "Telif hakkı",
      warranty: "Garanti",
      license: "Lisans hakları",
      links: "Harici referanslar ve bağlantılar",
    },
    termsText: [
      "Sizi ayrıca sorumluluk reddi beyanımıza ve veri koruma hükümlerimize de memnuniyetle yönlendiriyoruz.",
    ],
    copyrightText: [
      "Copyright 2024 ECHTE BÄRLINER®. Tüm hakları saklıdır.",
      "Tüm metinler, görseller, grafikler, ses, video ve animasyon dosyaları ile bunların düzenlemeleri telif hakkına ve fikri mülkiyetin korunmasına ilişkin diğer yasalara tabidir. Ticari amaçlarla veya dağıtım için kopyalanamaz, değiştirilemez ve başka internet sitelerinde kullanılamaz.",
      "Bazı ECHTE BÄRLINER® internet sayfalarında, bunları sağlayan kişilerin telif hakkına tabi görseller de bulunmaktadır.",
    ],
    warrantyText: [
      "ECHTE BÄRLINER®, bilgileri açık veya zımni herhangi bir güvence ya da garanti olmaksızın sunmaktadır.",
      "Buna; ticari elverişlilik, belirli amaçlara uygunluk veya yasa ve patent ihlali olmamasıyla ilgili tüm zımni garantiler de dahildir.",
      "Verdiğimiz bilgilerin doğru olduğunu varsaysak da bunlar yine de hata veya eksiklik içerebilir.",
    ],
    licenseText: [
      "ECHTE BÄRLINER® size yenilikçi ve bilgilendirici bir internet programı sunmak istemektedir. Bu nedenle yaratıcı tasarımımızdan bizim kadar keyif almanızı umuyoruz.",
      "Bununla birlikte, ECHTE BÄRLINER®'in patentler, ticari markalar ve telif hakları dahil olmak üzere fikri mülkiyetini korumak zorunda olduğunu ve bu internet sayfalarının ECHTE BÄRLINER®'in fikri mülkiyeti üzerinde herhangi bir lisans hakkı veremeyeceğini anlayışla karşılamanızı rica ederiz.",
    ],
    linksText: [
      "Hamburg Eyalet Mahkemesi 12 Mayıs 1998 tarihli kararında, bir bağlantı verilmesiyle bağlantı verilen sayfanın içeriğinden belirli durumlarda sorumluluk doğabileceğine karar vermiştir.",
      "Mahkemeye göre bu ancak söz konusu içeriklerden açıkça uzak durulmasıyla önlenebilir.",
      "Sayfalarımızda, içeriği ve güncelliği ECHTE BÄRLINER®'in etki alanında olmayan internet sayfalarına bağlantılar bulunmaktadır.",
      "Tüm bu bağlantılar için geçerlidir:",
      "ECHTE BÄRLINER®, yabancı internet sayfalarının tasarımı ve içeriği üzerinde hiçbir etkiye sahip değildir. Bu nedenle, ECHTE BÄRLINER® sayfalarından bu harici sayfalara bağlantı verilmiş olsa bile tüm yabancı içeriklerden uzak durmaktadır.",
      "Bu açıklama, ana sayfamızda gösterilen tüm bağlantılar ve bize kayıtlı banner ve bağlantıların yönlendirdiği sayfaların tüm içerikleri için geçerlidir.",
    ],
  },
};

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function TextLines({
  lines,
  style,
}: {
  lines: string[];
  style: any;
}) {
  return (
    <>
      {lines.map((line, index) => (
        <Text key={`${line}-${index}`} style={style}>
          {line}
        </Text>
      ))}
    </>
  );
}

export default function DsgvoScreen() {
  const [lang, setLang] = useState<Lang>("de");

  useFocusEffect(
    useCallback(() => {
      async function loadLanguage() {
        const currentLang = await getLanguage();
        const safeLang: Lang = ["de", "en", "hr", "sq", "tr"].includes(
          currentLang as Lang
        )
          ? (currentLang as Lang)
          : "de";

        setLang(safeLang);
      }

      loadLanguage();
    }, [])
  );

  const t = CONTENT[lang] || CONTENT.de;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 90, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        <Text style={styles.backText}>{t.back}</Text>
      </Pressable>

      <Text style={styles.pageTitle}>{t.pageTitle}</Text>

      <View style={styles.card}>
        <SectionTitle title={t.brandTitle} />
        <Text style={styles.highlight}>{t.brandSub}</Text>

        <TextLines lines={t.address} style={styles.textBlock} />
        <TextLines lines={t.contact} style={styles.textBlock} />
        <TextLines lines={t.owner} style={styles.textBlock} />
        <TextLines lines={t.court} style={styles.textBlock} />
        <TextLines lines={t.web} style={styles.textBlock} />
      </View>

      <View style={styles.card}>
        <SectionTitle title={t.sections.terms} />
        <TextLines lines={t.termsText} style={styles.paragraph} />
      </View>

      <View style={styles.card}>
        <SectionTitle title={t.sections.copyright} />
        <TextLines lines={t.copyrightText} style={styles.paragraph} />
      </View>

      <View style={styles.card}>
        <SectionTitle title={t.sections.warranty} />
        <TextLines lines={t.warrantyText} style={styles.paragraph} />
      </View>

      <View style={styles.card}>
        <SectionTitle title={t.sections.license} />
        <TextLines lines={t.licenseText} style={styles.paragraph} />
      </View>

      <View style={styles.card}>
        <SectionTitle title={t.sections.links} />
        <TextLines lines={t.linksText} style={styles.paragraph} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 4,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  highlight: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },
  textBlock: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 14,
  },
  paragraph: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});