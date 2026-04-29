import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { createBooking, getPackageBySlug } from "../services/api";
import { useChatRequestCount } from "../utils/chatRequests";
import { getPackageGalleryImages } from "../utils/placeImages";
import { getLocalizedSiteCopy, SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./DestinationDetail.css";

const CATEGORY_SUMMARIES = {
  Beach: "This package is built for travelers who want long beach hours, easy coastal dining, and a relaxed sea-facing base.",
  Culture: "This route leans into Sri Lanka's heritage layer with temples, monuments, old city streets, and time to explore the story behind each site.",
  Nature: "Expect scenic drives, cooler air, open viewpoints, and a slower rhythm shaped around landscapes rather than tight schedules.",
  Wildlife: "The experience focuses on the best safari windows, habitat variety, and enough flexibility to keep the wildlife moments feeling unhurried.",
  Wellness: "The pace is intentionally soft, leaving room for rest, spa time, mindful routines, and scenic moments that feel restorative.",
  Holiday: "This package balances variety and comfort, making it a strong fit for travelers who want a polished multi-stop island break.",
};

const CATEGORY_HIGHLIGHTS = {
  Beach: ["Handpicked beach base", "Sunset downtime", "Seafood and coastal cafes", "Flexible free time by the water"],
  Culture: ["UNESCO and heritage stops", "Historic walking routes", "Temple and monument access", "Local food and craft moments"],
  Nature: ["Viewpoints and scenic trails", "Waterfalls or forest edges", "Cool-climate stays", "Slow travel pacing"],
  Wildlife: ["Strong safari timing", "Best habitat windows", "Nature-led travel days", "Photo-friendly landscapes"],
  Wellness: ["Rest-first itinerary", "Spa or therapy focus", "Quiet scenic settings", "Gentle daily rhythm"],
  Holiday: ["Balanced multi-stop route", "Family-friendly flow", "Mix of sights and downtime", "Easy island holiday planning"],
};

const CATEGORY_TRAVEL_STYLE = {
  Beach: "Coastal leisure",
  Culture: "Heritage discovery",
  Nature: "Scenic escape",
  Wildlife: "Safari adventure",
  Wellness: "Restorative retreat",
  Holiday: "Classic island break",
};

const PACKAGE_RATING = 4.4;

const PACKAGE_DETAIL_COPY = {
  en: {
    nav: {
      home: "Home",
      destinations: "Destinations",
      shopping: "Stores",
      tours: "Tours",
      chat: "Chat",
      myBookings: "My Bookings",
      selectLanguage: "Select Language",
      greeting: "Hi",
      logout: "Logout",
      signIn: "Sign in",
    },
    states: {
      loading: "Loading package...",
    },
    rating: {
      excellent: "Excellent",
      veryGood: "Very Good",
      good: "Good",
    },
    categories: {
      Beach: "Beach",
      Culture: "Culture",
      Nature: "Nature",
      Wildlife: "Wildlife",
      Wellness: "Wellness",
      Holiday: "Holiday",
    },
    travelStyles: CATEGORY_TRAVEL_STYLE,
    summaries: CATEGORY_SUMMARIES,
    highlights: CATEGORY_HIGHLIGHTS,
    detail: {
      packageLocation: "Sri Lanka curated package",
      aboutTitle: "About this package",
      expectTitle: "What to expect",
      planningTitle: "Planning note",
      planningBody: "These package pages are inspiration-first. Once you find a route you like, head back to the destinations list to choose the stay that best matches your dates, budget, and travel style.",
      bookingConfirmed: "Booking Confirmed!",
      bookingReserved: "Your trip for {title} has been reserved.",
      viewMyBookings: "View My Bookings",
      bookAgain: "Book Again",
      perPackage: " / package",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      packageGuideRate: "Package guide rate",
      perDay: " / day",
      travelDates: "Travel dates",
      nightSingular: "night",
      nightPlural: "nights",
      estimatedTotal: "Estimated total",
      reservePackage: "Reserve Package",
      backToPackages: "Back to Packages",
      bookingNote: "Book with your dates and guest count, just like the regular destination booking flow.",
      galleryView: "view",
    },
    errors: {
      bookingFailed: "Booking failed. Please try again.",
    },
  },
  si: {
    nav: {
      home: "මුල් පිටුව",
      destinations: "ගමනාන්ත",
      myBookings: "මගේ වෙන්කිරීම්",
      selectLanguage: "භාෂාව තෝරන්න",
      greeting: "ආයුබෝවන්",
      logout: "ඉවත්වන්න",
      signIn: "පිවිසෙන්න",
    },
    states: {
      loading: "පැකේජය පූරණය වෙමින්...",
    },
    rating: {
      excellent: "විශිෂ්ටයි",
      veryGood: "ඉතා හොඳයි",
      good: "හොඳයි",
    },
    categories: {
      Beach: "වෙරළ",
      Culture: "සංස්කෘතික",
      Nature: "ස්වභාවය",
      Wildlife: "වනජීවී",
      Wellness: "සුවතාව",
      Holiday: "නිවාඩු",
    },
    travelStyles: {
      Beach: "වෙරළ විවේකය",
      Culture: "උරුම සොයාගැනීම",
      Nature: "දර්ශනීය විවේකය",
      Wildlife: "සෆාරි වික්‍රමය",
      Wellness: "සුවදායී විවේකය",
      Holiday: "සම්භාව්‍ය දූපත් නිවාඩුව",
    },
    summaries: {
      Beach: "දිගු වෙරළ වේලාවන්, පහසු වෙරළබඩ ආහාර සහ මුහුදු මුහුණත විවේකයක් කැමති සංචාරකයින් සඳහා මෙම පැකේජය ගොඩනගා ඇත.",
      Culture: "මෙම මාර්ගය ශ්‍රී ලංකාවේ උරුම තට්ටුව වෙත යොමු වන අතර විහාර, ස්මාරක සහ පැරණි නගර වීදි සමඟ ඒවායේ කතාව ගවේෂණය කිරීමට කාලය ලබා දෙයි.",
      Nature: "දර්ශනීය ධාවන, සිසිල් වාතය, විවෘත දර්ශන සහ තද කාලසටහන්වලට වඩා භූ දර්ශන මත පදනම් වූ මන්දගාමී රිද්මයක් අපේක්ෂා කරන්න.",
      Wildlife: "මෙම අත්දැකීම හොඳම සෆාරි වේලාවන්, වාසස්ථාන විවිධත්වය සහ වනජීවී මොහොතන් සැහැල්ලුවෙන් දැනෙන ලෙස නම්‍යශීලී බවක් ලබා දෙයි.",
      Wellness: "විවේකය, ස්පා කාලය, සිත සංයම සහ ප්‍රතිසාධනීය දර්ශන සඳහා ඉඩක් තබමින් ගමන මෘදු ලෙස සැලසුම් කර ඇත.",
      Holiday: "මෙම පැකේජය විවිධත්වය සහ සුවපහසුව සමතුලිත කරමින් උසස් තත්ත්වයේ දූපත් නිවාඩුවක් සොයන අයට හොඳ තේරීමකි.",
    },
    highlights: {
      Beach: ["තෝරාගත් වෙරළ නවාතැන", "හිරු බැස යන විවේකය", "මුහුදු ආහාර සහ වෙරළබඩ කෑම", "ජලය අසල නිදහස් කාලය"],
      Culture: ["UNESCO සහ උරුම ස්ථාන", "ඓතිහාසික ඇවිදීම", "විහාර සහ ස්මාරක පිවිසුම්", "දේශීය ආහාර සහ හස්ත කලා අත්දැකීම්"],
      Nature: ["දර්ශනීය ස්ථාන සහ මංපෙත්", "දිය ඇලි හෝ වනාන්තර අසබඩ", "සිසිල් දේශගුණ නවාතැන්", "මන්දගාමී සංචාර රිද්මය"],
      Wildlife: ["හොඳ සෆාරි වේලාවන්", "හොඳම වාසස්ථාන මොහොත", "ස්වභාවය මූලික ගමන්", "ඡායාරූප හිතකාමී භූ දර්ශන"],
      Wellness: ["විවේකය මූලික සැලසුම", "ස්පා හෝ ප්‍රතිකාර අවධානය", "නිහඬ දර්ශනීය පරිසර", "මෘදු දෛනික රිද්මය"],
      Holiday: ["සමබර බහු-නැවතුම් මාර්ගය", "පවුල් හිතකාමී ගමන් රටාව", "දර්ශන සහ විවේකයේ මිශ්‍රණය", "පහසු දූපත් නිවාඩු සැලසුම්"],
    },
    detail: {
      packageLocation: "ශ්‍රී ලංකා තෝරාගත් පැකේජය",
      aboutTitle: "මෙම පැකේජය ගැන",
      expectTitle: "අපේක්ෂා කළ හැකි දේ",
      planningTitle: "සැලසුම් සටහන",
      planningBody: "මෙම පැකේජ පිටු ආශ්වාදය මූලික කරගෙන නිර්මාණය කර ඇත. ඔබ කැමති මාර්ගයක් සොයාගත් පසු, ඔබගේ දිනයන්, අයවැය සහ ගමන් රටාවට ගැලපෙන නවාතැන තෝරා ගැනීමට ගමනාන්ත ලැයිස්තුවට ආපසු යන්න.",
      bookingConfirmed: "වෙන්කිරීම තහවුරු විය!",
      bookingReserved: "{title} සඳහා ඔබගේ සංචාරය වෙන් කර ඇත.",
      viewMyBookings: "මගේ වෙන්කිරීම් බලන්න",
      bookAgain: "නැවත වෙන්කරන්න",
      perPackage: " / පැකේජය",
      checkIn: "පැමිණීම",
      checkOut: "පිටවීම",
      guests: "අමුත්තන්",
      packageGuideRate: "පැකේජ මාර්ගෝපදේශ මිල",
      perDay: " / දිනකට",
      travelDates: "ගමන් දිනයන්",
      nightSingular: "රාත්‍රිය",
      nightPlural: "රාත්‍රි",
      estimatedTotal: "ඇස්තමේන්තුගත එකතුව",
      reservePackage: "පැකේජය වෙන්කරන්න",
      backToPackages: "පැකේජ වෙත ආපසු",
      bookingNote: "සාමාන්‍ය ගමනාන්ත වෙන් කිරීමේ ක්‍රියාවලිය මෙන් ඔබගේ දිනයන් සහ අමුත්තන් ගණන සමඟ වෙන්කරන්න.",
      galleryView: "දසුන",
    },
    errors: {
      bookingFailed: "වෙන්කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.",
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      destinations: "இடங்கள்",
      myBookings: "என் முன்பதிவுகள்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      greeting: "வணக்கம்",
      logout: "வெளியேறு",
      signIn: "உள்நுழைக",
    },
    states: {
      loading: "தொகுப்பு ஏற்றப்படுகிறது...",
    },
    rating: {
      excellent: "சிறப்பு",
      veryGood: "மிகவும் நல்லது",
      good: "நல்லது",
    },
    categories: {
      Beach: "கடற்கரை",
      Culture: "கலாசாரம்",
      Nature: "இயற்கை",
      Wildlife: "வனவிலங்கு",
      Wellness: "நலன்",
      Holiday: "விடுமுறை",
    },
    travelStyles: {
      Beach: "கடற்கரை ஓய்வு",
      Culture: "பாரம்பரிய ஆராய்ச்சி",
      Nature: "இயற்கை ஓய்வு",
      Wildlife: "சஃபாரி சாகசம்",
      Wellness: "மீளுருவாக்க ஓய்வு",
      Holiday: "பாரம்பரிய தீவு விடுமுறை",
    },
    summaries: {
      Beach: "நீண்ட கடற்கரை நேரம், எளிய கடற்கரை உணவகங்கள் மற்றும் அமைதியான கடல் நோக்கிய தங்குமிடம் விரும்பும் பயணிகளுக்காக இந்த தொகுப்பு அமைக்கப்பட்டுள்ளது.",
      Culture: "இந்த பாதை இலங்கையின் பாரம்பரிய அடுக்குகளை, கோவில்கள், நினைவுச்சின்னங்கள் மற்றும் பழைய நகர வீதிகளுடன் அவற்றின் கதையை அறிய நேரமளிக்கிறது.",
      Nature: "அழகிய பயணங்கள், குளிர்ந்த காற்று, திறந்த காட்சிகள் மற்றும் இறுக்கமான அட்டவணையை விட நிலக்காட்சியை மையப்படுத்திய மெதுவான ஓட்டத்தை எதிர்பார்க்கலாம்.",
      Wildlife: "சிறந்த சஃபாரி நேரங்கள், வாழிடம் மாறுபாடுகள் மற்றும் வனவிலங்கு தருணங்கள் சிரமமில்லாமல் அமைய போதிய நெகிழ்வுத்தன்மையை இந்த அனுபவம் வழங்குகிறது.",
      Wellness: "ஓய்வு, ஸ்பா நேரம், மனஅமைதி வழக்கங்கள் மற்றும் புதுப்பிக்கும் காட்சிகளுக்கு இடமளிக்கும் மென்மையான ஓட்டமாக இது திட்டமிடப்பட்டுள்ளது.",
      Holiday: "பல இடங்கள் கொண்ட தீவு விடுமுறையை சீரான வசதியுடன் நாடுபவர்களுக்கு இந்த தொகுப்பு வலுவான தேர்வாக அமைகிறது.",
    },
    highlights: {
      Beach: ["தேர்ந்தெடுக்கப்பட்ட கடற்கரை தங்குமிடம்", "சூரிய அஸ்தமன ஓய்வு", "கடல் உணவு மற்றும் கடற்கரை கஃபேக்கள்", "நீரோர சுதந்திர நேரம்"],
      Culture: ["யுனெஸ்கோ மற்றும் பாரம்பரிய இடங்கள்", "வரலாற்று நடைபாதைகள்", "கோவில் மற்றும் நினைவுச் சின்ன அணுகல்", "உள்ளூர் உணவு மற்றும் கைவினை அனுபவங்கள்"],
      Nature: ["காட்சி புள்ளிகள் மற்றும் நடைபாதைகள்", "அருவிகள் அல்லது காட்டு எல்லைகள்", "குளிரான காலநிலை தங்கும் இடங்கள்", "மெதுவான பயண ஓட்டம்"],
      Wildlife: ["சிறந்த சஃபாரி நேரம்", "சிறந்த வாழிடம் தருணங்கள்", "இயற்கை மைய பயண நாட்கள்", "புகைப்படத்திற்கு ஏற்ற நிலக்காட்சிகள்"],
      Wellness: ["ஓய்வு முதன்மை திட்டம்", "ஸ்பா அல்லது சிகிச்சை கவனம்", "அமைதியான காட்சிச் சூழல்", "மென்மையான தினசரி ஓட்டம்"],
      Holiday: ["சமநிலையான பல இட பயணம்", "குடும்ப நட்பு ஓட்டம்", "காட்சிகளும் ஓய்வும் கலந்த திட்டம்", "எளிய தீவு விடுமுறை திட்டமிடல்"],
    },
    detail: {
      packageLocation: "இலங்கை சிறப்பு தொகுப்பு",
      aboutTitle: "இந்த தொகுப்பைப் பற்றி",
      expectTitle: "எதை எதிர்பார்க்கலாம்",
      planningTitle: "திட்ட குறிப்புகள்",
      planningBody: "இந்த தொகுப்பு பக்கங்கள் முதலில் ஊக்கமளிப்பதற்காக உருவாக்கப்பட்டவை. நீங்கள் விரும்பும் பாதையை கண்டவுடன், உங்கள் தேதிகள், செலவு மற்றும் பயண முறைமைக்கு ஏற்ற தங்குமிடத்தைத் தேர்வு செய்ய இடங்களின் பட்டியலுக்கு திரும்புங்கள்.",
      bookingConfirmed: "முன்பதிவு உறுதிப்படுத்தப்பட்டது!",
      bookingReserved: "{title} க்கான உங்கள் பயணம் முன்பதிவு செய்யப்பட்டுள்ளது.",
      viewMyBookings: "என் முன்பதிவுகளைப் பார்க்கவும்",
      bookAgain: "மீண்டும் முன்பதிவு செய்க",
      perPackage: " / தொகுப்பு",
      checkIn: "செக்-இன்",
      checkOut: "செக்-அவுட்",
      guests: "விருந்தினர்கள்",
      packageGuideRate: "தொகுப்பு வழிகாட்டி விலை",
      perDay: " / நாள்",
      travelDates: "பயண தேதிகள்",
      nightSingular: "இரவு",
      nightPlural: "இரவுகள்",
      estimatedTotal: "மதிப்பிடப்பட்ட மொத்தம்",
      reservePackage: "தொகுப்பை முன்பதிவு செய்க",
      backToPackages: "தொகுப்புகளுக்கு திரும்பு",
      bookingNote: "வழக்கமான இட முன்பதிவு நடைமுறையைப் போலவே உங்கள் தேதிகளும் விருந்தினர் எண்ணிக்கையும் கொண்டு முன்பதிவு செய்யுங்கள்.",
      galleryView: "காட்சி",
    },
    errors: {
      bookingFailed: "முன்பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
    },
  },
};

Object.assign(PACKAGE_DETAIL_COPY, {
  hi: {
    nav: { home: "होम", destinations: "गंतव्य", myBookings: "मेरी बुकिंग", selectLanguage: "भाषा चुनें", greeting: "नमस्ते", logout: "लॉग आउट", signIn: "साइन इन" },
    states: { loading: "पैकेज लोड हो रहा है..." },
    rating: { excellent: "उत्कृष्ट", veryGood: "बहुत अच्छा", good: "अच्छा" },
    categories: { Beach: "समुद्र तट", Culture: "संस्कृति", Nature: "प्रकृति", Wildlife: "वन्यजीवन", Wellness: "वेलनेस", Holiday: "अवकाश" },
    travelStyles: { Beach: "तटीय अवकाश", Culture: "विरासत खोज", Nature: "प्राकृतिक विश्राम", Wildlife: "सफारी रोमांच", Wellness: "आरामदायक रिट्रीट", Holiday: "द्वीपीय छुट्टी" },
    detail: { packageLocation: "श्रीलंका का चुना हुआ पैकेज", aboutTitle: "इस पैकेज के बारे में", expectTitle: "क्या उम्मीद करें", planningTitle: "योजना नोट", bookingConfirmed: "बुकिंग पुष्टि हो गई!", viewMyBookings: "मेरी बुकिंग देखें", bookAgain: "फिर से बुक करें", perPackage: " / पैकेज", checkIn: "चेक-इन", checkOut: "चेक-आउट", guests: "मेहमान", packageGuideRate: "पैकेज गाइड दर", perDay: " / दिन", travelDates: "यात्रा तिथियाँ", estimatedTotal: "अनुमानित कुल", reservePackage: "पैकेज आरक्षित करें", backToPackages: "पैकेज पर वापस जाएँ", bookingNote: "अपनी तिथियों और मेहमानों की संख्या के साथ बुक करें।", galleryView: "दृश्य" },
    errors: { bookingFailed: "बुकिंग विफल रही। कृपया फिर से प्रयास करें।" },
  },
  zh: {
    nav: { home: "首页", destinations: "目的地", myBookings: "我的预订", selectLanguage: "选择语言", greeting: "您好", logout: "退出", signIn: "登录" },
    states: { loading: "正在加载套餐..." },
    rating: { excellent: "优秀", veryGood: "很好", good: "不错" },
    categories: { Beach: "海滩", Culture: "文化", Nature: "自然", Wildlife: "野生动物", Wellness: "康养", Holiday: "假期" },
    travelStyles: { Beach: "海岸休闲", Culture: "文化探索", Nature: "风景之旅", Wildlife: "Safari 冒险", Wellness: "疗愈度假", Holiday: "海岛假期" },
    detail: { packageLocation: "斯里兰卡精选套餐", aboutTitle: "关于此套餐", expectTitle: "行程亮点", planningTitle: "规划说明", bookingConfirmed: "预订已确认！", viewMyBookings: "查看我的预订", bookAgain: "再次预订", perPackage: " / 套餐", checkIn: "入住", checkOut: "退房", guests: "住客", packageGuideRate: "套餐指导价", perDay: " / 天", travelDates: "出行日期", estimatedTotal: "预计总价", reservePackage: "预订套餐", backToPackages: "返回套餐", bookingNote: "使用您的日期和人数完成预订。", galleryView: "图片" },
    errors: { bookingFailed: "预订失败，请重试。" },
  },
  ja: {
    nav: { home: "ホーム", destinations: "目的地", myBookings: "予約一覧", selectLanguage: "言語を選択", greeting: "こんにちは", logout: "ログアウト", signIn: "ログイン" },
    states: { loading: "パッケージを読み込み中..." },
    rating: { excellent: "素晴らしい", veryGood: "とても良い", good: "良い" },
    categories: { Beach: "ビーチ", Culture: "文化", Nature: "自然", Wildlife: "野生動物", Wellness: "ウェルネス", Holiday: "休日" },
    travelStyles: { Beach: "海辺の休暇", Culture: "文化探訪", Nature: "景観リトリート", Wildlife: "サファリアドベンチャー", Wellness: "癒やしの滞在", Holiday: "島の休日" },
    detail: { packageLocation: "スリランカ厳選パッケージ", aboutTitle: "このパッケージについて", expectTitle: "期待できること", planningTitle: "計画メモ", bookingConfirmed: "予約が確定しました！", viewMyBookings: "予約一覧を見る", bookAgain: "もう一度予約", perPackage: " / パッケージ", checkIn: "チェックイン", checkOut: "チェックアウト", guests: "人数", packageGuideRate: "パッケージ料金", perDay: " / 日", travelDates: "旅行日程", estimatedTotal: "概算合計", reservePackage: "パッケージを予約", backToPackages: "パッケージに戻る", bookingNote: "日付と人数を入力して予約してください。", galleryView: "表示" },
    errors: { bookingFailed: "予約に失敗しました。もう一度お試しください。" },
  },
  ko: {
    nav: { home: "홈", destinations: "여행지", myBookings: "내 예약", selectLanguage: "언어 선택", greeting: "안녕하세요", logout: "로그아웃", signIn: "로그인" },
    states: { loading: "패키지를 불러오는 중..." },
    rating: { excellent: "매우 우수", veryGood: "아주 좋음", good: "좋음" },
    categories: { Beach: "해변", Culture: "문화", Nature: "자연", Wildlife: "야생동물", Wellness: "웰니스", Holiday: "휴가" },
    travelStyles: { Beach: "해안 휴식", Culture: "유산 탐방", Nature: "풍경 휴식", Wildlife: "사파리 모험", Wellness: "회복형 휴양", Holiday: "섬 휴가" },
    detail: { packageLocation: "스리랑카 추천 패키지", aboutTitle: "이 패키지 소개", expectTitle: "기대할 내용", planningTitle: "여행 메모", bookingConfirmed: "예약이 확인되었습니다!", viewMyBookings: "내 예약 보기", bookAgain: "다시 예약", perPackage: " / 패키지", checkIn: "체크인", checkOut: "체크아웃", guests: "인원", packageGuideRate: "패키지 기준 요금", perDay: " / 일", travelDates: "여행 날짜", estimatedTotal: "예상 총액", reservePackage: "패키지 예약", backToPackages: "패키지로 돌아가기", bookingNote: "날짜와 인원으로 패키지를 예약하세요.", galleryView: "보기" },
    errors: { bookingFailed: "예약에 실패했습니다. 다시 시도해 주세요." },
  },
  fr: {
    nav: { home: "Accueil", destinations: "Destinations", myBookings: "Mes réservations", selectLanguage: "Choisir la langue", greeting: "Bonjour", logout: "Déconnexion", signIn: "Connexion" },
    states: { loading: "Chargement du forfait..." },
    rating: { excellent: "Excellent", veryGood: "Très bien", good: "Bien" },
    categories: { Beach: "Plage", Culture: "Culture", Nature: "Nature", Wildlife: "Faune", Wellness: "Bien-être", Holiday: "Vacances" },
    travelStyles: { Beach: "Détente côtière", Culture: "Découverte du patrimoine", Nature: "Évasion nature", Wildlife: "Aventure safari", Wellness: "Séjour bien-être", Holiday: "Pause insulaire" },
    detail: { packageLocation: "Forfait sélectionné au Sri Lanka", aboutTitle: "À propos de ce forfait", expectTitle: "À quoi vous attendre", planningTitle: "Note de planification", bookingConfirmed: "Réservation confirmée !", viewMyBookings: "Voir mes réservations", bookAgain: "Réserver à nouveau", perPackage: " / forfait", checkIn: "Arrivée", checkOut: "Départ", guests: "Voyageurs", packageGuideRate: "Tarif du forfait", perDay: " / jour", travelDates: "Dates de voyage", estimatedTotal: "Total estimé", reservePackage: "Réserver le forfait", backToPackages: "Retour aux forfaits", bookingNote: "Réservez avec vos dates et votre nombre de voyageurs.", galleryView: "vue" },
    errors: { bookingFailed: "La réservation a échoué. Veuillez réessayer." },
  },
  de: {
    nav: { home: "Startseite", destinations: "Reiseziele", myBookings: "Meine Buchungen", selectLanguage: "Sprache wählen", greeting: "Hallo", logout: "Abmelden", signIn: "Anmelden" },
    states: { loading: "Paket wird geladen..." },
    rating: { excellent: "Ausgezeichnet", veryGood: "Sehr gut", good: "Gut" },
    categories: { Beach: "Strand", Culture: "Kultur", Nature: "Natur", Wildlife: "Tierwelt", Wellness: "Wellness", Holiday: "Urlaub" },
    travelStyles: { Beach: "Küstenurlaub", Culture: "Kulturerlebnis", Nature: "Naturrückzug", Wildlife: "Safari-Abenteuer", Wellness: "Erholungsreise", Holiday: "Inselurlaub" },
    detail: { packageLocation: "Ausgewähltes Sri-Lanka-Paket", aboutTitle: "Über dieses Paket", expectTitle: "Was Sie erwartet", planningTitle: "Planungshinweis", bookingConfirmed: "Buchung bestätigt!", viewMyBookings: "Meine Buchungen ansehen", bookAgain: "Erneut buchen", perPackage: " / Paket", checkIn: "Check-in", checkOut: "Check-out", guests: "Gäste", packageGuideRate: "Paketpreis", perDay: " / Tag", travelDates: "Reisedaten", estimatedTotal: "Geschätzte Gesamtsumme", reservePackage: "Paket reservieren", backToPackages: "Zurück zu den Paketen", bookingNote: "Buchen Sie mit Ihren Daten und Ihrer Gästezahl.", galleryView: "Ansicht" },
    errors: { bookingFailed: "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut." },
  },
  es: {
    nav: { home: "Inicio", destinations: "Destinos", myBookings: "Mis reservas", selectLanguage: "Seleccionar idioma", greeting: "Hola", logout: "Cerrar sesión", signIn: "Iniciar sesión" },
    states: { loading: "Cargando paquete..." },
    rating: { excellent: "Excelente", veryGood: "Muy bueno", good: "Bueno" },
    categories: { Beach: "Playa", Culture: "Cultura", Nature: "Naturaleza", Wildlife: "Vida salvaje", Wellness: "Bienestar", Holiday: "Vacaciones" },
    travelStyles: { Beach: "Descanso costero", Culture: "Descubrimiento cultural", Nature: "Escapada natural", Wildlife: "Aventura safari", Wellness: "Retiro de bienestar", Holiday: "Vacaciones en la isla" },
    detail: { packageLocation: "Paquete seleccionado en Sri Lanka", aboutTitle: "Sobre este paquete", expectTitle: "Qué esperar", planningTitle: "Nota de planificación", bookingConfirmed: "¡Reserva confirmada!", viewMyBookings: "Ver mis reservas", bookAgain: "Reservar de nuevo", perPackage: " / paquete", checkIn: "Entrada", checkOut: "Salida", guests: "Huéspedes", packageGuideRate: "Tarifa del paquete", perDay: " / día", travelDates: "Fechas de viaje", estimatedTotal: "Total estimado", reservePackage: "Reservar paquete", backToPackages: "Volver a paquetes", bookingNote: "Reserva con tus fechas y número de huéspedes.", galleryView: "vista" },
    errors: { bookingFailed: "La reserva falló. Inténtalo de nuevo." },
  },
  it: {
    nav: { home: "Home", destinations: "Destinazioni", myBookings: "Le mie prenotazioni", selectLanguage: "Seleziona lingua", greeting: "Ciao", logout: "Esci", signIn: "Accedi" },
    states: { loading: "Caricamento pacchetto..." },
    rating: { excellent: "Eccellente", veryGood: "Molto buono", good: "Buono" },
    categories: { Beach: "Spiaggia", Culture: "Cultura", Nature: "Natura", Wildlife: "Fauna", Wellness: "Benessere", Holiday: "Vacanza" },
    travelStyles: { Beach: "Relax costiero", Culture: "Scoperta del patrimonio", Nature: "Fuga nella natura", Wildlife: "Avventura safari", Wellness: "Ritiro rigenerante", Holiday: "Vacanza sull'isola" },
    detail: { packageLocation: "Pacchetto selezionato in Sri Lanka", aboutTitle: "Informazioni su questo pacchetto", expectTitle: "Cosa aspettarsi", planningTitle: "Nota di pianificazione", bookingConfirmed: "Prenotazione confermata!", viewMyBookings: "Vedi le mie prenotazioni", bookAgain: "Prenota di nuovo", perPackage: " / pacchetto", checkIn: "Check-in", checkOut: "Check-out", guests: "Ospiti", packageGuideRate: "Tariffa pacchetto", perDay: " / giorno", travelDates: "Date del viaggio", estimatedTotal: "Totale stimato", reservePackage: "Prenota il pacchetto", backToPackages: "Torna ai pacchetti", bookingNote: "Prenota con le tue date e il numero di ospiti.", galleryView: "vista" },
    errors: { bookingFailed: "Prenotazione non riuscita. Riprova." },
  },
  pt: {
    nav: { home: "Início", destinations: "Destinos", myBookings: "Minhas reservas", selectLanguage: "Selecionar idioma", greeting: "Olá", logout: "Sair", signIn: "Entrar" },
    states: { loading: "Carregando pacote..." },
    rating: { excellent: "Excelente", veryGood: "Muito bom", good: "Bom" },
    categories: { Beach: "Praia", Culture: "Cultura", Nature: "Natureza", Wildlife: "Vida selvagem", Wellness: "Bem-estar", Holiday: "Férias" },
    travelStyles: { Beach: "Lazer costeiro", Culture: "Descoberta cultural", Nature: "Refúgio natural", Wildlife: "Aventura de safari", Wellness: "Retiro relaxante", Holiday: "Férias na ilha" },
    detail: { packageLocation: "Pacote selecionado no Sri Lanka", aboutTitle: "Sobre este pacote", expectTitle: "O que esperar", planningTitle: "Nota de planejamento", bookingConfirmed: "Reserva confirmada!", viewMyBookings: "Ver minhas reservas", bookAgain: "Reservar novamente", perPackage: " / pacote", checkIn: "Check-in", checkOut: "Check-out", guests: "Hóspedes", packageGuideRate: "Tarifa do pacote", perDay: " / dia", travelDates: "Datas da viagem", estimatedTotal: "Total estimado", reservePackage: "Reservar pacote", backToPackages: "Voltar aos pacotes", bookingNote: "Reserve com suas datas e quantidade de hóspedes.", galleryView: "vista" },
    errors: { bookingFailed: "A reserva falhou. Tente novamente." },
  },
  ar: {
    nav: { home: "الرئيسية", destinations: "الوجهات", myBookings: "حجوزاتي", selectLanguage: "اختر اللغة", greeting: "مرحبًا", logout: "تسجيل الخروج", signIn: "تسجيل الدخول" },
    states: { loading: "جارٍ تحميل الباقة..." },
    rating: { excellent: "ممتاز", veryGood: "جيد جدًا", good: "جيد" },
    categories: { Beach: "شاطئ", Culture: "ثقافة", Nature: "طبيعة", Wildlife: "حياة برية", Wellness: "عافية", Holiday: "عطلة" },
    travelStyles: { Beach: "استرخاء ساحلي", Culture: "استكشاف تراثي", Nature: "ملاذ طبيعي", Wildlife: "مغامرة سفاري", Wellness: "رحلة استجمام", Holiday: "عطلة جزيرية" },
    detail: { packageLocation: "باقة مختارة في سريلانكا", aboutTitle: "حول هذه الباقة", expectTitle: "ماذا تتوقع", planningTitle: "ملاحظة تخطيط", bookingConfirmed: "تم تأكيد الحجز!", viewMyBookings: "عرض حجوزاتي", bookAgain: "احجز مرة أخرى", perPackage: " / باقة", checkIn: "تسجيل الوصول", checkOut: "تسجيل المغادرة", guests: "الضيوف", packageGuideRate: "سعر الباقة", perDay: " / يوم", travelDates: "تواريخ السفر", estimatedTotal: "الإجمالي التقديري", reservePackage: "احجز الباقة", backToPackages: "العودة إلى الباقات", bookingNote: "احجز باستخدام تواريخك وعدد الضيوف.", galleryView: "عرض" },
    errors: { bookingFailed: "فشل الحجز. يرجى المحاولة مرة أخرى." },
  },
  ru: {
    nav: { home: "Главная", destinations: "Направления", myBookings: "Мои бронирования", selectLanguage: "Выберите язык", greeting: "Здравствуйте", logout: "Выйти", signIn: "Войти" },
    states: { loading: "Загрузка пакета..." },
    rating: { excellent: "Отлично", veryGood: "Очень хорошо", good: "Хорошо" },
    categories: { Beach: "Пляж", Culture: "Культура", Nature: "Природа", Wildlife: "Дикая природа", Wellness: "Оздоровление", Holiday: "Отпуск" },
    travelStyles: { Beach: "Пляжный отдых", Culture: "Культурное открытие", Nature: "Природное уединение", Wildlife: "Сафари-приключение", Wellness: "Оздоровительный отдых", Holiday: "Островной отпуск" },
    detail: { packageLocation: "Подобранный пакет по Шри-Ланке", aboutTitle: "Об этом пакете", expectTitle: "Что вас ждет", planningTitle: "Примечание к плану", bookingConfirmed: "Бронирование подтверждено!", viewMyBookings: "Посмотреть мои бронирования", bookAgain: "Забронировать снова", perPackage: " / пакет", checkIn: "Заезд", checkOut: "Выезд", guests: "Гости", packageGuideRate: "Тариф пакета", perDay: " / день", travelDates: "Даты поездки", estimatedTotal: "Ориентировочная сумма", reservePackage: "Забронировать пакет", backToPackages: "Назад к пакетам", bookingNote: "Бронируйте с вашими датами и числом гостей.", galleryView: "вид" },
    errors: { bookingFailed: "Бронирование не удалось. Попробуйте снова." },
  },
  nl: {
    nav: { home: "Home", destinations: "Bestemmingen", myBookings: "Mijn boekingen", selectLanguage: "Taal kiezen", greeting: "Hallo", logout: "Uitloggen", signIn: "Inloggen" },
    states: { loading: "Pakket wordt geladen..." },
    rating: { excellent: "Uitstekend", veryGood: "Zeer goed", good: "Goed" },
    categories: { Beach: "Strand", Culture: "Cultuur", Nature: "Natuur", Wildlife: "Wildlife", Wellness: "Wellness", Holiday: "Vakantie" },
    travelStyles: { Beach: "Kustontspanning", Culture: "Erfgoedontdekking", Nature: "Natuurverblijf", Wildlife: "Safari-avontuur", Wellness: "Ontspanningsretraite", Holiday: "Eilandvakantie" },
    detail: { packageLocation: "Geselecteerd Sri Lanka-pakket", aboutTitle: "Over dit pakket", expectTitle: "Wat je kunt verwachten", planningTitle: "Planningsnotitie", bookingConfirmed: "Boeking bevestigd!", viewMyBookings: "Mijn boekingen bekijken", bookAgain: "Opnieuw boeken", perPackage: " / pakket", checkIn: "Inchecken", checkOut: "Uitchecken", guests: "Gasten", packageGuideRate: "Pakkettarief", perDay: " / dag", travelDates: "Reisdata", estimatedTotal: "Geschat totaal", reservePackage: "Pakket reserveren", backToPackages: "Terug naar pakketten", bookingNote: "Boek met je data en aantal gasten.", galleryView: "weergave" },
    errors: { bookingFailed: "Boeking mislukt. Probeer het opnieuw." },
  },
});

function getPackageDetailCopy(language) {
  return getLocalizedSiteCopy(PACKAGE_DETAIL_COPY, language);
}

function formatCopy(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function packageRatingLabel(rating, copy) {
  if (rating >= 4.7) return copy.rating.excellent;
  if (rating >= 4.2) return copy.rating.veryGood;
  return copy.rating.good;
}

function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useSiteLanguage();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const copy = getPackageDetailCopy(language);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    checkin: searchParams.get("checkin") || "",
    checkout: searchParams.get("checkout") || "",
    guests: Number(searchParams.get("guests")) || 1,
  });
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPackage = async () => {
      setLoading(true);
      setBookingDone(false);
      setBookingError("");

      try {
        const { data } = await getPackageBySlug(slug);

        if (isMounted) {
          setPkg(data);
        }
      } catch {
        if (isMounted) {
          setPkg(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPackage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const languageSelector = (
    <div className="bc-lang">
      <span className="bc-lang-label">{copy.nav.selectLanguage}</span>
      <select aria-label={copy.nav.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading">{copy.states.loading}</div>
      </div>
    );
  }

  if (!pkg) {
    return <Navigate to="/destinations" replace />;
  }

  const galleryImages = getPackageGalleryImages(pkg.title, [pkg.image]);
  const durationDays = Number.parseInt(pkg.days, 10) || 1;
  const averagePerDay = Math.round(pkg.price / durationDays);
  const highlights = copy.highlights[pkg.category] || CATEGORY_HIGHLIGHTS[pkg.category] || [];
  const travelStyle = copy.travelStyles[pkg.category] || CATEGORY_TRAVEL_STYLE[pkg.category];
  const categoryLabel = copy.categories[pkg.category] || pkg.category;
  const nights =
    booking.checkin && booking.checkout
      ? Math.max(1, Math.round((new Date(booking.checkout) - new Date(booking.checkin)) / 86400000))
      : 0;
  const total = nights > 0 ? averagePerDay * nights * booking.guests : null;

  const handleBook = async (event) => {
    event.preventDefault();
    setBookingError("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await createBooking({
        bookingType: "package",
        checkIn: booking.checkin,
        checkOut: booking.checkout,
        guests: booking.guests,
        packageSlug: pkg.slug,
      });
      setBookingDone(true);
    } catch (error) {
      setBookingError(error.response?.data?.message || copy.errors.bookingFailed);
    }
  };

  return (
    <div className="detail-page">
      <div className="breadcrumb">
        <Link to="/">{copy.nav.home}</Link> ›
        <Link to="/destinations"> {copy.nav.destinations}</Link> ›
        <span> {pkg.title}</span>
        <div className="breadcrumb-nav">
          <Link to="/shopping" className="bc-link">{copy.nav.shopping || "Stores"}</Link>
          <Link to="/tours" className="bc-link">{copy.nav.tours || "Tours"}</Link>
          <Link to={user ? "/chat" : "/login"} className="bc-link">{copy.nav.chat || "Chat"}<ChatRequestBadge count={chatRequestCount} /></Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="bc-link">{copy.nav.myBookings}</Link>
              {languageSelector}
              <span className="bc-user">{copy.nav.greeting}, {user.name}</span>
              <button className="bc-logout" onClick={logout}>{copy.nav.logout}</button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="bc-link">{copy.nav.signIn}</Link>
            </>
          )}
        </div>
      </div>

      <div className="detail-hero">
        <img src={galleryImages[0]} alt={pkg.title} loading="eager" />
      </div>

      <div className="detail-gallery-wrap">
        <div className="detail-gallery-grid">
          {galleryImages.map((image, index) => (
            <div key={`${pkg.slug}-${index}`} className="detail-gallery-card">
              <img src={image} alt={`${pkg.title} ${copy.detail.galleryView} ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-info">
          <div className="detail-header">
            <div>
              <span className="detail-category">{categoryLabel}</span>
              <h1>{pkg.title}</h1>
              <p className="detail-location">{copy.detail.packageLocation}</p>
              <p className="detail-lead">{pkg.text}</p>
            </div>
            <div className="detail-rating">
              <span className="big-score">{PACKAGE_RATING.toFixed(1)}</span>
              <div>
                <span className="rating-label">{packageRatingLabel(PACKAGE_RATING, copy)}</span>
                <span className="detail-rating-stars">★★★★☆</span>
                <span className="review-count">{travelStyle}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>{copy.detail.aboutTitle}</h2>
            <p>{pkg.text}</p>
            <p>{copy.summaries[pkg.category] || CATEGORY_SUMMARIES[pkg.category]}</p>
          </div>

          <div className="detail-section">
            <h2>{copy.detail.expectTitle}</h2>
            <div className="amenities-grid">
              {highlights.map((item) => (
                <div key={item} className="amenity">✓ {item}</div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>{copy.detail.planningTitle}</h2>
            <p>{copy.detail.planningBody}</p>
          </div>
        </div>

        <aside className="booking-card">
          {bookingDone ? (
            <div className="booking-success">
              <div className="success-icon">✓</div>
              <h3>{copy.detail.bookingConfirmed}</h3>
              <p>{formatCopy(copy.detail.bookingReserved, { title: pkg.title })}</p>
              <Link to="/my-bookings" className="view-bookings-btn">{copy.detail.viewMyBookings}</Link>
              <button className="book-another-btn" onClick={() => setBookingDone(false)}>{copy.detail.bookAgain}</button>
            </div>
          ) : (
            <>
              <div className="booking-price">
                <span className="booking-amount">LKR {pkg.price.toLocaleString()}</span>
                <span className="booking-per">{copy.detail.perPackage}</span>
              </div>

              {bookingError && <p className="booking-error">{bookingError}</p>}

              <form className="booking-form" onSubmit={handleBook}>
                <div className="booking-dates">
                  <div className="booking-field">
                    <label>{copy.detail.checkIn}</label>
                    <input
                      type="date"
                      value={booking.checkin}
                      onChange={(event) => setBooking({ ...booking, checkin: event.target.value })}
                      required
                    />
                  </div>
                  <div className="booking-field">
                    <label>{copy.detail.checkOut}</label>
                    <input
                      type="date"
                      value={booking.checkout}
                      onChange={(event) => setBooking({ ...booking, checkout: event.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="booking-field">
                  <label>{copy.detail.guests}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={booking.guests}
                    onChange={(event) => setBooking({ ...booking, guests: Number(event.target.value) })}
                  />
                </div>

                {total !== null && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>{copy.detail.packageGuideRate}</span>
                      <strong>LKR {averagePerDay.toLocaleString()}{copy.detail.perDay}</strong>
                    </div>
                    <div className="summary-row">
                      <span>{copy.detail.travelDates}</span>
                      <strong>{nights} {nights === 1 ? copy.detail.nightSingular : copy.detail.nightPlural}</strong>
                    </div>
                    <div className="summary-row">
                      <span>{copy.detail.guests}</span>
                      <strong>{booking.guests}</strong>
                    </div>
                    <div className="summary-row total">
                      <span>{copy.detail.estimatedTotal}</span>
                      <strong>LKR {total.toLocaleString()}</strong>
                    </div>
                  </div>
                )}

                <button type="submit" className="reserve-btn">{copy.detail.reservePackage}</button>
              </form>

              <button className="book-another-btn" onClick={() => navigate("/destinations")}>{copy.detail.backToPackages}</button>
              <p className="booking-note">{copy.detail.bookingNote}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default PackageDetail;