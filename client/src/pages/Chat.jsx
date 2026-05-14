import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useLocation } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import {
  acceptChatFriendRequest,
  addChatFriend,
  declineChatFriendRequest,
  getChatMembers,
  getChatMessages,
  sendChatMessage,
  updateChatLocation,
} from "../services/api";
import {
  getLocalizedSiteCopy,
  SITE_LANGUAGE_DATE_LOCALES,
  SITE_LANGUAGE_OPTIONS,
  useSiteLanguage,
} from "../utils/siteLanguage";
import "leaflet/dist/leaflet.css";
import "./Shopping.css";
import "./Chat.css";

const CHAT_COPY = {
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
    },
    hero: {
      badge: "Community Lounge",
      title: "Chat with other logged-in travelers",
      subtitle:
        "A shared chat space where signed-in users can introduce themselves, exchange travel plans and get to know each other before exploring Sri Lanka.",
    },
    panel: {
      title: "Live traveler chat",
      refreshHint: "Messages refresh automatically every few seconds.",
      emptyTitle: "No messages yet",
      emptyBody: "Start the conversation and introduce yourself to other travelers.",
      placeholder: "Say hello, share your travel plan, or ask who is visiting Sri Lanka next...",
      sending: "Sending...",
      send: "Send Message",
      rules: "Keep it friendly, travel-focused and respectful.",
      membersTitle: "Active members",
      membersBody: "Members who are active in the chat right now or have spoken recently.",
      joined: "Joined",
      you: "You",
      signedInAs: "Signed in as",
      summaryMessages: "Messages",
      summaryMembers: "Members",
      messageLabel: "Traveler message",
      activeNow: "Active now",
      recentlyActive: "Recently active",
      noActiveMembers: "No other active members yet.",
      requestsTitle: "Friend requests",
      requestsBody: "Accept or decline people who want to connect with you.",
      noRequests: "No pending requests.",
      addFriend: "Add Friend",
      addedFriend: "Friend",
      addingFriend: "Sending...",
      requestSent: "Request Sent",
      sentYouRequest: "Sent you a request",
      accept: "Accept",
      decline: "Decline",
      accepting: "Accepting...",
      declining: "Declining...",
      mapTitle: "Traveler map",
      mapBody: "Share your location to show where you are currently available for chat.",
      enableLocation: "Share my location",
      disableLocation: "Hide my location",
      updatingLocation: "Updating...",
      noMapMembers: "No one is sharing location yet.",
      mapPrivacyHint: "Only users who choose to share are visible on the map.",
      locationActive: "Available on map",
      locationUpdated: "Updated",
      onMap: "On map",
    },
    errors: {
      loadMessages: "Failed to load chat messages.",
      sendMessage: "Failed to send your message.",
      addFriend: "Failed to update friend request.",
      locationShare: "Failed to update your location sharing status.",
      locationUnsupported: "Location sharing is not supported in this browser.",
      locationPermission: "Location permission is blocked. Please allow it and try again.",
      locationUnavailable: "Your current location could not be determined.",
      locationTimeout: "Location lookup timed out. Please try again.",
    },
    footer: "© 2025 Ceylon Explore. All rights reserved.",
  },
};

const AVATAR_THEMES = [
  {
    background: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
    border: "rgba(147, 197, 253, 0.34)",
    shadow: "rgba(37, 99, 235, 0.28)",
  },
  {
    background: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)",
    border: "rgba(94, 234, 212, 0.34)",
    shadow: "rgba(20, 184, 166, 0.28)",
  },
  {
    background: "linear-gradient(135deg, #db2777 0%, #fb7185 100%)",
    border: "rgba(251, 113, 133, 0.34)",
    shadow: "rgba(225, 29, 72, 0.24)",
  },
  {
    background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    border: "rgba(196, 181, 253, 0.34)",
    shadow: "rgba(124, 58, 237, 0.24)",
  },
  {
    background: "linear-gradient(135deg, #ea580c 0%, #fb923c 100%)",
    border: "rgba(253, 186, 116, 0.34)",
    shadow: "rgba(249, 115, 22, 0.24)",
  },
  {
    background: "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
    border: "rgba(165, 180, 252, 0.34)",
    shadow: "rgba(79, 70, 229, 0.24)",
  },
];

