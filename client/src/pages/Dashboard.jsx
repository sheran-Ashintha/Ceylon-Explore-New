import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { getMyBookings, getDestinations } from "../services/api";
import { useChatRequestCount } from "../utils/chatRequests";
import { getAccountCopy } from "../utils/accountTranslations";
import {
  getLocalizedSiteCopy,
  SITE_LANGUAGE_DATE_LOCALES,
  SITE_LANGUAGE_OPTIONS,
  useSiteLanguage,
} from "../utils/siteLanguage";
import "./Dashboard.css";

const DASHBOARD_COPY = {
  en: {
    loading: "Loading your dashboard...",
    welcomeBack: "Welcome back",
    welcomeBackWithName: "Welcome back, {name}",
    subtitle: "Here's an overview of your Sri Lanka trips.",
    totalBookings: "Total bookings",
    totalBookingsHint: "Including upcoming, past and cancelled stays.",
    upcomingTrips: "Upcoming trips",
    nextTripTemplate: "Next: {name} on {date}",
    planGetaway: "Plan a new getaway",
    planGetawayText: "Discover handpicked stays, wildlife adventures and coastal escapes.",
    browseDestinations: "Browse destinations",
    exploreDestinations: "Explore Destinations",
    viewAll: "View all",
    noDestinations: "No destinations available right now.",
    upcomingBookings: "Upcoming bookings",
    viewAllBookings: "View all bookings",
    noUpcomingTrips: "No upcoming trips yet.",
    findNextDestination: "Find your next destination",
    recentlyCompleted: "Recently completed",
    pricePerNightSuffix: "/ night",
  },
  si: {
    loading: "ඔබගේ පුවරුව පූරණය වෙමින්...",
    welcomeBack: "නැවත සාදරයෙන් පිළිගනිමු",
    welcomeBackWithName: "නැවත සාදරයෙන් පිළිගනිමු, {name}",
    subtitle: "ඔබගේ ශ්‍රී ලංකා සංචාර පිළිබඳ සාරාංශයකි.",
    totalBookings: "මුළු වෙන් කිරීම්",
    totalBookingsHint: "ඉදිරියට එන, අවසන් වූ සහ අවලංගු කළ නවාතැන් ඇතුළුව.",
    upcomingTrips: "ඉදිරියට එන සංචාර",
    nextTripTemplate: "ඊළඟ: {name} {date} දින",
    planGetaway: "නව සංචාරයක් සැලසුම් කරන්න",
    planGetawayText: "තෝරාගත් නවාතැන්, වනජීවි අත්දැකීම් සහ වෙරළ විවේක සොයන්න.",
    browseDestinations: "ගමනාන්ත බලන්න",
    exploreDestinations: "ගමනාන්ත සොයන්න",
    viewAll: "සියල්ල බලන්න",
    noDestinations: "දැනට ගමනාන්ත නොමැත.",
    upcomingBookings: "ඉදිරියට එන වෙන් කිරීම්",
    viewAllBookings: "සියලු වෙන් කිරීම් බලන්න",
    noUpcomingTrips: "තවම ඉදිරියට එන සංචාර නොමැත.",
    findNextDestination: "ඔබගේ ඊළඟ ගමනාන්තය සොයන්න",
    recentlyCompleted: "මෑතදී අවසන් වූ",
    pricePerNightSuffix: "/ රාත්‍රිය",
  },
  ta: {
    loading: "உங்கள் டாஷ்போர்டு ஏற்றப்படுகிறது...",
    welcomeBack: "மீண்டும் வரவேற்கிறோம்",
    welcomeBackWithName: "மீண்டும் வரவேற்கிறோம், {name}",
    subtitle: "உங்கள் இலங்கை பயணங்களின் ஒரு சுருக்கம் இதோ.",
    totalBookings: "மொத்த முன்பதிவுகள்",
    totalBookingsHint: "வரவிருக்கும், முடிந்த மற்றும் ரத்து செய்யப்பட்ட தங்குதிடல்கள் உட்பட.",
    upcomingTrips: "வரவிருக்கும் பயணங்கள்",
    nextTripTemplate: "அடுத்து: {name} {date}",
    planGetaway: "புதிய விடுமுறையைத் திட்டமிடுங்கள்",
    planGetawayText: "தேர்ந்தெடுக்கப்பட்ட தங்குதிடல்கள், வனவிலங்கு அனுபவங்கள் மற்றும் கடற்கரை ஓய்வுகளை கண்டறியுங்கள்.",
    browseDestinations: "இலக்குகளை பார்க்கவும்",
    exploreDestinations: "இலக்குகளை ஆராயவும்",
    viewAll: "அனைத்தையும் பார்க்கவும்",
    noDestinations: "தற்போது இலக்குகள் எதுவும் இல்லை.",
    upcomingBookings: "வரவிருக்கும் முன்பதிவுகள்",
    viewAllBookings: "அனைத்து முன்பதிவுகளையும் பார்க்கவும்",
    noUpcomingTrips: "இன்னும் வரவிருக்கும் பயணங்கள் இல்லை.",
    findNextDestination: "உங்கள் அடுத்த இலக்கை கண்டுபிடிக்கவும்",
    recentlyCompleted: "சமீபத்தில் முடிந்தவை",
    pricePerNightSuffix: "/ இரவு",
  },
  hi: { loading: "आपका डैशबोर्ड लोड हो रहा है...", welcomeBack: "वापसी पर स्वागत है", welcomeBackWithName: "वापसी पर स्वागत है, {name}", subtitle: "यहाँ आपकी श्रीलंका यात्राओं का एक संक्षिप्त दृश्य है।", totalBookings: "कुल बुकिंग", totalBookingsHint: "आगामी, पिछली और रद्द की गई ठहरनों सहित।", upcomingTrips: "आगामी यात्राएँ", nextTripTemplate: "अगली: {name} {date} को", planGetaway: "नई छुट्टी की योजना बनाएँ", planGetawayText: "चुने हुए ठहराव, वन्यजीव यात्राएँ और तटीय विश्राम खोजें।", browseDestinations: "गंतव्य देखें", exploreDestinations: "गंतव्यों को खोजें", viewAll: "सभी देखें", noDestinations: "अभी कोई गंतव्य उपलब्ध नहीं है।", upcomingBookings: "आगामी बुकिंग", viewAllBookings: "सभी बुकिंग देखें", noUpcomingTrips: "अभी कोई आगामी यात्रा नहीं है।", findNextDestination: "अपना अगला गंतव्य खोजें", recentlyCompleted: "हाल ही में पूरा हुआ", pricePerNightSuffix: "/ रात" },
  zh: { loading: "正在加载您的面板...", welcomeBack: "欢迎回来", welcomeBackWithName: "欢迎回来，{name}", subtitle: "这里是您斯里兰卡行程的概览。", totalBookings: "总预订数", totalBookingsHint: "包含即将到来、过去和已取消的住宿。", upcomingTrips: "即将出行", nextTripTemplate: "下一趟：{date} 前往 {name}", planGetaway: "规划新的假期", planGetawayText: "探索精选住宿、野生动物冒险和海岸度假体验。", browseDestinations: "浏览目的地", exploreDestinations: "探索目的地", viewAll: "查看全部", noDestinations: "目前暂无可用目的地。", upcomingBookings: "即将到来的预订", viewAllBookings: "查看全部预订", noUpcomingTrips: "还没有即将到来的行程。", findNextDestination: "寻找您的下一个目的地", recentlyCompleted: "最近完成", pricePerNightSuffix: "/ 晚" },
  ja: { loading: "ダッシュボードを読み込み中...", welcomeBack: "おかえりなさい", welcomeBackWithName: "おかえりなさい、{name}", subtitle: "スリランカ旅行の概要です。", totalBookings: "総予約数", totalBookingsHint: "今後、過去、キャンセル済みの滞在を含みます。", upcomingTrips: "今後の旅", nextTripTemplate: "次回: {date} {name}", planGetaway: "新しい旅を計画", planGetawayText: "厳選された滞在、野生動物体験、海辺の休暇を見つけましょう。", browseDestinations: "目的地を見る", exploreDestinations: "目的地を探す", viewAll: "すべて見る", noDestinations: "現在利用できる目的地はありません。", upcomingBookings: "今後の予約", viewAllBookings: "すべての予約を見る", noUpcomingTrips: "今後の旅行はまだありません。", findNextDestination: "次の目的地を探す", recentlyCompleted: "最近完了", pricePerNightSuffix: "/ 泊" },
  ko: { loading: "대시보드를 불러오는 중...", welcomeBack: "다시 오신 것을 환영합니다", welcomeBackWithName: "{name}님, 다시 오신 것을 환영합니다", subtitle: "스리랑카 여행 개요입니다.", totalBookings: "총 예약 수", totalBookingsHint: "예정, 지난, 취소된 숙박을 포함합니다.", upcomingTrips: "다가오는 여행", nextTripTemplate: "다음 일정: {date} {name}", planGetaway: "새 여행 계획하기", planGetawayText: "엄선된 숙소, 야생동물 모험, 해안 휴식을 찾아보세요.", browseDestinations: "여행지 둘러보기", exploreDestinations: "여행지 탐색", viewAll: "전체 보기", noDestinations: "현재 이용 가능한 여행지가 없습니다.", upcomingBookings: "다가오는 예약", viewAllBookings: "모든 예약 보기", noUpcomingTrips: "아직 다가오는 여행이 없습니다.", findNextDestination: "다음 여행지 찾기", recentlyCompleted: "최근 완료", pricePerNightSuffix: "/ 박" },
  fr: { loading: "Chargement de votre tableau de bord...", welcomeBack: "Bon retour", welcomeBackWithName: "Bon retour, {name}", subtitle: "Voici un aperçu de vos voyages au Sri Lanka.", totalBookings: "Réservations totales", totalBookingsHint: "Inclut les séjours à venir, passés et annulés.", upcomingTrips: "Voyages à venir", nextTripTemplate: "Prochain : {name} le {date}", planGetaway: "Planifier une nouvelle escapade", planGetawayText: "Découvrez des séjours choisis, des aventures animalières et des échappées côtières.", browseDestinations: "Voir les destinations", exploreDestinations: "Explorer les destinations", viewAll: "Voir tout", noDestinations: "Aucune destination disponible pour le moment.", upcomingBookings: "Réservations à venir", viewAllBookings: "Voir toutes les réservations", noUpcomingTrips: "Aucun voyage à venir pour le moment.", findNextDestination: "Trouver votre prochaine destination", recentlyCompleted: "Récemment terminés", pricePerNightSuffix: "/ nuit" },
  de: { loading: "Ihr Dashboard wird geladen...", welcomeBack: "Willkommen zurück", welcomeBackWithName: "Willkommen zurück, {name}", subtitle: "Hier ist ein Überblick über Ihre Sri-Lanka-Reisen.", totalBookings: "Gesamtbuchungen", totalBookingsHint: "Einschließlich kommender, vergangener und stornierter Aufenthalte.", upcomingTrips: "Kommende Reisen", nextTripTemplate: "Nächste Reise: {name} am {date}", planGetaway: "Neue Auszeit planen", planGetawayText: "Entdecken Sie handverlesene Aufenthalte, Tierabenteuer und Küstenfluchten.", browseDestinations: "Reiseziele ansehen", exploreDestinations: "Reiseziele entdecken", viewAll: "Alle ansehen", noDestinations: "Derzeit sind keine Reiseziele verfügbar.", upcomingBookings: "Kommende Buchungen", viewAllBookings: "Alle Buchungen ansehen", noUpcomingTrips: "Noch keine kommenden Reisen.", findNextDestination: "Finden Sie Ihr nächstes Reiseziel", recentlyCompleted: "Kürzlich abgeschlossen", pricePerNightSuffix: "/ Nacht" },
  es: { loading: "Cargando tu panel...", welcomeBack: "Bienvenido de nuevo", welcomeBackWithName: "Bienvenido de nuevo, {name}", subtitle: "Aquí tienes un resumen de tus viajes por Sri Lanka.", totalBookings: "Reservas totales", totalBookingsHint: "Incluye estancias próximas, pasadas y canceladas.", upcomingTrips: "Viajes próximos", nextTripTemplate: "Siguiente: {name} el {date}", planGetaway: "Planear una nueva escapada", planGetawayText: "Descubre estancias seleccionadas, aventuras de vida salvaje y escapadas costeras.", browseDestinations: "Explorar destinos", exploreDestinations: "Explorar destinos", viewAll: "Ver todo", noDestinations: "No hay destinos disponibles en este momento.", upcomingBookings: "Reservas próximas", viewAllBookings: "Ver todas las reservas", noUpcomingTrips: "Aún no hay viajes próximos.", findNextDestination: "Encuentra tu próximo destino", recentlyCompleted: "Completados recientemente", pricePerNightSuffix: "/ noche" },
  it: { loading: "Caricamento della dashboard...", welcomeBack: "Bentornato", welcomeBackWithName: "Bentornato, {name}", subtitle: "Ecco una panoramica dei tuoi viaggi in Sri Lanka.", totalBookings: "Prenotazioni totali", totalBookingsHint: "Include soggiorni futuri, passati e annullati.", upcomingTrips: "Viaggi in arrivo", nextTripTemplate: "Prossimo: {name} il {date}", planGetaway: "Pianifica una nuova fuga", planGetawayText: "Scopri soggiorni selezionati, avventure nella fauna e fughe costiere.", browseDestinations: "Esplora destinazioni", exploreDestinations: "Esplora destinazioni", viewAll: "Vedi tutto", noDestinations: "Nessuna destinazione disponibile al momento.", upcomingBookings: "Prenotazioni in arrivo", viewAllBookings: "Vedi tutte le prenotazioni", noUpcomingTrips: "Nessun viaggio in arrivo per ora.", findNextDestination: "Trova la tua prossima destinazione", recentlyCompleted: "Completati di recente", pricePerNightSuffix: "/ notte" },
  pt: { loading: "A carregar o seu painel...", welcomeBack: "Bem-vindo de volta", welcomeBackWithName: "Bem-vindo de volta, {name}", subtitle: "Aqui está uma visão geral das suas viagens pelo Sri Lanka.", totalBookings: "Reservas totais", totalBookingsHint: "Inclui estadias futuras, passadas e canceladas.", upcomingTrips: "Viagens futuras", nextTripTemplate: "Próxima: {name} em {date}", planGetaway: "Planear uma nova escapadinha", planGetawayText: "Descubra estadias escolhidas, aventuras com vida selvagem e escapadas costeiras.", browseDestinations: "Explorar destinos", exploreDestinations: "Explorar destinos", viewAll: "Ver tudo", noDestinations: "Não existem destinos disponíveis neste momento.", upcomingBookings: "Reservas futuras", viewAllBookings: "Ver todas as reservas", noUpcomingTrips: "Ainda não há viagens futuras.", findNextDestination: "Encontre o seu próximo destino", recentlyCompleted: "Concluídos recentemente", pricePerNightSuffix: "/ noite" },
  ar: { loading: "جارٍ تحميل لوحتك...", welcomeBack: "مرحبًا بعودتك", welcomeBackWithName: "مرحبًا بعودتك، {name}", subtitle: "إليك نظرة عامة على رحلاتك في سريلانكا.", totalBookings: "إجمالي الحجوزات", totalBookingsHint: "يشمل الإقامات القادمة والسابقة والملغاة.", upcomingTrips: "الرحلات القادمة", nextTripTemplate: "التالي: {name} في {date}", planGetaway: "خطط لعطلة جديدة", planGetawayText: "اكتشف إقامات مختارة ومغامرات الحياة البرية والرحلات الساحلية.", browseDestinations: "تصفح الوجهات", exploreDestinations: "استكشف الوجهات", viewAll: "عرض الكل", noDestinations: "لا توجد وجهات متاحة الآن.", upcomingBookings: "الحجوزات القادمة", viewAllBookings: "عرض كل الحجوزات", noUpcomingTrips: "لا توجد رحلات قادمة بعد.", findNextDestination: "ابحث عن وجهتك التالية", recentlyCompleted: "اكتملت مؤخرًا", pricePerNightSuffix: "/ ليلة" },
  ru: { loading: "Загрузка панели...", welcomeBack: "С возвращением", welcomeBackWithName: "С возвращением, {name}", subtitle: "Вот обзор ваших поездок по Шри-Ланке.", totalBookings: "Всего бронирований", totalBookingsHint: "Включая будущие, прошлые и отменённые поездки.", upcomingTrips: "Предстоящие поездки", nextTripTemplate: "Следующая: {name} {date}", planGetaway: "Запланировать новую поездку", planGetawayText: "Откройте для себя отобранные проживания, приключения с дикой природой и побережье.", browseDestinations: "Смотреть направления", exploreDestinations: "Изучить направления", viewAll: "Смотреть все", noDestinations: "Сейчас нет доступных направлений.", upcomingBookings: "Предстоящие бронирования", viewAllBookings: "Все бронирования", noUpcomingTrips: "Предстоящих поездок пока нет.", findNextDestination: "Найдите следующее направление", recentlyCompleted: "Недавно завершённые", pricePerNightSuffix: "/ ночь" },
  nl: { loading: "Je dashboard wordt geladen...", welcomeBack: "Welkom terug", welcomeBackWithName: "Welkom terug, {name}", subtitle: "Hier is een overzicht van je reizen in Sri Lanka.", totalBookings: "Totaal aantal boekingen", totalBookingsHint: "Inclusief aankomende, eerdere en geannuleerde verblijven.", upcomingTrips: "Aankomende reizen", nextTripTemplate: "Volgende: {name} op {date}", planGetaway: "Plan een nieuwe trip", planGetawayText: "Ontdek zorgvuldig gekozen verblijven, wildlife-avonturen en kustuitjes.", browseDestinations: "Bestemmingen bekijken", exploreDestinations: "Bestemmingen ontdekken", viewAll: "Alles bekijken", noDestinations: "Er zijn momenteel geen bestemmingen beschikbaar.", upcomingBookings: "Aankomende boekingen", viewAllBookings: "Alle boekingen bekijken", noUpcomingTrips: "Nog geen aankomende reizen.", findNextDestination: "Vind je volgende bestemming", recentlyCompleted: "Recent afgerond", pricePerNightSuffix: "/ nacht" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const accountCopy = getAccountCopy(language);
  const copy = getLocalizedSiteCopy(DASHBOARD_COPY, language);
  const locale = SITE_LANGUAGE_DATE_LOCALES[language] || "en-US";
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCopy = (template, values) =>
    template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

  useEffect(() => {
    Promise.all([getMyBookings(), getDestinations()])
      .then(([bookingsRes, destRes]) => {
        setBookings(bookingsRes.data || []);
        setDestinations(destRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const upcoming = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.checkIn) >= today)
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  const past = bookings.filter((b) => new Date(b.checkOut) < today);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const getStatusLabel = (status) => accountCopy.statuses[status] || status;
  const welcomeMessage = user?.name
    ? formatCopy(copy.welcomeBackWithName, { name: user.name })
    : copy.welcomeBack;

  if (loading) {
    return (
      <div className="dashboard-page dashboard-loading">
        <p>{copy.loading}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dash-nav">
        <Link to="/" className="dash-logo">
          Ceylon Explore
        </Link>
        <div className="dash-nav-controls">
          <nav>
            <Link to="/" className="dash-nav-link">
              {accountCopy.nav.home || "Home"}
            </Link>
            <Link to="/destinations" className="dash-nav-link">
              {accountCopy.nav.destinations}
            </Link>
            <Link to="/shopping" className="dash-nav-link">
              {accountCopy.nav.shopping || "Stores"}
            </Link>
            <Link to="/tours" className="dash-nav-link">
              {accountCopy.nav.tours || "Tours"}
            </Link>
            <Link to="/chat" className="dash-nav-link">
              {accountCopy.nav.chat || "Chat"}
              <ChatRequestBadge count={chatRequestCount} />
            </Link>
            <Link to="/my-bookings" className="dash-nav-link">
              {accountCopy.nav.myBookings}
            </Link>
            <div className="dash-lang">
              <span className="dash-lang-label">{accountCopy.selectLanguage}</span>
              <select aria-label={accountCopy.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
                {SITE_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="dash-nav-link dash-nav-link--static">
              {accountCopy.nav.greeting || "Hi"}, {user.name}
            </span>
            <button
              className="dash-nav-btn"
              onClick={() => { logout(); navigate("/"); }}
            >
              {accountCopy.nav.logout}
            </button>
          </nav>
        </div>
      </header>

      <main className="dash-main">
        <section className="dash-header">
          <h1>{welcomeMessage}</h1>
          <p className="dash-subtitle">
            {copy.subtitle}
          </p>
        </section>

        <section className="dash-grid">
          <div className="dash-card">
            <h2>{copy.totalBookings}</h2>
            <p className="dash-number">{formatNumber(bookings.length)}</p>
            <p className="dash-muted">
              {copy.totalBookingsHint}
            </p>
          </div>

          <div className="dash-card">
            <h2>{copy.upcomingTrips}</h2>
            <p className="dash-number">{formatNumber(upcoming.length)}</p>
            {upcoming[0] && (
              <p className="dash-muted">
                {formatCopy(copy.nextTripTemplate, {
                  name: upcoming[0].destination?.name || "",
                  date: formatDate(upcoming[0].checkIn),
                })}
              </p>
            )}
          </div>

          <div className="dash-card dash-cta">
            <h2>{copy.planGetaway}</h2>
            <p className="dash-muted">
              {copy.planGetawayText}
            </p>
            <button
              className="dash-primary-btn"
              onClick={() => navigate("/destinations")}
            >
              {copy.browseDestinations}
            </button>
          </div>
        </section>

        {/* ── Destinations ── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>{copy.exploreDestinations}</h2>
            <Link to="/destinations" className="dash-link">{copy.viewAll}</Link>
          </div>
          {destinations.length === 0 ? (
            <div className="dash-empty">
              <p>{copy.noDestinations}</p>
            </div>
          ) : (
            <div className="dash-dest-grid">
              {destinations.map((dest) => (
                <Link
                  key={dest._id}
                  to={`/destinations/${dest._id}`}
                  className="dash-dest-card"
                >
                  <img
                    src={dest.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"}
                    alt={dest.name}
                  />
                  <div className="dash-dest-info">
                    <h3>{dest.name}</h3>
                    <p className="dash-location">{dest.location}</p>
                    {dest.pricePerNight && (
                      <p className="dash-dest-price">LKR {formatNumber(dest.pricePerNight)} {copy.pricePerNightSuffix}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Upcoming bookings ── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>{copy.upcomingBookings}</h2>
            <Link to="/my-bookings" className="dash-link">
              {copy.viewAllBookings}
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="dash-empty">
              <p>{copy.noUpcomingTrips}</p>
              <button
                className="dash-secondary-btn"
                onClick={() => navigate("/destinations")}
              >
                {copy.findNextDestination}
              </button>
            </div>
          ) : (
            <div className="dash-list">
              {upcoming.slice(0, 3).map((b) => (
                <div key={b._id} className="dash-list-item">
                  <img
                    src={
                      b.destination?.images?.[0] ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
                    }
                    alt={b.destination?.name}
                  />
                  <div className="dash-list-info">
                    <h3>{b.destination?.name}</h3>
                    <p className="dash-location">{b.destination?.location}</p>
                    <p className="dash-dates">
                      {formatDate(b.checkIn)} — {formatDate(b.checkOut)}
                    </p>
                  </div>
                  <div className="dash-list-meta">
                    <span className="dash-status">{getStatusLabel(b.status)}</span>
                    {b.totalPrice && (
                      <span className="dash-price">
                        LKR {formatNumber(b.totalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section className="dash-section">
            <div className="dash-section-head">
              <h2>{copy.recentlyCompleted}</h2>
            </div>
            <div className="dash-tags">
              {past.slice(0, 6).map((b) => (
                <span key={b._id} className="dash-tag">
                  {b.destination?.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
