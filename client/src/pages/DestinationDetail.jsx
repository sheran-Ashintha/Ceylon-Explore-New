import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { getDestination, getReviews, addReview, createBooking, getMe } from "../services/api";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useChatRequestCount } from "../utils/chatRequests";
import { getDestinationGalleryImages } from "../utils/placeImages";
import { getLocalizedSiteCopy, SITE_LANGUAGE_DATE_LOCALES, SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./DestinationDetail.css";

const DESTINATION_DETAIL_COPY = {
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
    rating: {
      exceptional: "Exceptional",
      excellent: "Excellent",
      veryGood: "Very Good",
      good: "Good",
      okay: "Okay",
      reviewSingular: "review",
      reviewPlural: "reviews",
      popularTravelerRating: "Popular traveler rating",
    },
    states: {
      loading: "Loading...",
    },
    detail: {
      galleryView: "view",
      aboutTitle: "About this property",
      aboutBody: "Experience the true beauty of Sri Lanka at {name}. Whether you're seeking adventure, culture, or relaxation, this destination offers an unforgettable experience for every type of traveler.",
      facilitiesTitle: "Facilities",
      guestReviewsTitle: "Guest Reviews",
      writeReview: "Write a Review",
      yourRating: "Your rating:",
      shareExperience: "Share your experience...",
      submitting: "Submitting...",
      submitReview: "Submit Review",
      noReviews: "No reviews yet. Be the first to review!",
      bookingConfirmed: "Booking Confirmed!",
      bookingReserved: "Your stay at {name} has been reserved.",
      viewMyBookings: "View My Bookings",
      bookAgain: "Book Again",
      contactForPrice: "Contact for price",
      perNight: " / night",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      nightSingular: "night",
      nightPlural: "nights",
      guestSingular: "guest",
      guestPlural: "guests",
      total: "Total",
      reserveNow: "Reserve Now",
      signInToBook: "Sign in to Book",
      bookingNote: "You won't be charged yet · Free cancellation",
    },
    errors: {
      bookingFailed: "Booking failed. Please try again.",
      reviewFailed: "Failed to submit review.",
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
    rating: {
      exceptional: "අතිවිශිෂ්ටයි",
      excellent: "විශිෂ්ටයි",
      veryGood: "ඉතා හොඳයි",
      good: "හොඳයි",
      okay: "සාමාන්‍යයි",
      reviewSingular: "සමාලෝචනය",
      reviewPlural: "සමාලෝචන",
      popularTravelerRating: "ජනප්‍රිය සංචාරක ශ්‍රේණිගත කිරීම",
    },
    states: {
      loading: "පූරණය වෙමින්...",
    },
    detail: {
      galleryView: "දසුන",
      aboutTitle: "මෙම ස්ථානය ගැන",
      aboutBody: "{name} හි ශ්‍රී ලංකාවේ සැබෑ සුන්දරත්වය අත්විඳින්න. ඔබ වික්‍රමය, සංස්කෘතිය හෝ විවේකය සොයන්නේ නම්, මෙම ගමනාන්තය සෑම වර්ගයකම සංචාරකයෙකුටම අමතක නොවන අත්දැකීමක් ලබා දෙයි.",
      facilitiesTitle: "පහසුකම්",
      guestReviewsTitle: "අමුත්තන්ගේ සමාලෝචන",
      writeReview: "සමාලෝචනයක් ලියන්න",
      yourRating: "ඔබගේ ශ්‍රේණිගත කිරීම:",
      shareExperience: "ඔබගේ අත්දැකීම බෙදාගන්න...",
      submitting: "ඉදිරිපත් කරමින්...",
      submitReview: "සමාලෝචනය ඉදිරිපත් කරන්න",
      noReviews: "තවම සමාලෝචන නොමැත. මුල්ම සමාලෝචකයා වන්න!",
      bookingConfirmed: "වෙන්කිරීම තහවුරු විය!",
      bookingReserved: "{name} හි ඔබගේ නවාතැන වෙන් කර ඇත.",
      viewMyBookings: "මගේ වෙන්කිරීම් බලන්න",
      bookAgain: "නැවත වෙන්කරන්න",
      contactForPrice: "මිල සඳහා අමතන්න",
      perNight: " / රාත්‍රියකට",
      checkIn: "පැමිණීම",
      checkOut: "පිටවීම",
      guests: "අමුත්තන්",
      nightSingular: "රාත්‍රිය",
      nightPlural: "රාත්‍රි",
      guestSingular: "අමුත්තා",
      guestPlural: "අමුත්තන්",
      total: "එකතුව",
      reserveNow: "දැන් වෙන්කරන්න",
      signInToBook: "වෙන් කිරීමට පිවිසෙන්න",
      bookingNote: "තවම ඔබගෙන් අය නොකෙරේ · නොමිලේ අවලංගු කිරීම",
    },
    errors: {
      bookingFailed: "වෙන්කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.",
      reviewFailed: "සමාලෝචනය ඉදිරිපත් කළ නොහැකි විය.",
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
    rating: {
      exceptional: "மிகச் சிறப்பு",
      excellent: "சிறப்பு",
      veryGood: "மிகவும் நல்லது",
      good: "நல்லது",
      okay: "சராசரி",
      reviewSingular: "மதிப்புரை",
      reviewPlural: "மதிப்புரைகள்",
      popularTravelerRating: "பிரபல பயணி மதிப்பீடு",
    },
    states: {
      loading: "ஏற்றப்படுகிறது...",
    },
    detail: {
      galleryView: "காட்சி",
      aboutTitle: "இந்த இடத்தைப் பற்றி",
      aboutBody: "{name} இல் இலங்கையின் உண்மையான அழகை அனுபவிக்கவும். நீங்கள் சாகசம், கலாசாரம் அல்லது ஓய்வு தேடினாலும், இந்த இடம் ஒவ்வொரு பயணிக்கும் மறக்க முடியாத அனுபவத்தை வழங்குகிறது.",
      facilitiesTitle: "வசதிகள்",
      guestReviewsTitle: "விருந்தினர் மதிப்புரைகள்",
      writeReview: "ஒரு மதிப்புரை எழுதுங்கள்",
      yourRating: "உங்கள் மதிப்பீடு:",
      shareExperience: "உங்கள் அனுபவத்தை பகிருங்கள்...",
      submitting: "சமர்ப்பிக்கப்படுகிறது...",
      submitReview: "மதிப்புரையை சமர்ப்பிக்கவும்",
      noReviews: "இன்னும் மதிப்புரைகள் இல்லை. முதலில் மதிப்புரை இடுங்கள்!",
      bookingConfirmed: "முன்பதிவு உறுதிப்படுத்தப்பட்டது!",
      bookingReserved: "{name} இல் உங்கள் தங்குமிடம் முன்பதிவு செய்யப்பட்டுள்ளது.",
      viewMyBookings: "என் முன்பதிவுகளைப் பார்க்கவும்",
      bookAgain: "மீண்டும் முன்பதிவு செய்க",
      contactForPrice: "விலைக்கு தொடர்புகொள்ளவும்",
      perNight: " / இரவு",
      checkIn: "செக்-இன்",
      checkOut: "செக்-அவுட்",
      guests: "விருந்தினர்கள்",
      nightSingular: "இரவு",
      nightPlural: "இரவுகள்",
      guestSingular: "விருந்தினர்",
      guestPlural: "விருந்தினர்கள்",
      total: "மொத்தம்",
      reserveNow: "இப்போது முன்பதிவு செய்க",
      signInToBook: "முன்பதிவு செய்ய உள்நுழைக",
      bookingNote: "இப்போது கட்டணம் வசூலிக்கப்படாது · இலவச ரத்து",
    },
    errors: {
      bookingFailed: "முன்பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
      reviewFailed: "மதிப்புரையை சமர்ப்பிக்க முடியவில்லை.",
    },
  },
};

Object.assign(DESTINATION_DETAIL_COPY, {
  hi: {
    nav: { home: "होम", destinations: "गंतव्य", myBookings: "मेरी बुकिंग", selectLanguage: "भाषा चुनें", greeting: "नमस्ते", logout: "लॉग आउट", signIn: "साइन इन" },
    rating: { exceptional: "असाधारण", excellent: "उत्कृष्ट", veryGood: "बहुत अच्छा", good: "अच्छा", okay: "ठीक", reviewSingular: "समीक्षा", reviewPlural: "समीक्षाएँ", popularTravelerRating: "लोकप्रिय यात्री रेटिंग" },
    states: { loading: "लोड हो रहा है..." },
    detail: { galleryView: "दृश्य", aboutTitle: "इस स्थान के बारे में", facilitiesTitle: "सुविधाएँ", guestReviewsTitle: "अतिथि समीक्षाएँ", writeReview: "समीक्षा लिखें", yourRating: "आपकी रेटिंग:", shareExperience: "अपना अनुभव साझा करें...", submitting: "जमा हो रहा है...", submitReview: "समीक्षा भेजें", noReviews: "अभी तक कोई समीक्षा नहीं। पहले समीक्षा करें!", bookingConfirmed: "बुकिंग पुष्टि हो गई!", viewMyBookings: "मेरी बुकिंग देखें", bookAgain: "फिर से बुक करें", contactForPrice: "मूल्य के लिए संपर्क करें", perNight: " / रात", checkIn: "चेक-इन", checkOut: "चेक-आउट", guests: "मेहमान", total: "कुल", reserveNow: "अभी आरक्षित करें", signInToBook: "बुक करने के लिए साइन इन करें", bookingNote: "अभी शुल्क नहीं लगेगा · मुफ्त रद्दीकरण" },
    errors: { bookingFailed: "बुकिंग विफल रही। कृपया फिर से प्रयास करें।", reviewFailed: "समीक्षा भेजी नहीं जा सकी।" },
  },
  zh: {
    nav: { home: "首页", destinations: "目的地", myBookings: "我的预订", selectLanguage: "选择语言", greeting: "您好", logout: "退出", signIn: "登录" },
    rating: { exceptional: "非常出色", excellent: "优秀", veryGood: "很好", good: "不错", okay: "一般", reviewSingular: "条评价", reviewPlural: "条评价", popularTravelerRating: "热门旅客评分" },
    states: { loading: "加载中..." },
    detail: { galleryView: "图片", aboutTitle: "关于此住宿", facilitiesTitle: "设施", guestReviewsTitle: "住客评价", writeReview: "写评价", yourRating: "您的评分：", shareExperience: "分享您的体验...", submitting: "提交中...", submitReview: "提交评价", noReviews: "暂无评价，来做第一个评价的人吧！", bookingConfirmed: "预订已确认！", viewMyBookings: "查看我的预订", bookAgain: "再次预订", contactForPrice: "联系询价", perNight: " / 晚", checkIn: "入住", checkOut: "退房", guests: "住客", total: "总计", reserveNow: "立即预订", signInToBook: "登录后预订", bookingNote: "暂不收费 · 可免费取消" },
    errors: { bookingFailed: "预订失败，请重试。", reviewFailed: "提交评价失败。" },
  },
  ja: {
    nav: { home: "ホーム", destinations: "目的地", myBookings: "予約一覧", selectLanguage: "言語を選択", greeting: "こんにちは", logout: "ログアウト", signIn: "ログイン" },
    rating: { exceptional: "最高", excellent: "素晴らしい", veryGood: "とても良い", good: "良い", okay: "普通", reviewSingular: "件のレビュー", reviewPlural: "件のレビュー", popularTravelerRating: "人気旅行者評価" },
    states: { loading: "読み込み中..." },
    detail: { galleryView: "表示", aboutTitle: "この宿泊施設について", facilitiesTitle: "設備", guestReviewsTitle: "ゲストレビュー", writeReview: "レビューを書く", yourRating: "あなたの評価:", shareExperience: "体験を共有してください...", submitting: "送信中...", submitReview: "レビューを送信", noReviews: "まだレビューはありません。最初のレビューを書きましょう。", bookingConfirmed: "予約が確定しました！", viewMyBookings: "予約一覧を見る", bookAgain: "もう一度予約", contactForPrice: "料金はお問い合わせください", perNight: " / 泊", checkIn: "チェックイン", checkOut: "チェックアウト", guests: "宿泊者", total: "合計", reserveNow: "今すぐ予約", signInToBook: "予約するにはログイン", bookingNote: "まだ請求されません · 無料キャンセル" },
    errors: { bookingFailed: "予約に失敗しました。もう一度お試しください。", reviewFailed: "レビューを送信できませんでした。" },
  },
  ko: {
    nav: { home: "홈", destinations: "여행지", myBookings: "내 예약", selectLanguage: "언어 선택", greeting: "안녕하세요", logout: "로그아웃", signIn: "로그인" },
    rating: { exceptional: "최고", excellent: "매우 우수", veryGood: "아주 좋음", good: "좋음", okay: "보통", reviewSingular: "리뷰", reviewPlural: "리뷰", popularTravelerRating: "인기 여행자 평점" },
    states: { loading: "불러오는 중..." },
    detail: { galleryView: "보기", aboutTitle: "이 숙소 소개", facilitiesTitle: "시설", guestReviewsTitle: "투숙객 리뷰", writeReview: "리뷰 작성", yourRating: "내 평점:", shareExperience: "경험을 공유해 주세요...", submitting: "제출 중...", submitReview: "리뷰 제출", noReviews: "아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!", bookingConfirmed: "예약이 확인되었습니다!", viewMyBookings: "내 예약 보기", bookAgain: "다시 예약", contactForPrice: "가격 문의", perNight: " / 박", checkIn: "체크인", checkOut: "체크아웃", guests: "투숙객", total: "합계", reserveNow: "지금 예약", signInToBook: "예약하려면 로그인", bookingNote: "아직 결제되지 않습니다 · 무료 취소" },
    errors: { bookingFailed: "예약에 실패했습니다. 다시 시도해 주세요.", reviewFailed: "리뷰를 제출하지 못했습니다." },
  },
  fr: {
    nav: { home: "Accueil", destinations: "Destinations", myBookings: "Mes réservations", selectLanguage: "Choisir la langue", greeting: "Bonjour", logout: "Déconnexion", signIn: "Connexion" },
    rating: { exceptional: "Exceptionnel", excellent: "Excellent", veryGood: "Très bien", good: "Bien", okay: "Correct", reviewSingular: "avis", reviewPlural: "avis", popularTravelerRating: "Note appréciée des voyageurs" },
    states: { loading: "Chargement..." },
    detail: { galleryView: "vue", aboutTitle: "À propos de cet hébergement", facilitiesTitle: "Équipements", guestReviewsTitle: "Avis des clients", writeReview: "Écrire un avis", yourRating: "Votre note :", shareExperience: "Partagez votre expérience...", submitting: "Envoi...", submitReview: "Publier l'avis", noReviews: "Pas encore d'avis. Soyez le premier à en laisser un !", bookingConfirmed: "Réservation confirmée !", viewMyBookings: "Voir mes réservations", bookAgain: "Réserver à nouveau", contactForPrice: "Nous contacter pour le prix", perNight: " / nuit", checkIn: "Arrivée", checkOut: "Départ", guests: "Voyageurs", total: "Total", reserveNow: "Réserver maintenant", signInToBook: "Connectez-vous pour réserver", bookingNote: "Aucun paiement maintenant · Annulation gratuite" },
    errors: { bookingFailed: "La réservation a échoué. Veuillez réessayer.", reviewFailed: "Impossible d'envoyer l'avis." },
  },
  de: {
    nav: { home: "Startseite", destinations: "Reiseziele", myBookings: "Meine Buchungen", selectLanguage: "Sprache wählen", greeting: "Hallo", logout: "Abmelden", signIn: "Anmelden" },
    rating: { exceptional: "Außergewöhnlich", excellent: "Ausgezeichnet", veryGood: "Sehr gut", good: "Gut", okay: "Okay", reviewSingular: "Bewertung", reviewPlural: "Bewertungen", popularTravelerRating: "Beliebte Reisendenbewertung" },
    states: { loading: "Lädt..." },
    detail: { galleryView: "Ansicht", aboutTitle: "Über diese Unterkunft", facilitiesTitle: "Ausstattung", guestReviewsTitle: "Gästebewertungen", writeReview: "Bewertung schreiben", yourRating: "Ihre Bewertung:", shareExperience: "Teilen Sie Ihre Erfahrung...", submitting: "Wird gesendet...", submitReview: "Bewertung senden", noReviews: "Noch keine Bewertungen. Schreiben Sie die erste!", bookingConfirmed: "Buchung bestätigt!", viewMyBookings: "Meine Buchungen ansehen", bookAgain: "Erneut buchen", contactForPrice: "Preis auf Anfrage", perNight: " / Nacht", checkIn: "Check-in", checkOut: "Check-out", guests: "Gäste", total: "Gesamt", reserveNow: "Jetzt reservieren", signInToBook: "Zum Buchen anmelden", bookingNote: "Noch keine Zahlung · Kostenlose Stornierung" },
    errors: { bookingFailed: "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.", reviewFailed: "Bewertung konnte nicht gesendet werden." },
  },
  es: {
    nav: { home: "Inicio", destinations: "Destinos", myBookings: "Mis reservas", selectLanguage: "Seleccionar idioma", greeting: "Hola", logout: "Cerrar sesión", signIn: "Iniciar sesión" },
    rating: { exceptional: "Excepcional", excellent: "Excelente", veryGood: "Muy bueno", good: "Bueno", okay: "Aceptable", reviewSingular: "reseña", reviewPlural: "reseñas", popularTravelerRating: "Valoración popular de viajeros" },
    states: { loading: "Cargando..." },
    detail: { galleryView: "vista", aboutTitle: "Sobre este alojamiento", facilitiesTitle: "Instalaciones", guestReviewsTitle: "Opiniones de huéspedes", writeReview: "Escribir una reseña", yourRating: "Tu valoración:", shareExperience: "Comparte tu experiencia...", submitting: "Enviando...", submitReview: "Enviar reseña", noReviews: "Aún no hay reseñas. ¡Sé el primero en opinar!", bookingConfirmed: "¡Reserva confirmada!", viewMyBookings: "Ver mis reservas", bookAgain: "Reservar de nuevo", contactForPrice: "Consultar precio", perNight: " / noche", checkIn: "Entrada", checkOut: "Salida", guests: "Huéspedes", total: "Total", reserveNow: "Reservar ahora", signInToBook: "Inicia sesión para reservar", bookingNote: "Aún no se cobrará · Cancelación gratuita" },
    errors: { bookingFailed: "La reserva falló. Inténtalo de nuevo.", reviewFailed: "No se pudo enviar la reseña." },
  },
  it: {
    nav: { home: "Home", destinations: "Destinazioni", myBookings: "Le mie prenotazioni", selectLanguage: "Seleziona lingua", greeting: "Ciao", logout: "Esci", signIn: "Accedi" },
    rating: { exceptional: "Eccezionale", excellent: "Eccellente", veryGood: "Molto buono", good: "Buono", okay: "Discreto", reviewSingular: "recensione", reviewPlural: "recensioni", popularTravelerRating: "Valutazione popolare dei viaggiatori" },
    states: { loading: "Caricamento..." },
    detail: { galleryView: "vista", aboutTitle: "Informazioni su questa struttura", facilitiesTitle: "Servizi", guestReviewsTitle: "Recensioni degli ospiti", writeReview: "Scrivi una recensione", yourRating: "La tua valutazione:", shareExperience: "Condividi la tua esperienza...", submitting: "Invio in corso...", submitReview: "Invia recensione", noReviews: "Ancora nessuna recensione. Lascia la prima!", bookingConfirmed: "Prenotazione confermata!", viewMyBookings: "Vedi le mie prenotazioni", bookAgain: "Prenota di nuovo", contactForPrice: "Contatta per il prezzo", perNight: " / notte", checkIn: "Check-in", checkOut: "Check-out", guests: "Ospiti", total: "Totale", reserveNow: "Prenota ora", signInToBook: "Accedi per prenotare", bookingNote: "Nessun addebito ora · Cancellazione gratuita" },
    errors: { bookingFailed: "Prenotazione non riuscita. Riprova.", reviewFailed: "Impossibile inviare la recensione." },
  },
  pt: {
    nav: { home: "Início", destinations: "Destinos", myBookings: "Minhas reservas", selectLanguage: "Selecionar idioma", greeting: "Olá", logout: "Sair", signIn: "Entrar" },
    rating: { exceptional: "Excecional", excellent: "Excelente", veryGood: "Muito bom", good: "Bom", okay: "Razoável", reviewSingular: "avaliação", reviewPlural: "avaliações", popularTravelerRating: "Avaliação popular de viajantes" },
    states: { loading: "Carregando..." },
    detail: { galleryView: "vista", aboutTitle: "Sobre esta estadia", facilitiesTitle: "Instalações", guestReviewsTitle: "Avaliações dos hóspedes", writeReview: "Escrever avaliação", yourRating: "Sua avaliação:", shareExperience: "Compartilhe sua experiência...", submitting: "Enviando...", submitReview: "Enviar avaliação", noReviews: "Ainda não há avaliações. Seja o primeiro!", bookingConfirmed: "Reserva confirmada!", viewMyBookings: "Ver minhas reservas", bookAgain: "Reservar novamente", contactForPrice: "Consulte o preço", perNight: " / noite", checkIn: "Check-in", checkOut: "Check-out", guests: "Hóspedes", total: "Total", reserveNow: "Reservar agora", signInToBook: "Entre para reservar", bookingNote: "Você ainda não será cobrado · Cancelamento gratuito" },
    errors: { bookingFailed: "A reserva falhou. Tente novamente.", reviewFailed: "Não foi possível enviar a avaliação." },
  },
  ar: {
    nav: { home: "الرئيسية", destinations: "الوجهات", myBookings: "حجوزاتي", selectLanguage: "اختر اللغة", greeting: "مرحبًا", logout: "تسجيل الخروج", signIn: "تسجيل الدخول" },
    rating: { exceptional: "استثنائي", excellent: "ممتاز", veryGood: "جيد جدًا", good: "جيد", okay: "مقبول", reviewSingular: "مراجعة", reviewPlural: "مراجعات", popularTravelerRating: "تقييم شائع بين المسافرين" },
    states: { loading: "جارٍ التحميل..." },
    detail: { galleryView: "عرض", aboutTitle: "حول هذا المكان", facilitiesTitle: "المرافق", guestReviewsTitle: "مراجعات الضيوف", writeReview: "اكتب مراجعة", yourRating: "تقييمك:", shareExperience: "شارك تجربتك...", submitting: "جارٍ الإرسال...", submitReview: "إرسال المراجعة", noReviews: "لا توجد مراجعات بعد. كن أول من يراجع!", bookingConfirmed: "تم تأكيد الحجز!", viewMyBookings: "عرض حجوزاتي", bookAgain: "احجز مرة أخرى", contactForPrice: "تواصل لمعرفة السعر", perNight: " / ليلة", checkIn: "تسجيل الوصول", checkOut: "تسجيل المغادرة", guests: "الضيوف", total: "الإجمالي", reserveNow: "احجز الآن", signInToBook: "سجّل الدخول للحجز", bookingNote: "لن يتم الخصم الآن · إلغاء مجاني" },
    errors: { bookingFailed: "فشل الحجز. يرجى المحاولة مرة أخرى.", reviewFailed: "تعذر إرسال المراجعة." },
  },
  ru: {
    nav: { home: "Главная", destinations: "Направления", myBookings: "Мои бронирования", selectLanguage: "Выберите язык", greeting: "Здравствуйте", logout: "Выйти", signIn: "Войти" },
    rating: { exceptional: "Исключительно", excellent: "Отлично", veryGood: "Очень хорошо", good: "Хорошо", okay: "Нормально", reviewSingular: "отзыв", reviewPlural: "отзывов", popularTravelerRating: "Популярная оценка путешественников" },
    states: { loading: "Загрузка..." },
    detail: { galleryView: "вид", aboutTitle: "Об этом месте", facilitiesTitle: "Удобства", guestReviewsTitle: "Отзывы гостей", writeReview: "Написать отзыв", yourRating: "Ваша оценка:", shareExperience: "Поделитесь впечатлением...", submitting: "Отправка...", submitReview: "Отправить отзыв", noReviews: "Пока нет отзывов. Оставьте первый!", bookingConfirmed: "Бронирование подтверждено!", viewMyBookings: "Посмотреть мои бронирования", bookAgain: "Забронировать снова", contactForPrice: "Уточнить цену", perNight: " / ночь", checkIn: "Заезд", checkOut: "Выезд", guests: "Гости", total: "Итого", reserveNow: "Забронировать", signInToBook: "Войдите, чтобы забронировать", bookingNote: "Сейчас списания не будет · Бесплатная отмена" },
    errors: { bookingFailed: "Бронирование не удалось. Попробуйте снова.", reviewFailed: "Не удалось отправить отзыв." },
  },
  nl: {
    nav: { home: "Home", destinations: "Bestemmingen", myBookings: "Mijn boekingen", selectLanguage: "Taal kiezen", greeting: "Hallo", logout: "Uitloggen", signIn: "Inloggen" },
    rating: { exceptional: "Uitzonderlijk", excellent: "Uitstekend", veryGood: "Zeer goed", good: "Goed", okay: "Redelijk", reviewSingular: "review", reviewPlural: "reviews", popularTravelerRating: "Populaire reizigersscore" },
    states: { loading: "Laden..." },
    detail: { galleryView: "weergave", aboutTitle: "Over deze accommodatie", facilitiesTitle: "Faciliteiten", guestReviewsTitle: "Gastbeoordelingen", writeReview: "Schrijf een review", yourRating: "Jouw beoordeling:", shareExperience: "Deel je ervaring...", submitting: "Verzenden...", submitReview: "Review plaatsen", noReviews: "Nog geen reviews. Wees de eerste!", bookingConfirmed: "Boeking bevestigd!", viewMyBookings: "Mijn boekingen bekijken", bookAgain: "Opnieuw boeken", contactForPrice: "Neem contact op voor prijs", perNight: " / nacht", checkIn: "Inchecken", checkOut: "Uitchecken", guests: "Gasten", total: "Totaal", reserveNow: "Nu reserveren", signInToBook: "Log in om te boeken", bookingNote: "Je wordt nog niet belast · Gratis annuleren" },
    errors: { bookingFailed: "Boeking mislukt. Probeer het opnieuw.", reviewFailed: "Review kon niet worden verzonden." },
  },
});

const DETAIL_DATE_LOCALE = SITE_LANGUAGE_DATE_LOCALES;

function getDetailCopy(language) {
  return getLocalizedSiteCopy(DESTINATION_DETAIL_COPY, language);
}

function formatCopy(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function ratingLabel(r, copy) {
  if (r >= 4.8) return copy.rating.exceptional;
  if (r >= 4.5) return copy.rating.excellent;
  if (r >= 4.0) return copy.rating.veryGood;
  if (r >= 3.5) return copy.rating.good;
  return copy.rating.okay;
}

function displayRating(rating) {
  return rating > 0 ? Math.min(5, rating) : 4.4;
}

function ratingStars(rating) {
  const roundedRating = Math.max(1, Math.min(5, Math.round(displayRating(rating))));
  return `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;
}

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, setLanguage } = useSiteLanguage();
  const copy = getDetailCopy(language);

  const [dest, setDest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const [loading, setLoading] = useState(true);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [booking, setBooking] = useState({
    checkin: searchParams.get("checkin") || "",
    checkout: searchParams.get("checkout") || "",
    guests: Number(searchParams.get("guests")) || 1,
  });

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [destRes, reviewsRes] = await Promise.all([
          getDestination(id),
          getReviews(id),
        ]);
        setDest(destRes.data);
        setReviews(reviewsRes.data);
      } catch {
        navigate("/destinations");
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const meRes = await getMe();
          setUser(meRes.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, [id, navigate]);

  const nights =
    booking.checkin && booking.checkout
      ? Math.max(0, Math.round((new Date(booking.checkout) - new Date(booking.checkin)) / (1000 * 60 * 60 * 24)))
      : 0;

  const total = nights > 0 && dest?.price ? nights * dest.price * booking.guests : null;

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError("");
    if (!user) return navigate("/login");
    try {
      await createBooking({
        destinationId: id,
        checkIn: booking.checkin,
        checkOut: booking.checkout,
        guests: booking.guests,
      });
      setBookingDone(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || copy.errors.bookingFailed);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!user) return navigate("/login");
    setReviewSubmitting(true);
    try {
      const res = await addReview(id, reviewForm);
      setReviews((prev) => [res.data, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.response?.data?.message || copy.errors.reviewFailed);
    }
    setReviewSubmitting(false);
  };

  const handleLogout = () => { localStorage.removeItem("token"); setUser(null); };

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

  if (loading) return <div className="detail-loading">{copy.states.loading}</div>;
  if (!dest) return null;

  const galleryImages = getDestinationGalleryImages(dest);
  const shownRating = displayRating(dest.rating);

  return (
    <div className="detail-page">
      {/* Breadcrumb / Nav */}
      <div className="breadcrumb">
        <Link to="/">{copy.nav.home}</Link> ›
        <Link to="/destinations"> {copy.nav.destinations}</Link> ›
        <span> {dest.name}</span>
        <div className="breadcrumb-nav">
          <Link to="/shopping" className="bc-link">{copy.nav.shopping || "Stores"}</Link>
          <Link to="/tours" className="bc-link">{copy.nav.tours || "Tours"}</Link>
          <Link to={user ? "/chat" : "/login"} className="bc-link">{copy.nav.chat || "Chat"}<ChatRequestBadge count={chatRequestCount} /></Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="bc-link">{copy.nav.myBookings}</Link>
              {languageSelector}
              <span className="bc-user">{copy.nav.greeting}, {user.name}</span>
              <button className="bc-logout" onClick={handleLogout}>{copy.nav.logout}</button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="bc-link">{copy.nav.signIn}</Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Image */}
      <div className="detail-hero">
        <img src={galleryImages[0]} alt={dest.name} loading="eager" />
        {dest.tag && <span className="detail-tag">{dest.tag}</span>}
      </div>

      <div className="detail-gallery-wrap">
        <div className="detail-gallery-grid">
          {galleryImages.map((image, index) => (
            <div key={`${dest.name}-${index}`} className="detail-gallery-card">
              <img src={image} alt={`${dest.name} ${copy.detail.galleryView} ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="detail-layout">
        {/* Left: Info */}
        <div className="detail-info">
          <div className="detail-header">
            <div>
              <span className="detail-category">{dest.category}</span>
              <h1>{dest.name}</h1>
              <p className="detail-location">📍 {dest.location}</p>
              <p className="detail-lead">{dest.description}</p>
            </div>
            <div className="detail-rating">
              <span className="big-score">{shownRating.toFixed(1)}</span>
              <div>
                <span className="rating-label">{ratingLabel(shownRating, copy)}</span>
                <span className="detail-rating-stars">{ratingStars(shownRating)}</span>
                <span className="review-count">
                  {dest.reviewCount > 0
                    ? `${dest.reviewCount} ${dest.reviewCount === 1 ? copy.rating.reviewSingular : copy.rating.reviewPlural}`
                    : copy.rating.popularTravelerRating}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>{copy.detail.aboutTitle}</h2>
            <p>{formatCopy(copy.detail.aboutBody, { name: dest.name })}</p>
          </div>

          {dest.amenities?.length > 0 && (
            <div className="detail-section">
              <h2>{copy.detail.facilitiesTitle}</h2>
              <div className="amenities-grid">
                {dest.amenities.map((a) => (
                  <div key={a} className="amenity">✓ {a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="detail-section">
            <h2>{copy.detail.guestReviewsTitle} {dest.reviewCount > 0 && `(${dest.reviewCount})`}</h2>

            {user && (
              <form className="review-form" onSubmit={handleReview}>
                <h3>{copy.detail.writeReview}</h3>
                {reviewError && <p className="review-form-error">{reviewError}</p>}
                <div className="review-rating-row">
                  <label>{copy.detail.yourRating}</label>
                  <div className="star-select">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`star ${s <= reviewForm.rating ? "filled" : ""}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                      >★</span>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder={copy.detail.shareExperience}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3}
                  required
                />
                <button type="submit" className="submit-review-btn" disabled={reviewSubmitting}>
                  {reviewSubmitting ? copy.detail.submitting : copy.detail.submitReview}
                </button>
              </form>
            )}

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">{copy.detail.noReviews}</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="review-card">
                    <div className="review-top">
                      <div className="reviewer-avatar">{r.user?.name?.[0] ?? "?"}</div>
                      <div>
                        <p className="reviewer-name">{r.user?.name}</p>
                        <p className="review-date">{new Date(r.createdAt).toLocaleDateString(DETAIL_DATE_LOCALE[language] || "en-US", { month: "long", year: "numeric" })}</p>
                      </div>
                      <span className="review-score">{r.rating}.0</span>
                    </div>
                    <p className="review-text">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <aside className="booking-card">
          {bookingDone ? (
            <div className="booking-success">
              <div className="success-icon">✓</div>
              <h3>{copy.detail.bookingConfirmed}</h3>
              <p>{formatCopy(copy.detail.bookingReserved, { name: dest.name })}</p>
              <Link to="/my-bookings" className="view-bookings-btn">{copy.detail.viewMyBookings}</Link>
              <button className="book-another-btn" onClick={() => setBookingDone(false)}>{copy.detail.bookAgain}</button>
            </div>
          ) : (
            <>
              <div className="booking-price">
                {dest.price ? (
                  <><span className="booking-amount">${dest.price}</span><span className="booking-per">{copy.detail.perNight}</span></>
                ) : (
                  <span className="booking-amount">{copy.detail.contactForPrice}</span>
                )}
              </div>

              {bookingError && <p className="booking-error">{bookingError}</p>}

              <form className="booking-form" onSubmit={handleBook}>
                <div className="booking-dates">
                  <div className="booking-field">
                    <label>{copy.detail.checkIn}</label>
                    <input type="date" value={booking.checkin} onChange={(e) => setBooking({ ...booking, checkin: e.target.value })} required />
                  </div>
                  <div className="booking-field">
                    <label>{copy.detail.checkOut}</label>
                    <input type="date" value={booking.checkout} onChange={(e) => setBooking({ ...booking, checkout: e.target.value })} required />
                  </div>
                </div>
                <div className="booking-field">
                  <label>{copy.detail.guests}</label>
                  <input type="number" min="1" max="20" value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })} />
                </div>

                {total !== null && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>${dest.price} × {nights} {nights === 1 ? copy.detail.nightSingular : copy.detail.nightPlural} × {booking.guests} {booking.guests === 1 ? copy.detail.guestSingular : copy.detail.guestPlural}</span>
                      <span>${total}</span>
                    </div>
                    <div className="summary-row total">
                      <span>{copy.detail.total}</span>
                      <span>${total}</span>
                    </div>
                  </div>
                )}

                <button type="submit" className="reserve-btn">
                  {user ? copy.detail.reserveNow : copy.detail.signInToBook}
                </button>
              </form>
              <p className="booking-note">{copy.detail.bookingNote}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default DestinationDetail;
