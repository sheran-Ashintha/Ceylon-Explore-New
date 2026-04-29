import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { useChatRequestCount } from "../utils/chatRequests";
import { getLocalizedSiteCopy, SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./Home.css";

const TRANSLATIONS = {
  en: {
    nav: {
      destinations: "Destinations",
      shopping: "Stores",
      tours: "Tours",
      myBookings: "My Bookings",
      selectLanguage: "Select Language",
      greeting: "Hi",
      logout: "Logout",
      signIn: "Sign in",
      register: "Register",
    },
    hero: {
      welcome: "Welcome to",
      gateway: "your gateway to discovering the beauty, culture, and adventure of Sri Lanka",
      planTrip: "Journey Planner",
      imageLabel: "Go to hero image",
    },
    why: {
      title: "Why book with Ceylon Explore",
      supportKicker: "Customer support",
      supportTitle: "Real help, fast answers",
      supportBody: "Get quick assistance before, during, or after your trip with a dedicated help center.",
      callUs: "Call us:",
      rewardsKicker: "Earn rewards",
      rewardsTitle: "Collect perks as you go",
      rewardsBody: "Earn rewards on bookings and apply them toward your next Sri Lanka adventure.",
      reviewsKicker: "Millions of reviews",
      reviewsTitle: "Travel with confidence",
      reviewsBody: "Read millions of traveler reviews to choose experiences that match your style.",
      planKicker: "Plan your way",
      planTitle: "Build a trip that fits you",
      planBody: "Mix culture, nature, and beach time with flexible itineraries and transparent pricing.",
    },
    highlightsTitle: "Sri Lanka Highlights",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya at Sunrise",
      teaCountryViews: "Tea Country Views",
      southCoastBeaches: "South Coast Beaches",
      rainforestTrails: "Rainforest Trails",
    },
    footer: "(c) 2025 Ceylon Explore. All rights reserved.",
  },
  si: {
    nav: {
      destinations: "ගමනාන්ත",
      shopping: "සාප්පු සවාරි",
      tours: "සංචාර",
      myBookings: "මගේ වෙන්කිරීම්",
      selectLanguage: "භාෂාව තෝරන්න",
      greeting: "ආයුබෝවන්",
      logout: "ඉවත්වන්න",
      signIn: "පිවිසෙන්න",
      register: "ලියාපදිංචි වන්න",
    },
    hero: {
      welcome: "සාදරයෙන් පිළිගනිමු",
      gateway: "ශ්‍රී ලංකාවේ සුන්දරත්වය, සංස්කෘතිය සහ സാഹසය සොයා යාමට ඔබගේ දොරටුව",
      planTrip: "Trip Planner",
      imageLabel: "ප්‍රධාන රූපයට යන්න",
    },
    why: {
      title: "Ceylon Explore සමඟ වෙන්කරන්නේ ඇයි",
      supportKicker: "පාරිභෝගික සහාය",
      supportTitle: "සැබෑ සහාය, ඉක්මන් පිළිතුරු",
      supportBody: "ඔබගේ සංචාරයට පෙර, අතරතුර හෝ පසුව අපගේ සහාය මධ්‍යස්ථානයෙන් ඉක්මන් උපකාර ලබා ගන්න.",
      callUs: "අප අමතන්න:",
      rewardsKicker: "ප්‍රතිලාභ ලබාගන්න",
      rewardsTitle: "ගමන අතරතුර ප්‍රතිලාභ එකතු කරන්න",
      rewardsBody: "වෙන්කිරීම් වලින් ප්‍රතිලාභ ලබාගෙන ඔබගේ මීළඟ ශ්‍රී ලංකා සංචාරයට භාවිතා කරන්න.",
      reviewsKicker: "මිලියන ගණනක් සමාලෝචන",
      reviewsTitle: "විශ්වාසයෙන් සංචාරය කරන්න",
      reviewsBody: "ඔබගේ රුචියට ගැලපෙන අත්දැකීම් තෝරා ගැනීමට සංචාරක සමාලෝචන මිලියන ගණනක් කියවන්න.",
      planKicker: "ඔබේ අයුරින් සැලසුම් කරන්න",
      planTitle: "ඔබට ගැලපෙන සංචාරයක් ගොඩනඟන්න",
      planBody: "සංස්කෘතිය, ස්වභාවය සහ වෙරළ විවේකය නම්‍යශීලී ගමන් සැලසුම් සහ පැහැදිලි මිල ගණන් සමඟ මිශ්‍ර කරන්න.",
    },
    highlightsTitle: "ශ්‍රී ලංකාවේ විශේෂතා",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "උදෑසන සිගිරිය",
      teaCountryViews: "තේ දේශයේ දර්ශන",
      southCoastBeaches: "දකුණු වෙරළ තීරය",
      rainforestTrails: "වැසි වනාන්තර මංපෙත්",
    },
    footer: "© 2025 Ceylon Explore. සියලු හිමිකම් ඇවිරිණි.",
  },
  ta: {
    nav: {
      destinations: "இடங்கள்",
      shopping: "ஷாப்பிங்",
      tours: "சுற்றுலா",
      myBookings: "என் முன்பதிவுகள்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      greeting: "வணக்கம்",
      logout: "வெளியேறு",
      signIn: "உள்நுழைக",
      register: "பதிவு செய்க",
    },
    hero: {
      welcome: "வரவேற்கிறோம்",
      gateway: "இலங்கையின் அழகு, கலாசாரம் மற்றும் சாகசத்தை அறிய உங்கள் நுழைவாயில்",
      planTrip: "Trip Planner",
      imageLabel: "முக்கிய படத்திற்குச் செல்லவும்",
    },
    why: {
      title: "Ceylon Explore மூலம் ஏன் முன்பதிவு செய்ய வேண்டும்",
      supportKicker: "வாடிக்கையாளர் ஆதரவு",
      supportTitle: "உண்மையான உதவி, விரைவான பதில்கள்",
      supportBody: "உங்கள் பயணத்திற்கு முன், பயணத்தின் போது, அல்லது பின் எங்கள் உதவி மையத்திலிருந்து விரைவான உதவி பெறுங்கள்.",
      callUs: "எங்களை அழைக்கவும்:",
      rewardsKicker: "வெகுமதிகள் பெறுங்கள்",
      rewardsTitle: "பயணிக்கும் போதும் சலுகைகள் சேகரிக்கவும்",
      rewardsBody: "முன்பதிவுகளில் வெகுமதிகள் பெற்று, உங்கள் அடுத்த இலங்கை பயணத்திற்கு பயன்படுத்துங்கள்.",
      reviewsKicker: "மில்லியன் கணக்கான மதிப்புரைகள்",
      reviewsTitle: "நம்பிக்கையுடன் பயணிக்கவும்",
      reviewsBody: "உங்கள் விருப்பத்திற்கு பொருந்தும் அனுபவங்களைத் தேர்வு செய்ய பயணிகளின் மில்லியன் கணக்கான மதிப்புரைகளைப் படிக்கவும்.",
      planKicker: "உங்கள் முறையில் திட்டமிடுங்கள்",
      planTitle: "உங்களுக்கு ஏற்ற பயணத்தை உருவாக்குங்கள்",
      planBody: "கலாசாரம், இயற்கை, கடற்கரை ஓய்வு ஆகியவற்றை நெகிழ்வான திட்டங்கள் மற்றும் வெளிப்படையான விலைகளுடன் சேர்க்கவும்.",
    },
    highlightsTitle: "இலங்கை சிறப்பம்சங்கள்",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "சூரியோதயத்தில் சிகிரியா",
      teaCountryViews: "தேயிலை நாட்டின் காட்சிகள்",
      southCoastBeaches: "தெற்கு கடற்கரைகள்",
      rainforestTrails: "மழைக்காடு பாதைகள்",
    },
    footer: "© 2025 Ceylon Explore. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  hi: {
    nav: {
      destinations: "गंतव्य",
      shopping: "खरीदारी",
      tours: "टूर",
      myBookings: "मेरी बुकिंग",
      selectLanguage: "भाषा चुनें",
      greeting: "नमस्ते",
      logout: "लॉग आउट",
      signIn: "साइन इन",
      register: "रजिस्टर करें",
    },
    hero: {
      welcome: "स्वागत है",
      gateway: "श्रीलंका की सुंदरता, संस्कृति और रोमांच को खोजने के लिए आपका प्रवेश द्वार",
      planTrip: "Trip Planner",
      imageLabel: "हीरो छवि पर जाएँ",
    },
    why: {
      title: "Ceylon Explore के साथ बुक क्यों करें",
      supportKicker: "ग्राहक सहायता",
      supportTitle: "वास्तविक मदद, तेज जवाब",
      supportBody: "अपनी यात्रा से पहले, दौरान या बाद में हमारे समर्पित सहायता केंद्र से तुरंत सहायता पाएं।",
      callUs: "हमें कॉल करें:",
      rewardsKicker: "रिवॉर्ड कमाएँ",
      rewardsTitle: "यात्रा करते हुए लाभ पाएं",
      rewardsBody: "बुकिंग पर रिवॉर्ड कमाएँ और उन्हें अपनी अगली श्रीलंका यात्रा पर इस्तेमाल करें।",
      reviewsKicker: "लाखों समीक्षाएँ",
      reviewsTitle: "आत्मविश्वास से यात्रा करें",
      reviewsBody: "अपने अंदाज से मेल खाने वाले अनुभव चुनने के लिए यात्रियों की लाखों समीक्षाएँ पढ़ें।",
      planKicker: "अपने तरीके से योजना बनाएं",
      planTitle: "अपनी पसंद की यात्रा बनाएं",
      planBody: "संस्कृति, प्रकृति और बीच टाइम को लचीले कार्यक्रम और स्पष्ट कीमतों के साथ मिलाएँ।",
    },
    highlightsTitle: "श्रीलंका की झलकियाँ",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "सूर्योदय के समय सिगिरिया",
      teaCountryViews: "चाय देश के नज़ारे",
      southCoastBeaches: "दक्षिणी तट के बीच",
      rainforestTrails: "रेनफॉरेस्ट ट्रेल्स",
    },
    footer: "© 2025 Ceylon Explore. सर्वाधिकार सुरक्षित।",
  },
  zh: {
    nav: {
      destinations: "目的地",
      shopping: "购物",
      tours: "旅游",
      myBookings: "我的预订",
      selectLanguage: "选择语言",
      greeting: "您好",
      logout: "退出",
      signIn: "登录",
      register: "注册",
    },
    hero: {
      welcome: "欢迎来到",
      gateway: "探索斯里兰卡之美、文化与冒险的入口",
      planTrip: "Trip Planner",
      imageLabel: "转到主视觉图片",
    },
    why: {
      title: "为什么选择 Ceylon Explore",
      supportKicker: "客户支持",
      supportTitle: "真实帮助，快速回复",
      supportBody: "无论出发前、旅途中还是结束后，您都能从专属帮助中心获得及时支持。",
      callUs: "致电我们：",
      rewardsKicker: "赚取奖励",
      rewardsTitle: "边旅行边积累礼遇",
      rewardsBody: "通过预订获取奖励，并用于您的下一次斯里兰卡之旅。",
      reviewsKicker: "海量点评",
      reviewsTitle: "安心出行",
      reviewsBody: "阅读数百万旅客点评，挑选符合您风格的体验。",
      planKicker: "按您的方式规划",
      planTitle: "打造适合您的旅程",
      planBody: "用灵活行程和透明价格，把文化、自然与海滩时光结合起来。",
    },
    highlightsTitle: "斯里兰卡精选",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "日出中的狮子岩",
      teaCountryViews: "茶乡风光",
      southCoastBeaches: "南海岸海滩",
      rainforestTrails: "雨林步道",
    },
    footer: "© 2025 Ceylon Explore。保留所有权利。",
  },
  ja: {
    nav: {
      destinations: "目的地",
      shopping: "ショッピング",
      tours: "ツアー",
      myBookings: "予約一覧",
      selectLanguage: "言語を選択",
      greeting: "こんにちは",
      logout: "ログアウト",
      signIn: "ログイン",
      register: "登録",
    },
    hero: {
      welcome: "ようこそ",
      gateway: "スリランカの美しさ、文化、冒険を見つけるための入口へ",
      planTrip: "Trip Planner",
      imageLabel: "メイン画像へ移動",
    },
    why: {
      title: "Ceylon Explore で予約する理由",
      supportKicker: "カスタマーサポート",
      supportTitle: "本当に頼れる、素早いサポート",
      supportBody: "旅行前、旅行中、旅行後も専用サポートセンターからすぐにサポートを受けられます。",
      callUs: "お電話はこちら：",
      rewardsKicker: "特典を獲得",
      rewardsTitle: "旅するたびに特典がたまる",
      rewardsBody: "予約で特典を獲得し、次のスリランカ旅行に使えます。",
      reviewsKicker: "数百万件のレビュー",
      reviewsTitle: "安心して旅する",
      reviewsBody: "旅行者による数百万件のレビューを読んで、自分に合う体験を選べます。",
      planKicker: "自分らしく計画",
      planTitle: "あなたに合った旅を作る",
      planBody: "文化、自然、ビーチ時間を柔軟な旅程と明確な料金で組み合わせましょう。",
    },
    highlightsTitle: "スリランカの見どころ",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "朝焼けのシギリヤ",
      teaCountryViews: "紅茶の丘の眺め",
      southCoastBeaches: "南海岸のビーチ",
      rainforestTrails: "熱帯雨林トレイル",
    },
    footer: "© 2025 Ceylon Explore. All rights reserved.",
  },
  ko: {
    nav: {
      destinations: "여행지",
      shopping: "쇼핑",
      tours: "투어",
      myBookings: "내 예약",
      selectLanguage: "언어 선택",
      greeting: "안녕하세요",
      logout: "로그아웃",
      signIn: "로그인",
      register: "회원가입",
    },
    hero: {
      welcome: "환영합니다",
      gateway: "스리랑카의 아름다움, 문화, 모험을 발견하는 관문",
      planTrip: "Trip Planner",
      imageLabel: "메인 이미지로 이동",
    },
    why: {
      title: "Ceylon Explore로 예약해야 하는 이유",
      supportKicker: "고객 지원",
      supportTitle: "실질적인 도움, 빠른 답변",
      supportBody: "여행 전, 여행 중, 여행 후에도 전용 지원 센터를 통해 빠르게 도움을 받을 수 있습니다.",
      callUs: "전화 문의:",
      rewardsKicker: "리워드 적립",
      rewardsTitle: "여행할수록 혜택을 모으세요",
      rewardsBody: "예약으로 리워드를 적립하고 다음 스리랑카 여행에 사용하세요.",
      reviewsKicker: "수백만 개의 리뷰",
      reviewsTitle: "안심하고 여행하세요",
      reviewsBody: "여행자 리뷰 수백만 건을 읽고 나에게 맞는 경험을 선택하세요.",
      planKicker: "내 방식대로 계획",
      planTitle: "나에게 맞는 여행 만들기",
      planBody: "문화, 자연, 해변 시간을 유연한 일정과 투명한 가격으로 조합해 보세요.",
    },
    highlightsTitle: "스리랑카 하이라이트",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "시기리야의 일출",
      teaCountryViews: "차 산지 풍경",
      southCoastBeaches: "남부 해안 해변",
      rainforestTrails: "열대우림 트레일",
    },
    footer: "© 2025 Ceylon Explore. All rights reserved.",
  },
  fr: {
    nav: {
      destinations: "Destinations",
      shopping: "Stores",
      tours: "Circuits",
      myBookings: "Mes réservations",
      selectLanguage: "Choisir la langue",
      greeting: "Bonjour",
      logout: "Déconnexion",
      signIn: "Connexion",
      register: "Créer un compte",
    },
    hero: {
      welcome: "Bienvenue sur",
      gateway: "votre porte d'entrée pour découvrir la beauté, la culture et l'aventure du Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Aller à l'image principale",
    },
    why: {
      title: "Pourquoi réserver avec Ceylon Explore",
      supportKicker: "Service client",
      supportTitle: "Une vraie aide, des réponses rapides",
      supportBody: "Obtenez une assistance rapide avant, pendant ou après votre voyage grâce à un centre d'aide dédié.",
      callUs: "Appelez-nous :",
      rewardsKicker: "Cumulez des avantages",
      rewardsTitle: "Profitez de récompenses en voyageant",
      rewardsBody: "Gagnez des récompenses sur vos réservations et utilisez-les pour votre prochain voyage au Sri Lanka.",
      reviewsKicker: "Des millions d'avis",
      reviewsTitle: "Voyagez en toute confiance",
      reviewsBody: "Lisez des millions d'avis de voyageurs pour choisir des expériences qui vous ressemblent.",
      planKicker: "Planifiez à votre façon",
      planTitle: "Construisez un voyage qui vous correspond",
      planBody: "Mélangez culture, nature et plage avec des itinéraires flexibles et des prix transparents.",
    },
    highlightsTitle: "Les incontournables du Sri Lanka",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya au lever du soleil",
      teaCountryViews: "Panoramas du pays du thé",
      southCoastBeaches: "Plages de la côte sud",
      rainforestTrails: "Sentiers de forêt tropicale",
    },
    footer: "© 2025 Ceylon Explore. Tous droits réservés.",
  },
  de: {
    nav: {
      destinations: "Reiseziele",
      shopping: "Stores",
      tours: "Touren",
      myBookings: "Meine Buchungen",
      selectLanguage: "Sprache wählen",
      greeting: "Hallo",
      logout: "Abmelden",
      signIn: "Anmelden",
      register: "Registrieren",
    },
    hero: {
      welcome: "Willkommen bei",
      gateway: "Ihrem Zugang zu Schönheit, Kultur und Abenteuer in Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Zum Hero-Bild wechseln",
    },
    why: {
      title: "Warum mit Ceylon Explore buchen",
      supportKicker: "Kundensupport",
      supportTitle: "Echte Hilfe, schnelle Antworten",
      supportBody: "Erhalten Sie schnelle Unterstützung vor, während oder nach Ihrer Reise über ein engagiertes Hilfezentrum.",
      callUs: "Rufen Sie uns an:",
      rewardsKicker: "Prämien sammeln",
      rewardsTitle: "Vorteile auf jeder Reise sammeln",
      rewardsBody: "Sammeln Sie Prämien bei Buchungen und nutzen Sie diese für Ihr nächstes Sri-Lanka-Abenteuer.",
      reviewsKicker: "Millionen Bewertungen",
      reviewsTitle: "Mit Vertrauen reisen",
      reviewsBody: "Lesen Sie Millionen Reisebewertungen, um Erlebnisse zu wählen, die zu Ihrem Stil passen.",
      planKicker: "Planen Sie auf Ihre Art",
      planTitle: "Eine Reise, die zu Ihnen passt",
      planBody: "Verbinden Sie Kultur, Natur und Strandzeit mit flexiblen Routen und transparenten Preisen.",
    },
    highlightsTitle: "Sri Lanka Highlights",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya bei Sonnenaufgang",
      teaCountryViews: "Ausblicke ins Teeland",
      southCoastBeaches: "Strände der Südküste",
      rainforestTrails: "Regenwaldpfade",
    },
    footer: "© 2025 Ceylon Explore. Alle Rechte vorbehalten.",
  },
  es: {
    nav: {
      destinations: "Destinos",
      shopping: "Compras",
      tours: "Tours",
      myBookings: "Mis reservas",
      selectLanguage: "Seleccionar idioma",
      greeting: "Hola",
      logout: "Cerrar sesión",
      signIn: "Iniciar sesión",
      register: "Registrarse",
    },
    hero: {
      welcome: "Bienvenido a",
      gateway: "tu puerta de entrada para descubrir la belleza, la cultura y la aventura de Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Ir a la imagen principal",
    },
    why: {
      title: "Por qué reservar con Ceylon Explore",
      supportKicker: "Atención al cliente",
      supportTitle: "Ayuda real, respuestas rápidas",
      supportBody: "Recibe asistencia rápida antes, durante o después de tu viaje con un centro de ayuda dedicado.",
      callUs: "Llámanos:",
      rewardsKicker: "Gana recompensas",
      rewardsTitle: "Acumula ventajas mientras viajas",
      rewardsBody: "Gana recompensas con tus reservas y úsalas en tu próxima aventura por Sri Lanka.",
      reviewsKicker: "Millones de reseñas",
      reviewsTitle: "Viaja con confianza",
      reviewsBody: "Lee millones de reseñas de viajeros para elegir experiencias que se ajusten a tu estilo.",
      planKicker: "Planifica a tu manera",
      planTitle: "Construye un viaje hecho para ti",
      planBody: "Combina cultura, naturaleza y playa con itinerarios flexibles y precios transparentes.",
    },
    highlightsTitle: "Lo mejor de Sri Lanka",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya al amanecer",
      teaCountryViews: "Vistas del país del té",
      southCoastBeaches: "Playas de la costa sur",
      rainforestTrails: "Senderos de selva tropical",
    },
    footer: "© 2025 Ceylon Explore. Todos los derechos reservados.",
  },
  it: {
    nav: {
      destinations: "Destinazioni",
      shopping: "Stores",
      tours: "Tour",
      myBookings: "Le mie prenotazioni",
      selectLanguage: "Seleziona lingua",
      greeting: "Ciao",
      logout: "Esci",
      signIn: "Accedi",
      register: "Registrati",
    },
    hero: {
      welcome: "Benvenuto su",
      gateway: "la tua porta d'accesso per scoprire la bellezza, la cultura e l'avventura dello Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Vai all'immagine principale",
    },
    why: {
      title: "Perché prenotare con Ceylon Explore",
      supportKicker: "Assistenza clienti",
      supportTitle: "Aiuto reale, risposte rapide",
      supportBody: "Ottieni assistenza rapida prima, durante o dopo il viaggio grazie a un centro assistenza dedicato.",
      callUs: "Chiamaci:",
      rewardsKicker: "Guadagna premi",
      rewardsTitle: "Accumula vantaggi mentre viaggi",
      rewardsBody: "Guadagna premi con le prenotazioni e usali per la tua prossima avventura in Sri Lanka.",
      reviewsKicker: "Milioni di recensioni",
      reviewsTitle: "Viaggia con fiducia",
      reviewsBody: "Leggi milioni di recensioni di viaggiatori per scegliere esperienze che si adattano al tuo stile.",
      planKicker: "Pianifica a modo tuo",
      planTitle: "Crea un viaggio su misura per te",
      planBody: "Unisci cultura, natura e mare con itinerari flessibili e prezzi trasparenti.",
    },
    highlightsTitle: "I punti forti dello Sri Lanka",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya all'alba",
      teaCountryViews: "Panorami del paese del tè",
      southCoastBeaches: "Spiagge della costa sud",
      rainforestTrails: "Sentieri della foresta pluviale",
    },
    footer: "© 2025 Ceylon Explore. Tutti i diritti riservati.",
  },
  pt: {
    nav: {
      destinations: "Destinos",
      shopping: "Compras",
      tours: "Tours",
      myBookings: "Minhas reservas",
      selectLanguage: "Selecionar idioma",
      greeting: "Olá",
      logout: "Sair",
      signIn: "Entrar",
      register: "Registrar-se",
    },
    hero: {
      welcome: "Bem-vindo ao",
      gateway: "seu portal para descobrir a beleza, a cultura e a aventura do Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Ir para a imagem principal",
    },
    why: {
      title: "Por que reservar com a Ceylon Explore",
      supportKicker: "Atendimento ao cliente",
      supportTitle: "Ajuda real, respostas rápidas",
      supportBody: "Receba assistência rápida antes, durante ou depois da sua viagem com uma central de ajuda dedicada.",
      callUs: "Ligue para nós:",
      rewardsKicker: "Ganhe recompensas",
      rewardsTitle: "Acumule vantagens enquanto viaja",
      rewardsBody: "Ganhe recompensas em reservas e use-as na sua próxima aventura pelo Sri Lanka.",
      reviewsKicker: "Milhões de avaliações",
      reviewsTitle: "Viaje com confiança",
      reviewsBody: "Leia milhões de avaliações de viajantes para escolher experiências que combinem com seu estilo.",
      planKicker: "Planeje do seu jeito",
      planTitle: "Monte uma viagem que combine com você",
      planBody: "Combine cultura, natureza e praia com roteiros flexíveis e preços transparentes.",
    },
    highlightsTitle: "Destaques do Sri Lanka",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya ao nascer do sol",
      teaCountryViews: "Vistas da região do chá",
      southCoastBeaches: "Praias da costa sul",
      rainforestTrails: "Trilhas da floresta tropical",
    },
    footer: "© 2025 Ceylon Explore. Todos os direitos reservados.",
  },
  ar: {
    nav: {
      destinations: "الوجهات",
      shopping: "التسوق",
      tours: "الجولات",
      myBookings: "حجوزاتي",
      selectLanguage: "اختر اللغة",
      greeting: "مرحبًا",
      logout: "تسجيل الخروج",
      signIn: "تسجيل الدخول",
      register: "إنشاء حساب",
    },
    hero: {
      welcome: "مرحبًا بكم في",
      gateway: "بوابتك لاكتشاف جمال سريلانكا وثقافتها ومغامراتها",
      planTrip: "Trip Planner",
      imageLabel: "انتقل إلى الصورة الرئيسية",
    },
    why: {
      title: "لماذا تحجز مع Ceylon Explore",
      supportKicker: "دعم العملاء",
      supportTitle: "مساعدة حقيقية وإجابات سريعة",
      supportBody: "احصل على دعم سريع قبل رحلتك أو أثناءها أو بعدها من خلال مركز مساعدة مخصص.",
      callUs: "اتصل بنا:",
      rewardsKicker: "اكسب المكافآت",
      rewardsTitle: "اجمع المزايا أثناء السفر",
      rewardsBody: "اكسب مكافآت على الحجوزات واستخدمها في مغامرتك القادمة في سريلانكا.",
      reviewsKicker: "ملايين المراجعات",
      reviewsTitle: "سافر بثقة",
      reviewsBody: "اقرأ ملايين مراجعات المسافرين لاختيار التجارب التي تناسب أسلوبك.",
      planKicker: "خطط بطريقتك",
      planTitle: "ابنِ رحلة تناسبك",
      planBody: "اجمع بين الثقافة والطبيعة وأوقات الشاطئ مع مسارات مرنة وأسعار واضحة.",
    },
    highlightsTitle: "أبرز معالم سريلانكا",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "سيجيريا عند الشروق",
      teaCountryViews: "إطلالات بلاد الشاي",
      southCoastBeaches: "شواطئ الساحل الجنوبي",
      rainforestTrails: "مسارات الغابات المطيرة",
    },
    footer: "© 2025 Ceylon Explore. جميع الحقوق محفوظة.",
  },
  ru: {
    nav: {
      destinations: "Направления",
      shopping: "Шопинг",
      tours: "Туры",
      myBookings: "Мои бронирования",
      selectLanguage: "Выберите язык",
      greeting: "Здравствуйте",
      logout: "Выйти",
      signIn: "Войти",
      register: "Регистрация",
    },
    hero: {
      welcome: "Добро пожаловать в",
      gateway: "ваши ворота к красоте, культуре и приключениям Шри-Ланки",
      planTrip: "Trip Planner",
      imageLabel: "Перейти к главному изображению",
    },
    why: {
      title: "Почему стоит бронировать с Ceylon Explore",
      supportKicker: "Поддержка клиентов",
      supportTitle: "Реальная помощь и быстрые ответы",
      supportBody: "Получайте быструю помощь до поездки, во время путешествия и после него через специальный центр поддержки.",
      callUs: "Позвоните нам:",
      rewardsKicker: "Получайте бонусы",
      rewardsTitle: "Копите преимущества во время путешествий",
      rewardsBody: "Получайте бонусы за бронирования и используйте их в следующем путешествии по Шри-Ланке.",
      reviewsKicker: "Миллионы отзывов",
      reviewsTitle: "Путешествуйте уверенно",
      reviewsBody: "Читайте миллионы отзывов путешественников и выбирайте впечатления по своему вкусу.",
      planKicker: "Планируйте по-своему",
      planTitle: "Создайте поездку, которая подходит именно вам",
      planBody: "Сочетайте культуру, природу и пляжный отдых с гибкими маршрутами и прозрачными ценами.",
    },
    highlightsTitle: "Главные впечатления Шри-Ланки",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Сигирия на рассвете",
      teaCountryViews: "Пейзажи чайной страны",
      southCoastBeaches: "Пляжи южного побережья",
      rainforestTrails: "Тропы дождевого леса",
    },
    footer: "© 2025 Ceylon Explore. Все права защищены.",
  },
  nl: {
    nav: {
      destinations: "Bestemmingen",
      shopping: "Winkelen",
      tours: "Tours",
      myBookings: "Mijn boekingen",
      selectLanguage: "Taal kiezen",
      greeting: "Hallo",
      logout: "Uitloggen",
      signIn: "Inloggen",
      register: "Registreren",
    },
    hero: {
      welcome: "Welkom bij",
      gateway: "jouw toegangspoort tot de schoonheid, cultuur en het avontuur van Sri Lanka",
      planTrip: "Trip Planner",
      imageLabel: "Ga naar de hoofdafbeelding",
    },
    why: {
      title: "Waarom boeken met Ceylon Explore",
      supportKicker: "Klantenservice",
      supportTitle: "Echte hulp, snelle antwoorden",
      supportBody: "Krijg snelle ondersteuning voor, tijdens of na je reis via een speciaal helpcentrum.",
      callUs: "Bel ons:",
      rewardsKicker: "Verdien beloningen",
      rewardsTitle: "Verzamel voordelen terwijl je reist",
      rewardsBody: "Verdien beloningen op boekingen en gebruik ze voor je volgende Sri Lanka-avontuur.",
      reviewsKicker: "Miljoenen reviews",
      reviewsTitle: "Reis met vertrouwen",
      reviewsBody: "Lees miljoenen reizigersreviews om ervaringen te kiezen die bij jouw stijl passen.",
      planKicker: "Plan op jouw manier",
      planTitle: "Bouw een reis die bij je past",
      planBody: "Combineer cultuur, natuur en strandtijd met flexibele routes en transparante prijzen.",
    },
    highlightsTitle: "Hoogtepunten van Sri Lanka",
    slideLabel: "Ceylon Explore",
    slides: {
      sigiriyaSunrise: "Sigiriya bij zonsopgang",
      teaCountryViews: "Uitzichten over het theeland",
      southCoastBeaches: "Stranden aan de zuidkust",
      rainforestTrails: "Regenwoudpaden",
    },
    footer: "© 2025 Ceylon Explore. Alle rechten voorbehouden.",
  },
};