const MAP_DEFAULT_CENTER = [7.8731, 80.7718];
const MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_PERSON_EMOJIS = ["🧑", "👩", "👨", "👤", "🙂", "🙋", "🧔", "👵", "👴", "👱"];

function formatTime(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatJoinDate(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getAvatarLabel(name = "Traveler") {
  const cleanedParts = String(name).trim().split(/\s+/).filter(Boolean);

  if (cleanedParts.length >= 2) {
    return `${cleanedParts[0][0] || ""}${cleanedParts[1][0] || ""}`.toUpperCase();
  }

  return cleanedParts[0]?.slice(0, 2).toUpperCase() || "TR";
}

function getAvatarStyle(seed = "") {
  const index = Array.from(String(seed)).reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_THEMES.length;
  const theme = AVATAR_THEMES[index];

  return {
    "--cp-avatar-bg": theme.background,
    "--cp-avatar-border": theme.border,
    "--cp-avatar-shadow": theme.shadow,
  };
}

function getMapPersonEmoji(seed = "") {
  const index = Array.from(String(seed)).reduce((sum, char) => sum + char.charCodeAt(0), 0) % MAP_PERSON_EMOJIS.length;
  return MAP_PERSON_EMOJIS[index];
}

function createMemberMapIcon(member, isOwnLocation) {
  const markerSeed = `${member.name || "Traveler"}-${member._id || "member"}`;
  const emoji = getMapPersonEmoji(markerSeed);
  const initials = getAvatarLabel(member.name || "Traveler");
  const avatarUrl = String(member.avatarUrl || "").trim();
  const markerMedia = avatarUrl
    ? `<img class="cp-map-person-photo" src="${avatarUrl}" alt="${initials}" referrerpolicy="no-referrer" />`
    : `<span class="cp-map-person-emoji" aria-hidden="true">${emoji}</span>`;

  return L.divIcon({
    className: "cp-map-person-icon",
    html: `
      <div class="cp-map-person-pin${isOwnLocation ? " cp-map-person-pin--you" : ""}">
        <span class="cp-map-person-media">${markerMedia}</span>
        <span class="cp-map-person-initials">${initials}</span>
      </div>
    `,
    iconSize: [48, 58],
    iconAnchor: [24, 56],
    popupAnchor: [0, -46],
  });
}

function requestCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("UNSUPPORTED"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  });
}