const HIGHLIGHT_SLIDES = [
  {
    key: "sigiriyaSunrise",
    image: "/slides/sigiriya-sunrise.jpg",
  },
  {
    key: "teaCountryViews",
    image: "/slides/tea-country.jpg",
  },
  {
    key: "southCoastBeaches",
    image: "https://asiajourney.org/wp-content/uploads/2025/02/serene-beaches-Sri-Lanka.png",
  },
  {
    key: "rainforestTrails",
    image: "https://trekkingtripsinsrilanka.com/img/pekoe-trail.jpg",
  },
];

const HERO_VIDEO_URL = "/videos/home-hero.mp4";


export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const copy = getLocalizedSiteCopy(TRANSLATIONS, language);

  const languageSelector = (
    <div className="hp-lang">
      <span className="hp-lang-label">{copy.nav.selectLanguage}</span>
      <select
        aria-label={copy.nav.selectLanguage}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HIGHLIGHT_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goToTripPlanner = () => navigate(user ? "/plan-trip" : "/login");

  const handleBackgroundMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty("--cursor-x", `${x}%`);
    target.style.setProperty("--cursor-y", `${y}%`);
  };

  return (
    <div className="hp" onMouseMove={handleBackgroundMouseMove}>
      {/* -- Navbar -- */}
      <header className="hp-nav">
        <div className="hp-nav-left">
          <Link to="/" className="hp-brand">
            Ceylon Explore
          </Link>
        </div>
        <nav className="hp-nav-right">
          <Link to="/" className="hp-nav-link">
            {copy.nav.home || "Home"}
          </Link>
          <Link to={user ? "/destinations" : "/login"} className="hp-nav-link">
            {copy.nav.destinations}
          </Link>
          <Link to="/shopping" className="hp-nav-link">
            {copy.nav.shopping}
          </Link>
          <Link to="/tours" className="hp-nav-link">
            {copy.nav.tours}
          </Link>
          <Link to={user ? "/chat" : "/login"} className="hp-nav-link">
            {copy.nav.chat || "Chat"}
            <ChatRequestBadge count={chatRequestCount} />
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="hp-nav-link">
                {copy.nav.myBookings}
              </Link>
              {languageSelector}
              <span className="hp-nav-name">{copy.nav.greeting}, {user.name}</span>
              <button
                className="hp-btn-ghost"
                onClick={logout}
              >
                {copy.nav.logout}
              </button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="hp-btn-ghost">
                {copy.nav.signIn}
              </Link>
              <Link to="/register" className="hp-btn-solid">
                {copy.nav.register}
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* -- Hero -- */}
      <section className="hp-hero">
        <video
          className="hp-hero-video"
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hp-hero-overlay" aria-hidden="true" />
        <div className="hp-hero-body">
          <h1 className="hp-hero-title">
            {copy.hero.welcome}
            <span className="hp-hero-title-brand"> Ceylon Explore</span>
            <br />
            {copy.hero.gateway}
          </h1>

          <div className="hp-hero-cta">
            <button
              type="button"
              className="hp-btn-ghost hp-cta"
              onClick={goToTripPlanner}
            >
              {copy.hero.planTrip}
            </button>
          </div>
        </div>
      </section>

      {/* -- Why book with Ceylon Explore -- */}
      <section className="hp-section hp-section-why" id="why-ceylon-explore">
        <div className="hp-section-head">
          <h2 className="hp-section-title">{copy.why.title}</h2>
        </div>
        <div className="hp-why-grid">
          <article className="hp-why-card">
            <p className="hp-why-kicker">{copy.why.supportKicker}</p>
            <span className="hp-why-icon hp-why-icon-support" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.2 2.3 3.1 4.2 5.4 5.4l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.9 21 3 14.1 3 5c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2 1.9z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h3>{copy.why.supportTitle}</h3>
            <p>
              {copy.why.supportBody}
            </p>
            <p>
              {copy.why.callUs}{" "}
              <a className="hp-why-phone" href="tel:+94112345678">
                +94 11 234 5678
              </a>
            </p>
          </article>
          <article className="hp-why-card">
            <p className="hp-why-kicker">{copy.why.rewardsKicker}</p>
            <span className="hp-why-icon hp-why-icon-rewards" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path
                  d="M5 7h14a2 2 0 0 1 2 2v2a3 3 0 0 1-3 3h-1v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3H6a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2zm2 7v3h10v-3H7zm11-2a1 1 0 0 0 1-1V9H5v2a1 1 0 0 0 1 1h12z"
                  fill="currentColor"
                />
                <path
                  d="M9.3 4.6a2 2 0 1 1 2.8 2.8L11 8.5l-1.1-1.1a2 2 0 0 1-.6-2.8zm4.8 0a2 2 0 0 1 2.8 2.8L15.8 8.5 14.7 7.4a2 2 0 0 1-.6-2.8z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h3>{copy.why.rewardsTitle}</h3>
            <p>
              {copy.why.rewardsBody}
            </p>
          </article>
          <article className="hp-why-card">
            <p className="hp-why-kicker">{copy.why.reviewsKicker}</p>
            <span className="hp-why-icon hp-why-icon-reviews" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path
                  d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.6 6.6 20l1-6.1L3.2 9.4l6.1-.9L12 3z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h3>{copy.why.reviewsTitle}</h3>
            <p>
              {copy.why.reviewsBody}
            </p>
          </article>
          <article className="hp-why-card hp-why-card-cta">
            <p className="hp-why-kicker">{copy.why.planKicker}</p>
            <span className="hp-why-icon hp-why-icon-plan" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path
                  d="M7 3a1 1 0 0 1 1 1v1h8V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1zm12 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h3>{copy.why.planTitle}</h3>
            <p>
              {copy.why.planBody}
            </p>
          </article>
        </div>
      </section>

      {/* -- Slideshow (moved down) -- */}
      <section className="hp-section hp-section-highlights">
        <div className="hp-section-head">
          <h2 className="hp-section-title hp-highlight-title">
            {copy.highlightsTitle}
          </h2>
        </div>
        <div className="hp-slideshow" aria-live="polite">
          {HIGHLIGHT_SLIDES.map((slide, i) => {
            const slideTitle = copy.slides[slide.key];

            return (
            <div
              key={slide.key}
              className={`hp-slide ${i === currentSlide ? "is-active" : ""}`}
              aria-hidden={i !== currentSlide}
            >
              <img
                className="hp-slide-image"
                src={slide.image}
                alt={slideTitle}
                loading="lazy"
              />
              <div className="hp-slide-overlay" />
              <div className="hp-slide-content">
                <p className="hp-slide-label">{copy.slideLabel}</p>
                <h3>{slideTitle}</h3>
              </div>
            </div>
            );
          })}
          {/* dots removed as requested */}
        </div>
      </section>

      {/* -- Footer -- */}
      <footer className="hp-footer">
        <span className="hp-brand">Ceylon Explore</span>
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}