export default function Chat() {
  const { user, logout } = useAuth();
  const { search } = useLocation();
  const { language, setLanguage } = useSiteLanguage();
  const copy = getLocalizedSiteCopy(CHAT_COPY, language);
  const locale = SITE_LANGUAGE_DATE_LOCALES[language] || "en-US";
  const currentUserId = user?._id || user?.id;
  const shouldAutoShareLocation = new URLSearchParams(search).get("shareLocation") === "1";
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [processingMemberId, setProcessingMemberId] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [error, setError] = useState("");
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [locationUpdating, setLocationUpdating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const messageListRef = useRef(null);
  const autoShareLocationRef = useRef(false);

  const memberCount = members.length;
  const mapMembers = members.filter((member) => {
    const latitude = Number(member.location?.latitude);
    const longitude = Number(member.location?.longitude);
    return Boolean(member.location?.isVisible) && Number.isFinite(latitude) && Number.isFinite(longitude);
  });
  const mapCenterMember = mapMembers.find((member) => member._id === currentUserId) || mapMembers[0];
  const mapCenter = mapCenterMember
    ? [Number(mapCenterMember.location.latitude), Number(mapCenterMember.location.longitude)]
    : MAP_DEFAULT_CENTER;

  useEffect(() => {
    let active = true;

    const loadMessages = async (showLoading = false) => {
      if (showLoading && active) {
        setLoading(true);
      }

      try {
        const { data } = await getChatMessages();
        if (active) {
          setMessages(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || copy.errors.loadMessages);
        }
      } finally {
        if (showLoading && active) {
          setLoading(false);
        }
      }
    };

    const loadMembers = async () => {
      try {
        const { data } = await getChatMembers();
        if (active) {
          setMembers(data.activeMembers || []);
          setIncomingRequests(data.incomingRequests || []);
          setIsSharingLocation(Boolean(data.selfLocation?.isVisible));
        }
      } catch {
        // Keep chat usable even if the member list fails.
      }
    };

    loadMessages(true);
    loadMembers();

    const messageInterval = window.setInterval(() => loadMessages(false), 5000);
    const memberInterval = window.setInterval(loadMembers, 30000);

    return () => {
      active = false;
      window.clearInterval(messageInterval);
      window.clearInterval(memberInterval);
    };
  }, [copy.errors.loadMessages]);

  useEffect(() => {
    const container = messageListRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = draft.trim();

    if (!body) {
      return;
    }

    setSending(true);

    try {
      const { data } = await sendChatMessage({ body });
      setMessages((prev) => [...prev, data]);
      setDraft("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || copy.errors.sendMessage);
    } finally {
      setSending(false);
    }
  };

  const applyOwnLocation = useCallback((nextLocation) => {
    const latitude = Number(nextLocation?.latitude);
    const longitude = Number(nextLocation?.longitude);
    const normalizedLocation = {
      isVisible: Boolean(nextLocation?.isVisible),
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
      updatedAt: nextLocation?.updatedAt || null,
    };

    setIsSharingLocation(normalizedLocation.isVisible);
    setMembers((prev) => prev.map((member) => (
      member._id === currentUserId
        ? { ...member, location: normalizedLocation }
        : member
    )));
  }, [currentUserId]);

  const handleToggleLocationSharing = useCallback(async () => {
    if (locationUpdating) {
      return;
    }

    setLocationUpdating(true);
    setLocationError("");

    try {
      if (isSharingLocation) {
        const { data } = await updateChatLocation({ isVisible: false });
        applyOwnLocation(data.location);
        return;
      }

      const position = await requestCurrentPosition();
      const latitude = Number(position.coords.latitude.toFixed(5));
      const longitude = Number(position.coords.longitude.toFixed(5));
      const { data } = await updateChatLocation({
        isVisible: true,
        latitude,
        longitude,
      });

      applyOwnLocation(data.location);
    } catch (err) {
      if (err.response?.data?.message) {
        setLocationError(err.response.data.message);
      } else {
        let nextErrorMessage = copy.errors.locationShare;

        if (err?.message === "UNSUPPORTED") {
          nextErrorMessage = copy.errors.locationUnsupported;
        } else {
          switch (err?.code) {
            case 1:
              nextErrorMessage = copy.errors.locationPermission;
              break;
            case 2:
              nextErrorMessage = copy.errors.locationUnavailable;
              break;
            case 3:
              nextErrorMessage = copy.errors.locationTimeout;
              break;
            default:
              nextErrorMessage = copy.errors.locationShare;
          }
        }

        setLocationError(nextErrorMessage);
      }
    } finally {
      setLocationUpdating(false);
    }
  }, [
    applyOwnLocation,
    copy.errors.locationPermission,
    copy.errors.locationShare,
    copy.errors.locationTimeout,
    copy.errors.locationUnavailable,
    copy.errors.locationUnsupported,
    isSharingLocation,
    locationUpdating,
  ]);

  useEffect(() => {
    if (!shouldAutoShareLocation) {
      autoShareLocationRef.current = false;
      return;
    }

    if (loading || locationUpdating || isSharingLocation || autoShareLocationRef.current) {
      return;
    }

    autoShareLocationRef.current = true;
    void handleToggleLocationSharing();
  }, [shouldAutoShareLocation, loading, locationUpdating, isSharingLocation, handleToggleLocationSharing]);

  const handleAddFriend = async (memberId) => {
    if (!memberId || memberId === currentUserId || processingMemberId === memberId) {
      return;
    }

    setProcessingMemberId(memberId);
    setProcessingAction("send");

    try {
      await addChatFriend(memberId);
      setMembers((prev) => prev.map((member) => (
        member._id === memberId
          ? { ...member, hasOutgoingRequest: true, hasIncomingRequest: false }
          : member
      )));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || copy.errors.addFriend);
    } finally {
      setProcessingMemberId("");
      setProcessingAction("");
    }
  };

  const handleAcceptFriendRequest = async (memberId) => {
    if (!memberId || processingMemberId === memberId) {
      return;
    }

    setProcessingMemberId(memberId);
    setProcessingAction("accept");

    try {
      await acceptChatFriendRequest(memberId);
      setIncomingRequests((prev) => prev.filter((member) => member._id !== memberId));
      setMembers((prev) => prev.map((member) => (
        member._id === memberId
          ? { ...member, isFriend: true, hasIncomingRequest: false, hasOutgoingRequest: false }
          : member
      )));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || copy.errors.addFriend);
    } finally {
      setProcessingMemberId("");
      setProcessingAction("");
    }
  };

  const handleDeclineFriendRequest = async (memberId) => {
    if (!memberId || processingMemberId === memberId) {
      return;
    }

    setProcessingMemberId(memberId);
    setProcessingAction("decline");

    try {
      await declineChatFriendRequest(memberId);
      setIncomingRequests((prev) => prev.filter((member) => member._id !== memberId));
      setMembers((prev) => prev.map((member) => (
        member._id === memberId
          ? { ...member, hasIncomingRequest: false }
          : member
      )));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || copy.errors.addFriend);
    } finally {
      setProcessingMemberId("");
      setProcessingAction("");
    }
  };

  const languageSelector = (
    <div className="sp-lang">
      <span className="sp-lang-label">{copy.nav.selectLanguage}</span>
      <select aria-label={copy.nav.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="sp cp">
      <header className="sp-nav">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="sp-nav-right">
          <Link to="/" className="sp-nav-link">{copy.nav.home}</Link>
          <Link to="/destinations" className="sp-nav-link">{copy.nav.destinations}</Link>
          <Link to="/shopping" className="sp-nav-link">{copy.nav.shopping}</Link>
          <Link to="/tours" className="sp-nav-link">{copy.nav.tours}</Link>
          <Link to="/sos" className="sp-nav-link">SOS</Link>
          <Link to="/chat" className="sp-nav-link">{copy.nav.chat}<ChatRequestBadge count={incomingRequests.length} /></Link>
          <Link to="/my-bookings" className="sp-nav-link">{copy.nav.myBookings}</Link>
          {languageSelector}
          <span className="sp-nav-name">{copy.nav.greeting}, {user.name}</span>
          <button className="sp-nav-btn sp-nav-btn--outline" onClick={logout}>{copy.nav.logout}</button>
        </nav>
      </header>

      <section className="cp-section">
        <div className="sp-container">
          <div className="cp-toolbar">
            <div className="cp-toolbar-copy">
              <span className="cp-badge">{copy.hero.badge}</span>
              <h1 className="cp-title">{copy.hero.title}</h1>
              <p className="cp-subtitle">{copy.hero.subtitle}</p>
            </div>
            <div className="cp-toolbar-user">
              <div className="cp-avatar cp-avatar--profile" style={getAvatarStyle(user.email || user.name)} aria-hidden="true">
                {getAvatarLabel(user.name)}
              </div>
              <div className="cp-user-copy">
                <p>{copy.panel.signedInAs}</p>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <div className="cp-toolbar-meta">
                <div className="cp-toolbar-stat">
                  <span>{copy.panel.summaryMessages}</span>
                  <strong>{messages.length}</strong>
                </div>
                <div className="cp-toolbar-stat">
                  <span>{copy.panel.summaryMembers}</span>
                  <strong>{memberCount}</strong>
                </div>
              </div>
            </div>

          </div>

          <div className="cp-layout">
            <div className="cp-panel cp-panel--chat">
              <div className="cp-panel-head">
                <div>
                  <h2>{copy.panel.title}</h2>
                  <p>{copy.panel.refreshHint}</p>
                </div>
                <span className="cp-rule">{copy.panel.rules}</span>
              </div>

              {error && <div className="cp-error">{error}</div>}

              <div className="cp-messages" ref={messageListRef}>
                {loading ? (
                  <div className="cp-empty-state">
                    <h3>{copy.panel.title}</h3>
                    <p>{copy.panel.refreshHint}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="cp-empty-state">
                    <h3>{copy.panel.emptyTitle}</h3>
                    <p>{copy.panel.emptyBody}</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender?._id === currentUserId;
                    const senderName = message.sender?.name || "Traveler";
                    const avatarSeed = `${senderName}-${message.sender?._id || message._id}`;

                    return (
                      <article key={message._id} className={`cp-message${isOwnMessage ? " cp-message--own" : ""}`} aria-label={copy.panel.messageLabel}>
                        <div className="cp-avatar cp-avatar--message" style={getAvatarStyle(avatarSeed)} aria-hidden="true">
                          {getAvatarLabel(senderName)}
                        </div>
                        <div className="cp-bubble">
                          <div className="cp-bubble-head">
                            <strong>
                              {senderName}
                              {isOwnMessage ? ` · ${copy.panel.you}` : ""}
                            </strong>
                            <span>{formatTime(message.createdAt, locale)}</span>
                          </div>
                          <p>{message.body}</p>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              <form className="cp-compose" onSubmit={handleSubmit}>
                <div className="cp-compose-shell">
                  <div className="cp-avatar cp-avatar--composer" style={getAvatarStyle(user.email || user.name)} aria-hidden="true">
                    {getAvatarLabel(user.name)}
                  </div>
                  <div className="cp-compose-main">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={copy.panel.placeholder}
                      maxLength={500}
                    />
                    <div className="cp-compose-foot">
                      <span>{draft.trim().length}/500</span>
                      <button type="submit" className="sp-card-btn" disabled={sending || !draft.trim()}>
                        {sending ? copy.panel.sending : copy.panel.send}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <aside className="cp-panel cp-panel--members">
              <div className="cp-request-section">
                <div className="cp-request-head">
                  <div className="cp-request-title-row">
                    <h3>{copy.panel.requestsTitle}</h3>
                    <ChatRequestBadge count={incomingRequests.length} />
                  </div>
                  <p>{copy.panel.requestsBody}</p>
                </div>

                <div className="cp-member-list cp-member-list--requests">
                  {incomingRequests.length === 0 ? (
                    <div className="cp-empty-members">{copy.panel.noRequests}</div>
                  ) : (
                    incomingRequests.map((member) => (
                      <article key={member._id} className="cp-member-card cp-member-card--request">
                        <div className="cp-avatar cp-avatar--member" style={getAvatarStyle(`${member.name}-${member._id}`)} aria-hidden="true">
                          {getAvatarLabel(member.name)}
                        </div>
                        <div className="cp-member-copy">
                          <div className="cp-member-top">
                            <strong>{member.name}</strong>
                            <span className="cp-member-badge cp-member-badge--request">{copy.panel.sentYouRequest}</span>
                          </div>
                          <p>
                            {member.lastMessageAt
                              ? `${copy.panel.recentlyActive} · ${formatTime(member.lastMessageAt, locale)}`
                              : `${copy.panel.joined} ${formatJoinDate(member.createdAt, locale)}`}
                          </p>
                        </div>
                        <div className="cp-request-actions">
                          <button
                            type="button"
                            className="cp-friend-btn"
                            onClick={() => handleAcceptFriendRequest(member._id)}
                            disabled={processingMemberId === member._id}
                          >
                            {processingMemberId === member._id && processingAction === "accept"
                              ? copy.panel.accepting
                              : copy.panel.accept}
                          </button>
                          <button
                            type="button"
                            className="cp-friend-btn cp-friend-btn--ghost"
                            onClick={() => handleDeclineFriendRequest(member._id)}
                            disabled={processingMemberId === member._id}
                          >
                            {processingMemberId === member._id && processingAction === "decline"
                              ? copy.panel.declining
                              : copy.panel.decline}
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="cp-map-section">
                <div className="cp-map-head">
                  <div>
                    <h3>{copy.panel.mapTitle}</h3>
                    <p>{copy.panel.mapBody}</p>
                  </div>
                  <button
                    type="button"
                    className={`cp-location-toggle${isSharingLocation ? " cp-location-toggle--on" : ""}`}
                    onClick={handleToggleLocationSharing}
                    disabled={locationUpdating}
                  >
                    {locationUpdating
                      ? copy.panel.updatingLocation
                      : isSharingLocation
                        ? copy.panel.disableLocation
                        : copy.panel.enableLocation}
                  </button>
                </div>

                {locationError ? <div className="cp-location-error">{locationError}</div> : null}

                <div className="cp-map-shell">
                  {mapMembers.length === 0 ? (
                    <div className="cp-empty-members">{copy.panel.noMapMembers}</div>
                  ) : (
                    <MapContainer
                      key={mapCenter.join("-")}
                      center={mapCenter}
                      zoom={7}
                      className="cp-map-canvas"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={MAP_TILE_URL}
                      />
                      {mapMembers.map((member) => {
                        const latitude = Number(member.location?.latitude);
                        const longitude = Number(member.location?.longitude);
                        const isOwnLocation = member._id === currentUserId;
                        const markerIcon = createMemberMapIcon(member, isOwnLocation);

                        return (
                          <Marker
                            key={`map-${member._id}`}
                            position={[latitude, longitude]}
                            icon={markerIcon}
                          >
                            <Popup>
                              <strong>
                                {member.name}
                                {isOwnLocation ? ` (${copy.panel.you})` : ""}
                              </strong>
                              <p>{copy.panel.locationActive}</p>
                              {member.location?.updatedAt ? (
                                <p>{copy.panel.locationUpdated} {formatTime(member.location.updatedAt, locale)}</p>
                              ) : null}
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  )}
                </div>

                <p className="cp-map-note">{copy.panel.mapPrivacyHint}</p>
              </div>

              <div className="cp-panel-head cp-panel-head--stack">
                <div>
                  <h2>{copy.panel.membersTitle}</h2>
                  <p>{copy.panel.membersBody}</p>
                </div>
                <span className="cp-member-count">{members.length}</span>
              </div>

              <div className="cp-member-list">
                {members.length === 0 ? (
                  <div className="cp-empty-members">{copy.panel.noActiveMembers}</div>
                ) : (
                  members.map((member) => (
                    <article key={member._id} className={`cp-member-card${member._id === currentUserId ? " cp-member-card--you" : ""}`}>
                      <div className="cp-avatar cp-avatar--member" style={getAvatarStyle(`${member.name}-${member._id}`)} aria-hidden="true">
                        {getAvatarLabel(member.name)}
                      </div>
                      <div className="cp-member-copy">
                        <div className="cp-member-top">
                          <strong>{member.name}</strong>
                          {member._id === currentUserId ? <span className="cp-member-badge">{copy.panel.you}</span> : null}
                        </div>
                        <p>
                          {member.isActiveNow ? copy.panel.activeNow : copy.panel.recentlyActive}
                          {member.lastMessageAt ? ` · ${formatTime(member.lastMessageAt, locale)}` : ` · ${copy.panel.joined} ${formatJoinDate(member.createdAt, locale)}`}
                          {member.location?.isVisible ? ` · ${copy.panel.onMap}` : ""}
                        </p>
                      </div>
                      {member._id !== currentUserId ? (
                        member.isFriend ? (
                          <span className="cp-friend-chip">{copy.panel.addedFriend}</span>
                        ) : member.hasIncomingRequest ? (
                          <span className="cp-friend-chip cp-friend-chip--request">{copy.panel.sentYouRequest}</span>
                        ) : member.hasOutgoingRequest ? (
                          <span className="cp-friend-chip cp-friend-chip--pending">{copy.panel.requestSent}</span>
                        ) : (
                          <button
                            type="button"
                            className="cp-friend-btn"
                            onClick={() => handleAddFriend(member._id)}
                            disabled={processingMemberId === member._id}
                          >
                            {processingMemberId === member._id && processingAction === "send"
                              ? copy.panel.addingFriend
                              : copy.panel.addFriend}
                          </button>
                        )
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer className="sp-footer">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}