import React, { useEffect, useMemo, useRef, useState } from "react";
import reelsGoLogo from "../image.png";
import {
  Home, Search, PlusSquare, Heart, MessageCircle, User, Settings, LogOut,
  Camera, Menu, X, Image as ImageIcon, Film, Bookmark, Compass, MoreHorizontal,
  Send, Grid3X3, Users, Lock, Shield, Trash2, Archive, Edit3, Check, UserPlus,
  UserMinus, Flag, ChevronRight, Play, Bell, Mic, Smile, Paperclip, Upload,
  SlidersHorizontal, KeyRound, Eye, EyeOff, HelpCircle, Languages, Moon, Sun,
  Link as LinkIcon, AtSign, UserRoundCheck, Smartphone, Mail, CircleUser,
  Clock3, Ban, MessageSquareText, CircleHelp, AlertTriangle, CameraOff, ChevronUp, ChevronDown, CircleMinus, HeartOff, SendHorizontal, Download, Maximize2, Link2, Handshake, PinOff, QrCode, BadgeCheck, Volume2, VolumeX
} from "lucide-react";

const API = (import.meta.env.VITE_API_URL || "https://reelsgo.onrender.com/api").replace(/\/$/, "");
const SERVER = API.replace(/\/api\/?$/, "");


// Built-in emoji picker: no external package required, so it works on desktop,
// Android, iPhone/iPad and small-screen browsers without extra dependencies.
const REELSGO_EMOJI_CATEGORIES = {
  Smileys: [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑"
  ],
  People: [
    "👋","🤚","🖐️","✋","🖖","👌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🙏","💪","🫶","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","✨","💫","⭐","🌟","🔥","💯","🎉","🎊","🥳"
  ],
  Animals: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🪲","🦋","🐌","🐞","🐜","🕷️","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦀","🐠","🐟","🐡","🐬","🐳","🦈","🐊","🐘","🦏","🦛","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌"
  ],
  Food: [
    "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🥪","🥙","🌮","🌯","🥗","🍿","🍣","🍤","🍜","🍝","🍚","🍙","🍱","🥟","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍭","🍬","🍮","☕","🧋","🥤","🍹","🍺","🍻","🍷","🥂"
  ],
  Travel: [
    "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍️","🚲","✈️","🛫","🛬","🚁","🚀","🛸","🚢","⛵","🚤","🗺️","🗽","🗼","🏰","🏯","🏝️","🏖️","🏜️","🌋","⛰️","🏔️","🌅","🌄","🌇","🌃","🌌","🌠","🌍","🌎","🌏","🏕️","⛺","🎡","🎢","🎠","🎭","🎨","🎬","🎤","🎧","🎮","🎲","⚽","🏀","🏈","⚾","🎾","🏆"
  ],
  Objects: [
    "📱","💻","🖥️","⌨️","🖱️","🖨️","📷","📸","📹","🎥","☎️","📞","📺","📻","⏰","⌚","💡","🔦","🕯️","📚","📖","✏️","📝","📌","📎","🔒","🔓","🔑","🔨","🛠️","⚙️","🔧","🔗","💎","💰","💵","💳","🎁","🎈","🎀","🧸","🪄","🎯","🚨","⚡","☀️","🌙","☁️","☔","❄️","☃️","🌈","💥","💦","💨"
  ],
  Symbols: [
    "❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🩶","🤍","💔","❤️‍🔥","❤️‍🩹","💋","💯","💢","💥","💫","💦","💨","🕳️","💣","💬","👁️‍🗨️","💤","✔️","☑️","❌","❗","❓","‼️","⁉️","⭕","🚫","⚠️","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","🔺","🔻","🔶","🔷","🔸","🔹","⭐","🌟","✨","⚡","🔥","🎉","🎊","💖","💘","💝"
  ],
  Flags: [
    "🏳️","🏴","🏁","🚩","🏳️‍🌈","🏳️‍⚧️","🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇯🇵","🇰🇷","🇸🇬","🇦🇪","🇩🇪","🇫🇷","🇮🇹","🇪🇸","🇧🇷","🇲🇽","🇿🇦","🇳🇿","🇵🇭","🇮🇩","🇹🇭","🇻🇳","🇸🇦","🇹🇷","🇨🇭","🇳🇱","🇸🇪","🇳🇴","🇩🇰","🇫🇮","🇮🇪","🇵🇹","🇬🇷","🇷🇺","🇺🇦","🇵🇱","🇦🇹","🇧🇪","🇦🇷","🇨🇱","🇨🇴","🇵🇪","🇪🇬","🇳🇬","🇰🇪"
  ]
};

const REELSGO_EMOJI_TABS = Object.keys(REELSGO_EMOJI_CATEGORIES);

const getToken = () => localStorage.getItem("vk_token");
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("vk_user") || "null"); } catch { return null; }
};

function authHeaders(extra = {}) {
  return { ...extra, ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) };
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {})
  });
  const type = response.headers.get("content-type") || "";
  const raw = await response.text();
  let data;
  try {
    data = type.includes("application/json") ? JSON.parse(raw) : { message: raw };
  } catch {
    data = { message: raw || `HTTP ${response.status}` };
  }
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`);
  return data;
}

function avatarUrl(user) {
  return user?._id ? `${SERVER}/api/users/${user._id}/avatar?v=${user.updatedAt || ""}` : "";
}


/* =========================================================
   REELSGO CUSTOM BLUE VERIFICATION
   No OTP / Firebase / Twilio / SMS.
   The backend stores the phone number once and returns
   verified=true. This is a custom ReelsGo badge system.
   ========================================================= */

const verificationStatusCache = new Map();

function normalizeReelsGoPhone(value) {
  let phone = String(value || "")
    .trim()
    .replace(/[\s().-]/g, "");

  if (/^[6-9]\d{9}$/.test(phone)) {
    phone = `+91${phone}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error(
      "Enter a valid phone number. Example: +919876543210."
    );
  }

  return phone;
}

function VerifiedBadge({ userId, title = "Verified on ReelsGo" }) {
  const [verified, setVerified] = useState(
    () => userId ? verificationStatusCache.get(String(userId)) === true : false
  );

  useEffect(() => {
    if (!userId) return;

    const id = String(userId);
    let cancelled = false;

    async function loadStatus(force = false) {
      if (!force && verificationStatusCache.has(id)) {
        if (!cancelled) {
          setVerified(verificationStatusCache.get(id) === true);
        }
        return;
      }

      try {
        const data = await api(`/verification/status/${id}`);
        const isVerified = Boolean(data?.verified);
        verificationStatusCache.set(id, isVerified);
        if (!cancelled) setVerified(isVerified);
      } catch {
        verificationStatusCache.set(id, false);
        if (!cancelled) setVerified(false);
      }
    }

    loadStatus();

    const refresh = () => {
      verificationStatusCache.delete(id);
      loadStatus(true);
    };

    window.addEventListener("reelsgo-verification-updated", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("reelsgo-verification-updated", refresh);
    };
  }, [userId]);

  if (!verified) return null;

  return (
    <span
      className="verified-badge"
      title={title}
      aria-label={title}
      role="img"
    >
      <BadgeCheck />
    </span>
  );
}

function PhoneVerificationModal({ onClose, onVerified }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const normalizedPhone = normalizeReelsGoPhone(phone);

      const data = await api("/verification/phone/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone: normalizedPhone })
      });

      const currentUser = getUser();

      if (currentUser?._id) {
        verificationStatusCache.set(String(currentUser._id), true);
      }

      window.dispatchEvent(
        new CustomEvent("reelsgo-verification-updated")
      );

      setSuccess(true);
      onVerified?.(data);
    } catch (err) {
      setError(err?.message || "Unable to save phone number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="verification-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="verification-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="verification-head">
          <div className="verification-icon">
            <BadgeCheck />
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close verification"
          >
            <X />
          </button>
        </div>

        {success ? (
          <>
            <h2>Blue tick activated</h2>
            <p>
              Your phone number has been saved to your ReelsGo account.
              Your blue tick is now active.
            </p>
            <div className="verification-success">
              <BadgeCheck />
              <span>Your account is now verified.</span>
            </div>
            <button
              type="button"
              className="primary full"
              onClick={onClose}
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2>Get your ReelsGo blue tick</h2>
            <p>
              Enter your phone number once. No OTP or SMS is required.
              After saving, you cannot change the number.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="verification-label">Phone number</label>
              <input
                className="verification-input"
                type="tel"
                value={phone}
                placeholder="+91 9876543210"
                autoComplete="tel"
                inputMode="tel"
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
              <small className="verification-hint">
                Example: +919876543210
              </small>

              {error && (
                <div className="verification-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="primary full"
                disabled={loading || !phone.trim()}
              >
                {loading ? "Saving..." : "Save number & get blue tick"}
              </button>
            </form>

            <div className="verification-note">
              <Shield />
              <span>
                One ReelsGo account can use only one phone number.
                One phone number can be used for only one verified account.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Avatar({ user, size = 42, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = user?.avatar && typeof user.avatar === "string" ? user.avatar : avatarUrl(user);
  const initial = (user?.name || user?.username || "U").slice(0, 1).toUpperCase();
  return (
    <div className={`avatar ${className}`} style={{ width: size, height: size, minWidth: size, minHeight: size, aspectRatio: "1 / 1", borderRadius: "50%", overflow: "hidden" }}>
      {!failed && src ? (
        <img src={src} alt="" onError={() => setFailed(true)} style={{ width: "100%", height: "100%", minWidth: "100%", minHeight: "100%", maxWidth: "none", maxHeight: "none", aspectRatio: "1 / 1", objectFit: "cover", objectPosition: "center", borderRadius: "50%", display: "block" }} />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}


function openUserProfile(userId) {
  if (!userId) return;
  window.dispatchEvent(new CustomEvent("vk-open-profile", { detail: { id: userId } }));
}

function UserLink({ user, className = "" }) {
  const label = user?.username || user?.name || "User";
  if (!user?._id) return <span className={className}>{label}</span>;
  return (
    <span
      className={`profile-username-link ${className}`}
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); openUserProfile(user._id); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); openUserProfile(user._id); } }}
    >
      {label}
      <VerifiedBadge userId={user._id} />
    </span>
  );
}


/* ReelsGo responsive viewport guard */
function ReelsGoViewport() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content =
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
  }, []);
  return null;
}

function ReelsGoBranding() {
  useEffect(() => {
    document.title = "ReelsGo";
    let icon = document.querySelector('link[data-reelsgo-favicon="true"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/png";
      icon.dataset.reelsgoFavicon = "true";
      document.head.appendChild(icon);
    }
    icon.remove();
  }, []);
  return null;
}

function ReelsGoLogo({ className = "" }) {
  return <span className={`reelsgo-text-logo ${className}`}>REELSGO</span>;
}


/* =========================================================
   REELSGO ADVANCED HUB
   Working MVP controls stored locally in this browser.
   Server-dependent AI, payments and analytics are clearly
   presented as integrations to connect before production.
   ========================================================= */
function ReelsGoAdvancedHub({ user }) {
  const tabs = [
    { id: "control", label: "My Feed, My Rules", icon: SlidersHorizontal },
    { id: "creator", label: "Creator Super Studio", icon: Film },
    { id: "privacy", label: "Privacy per post", icon: Lock },
    { id: "community", label: "Communities", icon: Users },
    { id: "wellbeing", label: "Smart Scroll & Focus", icon: Clock3 },
    { id: "editor", label: "Advanced Reels Editor", icon: Camera },
    { id: "earn", label: "Creator Earnings", icon: Handshake },
    { id: "trust", label: "Trust & Scam Protection", icon: Shield },
    { id: "collab", label: "Collaborative Content", icon: UserPlus },
    { id: "library", label: "Smart Save Library", icon: Bookmark },
    { id: "local", label: "Local Discovery & Events", icon: Compass }
  ];
  const [tab, setTab] = useState("control");
  const [prefs, setPrefs] = useState(() => {
    try { return { feed: "For you", chronological: false, autoplay: true, suggestions: true, sponsored: true, sessionLimit: 20, bedtime: false, ...JSON.parse(localStorage.getItem("reelsgo_advanced_prefs") || "{}") }; }
    catch { return { feed: "For you", chronological: false, autoplay: true, suggestions: true, sponsored: true, sessionLimit: 20, bedtime: false }; }
  });
  const [library, setLibrary] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_smart_library") || "[]"); } catch { return []; }
  });
  const [drafts, setDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_creator_drafts") || "[]"); } catch { return []; }
  });
  const [communities, setCommunities] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_communities") || "[]"); } catch { return []; }
  });
  const [joined, setJoined] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_joined_communities") || "[]"); } catch { return []; }
  });
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const [focusActive, setFocusActive] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [notice, setNotice] = useState("");
  const [privacyAudience, setPrivacyAudience] = useState("Everyone");
  const [privacyComments, setPrivacyComments] = useState("Everyone");
  const [privacyDownloads, setPrivacyDownloads] = useState(false);
  const [privacyRemix, setPrivacyRemix] = useState(true);
  const [collabTitle, setCollabTitle] = useState("");
  const [collabUsername, setCollabUsername] = useState("");
  const [collabItems, setCollabItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_collaboration_invites") || "[]"); } catch { return []; }
  });
  const [editorFile, setEditorFile] = useState(null);
  const [editorCaption, setEditorCaption] = useState("");
  const [editorMuted, setEditorMuted] = useState(false);
  const [editorAutoCaptions, setEditorAutoCaptions] = useState(true);
  const [localArea, setLocalArea] = useState("");
  const [localEventTitle, setLocalEventTitle] = useState("");
  const [localEvents, setLocalEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reelsgo_local_event_drafts") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("reelsgo_advanced_prefs", JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => { localStorage.setItem("reelsgo_smart_library", JSON.stringify(library)); }, [library]);
  useEffect(() => { localStorage.setItem("reelsgo_creator_drafts", JSON.stringify(drafts)); }, [drafts]);
  useEffect(() => { localStorage.setItem("reelsgo_communities", JSON.stringify(communities)); }, [communities]);
  useEffect(() => { localStorage.setItem("reelsgo_joined_communities", JSON.stringify(joined)); }, [joined]);
  useEffect(() => {
    if (!focusActive) return;
    const id = window.setInterval(() => setFocusSeconds(v => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [focusActive]);

  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }
  function addLibraryItem(e) {
    e.preventDefault();
    if (!saveTitle.trim()) return;
    setLibrary(items => [{ id: `${Date.now()}`, title: saveTitle.trim(), url: saveUrl.trim(), note: "", createdAt: new Date().toISOString() }, ...items]);
    setSaveTitle(""); setSaveUrl("");
    flash("Added to your Smart Save Library.");
  }
  function addDraft(e) {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    setDrafts(items => [{ id: `${Date.now()}`, title: draftTitle.trim(), date: draftDate, status: draftDate ? "Scheduled locally" : "Draft", createdAt: new Date().toISOString() }, ...items]);
    setDraftTitle(""); setDraftDate("");
    flash("Creator item saved on this device.");
  }
  function createCommunity(name) {
    const clean = name.trim();
    if (!clean) return;
    setCommunities(items => [...items, { id: `${Date.now()}`, name: clean, members: 1, description: "A new community started by you" }]);
    flash("Community created locally.");
  }


  const Toggle = ({ label, detail, checked, onChange }) => (
    <label className="rg-toggle-row">
      <span><b>{label}</b><small>{detail}</small></span>
      <input type="checkbox" checked={Boolean(checked)} onChange={e => onChange(e.target.checked)} />
    </label>
  );
  const panelTitle = tabs.find(t => t.id === tab)?.label || "ReelsGo Lab";

  return (
    <div className="page rg-hub-page">
      <div className="rg-hub-hero">
        <div className="rg-hub-kicker"><Shield size={16} /> REELSGO LAB</div>
        <h1>Make social media work for you.</h1>
        <p>Personal controls, creator tools, communities and wellbeing in one place.</p>
        <div className="rg-hub-chips"><span>Personalized</span><span>Creator-first</span><span>Privacy-aware</span></div>
      </div>
      {notice && <div className="rg-hub-notice" role="status">{notice}</div>}
      <div className="rg-hub-layout">
        <nav className="rg-hub-tabs" aria-label="ReelsGo advanced features">
          {tabs.map(item => {
            const Icon = item.icon;
            return <button type="button" key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon size={18}/><span>{item.label}</span><ChevronRight size={16}/></button>;
          })}
        </nav>
        <section className="rg-hub-panel">
          <div className="rg-hub-panel-heading"><div><span>REELSGO TOOLS</span><h2>{panelTitle}</h2></div><span className="rg-hub-local-tag">MVP</span></div>

          {tab === "control" && <>
            <p className="rg-hub-intro">Choose the feed experience you want. These preferences are saved on this device; connect them to your backend feed query to apply them across devices.</p>
            <label className="rg-field-label">Default feed</label>
            <div className="rg-choice-grid">{["For you","Following","Close friends","Learning","Local","Reels only"].map(v => <button type="button" key={v} className={prefs.feed === v ? "selected" : ""} onClick={() => setPrefs(p => ({...p, feed:v}))}>{v}</button>)}</div>
            <Toggle label="Chronological mode" detail="Prefer newest posts first when the backend supports it." checked={prefs.chronological} onChange={v => setPrefs(p=>({...p,chronological:v}))}/>
            <Toggle label="Autoplay videos" detail="Turn automatic video playback on or off." checked={prefs.autoplay} onChange={v=>setPrefs(p=>({...p,autoplay:v}))}/>
            <Toggle label="Suggested posts" detail="Choose whether to include recommendations." checked={prefs.suggestions} onChange={v=>setPrefs(p=>({...p,suggestions:v}))}/>
            <Toggle label="Sponsored content" detail="Hide platform-controlled promotions where available." checked={prefs.sponsored} onChange={v=>setPrefs(p=>({...p,sponsored:v}))}/>
            <div className="rg-hub-callout"><Shield size={20}/><span><b>Privacy by design</b><small>Audience controls should be enforced by the server, not just hidden in the interface.</small></span></div>
          </>}

          {tab === "library" && <>
            <p className="rg-hub-intro">Keep links, tutorials and ideas together. These entries are stored in this browser, not synced to other devices yet.</p>
            <form className="rg-hub-form" onSubmit={addLibraryItem}><label className="rg-field-label">Title</label><input value={saveTitle} onChange={e=>setSaveTitle(e.target.value)} placeholder="e.g. React interview preparation" required/><label className="rg-field-label">Link (optional)</label><input type="url" value={saveUrl} onChange={e=>setSaveUrl(e.target.value)} placeholder="https://..."/><button className="primary" type="submit"><Bookmark size={16}/> Save item</button></form>
            <div className="rg-hub-list">{library.length ? library.map(item=><article className="rg-hub-list-item" key={item.id}><div><b>{item.title}</b>{item.url && <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>}<small>Saved {new Date(item.createdAt).toLocaleDateString()}</small></div><button type="button" className="rg-danger-text" onClick={()=>setLibrary(items=>items.filter(x=>x.id!==item.id))}>Remove</button></article>) : <div className="rg-hub-empty"><Bookmark/><b>Your library is ready</b><span>Add your first link or learning resource above.</span></div>}</div>
          </>}

          {tab === "creator" && <>
            <p className="rg-hub-intro">Plan content, keep a publishing calendar and review the creator dashboard. The figures below are demo placeholders until real post/view events are recorded by your backend.</p>
            <form className="rg-hub-form" onSubmit={addDraft}><label className="rg-field-label">Content title</label><input value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} placeholder="e.g. 5 JavaScript interview tips" required/><label className="rg-field-label">Planned date (optional)</label><input type="datetime-local" value={draftDate} onChange={e=>setDraftDate(e.target.value)}/><button className="primary" type="submit"><PlusSquare size={16}/> Save draft plan</button></form>
            <div className="rg-hub-stat-grid"><div><b>{drafts.length}</b><span>Planned items</span></div><div><b>{drafts.filter(d=>d.status==="Draft").length}</b><span>Unscheduled drafts</span></div><div><b>Not connected</b><span>Live analytics</span></div></div>
            <div className="rg-trust-grid"><article><Film/><b>Watch time</b><p>Connect playback events to calculate average watch time and retention.</p></article><article><Users/><b>Audience growth</b><p>Track follower changes, reach and engagement from real data.</p></article><article><Clock3/><b>Best posting time</b><p>Recommend times only after enough historical engagement data exists.</p></article><article><CalendarDaysFallback/><b>Content calendar</b><p>Your planned items are listed below; automated publishing needs a scheduler.</p></article></div>
            <div className="rg-hub-list">{drafts.length ? drafts.map(d=><article className="rg-hub-list-item" key={d.id}><div><b>{d.title}</b><small>{d.date ? new Date(d.date).toLocaleString() : "No date set"} · {d.status}</small></div><button type="button" className="rg-danger-text" onClick={()=>setDrafts(items=>items.filter(x=>x.id!==d.id))}>Delete</button></article>) : <div className="rg-hub-empty"><Film/><b>Your creator planner is empty</b><span>Add a draft idea to start planning.</span></div>}</div>
            <div className="rg-hub-callout"><AlertTriangle size={20}/><span><b>Analytics integration needed</b><small>Watch time, retention and audience metrics must come from real post and view events in your backend.</small></span></div>
          </>}

          {tab === "privacy" && <>
            <p className="rg-hub-intro">Choose defaults for the audience and interaction settings used when you create content. These are saved as local preferences; enforce each audience on the server before production.</p>
            <label className="rg-field-label">Default audience for new posts</label>
            <select value={privacyAudience} onChange={e=>setPrivacyAudience(e.target.value)}>
              <option>Everyone</option><option>Followers</option><option>Close friends</option><option>Selected people</option><option>Only me</option>
            </select>
            <label className="rg-field-label">Who can comment?</label>
            <select value={privacyComments} onChange={e=>setPrivacyComments(e.target.value)}>
              <option>Everyone</option><option>People I follow</option><option>Followers</option><option>Off</option>
            </select>
            <Toggle label="Allow downloads" detail="Default preference for your own uploaded content." checked={privacyDownloads} onChange={setPrivacyDownloads}/>
            <Toggle label="Allow remixes and collaborations" detail="Let others request to remix content when supported." checked={privacyRemix} onChange={setPrivacyRemix}/>
            <div className="rg-hub-callout"><Lock size={20}/><span><b>Per-post audience controls</b><small>Choose the audience on every post too. The server must check audience permissions for feeds, direct links, downloads and APIs.</small></span></div>
            <button className="primary" type="button" onClick={()=>{try{localStorage.setItem("reelsgo_privacy_defaults",JSON.stringify({privacyAudience,privacyComments,privacyDownloads,privacyRemix}));flash("Privacy defaults saved on this device.");}catch{flash("Could not save privacy settings.");}}}>Save privacy defaults</button>
          </>}

          {tab === "editor" && <>
            <p className="rg-hub-intro">A starter editing workspace for selecting a local video, adding a caption and setting editing preferences. Multi-track editing, background removal, beat sync and rendered exports need a dedicated video-processing implementation.</p>
            <label className="rg-field-label">Choose a video file</label>
            <input type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0]; if(f) setEditorFile({name:f.name,size:f.size,url:URL.createObjectURL(f)});}}/>
            {editorFile && <div className="rg-editor-preview"><video src={editorFile.url} controls playsInline/><div><b>{editorFile.name}</b><small>{(editorFile.size/1024/1024).toFixed(1)} MB · Preview on this device</small></div></div>}
            <label className="rg-field-label">Caption / hook</label>
            <textarea className="rg-ai-text" value={editorCaption} onChange={e=>setEditorCaption(e.target.value)} placeholder="Write a hook or caption for your reel..."/>
            <Toggle label="Prepare auto-caption workflow" detail="Preference only; speech-to-text must be connected to generate subtitles." checked={editorAutoCaptions} onChange={setEditorAutoCaptions}/>
            <Toggle label="Mute original audio" detail="Saved editing preference; an export pipeline is needed to apply it to a file." checked={editorMuted} onChange={setEditorMuted}/>
            <div className="rg-choice-grid"><button type="button" onClick={()=>{navigator.clipboard?.writeText(editorCaption);flash("Caption copied when clipboard access is available.");}}>Copy caption</button><button type="button" onClick={()=>flash("Draft settings saved in this editing session.")}>Save edit settings</button></div>
            <div className="rg-hub-callout"><Film size={20}/><span><b>Next editor integrations</b><small>Timeline tracks, trimming, transitions, audio mixing, subtitles, background removal and MP4 export.</small></span></div>
          </>}

          {tab === "collab" && <>
            <p className="rg-hub-intro">Prepare collaboration invitations and ideas. Invitations created here are local drafts only; real invitations must be delivered and accepted through the backend.</p>
            <form className="rg-hub-form" onSubmit={e=>{e.preventDefault();if(!collabTitle.trim()||!collabUsername.trim())return;setCollabItems(items=>[{id:String(Date.now()),title:collabTitle.trim(),username:collabUsername.trim().replace(/^@/,""),status:"Draft invitation",createdAt:new Date().toISOString()},...items]);setCollabTitle("");setCollabUsername("");flash("Collaboration invitation draft saved.");}}>
              <label className="rg-field-label">Post or reel idea</label><input value={collabTitle} onChange={e=>setCollabTitle(e.target.value)} placeholder="e.g. React tips collaboration" required/>
              <label className="rg-field-label">Creator username</label><input value={collabUsername} onChange={e=>setCollabUsername(e.target.value)} placeholder="@creatorname" required/>
              <button className="primary" type="submit"><UserPlus size={16}/> Create collaboration draft</button>
            </form>
            <div className="rg-hub-list">{collabItems.length?collabItems.map(item=><article className="rg-hub-list-item" key={item.id}><div><b>{item.title}</b><small>Invite @{item.username} · {item.status}</small></div><button className="rg-danger-text" type="button" onClick={()=>setCollabItems(items=>items.filter(x=>x.id!==item.id))}>Remove</button></article>):<div className="rg-hub-empty"><UserPlus/><b>No collaboration drafts yet</b><span>Invite a co-author or plan a remix idea.</span></div>}</div>
            <div className="rg-hub-callout"><Users size={20}/><span><b>Collaboration permissions</b><small>Production support needs accepted invites, co-author attribution, consent, removal rules and ownership checks.</small></span></div>
          </>}

          {tab === "community" && <>
            <p className="rg-hub-intro">Start interest groups and join local demo communities. For a multi-user community, membership and permissions must be saved on the server.</p>
            <form className="rg-hub-form rg-inline-form" onSubmit={e=>{e.preventDefault();createCommunity(e.currentTarget.elements.communityName.value);e.currentTarget.reset();}}><input name="communityName" placeholder="Community name, e.g. MERN Developers" required/><button className="primary" type="submit">Create</button></form>
            <div className="rg-hub-community-grid">{[{id:"learn",name:"Learn & Build",description:"Share skills, projects and learning resources."},{id:"creators",name:"Creator Circle",description:"Feedback, collaboration and creator tips."},{id:"local",name:"Local Connect",description:"Meet people around shared interests."},...communities].map(c=><article className="rg-community-card" key={c.id}><div className="rg-community-avatar"><Users/></div><h3>{c.name}</h3><p>{c.description}</p><button className={joined.includes(c.id)?"secondary":"primary"} type="button" onClick={()=>setJoined(j=>j.includes(c.id)?j.filter(x=>x!==c.id):[...j,c.id])}>{joined.includes(c.id)?"Joined":"Join community"}</button></article>)}</div>
          </>}

          {tab === "wellbeing" && <>
            <p className="rg-hub-intro">Set boundaries and use ReelsGo intentionally. The timer works while this page stays open.</p>
            <div className="rg-focus-card"><span>YOUR FOCUS SESSION</span><strong>{String(Math.floor(focusSeconds/60)).padStart(2,"0")}:{String(focusSeconds%60).padStart(2,"0")}</strong><p>{focusActive?"Focus session is running.":"Ready when you are."}</p><div><button className="primary" onClick={()=>setFocusActive(v=>!v)}>{focusActive?"Pause session":"Start focus session"}</button><button className="secondary" onClick={()=>{setFocusActive(false);setFocusSeconds(0)}}>Reset</button></div></div>
            <label className="rg-field-label">Daily reminder target</label><select value={prefs.sessionLimit} onChange={e=>setPrefs(p=>({...p,sessionLimit:Number(e.target.value)}))}><option value={10}>10 minutes</option><option value={20}>20 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></select>
            <Toggle label="Bedtime quiet mode" detail="Preference saved locally; notification suppression must be connected separately." checked={prefs.bedtime} onChange={v=>setPrefs(p=>({...p,bedtime:v}))}/>
            <div className="rg-hub-callout"><Clock3 size={20}/><span><b>Take a break</b><small>Use a session target that feels helpful, not stressful.</small></span></div>
          </>}

                    {tab === "trust" && <>
            <p className="rg-hub-intro">A central place to review safety practices. These are quick links and recommendations; automated detection needs backend services.</p>
            <div className="rg-trust-grid"><article><Shield/><b>Account security</b><p>Use strong passwords, protect tokens, and review active sessions.</p></article><article><Flag/><b>Report harmful content</b><p>Use the report option on posts and profiles; add status tracking server-side.</p></article><article><Ban/><b>Block and restrict</b><p>Keep blocked users from messaging or interacting through server-enforced rules.</p></article><article><BadgeCheck/><b>Clear verification labels</b><p>A custom badge without ownership checks is not identity verification.</p></article></div>
            <button className="secondary" type="button" onClick={()=>flash("Safety checklist reviewed.")}>Mark checklist reviewed</button>
          </>}

          {tab === "earn" && <>
            <p className="rg-hub-intro">Creator earnings dashboard preview. No payments are processed by this demo panel.</p>
            <div className="rg-hub-stat-grid"><div><b>₹0</b><span>Available balance</span></div><div><b>0</b><span>Supporters</span></div><div><b>Not connected</b><span>Payments</span></div></div>
            <div className="rg-trust-grid"><article><Heart/><b>Tips and gifts</b><p>Allow eligible viewers to support creators.</p></article><article><Users/><b>Memberships</b><p>Offer optional subscriber-only content.</p></article><article><LinkIcon/><b>Affiliate links</b><p>Disclose paid partnerships and track eligible referrals.</p></article><article><Handshake/><b>Brand collaborations</b><p>Let brands contact opted-in creators.</p></article></div>
            <div className="rg-hub-callout"><AlertTriangle size={20}/><span><b>Before launch</b><small>Connect a compliant payment provider, creator eligibility checks, refunds, fraud monitoring and payout records.</small></span></div>
          </>}

          {tab === "local" && <>
            <p className="rg-hub-intro">Discover public events and creators by a city or area you choose. ReelsGo does not request precise device location for this feature.</p>
            <label className="rg-field-label">Choose a city or area</label><input value={localArea} onChange={e=>setLocalArea(e.target.value)} placeholder="e.g. Bengaluru, Tirupati, Hyderabad"/>
            <div className="rg-trust-grid"><article><Compass/><b>Local creators</b><p>Directory of public profiles filtered by a selected area.</p></article><article><CalendarDaysFallback/><b>Events and meetups</b><p>Draft public events and later add RSVP and organizer tools.</p></article></div>
            <form className="rg-hub-form" onSubmit={e=>{e.preventDefault();if(!localEventTitle.trim())return;setLocalEvents(items=>[{id:String(Date.now()),title:localEventTitle.trim(),area:localArea.trim()||"Area not set",createdAt:new Date().toISOString()},...items]);setLocalEventTitle("");flash("Local event draft saved on this device.");}}>
              <label className="rg-field-label">Create an event draft</label><input value={localEventTitle} onChange={e=>setLocalEventTitle(e.target.value)} placeholder="e.g. Bengaluru developers meetup" required/><button className="primary" type="submit">Save event draft</button>
            </form>
            <div className="rg-hub-list">{localEvents.length?localEvents.map(ev=><article className="rg-hub-list-item" key={ev.id}><div><b>{ev.title}</b><small>{ev.area} · Draft event</small></div><button className="rg-danger-text" type="button" onClick={()=>setLocalEvents(items=>items.filter(x=>x.id!==ev.id))}>Remove</button></article>):<div className="rg-hub-empty"><Compass/><b>No local event drafts</b><span>Create an event idea to start.</span></div>}</div>
            <button className="secondary" type="button" onClick={()=>flash("Connect a backend location/events API to load real nearby results.")}>Find local creators and events</button>
          </>}
          <div className="rg-hub-footnote">All 12 feature areas are listed here. Browser-based preferences and draft tools work locally; shared feeds, per-post permissions, AI, real analytics, video exports, collaboration invitations, community membership, payments and local listings need backend/API integration.</div>
        </section>
      </div>
    </div>
  );
}

function CalendarDaysFallback() {
  return <Clock3 />;
}


function getSharedPostIdFromPath(pathname = window.location.pathname) {
  const match = pathname.match(/^\/post\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getSharedReelIdFromPath(pathname = window.location.pathname) {
  const match = pathname.match(/^\/(?:reel|reels)\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getSharedRouteFromPath(pathname = window.location.pathname) {
  const postId = getSharedPostIdFromPath(pathname);
  if (postId) return { type: "post", id: postId };
  const reelId = getSharedReelIdFromPath(pathname);
  if (reelId) return { type: "reel", id: reelId };
  return null;
}

function SharedPostPage({ postId, user, onBack }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      setLoading(true);
      setError("");
      try {
        let foundPost = null;
        try {
          const data = await api(`/posts/${encodeURIComponent(postId)}`);
          foundPost = data?.post || data?.data?.post || data;
          if (String(foundPost?._id || "") !== String(postId)) foundPost = null;
        } catch {
          // Some backend versions expose the feed but not GET /posts/:id.
        }
        if (!foundPost) {
          const feed = await api("/posts");
          foundPost = (feed?.posts || feed?.data?.posts || []).find(
            item => String(item?._id) === String(postId)
          );
        }
        if (!foundPost || !foundPost._id) {
          throw new Error("This post could not be found, or the backend does not allow public access.");
        }
        if (!cancelled) setPost(foundPost);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load this post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (postId) loadPost();
    else { setError("This post link is invalid."); setLoading(false); }
    return () => { cancelled = true; };
  }, [postId]);

  if (loading) return <div className="page"><div className="empty">Loading post…</div></div>;
  if (error || !post) return <div className="page"><button type="button" className="secondary" onClick={onBack}>Back to ReelsGo</button><div className="empty"><h2>Post unavailable</h2><p>{error || "This post could not be found."}</p></div></div>;
  return <div className="page"><button type="button" className="secondary" onClick={onBack}>← Back to ReelsGo</button><Post post={post} user={user} onDeleted={onBack} /></div>;
}

function SharedReelPage({ reelId, onBack }) {
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadReel() {
      setLoading(true);
      setError("");
      try {
        let foundReel = null;
        try {
          const data = await api(`/reels/${encodeURIComponent(reelId)}`);
          foundReel = data?.reel || data?.data?.reel || data;
          if (String(foundReel?._id || "") !== String(reelId)) foundReel = null;
        } catch {
          // Fall back to the existing reels feed route.
        }
        if (!foundReel) {
          const feed = await api("/reels");
          foundReel = (feed?.reels || feed?.data?.reels || []).find(
            item => String(item?._id) === String(reelId)
          );
        }
        if (!foundReel?._id) {
          throw new Error("This Reel could not be found, or the backend does not allow public access.");
        }
        if (!cancelled) setReel(foundReel);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load this Reel.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (reelId) loadReel();
    else { setError("This Reel link is invalid."); setLoading(false); }
    return () => { cancelled = true; };
  }, [reelId]);

  if (loading) return <div className="page"><div className="empty">Loading Reel…</div></div>;
  if (error || !reel) return <div className="page"><button type="button" className="secondary" onClick={onBack}>Back to ReelsGo</button><div className="empty"><h2>Reel unavailable</h2><p>{error || "This Reel could not be found."}</p></div></div>;

  const author = reel.author || {};
  const mediaUrl = reel.mediaUrl ? `${SERVER}${reel.mediaUrl}` : "";
  return (
    <div className="page shared-reel-page" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 14px" }}>
      <button type="button" className="secondary" onClick={onBack} style={{ marginBottom: 16 }}>← Back to ReelsGo</button>
      <article style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14, justifyItems: "center" }}>
        <div style={{ width: "min(100%, 430px)", overflow: "hidden", borderRadius: 18, background: "#080808", border: "1px solid rgba(128,128,128,.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, color: "inherit" }}>
            <Avatar user={author} size={40} />
            <div style={{ minWidth: 0 }}>
              <strong>{author.username ? `@${author.username}` : author.name || "ReelsGo user"}</strong>
              <div style={{ opacity: .7, fontSize: 12 }}>Reel on ReelsGo</div>
            </div>
          </div>
          {mediaUrl ? <video src={mediaUrl} controls playsInline autoPlay loop style={{ display: "block", width: "100%", maxHeight: "72vh", objectFit: "contain", background: "#000" }} /> : <div className="empty">Reel video is unavailable.</div>}
          <div style={{ padding: 14, color: "inherit", overflowWrap: "anywhere" }}>
            <div>{reel.caption || "Watch this Reel on ReelsGo."}</div>
            {reel.hashtags && <div style={{ opacity: .8, marginTop: 6 }}>{Array.isArray(reel.hashtags) ? reel.hashtags.join(" ") : reel.hashtags}</div>}
            <button type="button" className="secondary" style={{ marginTop: 14 }} onClick={async () => {
              const link = window.location.href;
              try {
                if (navigator.share) await navigator.share({ title: "ReelsGo Reel", text: reel.caption || "Check out this Reel on ReelsGo", url: link });
                else { await navigator.clipboard.writeText(link); alert("Reel link copied."); }
              } catch (e) {
                if (e?.name !== "AbortError") alert("Unable to share. Please copy the link from your browser.");
              }
            }}><Link2 size={16} /> Share Reel</button>
          </div>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [page, setPage] = useState(() => {
    const shared = getSharedRouteFromPath();
    return shared ? `shared-${shared.type}` : "home";
  });
  const [sharedPostId, setSharedPostId] = useState(() => getSharedPostIdFromPath());
  const [sharedReelId, setSharedReelId] = useState(() => getSharedReelIdFromPath());
  const [createOpen, setCreateOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedRefresh, setFeedRefresh] = useState(0);
  const [profileUserId, setProfileUserId] = useState(null);
  const [openConversationId, setOpenConversationId] = useState(null);
  const [openConversationData, setOpenConversationData] = useState(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationAlert, setVerificationAlert] = useState(false);

  useEffect(() => {
    const syncRoute = () => {
      const postId = getSharedPostIdFromPath();
      const reelId = getSharedReelIdFromPath();
      setSharedPostId(postId);
      setSharedReelId(reelId);
      setPage(postId ? "shared-post" : reelId ? "shared-reel" : "home");
    };
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    if (!token) return;
    const openMessages = () => navigate("messages");
    window.addEventListener("vk-open-messages", openMessages);
    return () => window.removeEventListener("vk-open-messages", openMessages);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const openSearch = () => navigate("search");
    window.addEventListener("vk-open-search", openSearch);
    return () => window.removeEventListener("vk-open-search", openSearch);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const openStoryComposer = () => setStoryOpen(true);
    window.addEventListener("reelsgo-open-story-composer", openStoryComposer);
    return () => window.removeEventListener("reelsgo-open-story-composer", openStoryComposer);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const openProfile = (event) => {
      const id = event?.detail?.id;
      if (!id) return;
      setProfileUserId(String(id));
      setPage("user-profile");
      setMenuOpen(false);
      setSettingsOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("vk-open-profile", openProfile);
    return () => window.removeEventListener("vk-open-profile", openProfile);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api("/users/me")
      .then(d => {
        setUser(d.user);
        localStorage.setItem("vk_user", JSON.stringify(d.user));
      })
      .catch(() => {});
  }, [token]);

  function login(data) {
    localStorage.setItem("vk_token", data.token);
    localStorage.setItem("vk_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    const postId = getSharedPostIdFromPath();
    const reelId = getSharedReelIdFromPath();
    setSharedPostId(postId);
    setSharedReelId(reelId);
    setPage(postId ? "shared-post" : reelId ? "shared-reel" : "home");
  }

  function logout() {
    localStorage.removeItem("vk_token");
    localStorage.removeItem("vk_user");
    setToken(null);
    setUser(null);
    setSettingsOpen(false);
  }

  const navigate = p => {
    setPage(p);
    if (p !== "user-profile") setProfileUserId(null);
    if (p !== "shared-post" && p !== "shared-reel" && getSharedRouteFromPath()) {
      window.history.pushState({}, "", "/");
      setSharedPostId(null);
      setSharedReelId(null);
    }
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Shared post/Reel links should open directly in a browser, even when the visitor
  // is not logged in. Other sections still require authentication as before.
  if (!token && sharedPostId) {
    return <div className="shared-public-shell"><SharedPostPage postId={sharedPostId} user={user} onBack={() => { window.history.pushState({}, "", "/"); setSharedPostId(null); setPage("home"); }} /></div>;
  }
  if (!token && sharedReelId) {
    return <div className="shared-public-shell"><SharedReelPage reelId={sharedReelId} onBack={() => { window.history.pushState({}, "", "/"); setSharedReelId(null); setPage("home"); }} /></div>;
  }
  if (!token) return <Auth onLogin={login} />;

  return (
    <>
      <ReelsGoViewport />
      <ReelsGoBranding />
      <div className="app">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("home")} aria-label="ReelsGo home">
          <ReelsGoLogo className="brand-wordmark" />
        </button>

        <div className="sidebar-main-nav">
          <Nav icon={<Home />} label="Home" active={page === "home"} onClick={() => navigate("home")} />
          <Nav icon={<Search />} label="Search" active={page === "search"} onClick={() => navigate("search")} />
          <Nav icon={<Film />} label="Reels" active={page === "reels"} onClick={() => navigate("reels")} />
          <Nav icon={<MessageCircle />} label="Messages" active={page === "messages"} onClick={() => navigate("messages")} />
          <Nav icon={<Heart />} label="Notifications" active={page === "notifications"} onClick={() => navigate("notifications")} />
          <Nav icon={<PlusSquare />} label="Create" onClick={() => setCreateOpen(true)} />
          <Nav icon={<Avatar user={user} size={27} />} label="Profile" active={page === "profile"} onClick={() => navigate("profile")} />
        </div>

        <div className="nav-bottom">
          <Nav icon={<Bookmark />} label="Saved" active={page === "saved"} onClick={() => navigate("saved")} />
          <Nav icon={<Settings />} label="Settings" onClick={() => setSettingsOpen(true)} />
          <Nav icon={<Menu />} label="More" onClick={() => setMenuOpen(true)} />
        </div>
      </aside>

      <header className="mobile-header">
        <button className="mobile-brand" onClick={() => navigate("home")} aria-label="ReelsGo home"><ReelsGoLogo className="mobile-brand-wordmark" /></button>
        <div className="mobile-header-actions">
          <button onClick={() => navigate("notifications")} aria-label="Notifications"><Heart /></button>
          <button onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="menu-user">
              <Avatar user={user} size={48} />
              <div><b>{user?.name}</b><span>@{user?.username}</span></div>
              <button onClick={() => setMenuOpen(false)}><X /></button>
            </div>
            <button onClick={() => navigate("profile")}><User /> Profile</button>
            <button onClick={() => navigate("saved")}><Bookmark /> Saved</button>
            <button onClick={() => { setMenuOpen(false); setSettingsOpen(true); }}><Settings /> Settings</button>
            <button onClick={logout}><LogOut /> Logout</button>
          </div>
        </div>
      )}

      <main className="main">
        {page === "home" && <HomePage user={user} refreshKey={feedRefresh} onCreate={() => setCreateOpen(true)} onStory={() => setStoryOpen(true)} />}
        {page === "shared-post" && <SharedPostPage postId={sharedPostId} user={user} onBack={() => navigate("home")} />}
        {page === "shared-reel" && <SharedReelPage reelId={sharedReelId} onBack={() => navigate("home")} />}
        {page === "search" && <SearchPage onBack={() => navigate("home")} onOpenProfile={(id) => { setProfileUserId(id); setPage("user-profile"); }} />}
        {page === "user-profile" && profileUserId && <UserProfilePage userId={profileUserId} currentUser={user} onBack={() => navigate("search")} onMessage={async (id) => {
          try {
            if (!id) throw new Error("Could not find this user's profile ID. Please refresh the profile and try again.");
            const d = await api("/messages/conversations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ members: [String(id)] })
            });
            const conversation = d?.conversation;
            if (!conversation?._id) throw new Error("The server did not return a conversation. Please check the messages API and try again.");
            // Keep the returned conversation so MessagesPage can open it immediately,
            // even if the inbox list has not refreshed yet.
            setOpenConversationData(conversation);
            setOpenConversationId(String(conversation._id));
            setPage("messages");
            setProfileUserId(null);
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (e) { alert(e?.message || "Unable to start this conversation."); }
        }} />}
        {page === "reels" && <ReelsPage onCreate={() => setReelOpen(true)} />}
        {page === "messages" && <MessagesPage openConversationId={openConversationId} openConversationData={openConversationData} />}
        {page === "notifications" && <NotificationsPage />}
        {page === "saved" && <SavedPage user={user} />}
        {page === "profile" && <ProfilePage user={user} setUser={setUser} />}
      </main>

      <nav className="bottom-nav glass-bottom-nav">
        <NavMobile icon={<Home />} label="Home" active={page === "home"} onClick={() => navigate("home")} />
        <NavMobile icon={<Film />} label="Reels" active={page === "reels"} onClick={() => navigate("reels")} />
        <NavMobile icon={<Send />} label="Messages" active={page === "messages"} onClick={() => navigate("messages")} />
        <NavMobile icon={<Search />} label="Search" active={page === "search"} onClick={() => navigate("search")} />
        <button className={`mobile-profile ${page === "profile" ? "active" : ""}`} onClick={() => navigate("profile")} aria-label="Profile">
          <Avatar user={user} size={34} />
          <span>Profile</span>
        </button>
      </nav>

      {createOpen && <PostComposer user={user} onClose={() => setCreateOpen(false)} onDone={() => setCreateOpen(false)} />}
      {storyOpen && <StoryComposer onClose={() => setStoryOpen(false)} onDone={() => { setStoryOpen(false); setFeedRefresh(v => v + 1); }} />}
      {reelOpen && <ReelComposer onClose={() => setReelOpen(false)} onDone={() => setReelOpen(false)} />}
      {settingsOpen && (
        <SettingsModal
          user={user}
          setUser={setUser}
          onClose={() => setSettingsOpen(false)}
          onLogout={logout}
          onOpenVerification={() => {
            setSettingsOpen(false);
            setVerificationOpen(true);
          }}
        />
      )}
      {verificationOpen && (
        <PhoneVerificationModal
          onClose={() => setVerificationOpen(false)}
          onVerified={() => {
            setVerificationOpen(false);
            setVerificationAlert(true);
            window.setTimeout(() => setVerificationAlert(false), 4500);
          }}
        />
      )}
      {verificationAlert && (
        <div className="verification-alert" role="alert" aria-live="polite">
          <div className="verification-alert-icon">
            <BadgeCheck />
          </div>
          <div className="verification-alert-copy">
            <strong>Your profile has been verified!</strong>
            <span>Congratulations! Your ReelsGo blue tick is now active.</span>
          </div>
          <button
            type="button"
            className="verification-alert-close"
            onClick={() => setVerificationAlert(false)}
            aria-label="Close verification alert"
          >
            <X />
          </button>
        </div>
      )}
      </div>
    </>
  );
}

function Nav({ icon, label, active, onClick }) {
  return <button className={`nav ${active ? "active" : ""} ${label === "Messages" ? "messages-nav-item" : ""}`} onClick={onClick}><span>{icon}</span>{label}</button>;
}

function NavMobile({ icon, label, active, onClick }) {
  return <button className={`nav-mobile ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function AuthLogo({ className = "" }) {
  return (
    <img
      src={reelsGoLogo}
      alt="ReelsGo"
      className={`auth-logo-image ${className}`}
      draggable="false"
    />
  );
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email: form.email, password: form.password } : form;
      const d = await api(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      onLogin(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-showcase">
        <div className="auth-showcase-logo">
          <AuthLogo className="auth-showcase-image" />
        </div>
        <h1>Share your world.</h1>
        <p>Photos, Reels, Stories, messages and the people you care about — all in one social space.</p>
        <div className="auth-pills"><span>Posts</span><span>Stories</span><span>Reels</span><span>Messages</span></div>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          <AuthLogo className="auth-page-image" />
        </div>
        <h2 className="auth-title">{mode === "login" ? "Log in" : "Create an account"}</h2>
        <p className="auth-subtitle">{mode === "login" ? "Welcome back. Continue where you left off." : "Join and start sharing."}</p>

        {mode === "signup" && <>
          <Field icon={<CircleUser />} placeholder="Full name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Field icon={<AtSign />} placeholder="Username" value={form.username} onChange={v => setForm({ ...form, username: v })} />
        </>}

        <Field icon={<Mail />} type="email" placeholder="Email address" value={form.email} onChange={v => setForm({ ...form, email: v })} />
        <div className="password-field">
          <Field icon={<KeyRound />} type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={v => setForm({ ...form, password: v })} />
          <button type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff /> : <Eye />}</button>
        </div>

        {mode === "login" && <button type="button" className="forgot">Forgot password?</button>}
        {error && <div className="error">{error}</div>}
        <button className="primary auth-submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>

        <div className="auth-divider"><span>OR</span></div>
        <button type="button" className="secondary auth-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
          {mode === "login" ? "Create new account" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}

function Field({ icon, type = "text", placeholder, value, onChange }) {
  return <div className="field-wrap"><span>{icon}</span><input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} /></div>;
}

function HomePage({ user, refreshKey, onCreate, onStory }) {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([api("/posts"), api("/stories")]);
      setPosts(p.posts || []);
      setStories(s.stories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [refreshKey]);

  const myStories = stories.filter(s => String(s.author?._id || s.author) === String(user?._id));
  const otherStories = stories.filter(s => String(s.author?._id || s.author) !== String(user?._id));

  async function openStory(story) {
    setActiveStory(story);
    try { await api(`/stories/${story._id}/view`, { method: "POST" }); } catch {}
  }

  return (
    <div className="page feed-page">
      <div className="home-layout">
        <section className="home-feed-column">
          <div className="page-heading">
            <button className="desktop-create" onClick={onCreate}><PlusSquare /> Create</button>
          </div>

          <div className="stories-card">
        <button className="story own" onClick={() => myStories.length ? openStory(myStories[myStories.length - 1]) : onStory()}>
          <div className="story-ring">{myStories.length && myStories[myStories.length - 1].mediaUrl ? (myStories[myStories.length - 1].kind === "video" ? <video src={`${SERVER}${myStories[myStories.length - 1].mediaUrl}`} muted playsInline /> : <img src={`${SERVER}${myStories[myStories.length - 1].mediaUrl}`} alt="" />) : <Avatar user={user} size={64} />} {!myStories.length && <i>+</i>}</div><span>{myStories.length ? "Your story" : "Your story"}</span>
        </button>
        {otherStories.map(s => (
          <button className="story" key={s._id} onClick={() => openStory(s)}>
            <div className="story-ring">
              {s.mediaUrl ? (
                s.kind === "video" ? <video src={`${SERVER}${s.mediaUrl}`} muted playsInline /> : <img src={`${SERVER}${s.mediaUrl}`} alt="" />
              ) : <div className="story-text-thumb">Aa</div>}
            </div>
            <UserLink user={s.author} className="story-username" />
          </button>
        ))}
      </div>

      <div className="quick-create">
        <Avatar user={user} size={42} />
        <button onClick={onCreate}>What's on your mind?</button>
        <button className="quick-icon" onClick={onCreate}><ImageIcon /></button>
      </div>

      {loading ? <div className="empty">Loading feed...</div> :
        posts.length ? posts.map(p => (
          <Post
            key={p._id}
            post={p}
            user={user}
            onDeleted={(id) => setPosts(current => current.filter(item => String(item._id) !== String(id)))}
          />
        )) :
        <div className="empty"><ImageIcon /><h2>Your feed is empty</h2><p>Create your first post to get started.</p><button className="primary small" onClick={onCreate}>Create post</button></div>}

          {activeStory && (
            <StoryViewer
              story={activeStory}
              onClose={() => setActiveStory(null)}
              onDeleted={() => {
                setActiveStory(null);
                load();
              }}
            />
          )}
        </section>

        <SuggestionsRail user={user} posts={posts} />
      </div>
    </div>
  );
}


function SuggestionsRail({ user, posts }) {
  const [people, setPeople] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [busyId, setBusyId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [followError, setFollowError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      const map = new Map();
      const currentFollowing = new Set();
      const add = (person) => {
        if (!person?._id || String(person._id) === String(user?._id)) return;
        const id = String(person._id);
        if (!map.has(id)) map.set(id, person);
      };

      // Reuse people already present in the feed, then supplement with
      // the signed-in user's existing followers/following from the API.
      for (const post of posts || []) add(post?.author);

      if (user?._id) {
        try {
          const d = await api(`/follows/${user._id}/following`);
          for (const item of (d.following || d.users || [])) {
            const person = item?.user || item;
            add(person);
            if (person?._id) currentFollowing.add(String(person._id));
          }
        } catch {}

        try {
          const d = await api(`/follows/${user._id}/followers`);
          for (const item of (d.followers || d.users || [])) add(item?.user || item);
        } catch {}
      }

      if (!cancelled) {
        setPeople(Array.from(map.values()));
        setFollowing(currentFollowing);
      }
    }

    loadSuggestions();
    return () => { cancelled = true; };
  }, [posts, user?._id]);

  async function toggleFollow(person) {
    const id = String(person?._id || "");
    if (!id || busyId) return;
    const isFollowing = following.has(id);
    setBusyId(id);
    setFollowError("");

    // Update immediately for responsive UI, then roll back if the API fails.
    setFollowing(prev => {
      const next = new Set(prev);
      if (isFollowing) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await api(`/follows/${id}`, { method: isFollowing ? "DELETE" : "POST" });
    } catch (e) {
      setFollowing(prev => {
        const next = new Set(prev);
        if (isFollowing) next.add(id);
        else next.delete(id);
        return next;
      });
      setFollowError(e?.message || "Could not update follow status. Please try again.");
    } finally {
      setBusyId("");
    }
  }

  const visiblePeople = showAll ? people : people.slice(0, 6);

  return (
    <aside className="suggestions-rail">
      <div className="rail-account">
        <button type="button" className="rail-avatar-button" onClick={() => openUserProfile(user?._id)} aria-label="Open your profile">
          <Avatar user={user} size={56} />
        </button>
        <div className="rail-account-info">
          <UserLink user={user} className="rail-username" />
          <span>{user?.name || "ReelsGo user"}</span>
        </div>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("vk-switch-account"))}>Switch</button>
      </div>

      <div className="suggestions-title">
        <b>Suggested for you</b>
        <button type="button" onClick={() => setShowAll(value => !value)}>
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      {followError && <div className="suggestion-error" role="status">{followError}</div>}

      <div className="suggestion-list">
        {visiblePeople.map(person => {
          const id = String(person._id);
          const isFollowing = following.has(id);
          const busy = busyId === id;
          return (
            <div className="suggestion-row" key={id}>
              <button type="button" className="suggestion-avatar-button" onClick={() => openUserProfile(id)} aria-label={`Open ${person.username || person.name || "user"} profile`}>
                <Avatar user={person} size={42} />
              </button>
              <div className="suggestion-copy">
                <UserLink user={person} />
                <span>{isFollowing ? "Following" : "Suggested for you"}</span>
              </div>
              <button
                type="button"
                className={isFollowing ? "following" : "follow"}
                disabled={busy}
                onClick={() => toggleFollow(person)}
              >
                {busy ? "…" : isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
        {!people.length && (
          <div className="suggestion-empty">More people will appear here as ReelsGo discovers accounts.</div>
        )}
      </div>

      <div className="rail-footer">
        About · Help · Press · API · Jobs · Privacy · Terms<br />
        Locations · Language<br /><br />
        © 2026 REELSGO
      </div>

      <button type="button" className="floating-messages" onClick={() => window.dispatchEvent(new CustomEvent("vk-open-messages"))}>
        <Send />
        <b>Messages</b>
        <span className="floating-avatars">
          {people.slice(0, 3).map(person => <span key={person._id} className="floating-avatar-item"><Avatar user={person} size={25} /></span>)}
        </span>
      </button>
    </aside>
  );
}

function StoryViewer({ story, onClose, onDeleted }) {
  const mediaUrl = story.mediaUrl ? `${SERVER}${story.mediaUrl}` : null;
  const me = getUser();
  const isOwner = String(story.author?._id || story.author) === String(me?._id);
  const [viewersOpen, setViewersOpen] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [loadingViewers, setLoadingViewers] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteStory() {
    if (!isOwner || deleting) return;
    const confirmed = window.confirm("Delete this story? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api(`/stories/${story._id}`, { method: "DELETE" });
      if (onDeleted) onDeleted(story._id);
      else onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  async function openViewers() {
    if (!isOwner) return;
    setViewersOpen(true);
    setLoadingViewers(true);
    try {
      const d = await api(`/stories/${story._id}/viewers`);
      setViewers(d.viewers || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingViewers(false);
    }
  }

  useEffect(() => {
    if (!isOwner && story?._id) {
      api(`/stories/${story._id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [story?._id, isOwner]);

  return (
    <div className="story-viewer" onClick={onClose}>
      <div className="story-progress"><span /></div>
      <div className="story-viewer-top">
        <div className="story-viewer-user">
          <Avatar user={story.author} size={42} />
          <div>
            <UserLink user={story.author} />
            <span>{isOwner ? 'Your story' : 'Story'}</span>
          </div>
        </div>
        <div
          className="story-viewer-top-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          {isOwner && (
            <button
              type="button"
              title="Delete story"
              aria-label="Delete story"
              disabled={deleting}
              onClick={e => { e.stopPropagation(); deleteStory(); }}
              style={{ color: "#ff5c70" }}
            >
              <Trash2 />
            </button>
          )}
          <button type="button" onClick={e => { e.stopPropagation(); onClose(); }}><X /></button>
        </div>
      </div>
      <div className="story-viewer-content" onClick={e => e.stopPropagation()}>
        {mediaUrl && story.kind === 'video' ? (
          <video src={mediaUrl} autoPlay controls playsInline />
        ) : mediaUrl ? (
          <img src={mediaUrl} alt="Story" />
        ) : (
          <div className="story-text-view" style={{ background: story.background || 'linear-gradient(135deg,#111827,#4f46e5)' }}>{story.text || 'Story'}</div>
        )}
      </div>
      {isOwner && (
        <button className="story-viewers-button" onClick={e => { e.stopPropagation(); openViewers(); }}>
          <Eye /> <span>{viewers.length || story.views?.length || 0} views</span>
        </button>
      )}
      {viewersOpen && (
        <div className="story-viewers-sheet" onClick={e => e.stopPropagation()}>
          <div className="story-viewers-head">
            <div><b>Story views</b><span>{viewers.length} {viewers.length === 1 ? 'viewer' : 'viewers'}</span></div>
            <button onClick={() => setViewersOpen(false)}><X /></button>
          </div>
          {loadingViewers ? (
            <div className="story-viewers-empty"><div className="viewer-loader" /><b>Loading viewers...</b></div>
          ) : viewers.length ? (
            <div className="story-viewers-list">
              {viewers.map(v => (
                <div className="story-viewer-row" key={v._id}>
                  <Avatar user={v} size={50} />
                  <div className="story-viewer-user-info"><UserLink user={v} /><span>{v.name || 'ReelsGo user'}</span></div>
                  {v.viewedAt && <small>{new Date(v.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>}
                </div>
              ))}
            </div>
          ) : (
            <div className="story-viewers-empty"><Eye /><b>No views yet</b><span>When someone watches your story, their profile will appear here.</span></div>
          )}
        </div>
      )}
    </div>
  );
}

function Post({ post, user, onDeleted }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [likedUsersOpen, setLikedUsersOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likedUsersLoading, setLikedUsersLoading] = useState(false);
  const [likedUsersError, setLikedUsersError] = useState("");

  const media = post.media?.[0];
  const mediaUrl = media?.url ? `${SERVER}${media.url}` : "";
  const isOwner = String(post.author?._id || post.author) === String(user?._id);

  async function like() {
    try {
      const d = await api(`/posts/${post._id}/like`, { method: "POST" });
      setLiked(d.liked);
    } catch (e) {
      alert(e.message);
    }
  }

  async function save() {
    try {
      const d = await api(`/posts/${post._id}/save`, { method: "POST" });
      setSaved(d.saved);
    } catch (e) {
      alert(e.message);
    }
  }

  async function openLikedUsers() {
    setLikedUsersOpen(true); setLikedUsersLoading(true); setLikedUsersError(""); setLikedUsers([]);
    try { const data = await api(`/posts/${post._id}/likes`); setLikedUsers(Array.isArray(data.users) ? data.users : []); }
    catch (error) { setLikedUsersError(error?.message || "Could not load likes."); }
    finally { setLikedUsersLoading(false); }
  }

  async function loadComments() {
    try {
      const d = await api(`/posts/${post._id}/comments`);
      setComments(d.comments || []);
      setShowComments(true);
    } catch (e) {
      alert(e.message);
    }
  }

  async function comment() {
    if (!text.trim()) return;
    try {
      await api(`/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() })
      });
      setText("");
      await loadComments();
    } catch (e) {
      alert(e.message);
    }
  }

  async function deletePost() {
    if (!isOwner || deleting) return;

    const confirmed = window.confirm(
      "Delete this post? This action cannot be undone."
    );

    if (!confirmed) {
      setMenuOpen(false);
      return;
    }

    setDeleting(true);

    try {
      await api(`/posts/${post._id}`, {
        method: "DELETE"
      });

      setMenuOpen(false);

      if (onDeleted) {
        onDeleted(post._id);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <article className="post-card">
        <div className="post-head">
          <div className="post-user">
            <Avatar user={post.author} size={42} />
            <div>
              <UserLink user={post.author} />
              <span>{post.location || "ReelsGo"}</span>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <button
              className="icon-button"
              type="button"
              aria-label="More options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              <MoreHorizontal />
            </button>

            {menuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  zIndex: 40,
                  minWidth: 170,
                  padding: 6,
                  borderRadius: 14,
                  background: "#171b21",
                  border: "1px solid rgba(255,255,255,.12)",
                  boxShadow: "0 18px 50px rgba(0,0,0,.45)"
                }}
              >
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={deletePost}
                      disabled={deleting}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "11px 12px",
                        borderRadius: 10,
                        background: "transparent",
                        color: "#ff5c70",
                        textAlign: "left",
                        fontWeight: 750
                      }}
                    >
                      <Trash2 size={17} />
                      {deleting ? "Deleting..." : "Delete post"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 10,
                        background: "transparent",
                        color: "#fff",
                        textAlign: "left"
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 10,
                      background: "transparent",
                      color: "#fff",
                      textAlign: "left"
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {mediaUrl && (
          <button
            className="post-media-button"
            type="button"
            onClick={() => setViewerOpen(true)}
            aria-label="Open post"
          >
            {media.kind === "video" ? (
              <video
                className="post-media"
                src={mediaUrl}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                className="post-media"
                src={mediaUrl}
                alt={post.caption || "Post"}
              />
            )}
            {media.kind === "video" && (
              <span className="media-play-overlay">
                <Play fill="currentColor" />
              </span>
            )}
          </button>
        )}

        <div className="actions">
          <div>
            <button
              className={liked ? "liked" : ""}
              onClick={like}
              type="button"
              aria-label="Like"
            >
              <Heart fill={liked ? "currentColor" : "none"} />
            </button>

            <button
              onClick={loadComments}
              type="button"
              aria-label="Comments"
            >
              <MessageCircle />
            </button>

            <button
              onClick={() => setShareOpen(true)}
              type="button"
              aria-label="Share"
            >
              <Send />
            </button>
          </div>

          <button
            className={saved ? "saved" : ""}
            onClick={save}
            type="button"
            aria-label="Save"
          >
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="post-body">
          {!post.hideLikeCount && <button type="button" className="post-likes-link" onClick={openLikedUsers}>{post.likesCount || 0} likes</button>}

          {post.caption && (
            <p>
              <UserLink user={post.author} /> {post.caption}
            </p>
          )}

          <button
            className="comments-link"
            onClick={loadComments}
            type="button"
          >
            View all comments
          </button>

          {showComments && (
            <div className="comments">
              {comments.map(c => (
                <div className="comment" key={c._id}>
                  <Avatar user={c.author} size={28} />
                  <div>
                    <UserLink user={c.author} />
                    <span>{c.text}</span>
                  </div>
                </div>
              ))}

              {!post.commentsDisabled && (
                <div className="comment-input">
                  <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        comment();
                      }
                    }}
                    placeholder="Add a comment..."
                  />
                  <button onClick={comment} type="button">
                    Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {shareOpen && (
        <ShareSheet
          post={post}
          onClose={() => setShareOpen(false)}
        />
      )}

      {viewerOpen && (
        <MediaViewer
          media={media}
          post={post}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

function MediaViewer({ media, post, onClose }) {
  const url = media?.url ? `${SERVER}${media.url}` : "";
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  async function like() {
    try {
      const d = await api(`/posts/${post?._id}/like`, { method: "POST" });
      setLiked(!!d.liked);
    } catch (e) {
      alert(e.message);
    }
  }

  async function save() {
    try {
      const d = await api(`/posts/${post?._id}/save`, { method: "POST" });
      setSaved(!!d.saved);
    } catch (e) {
      alert(e.message);
    }
  }

  if (!url) return null;

  return (
    <div className="media-screen-viewer" role="dialog" aria-modal="true">
      <div className="media-screen-backdrop" onClick={onClose} />

      <div className="media-screen-topbar">
        <button
          className="media-screen-back"
          type="button"
          onClick={onClose}
          aria-label="Back"
        >
          <ChevronRight style={{ transform: "rotate(180deg)" }} />
        </button>

        <div className="media-screen-user">
          <Avatar user={post?.author} size={40} />
          <div>
            <UserLink user={post?.author} />
            <span>{post?.location || "ReelsGo"}</span>
          </div>
        </div>

        <button className="media-screen-more" type="button">
          <MoreHorizontal />
        </button>
      </div>

      <div className="media-screen-content">
        {media.kind === "video" ? (
          <video
            src={url}
            autoPlay
            controls
            playsInline
            className="media-screen-media"
          />
        ) : (
          <img
            src={url}
            alt={post?.caption || "Post"}
            className="media-screen-media"
          />
        )}
      </div>

      <div className="media-screen-bottom">
        <div className="media-screen-actions">
          <div className="media-screen-action-group">
            <button
              type="button"
              className={liked ? "active" : ""}
              onClick={like}
              aria-label="Like"
            >
              <Heart fill={liked ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label="Share"
            >
              <Send />
            </button>
          </div>

          <button
            type="button"
            className={saved ? "active" : ""}
            onClick={save}
            aria-label="Save"
          >
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {post?.caption && (
          <div className="media-screen-caption">
            <UserLink user={post.author} />{" "}
            <span>{post.caption}</span>
          </div>
        )}
      </div>

      {shareOpen && (
        <ShareSheet
          post={post}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}

function ShareSheet({ post, onClose, kind = "post" }) {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const postLink = `${window.location.origin}/${kind === "reel" ? "reel" : "post"}/${post?._id || ""}`;
  const contentLabel = kind === "reel" ? "Reel" : "post";
  const shareText = `Check out this ${contentLabel} on ReelsGo: ${postLink}`;

  async function loadPeople() {
    setLoading(true);
    try {
      let users = [];
      try {
        const currentUser = getUser();
        if (currentUser?._id) {
          const d = await api(`/follows/${currentUser._id}/following`);
          users = d.following || d.users || d.followers || [];
        }
      } catch {}
      if (!users.length) {
        try {
          const d = await api("/messages/conversations");
          users = (d.conversations || []).map(c =>
            (c.members || []).find(m => String(m?._id) !== String(getUser()?._id))
          ).filter(Boolean);
        } catch {}
      }
      const unique = [];
      const seen = new Set();
      for (const item of users) {
        const person = item?.user || item;
        if (!person?._id) continue;
        const id = String(person._id);
        if (id === String(getUser()?._id || "") || seen.has(id)) continue;
        seen.add(id);
        unique.push(person);
      }
      setPeople(unique);
    } catch (e) {
      console.error(e);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPeople(); }, []);

  function togglePerson(person) {
    const id = String(person._id);
    setSelected(current =>
      current.some(item => String(item._id) === id)
        ? current.filter(item => String(item._id) !== id)
        : [...current, person]
    );
  }

  async function copyPostLink() {
    try {
      await navigator.clipboard.writeText(postLink);
      setNotice(`${kind === "reel" ? "Reel" : "Post"} link copied.`);
    } catch {
      const field = document.createElement("textarea");
      field.value = postLink;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      setNotice(copied ? `${kind === "reel" ? "Reel" : "Post"} link copied.` : "Copy failed. Please copy the link from your browser.");
    }
  }

  function openWhatsApp(status = false) {
    const message = encodeURIComponent(shareText);
    // WhatsApp Web/app opens with the link. For Status, choose "My status"
    // in WhatsApp's own share UI; browsers cannot publish a Status silently.
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
    if (status) setNotice("WhatsApp opened. Choose Status in WhatsApp to post it there.");
  }

  async function shareExternally() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `ReelsGo ${contentLabel}`, text: `Check out this ${contentLabel} on ReelsGo`, url: postLink });
      } else {
        await copyPostLink();
        setNotice("Sharing is not supported here, so the link was copied.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") setNotice("Unable to open the share menu. Try Copy link.");
    }
  }

  function addToStory() {
    onClose();
    window.dispatchEvent(new CustomEvent("reelsgo-open-story-composer", {
      detail: { postId: kind === "post" ? (post?._id || null) : null, reelId: kind === "reel" ? (post?._id || null) : null, postLink }
    }));
  }

  async function sendPost() {
    if (!selected.length || sending) return;
    setSending(true);
    let sent = 0;
    const failed = [];
    try {
      for (const person of selected) {
        try {
          const d = await api("/messages/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ members: [person._id] })
          });
          const conversation = d.conversation;
          if (!conversation?._id) throw new Error("Unable to create conversation");
          await api(`/messages/conversations/${conversation._id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: shareText })
          });
          sent += 1;
        } catch (error) {
          failed.push(person.username || person.name || "user");
          console.error("Failed to share post with user", person, error);
        }
      }
      if (sent && !failed.length) {
        alert(`${kind === "reel" ? "Reel" : "Post"} sent to ${sent} ${sent === 1 ? "person" : "people"}.`);
        onClose();
      } else if (sent) {
        alert(`${kind === "reel" ? "Reel" : "Post"} sent to ${sent} ${sent === 1 ? "person" : "people"}. Could not send to: ${failed.join(", ")}.`);
        onClose();
      } else {
        alert(`Could not send the ${contentLabel}. Please try again.`);
      }
    } finally {
      setSending(false);
    }
  }

  const filtered = people.filter(person =>
    `${person.username || ""} ${person.name || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="share-sheet-overlay" onClick={onClose}>
      <div className="share-sheet glass-panel" onClick={e => e.stopPropagation()}>
        <div className="share-sheet-handle" />
        <div className="share-sheet-head">
          <div><h2>Share {kind === "reel" ? "Reel" : "post"}</h2><p>Select multiple people, or choose a sharing option</p></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close share"><X /></button>
        </div>

        <div className="share-search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people" autoFocus /></div>

        <div className="share-people">
          {loading ? <div className="share-loading">Loading people...</div> : filtered.length ? filtered.map(person => {
            const active = selected.some(item => String(item._id) === String(person._id));
            return (
              <button key={person._id} type="button" className={`share-person ${active ? "selected" : ""}`}
                onClick={() => togglePerson(person)} aria-pressed={active}
                title={active ? `Remove @${person.username} from selection` : `Select @${person.username}`}>
                <div className="share-person-avatar">
                  <Avatar user={person} size={64} />
                  {active && <span className="share-selected-check"><Check /></span>}
                </div>
                <b>@{person.username || person.name || "user"}</b>
                <span>{person.name || "ReelsGo user"}</span>
              </button>
            );
          }) : <div className="share-empty"><Users /><b>No people found</b><span>Follow people to quickly share posts with them.</span></div>}
        </div>

        {selected.length > 0 && (
          <button className="share-send-button" type="button" disabled={sending} onClick={sendPost}>
            <Send />{sending ? "Sending..." : `Send to ${selected.length} ${selected.length === 1 ? "person" : "people"}`}
          </button>
        )}

        <div className="share-shortcuts" aria-label="More sharing options">
          <button type="button" onClick={addToStory}>
            <span className="share-shortcut-icon"><CirclePlusFallback /></span><b>Add to story</b>
          </button>
          <button type="button" onClick={() => openWhatsApp(false)}>
            <span className="share-shortcut-icon whatsapp"><MessageCircle /></span><b>WhatsApp</b>
          </button>
          <button type="button" onClick={() => openWhatsApp(true)}>
            <span className="share-shortcut-icon whatsapp"><CirclePlusFallback /></span><b>WhatsApp Status</b>
          </button>
          <button type="button" onClick={shareExternally}>
            <span className="share-shortcut-icon"><Upload /></span><b>Share to…</b>
          </button>
          <button type="button" onClick={copyPostLink}>
            <span className="share-shortcut-icon"><LinkIcon /></span><b>Copy link</b>
          </button>
        </div>
        {notice && <div className="share-notice" role="status">{notice}</div>}
      </div>
    </div>
  );
}

function CirclePlusFallback() {
  return <span className="share-circle-plus">＋</span>;
}

function TagPeoplePicker({ selected = [], setSelected, onClose }) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPeople(search = "") {
    setLoading(true);
    setError("");
    try {
      let users = [];
      if (search.trim()) {
        const d = await api(`/users/search?q=${encodeURIComponent(search.trim())}`);
        users = d.users || d.results || [];
      } else {
        try {
          const current = getUser();
          if (current?._id) {
            const d = await api(`/follows/${current._id}/following`);
            users = d.following || d.users || [];
          }
        } catch {}
        if (!users.length) {
          const d = await api(`/users/search?q=${encodeURIComponent("a")}`);
          users = d.users || d.results || [];
        }
      }

      const currentId = String(getUser()?._id || "");
      const unique = [];
      const seen = new Set();
      for (const item of users) {
        const person = item?.user || item;
        if (!person?._id) continue;
        const id = String(person._id);
        if (id === currentId || seen.has(id)) continue;
        seen.add(id);
        unique.push(person);
      }
      setPeople(unique);
    } catch (e) {
      console.error(e);
      setPeople([]);
      setError(e.message || "Unable to load people");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadPeople(query), query.trim() ? 250 : 0);
    return () => clearTimeout(timer);
  }, [query]);

  function togglePerson(person) {
    const id = String(person._id);
    const exists = selected.some(p => String(p._id) === id);
    if (exists) {
      setSelected(selected.filter(p => String(p._id) !== id));
      return;
    }
    if (selected.length >= 20) {
      alert("You can tag up to 20 people.");
      return;
    }
    setSelected([...selected, person]);
  }

  return (
    <div className="tag-people-panel">
      <div className="tag-people-head">
        <div>
          <b>Tag people</b>
          <span>{selected.length ? `${selected.length} selected` : "Choose people to tag"}</span>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close tag people">
          <X />
        </button>
      </div>

      {selected.length > 0 && (
        <div className="tag-selected-list">
          {selected.map(person => (
            <button
              key={person._id}
              type="button"
              className="tag-selected-chip"
              onClick={() => togglePerson(person)}
              title={`Remove @${person.username}`}
            >
              <Avatar user={person} size={30} />
              <span>@{person.username}</span>
              <X />
            </button>
          ))}
        </div>
      )}

      <div className="tag-people-search">
        <Search />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search people by name or username"
          autoFocus
        />
        {query && <button type="button" onClick={() => setQuery("")}><X /></button>}
      </div>

      <div className="tag-people-results">
        {loading ? (
          <div className="tag-people-state">Searching people...</div>
        ) : error ? (
          <div className="tag-people-state">{error}</div>
        ) : people.length ? (
          people.map(person => {
            const active = selected.some(p => String(p._id) === String(person._id));
            return (
              <button
                key={person._id}
                type="button"
                className={`tag-person-row ${active ? "selected" : ""}`}
                onClick={() => togglePerson(person)}
              >
                <Avatar user={person} size={46} />
                <span className="tag-person-info">
                  <b>{person.username ? `@${person.username}` : person.name || "ReelsGo user"}</b>
                  <small>{person.name || "ReelsGo user"}</small>
                </span>
                <span className={`tag-person-check ${active ? "active" : ""}`}>
                  {active ? <Check /> : null}
                </span>
              </button>
            );
          })
        ) : (
          <div className="tag-people-state">
            <Users />
            <b>No people found</b>
            <span>Search for a ReelsGo user to tag.</span>
          </div>
        )}
      </div>

      <button type="button" className="primary full" onClick={onClose}>
        <Check /> Done
      </button>
    </div>
  );
}

function PostComposer({ user, onClose, onDone }) {
  const input = useRef(null);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [audience, setAudience] = useState("everyone");
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [tagPeopleOpen, setTagPeopleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("");

  async function publish() {
    if (!files.length && !caption.trim()) {
      alert("Add a photo/video or caption");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach(file => fd.append("media", file));
      fd.append("caption", caption);
      fd.append("location", location);
      fd.append("hashtags", hashtags);
      fd.append("audience", audience);
      fd.append("mentions", JSON.stringify(taggedPeople.map(person => person._id)));
      await api("/posts", { method: "POST", body: fd });
      onDone();
      alert("Post shared");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  function chooseFiles(event) {
    const selected = Array.from(event.target.files || []);
    setFiles(selected);
    event.target.value = "";
  }

  function removeFile(index) {
    setFiles(current => current.filter((_, i) => i !== index));
  }

  function openPoll() {
    setActiveTool(current => current === "poll" ? "" : "poll");
    setCaption(current => current || "Poll: ");
  }

  function openPrompt() {
    setActiveTool(current => current === "prompt" ? "" : "prompt");
    setCaption(current => current || "Prompt: ");
  }

  return (
    <div className="publish-page-overlay" role="dialog" aria-modal="true" aria-label="New post">
      <div className="publish-page">
        <header className="publish-page-header">
          <button type="button" className="publish-back-button" onClick={onClose} aria-label="Go back">
            <ChevronRight style={{ transform: "rotate(180deg)" }} />
          </button>
          <h1>New post</h1>
          <div className="publish-header-spacer" />
        </header>

        <div className="publish-scroll-area">
          <section className="publish-media-section">
            {files.length ? (
              <div className={`publish-media-preview ${files.length > 1 ? "multiple" : ""}`}>
                {files.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  const isVideo = file.type.startsWith("video/");
                  return (
                    <div className="publish-media-item" key={`${file.name}-${file.lastModified}-${index}`}>
                      {isVideo ? (
                        <video src={url} muted playsInline controls preload="metadata" />
                      ) : (
                        <img src={url} alt={file.name} />
                      )}
                      <button type="button" className="publish-media-remove" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                        <X />
                      </button>
                      {files.length > 1 && <span className="publish-media-count">{index + 1}/{files.length}</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <button type="button" className="publish-empty-media" onClick={() => input.current?.click()}>
                <ImageIcon />
                <b>Add photos or videos</b>
                <span>Choose media from your device</span>
              </button>
            )}
          </section>

          <section className="publish-caption-section">
            <div className="publish-user-row">
              <Avatar user={user} size={42} />
              <div>
                <b>{user?.username || user?.name || "You"}</b>
                <span>New post</span>
              </div>
            </div>
            <textarea
              className="publish-caption"
              placeholder="Add a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              maxLength={2200}
            />
            <div className="publish-caption-meta">
              <span>{hashtags ? "Hashtags added" : ""}</span>
              <span>{caption.length}/2,200</span>
            </div>
          </section>

          <section className="publish-pills">
            <button type="button" className={activeTool === "poll" ? "active" : ""} onClick={openPoll}>
              <SlidersHorizontal />
              <span>Poll</span>
            </button>
            <button type="button" className={activeTool === "prompt" ? "active" : ""} onClick={openPrompt}>
              <MessageSquareText />
              <span>Prompt</span>
            </button>
          </section>

          <section className="publish-options-card">
            <button
              type="button"
              className={`publish-option-row ${taggedPeople.length ? "selected" : ""}`}
              onClick={() => setTagPeopleOpen(true)}
            >
              <span className="publish-option-icon"><UserPlus /></span>
              <span className="publish-option-copy">
                <b>Tag people</b>
                <small>{taggedPeople.length ? `${taggedPeople.length} ${taggedPeople.length === 1 ? "person" : "people"} tagged` : "Tag people in this post"}</small>
              </span>
              <ChevronRight />
            </button>

            <div className="publish-option-divider" />

            <button
              type="button"
              className={`publish-option-row ${location.trim() ? "selected" : ""}`}
              onClick={() => setActiveTool(activeTool === "location" ? "" : "location")}
            >
              <span className="publish-option-icon"><PinOff /></span>
              <span className="publish-option-copy">
                <b>Add location</b>
                <small>{location.trim() || "Add where this post was taken"}</small>
              </span>
              <ChevronRight />
            </button>

            {activeTool === "location" && (
              <div className="publish-inline-field">
                <PinOff />
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Search or enter a location" autoFocus />
                {location && (
                  <button type="button" onClick={() => setLocation("")} aria-label="Clear location">
                    <X />
                  </button>
                )}
              </div>
            )}

            <div className="publish-option-divider" />

            <button type="button" className="publish-option-row" onClick={() => input.current?.click()}>
              <span className="publish-option-icon"><ImageIcon /></span>
              <span className="publish-option-copy">
                <b>Add more media</b>
                <small>{files.length ? `${files.length} selected` : "Choose photos or videos"}</small>
              </span>
              <ChevronRight />
            </button>
          </section>

          <section className="publish-audience-section">
            <label htmlFor="post-audience">Who can see this post?</label>
            <select id="post-audience" value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="everyone">Everyone</option>
              <option value="followers">Followers</option>
              <option value="close_friends">Close friends</option>
              <option value="only_me">Only me</option>
            </select>
            <small>Close friends visibility must also be enforced by your backend.</small>
          </section>

          <section className="publish-hashtags-section">
            <label htmlFor="publish-hashtags">Hashtags</label>
            <input id="publish-hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#reelsgo #photo #life" />
          </section>

          <input ref={input} type="file" multiple accept="image/*,video/*" hidden onChange={chooseFiles} />
        </div>

        <div className="publish-bottom-bar">
          <button type="button" className="publish-share-button" disabled={loading || (!files.length && !caption.trim())} onClick={publish}>
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {tagPeopleOpen && (
          <div className="publish-tag-overlay">
            <div className="publish-tag-card">
              <TagPeoplePicker selected={taggedPeople} setSelected={setTaggedPeople} onClose={() => setTagPeopleOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComposer({ onClose, onDone }) {
  const input = useRef(null);
  const currentUser = getUser();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("everyone");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("");

  async function publish() {
    if (!file && !text.trim()) {
      alert("Add a photo/video or text");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("media", file);
      fd.append("text", text);
      fd.append("audience", audience);
      await api("/stories", { method: "POST", body: fd });
      onDone();
      alert("Story shared");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  function chooseFile(event) {
    setFile(event.target.files?.[0] || null);
    event.target.value = "";
  }

  return (
    <div className="publish-page-overlay" role="dialog" aria-modal="true" aria-label="New story">
      <div className="publish-page story-publish-page">
        <header className="publish-page-header">
          <button type="button" className="publish-back-button" onClick={onClose} aria-label="Go back">
            <ChevronRight style={{ transform: "rotate(180deg)" }} />
          </button>
          <h1>New story</h1>
          <div className="publish-header-spacer" />
        </header>

        <div className="publish-scroll-area">
          <section className="publish-media-section">
            {file ? (
              <div className="publish-media-preview story-publish-preview">
                <div className="publish-media-item story-publish-media-item">
                  {file.type.startsWith("video/") ? (
                    <video src={URL.createObjectURL(file)} muted playsInline controls preload="metadata" />
                  ) : (
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                  )}
                  <button type="button" className="publish-media-remove" onClick={() => setFile(null)} aria-label="Remove story media">
                    <X />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="publish-empty-media story-empty-media" onClick={() => input.current?.click()}>
                <Camera />
                <b>Add to your story</b>
                <span>Photo, video or text</span>
              </button>
            )}
          </section>

          <section className="publish-caption-section">
            <div className="publish-user-row">
              <Avatar user={currentUser} size={42} />
              <div>
                <b>{currentUser?.username || currentUser?.name || "You"}</b>
                <span>New story</span>
              </div>
            </div>
            <textarea
              className="publish-caption story-publish-caption"
              placeholder="Add text to your story..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={1000}
            />
            <div className="publish-caption-meta">
              <span>Share a photo, video or text</span>
              <span>{text.length}/1,000</span>
            </div>
          </section>

          <section className="publish-pills">
            <button
              type="button"
              className={activeTool === "text" ? "active" : ""}
              onClick={() => {
                setActiveTool(activeTool === "text" ? "" : "text");
                setTimeout(() => document.querySelector(".story-publish-caption")?.focus(), 0);
              }}
            >
              <MessageSquareText />
              <span>Add text</span>
            </button>
            <button
              type="button"
              className={activeTool === "gallery" ? "active" : ""}
              onClick={() => {
                setActiveTool("gallery");
                input.current?.click();
              }}
            >
              <Camera />
              <span>Gallery</span>
            </button>
          </section>

          <section className="publish-options-card">
            <button type="button" className="publish-option-row" onClick={() => input.current?.click()}>
              <span className="publish-option-icon"><ImageIcon /></span>
              <span className="publish-option-copy">
                <b>Choose from gallery</b>
                <small>{file ? file.name : "Select a photo or video"}</small>
              </span>
              <ChevronRight />
            </button>

            <div className="publish-option-divider" />

            <button
              type="button"
              className={`publish-option-row ${text.trim() ? "selected" : ""}`}
              onClick={() => {
                setActiveTool("text");
                setTimeout(() => document.querySelector(".story-publish-caption")?.focus(), 0);
              }}
            >
              <span className="publish-option-icon"><MessageSquareText /></span>
              <span className="publish-option-copy">
                <b>Add text</b>
                <small>{text.trim() || "Write something on your story"}</small>
              </span>
              <ChevronRight />
            </button>
          </section>

          <section className="publish-audience-section">
            <label htmlFor="story-audience">Who can see this story?</label>
            <select id="story-audience" value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="everyone">Everyone</option>
              <option value="followers">Followers</option>
              <option value="close_friends">Close friends</option>
            </select>
            <small>Close friends visibility must also be enforced by your backend.</small>
          </section>
          <input ref={input} type="file" accept="image/*,video/*" hidden onChange={chooseFile} />
        </div>

        <div className="publish-bottom-bar">
          <button type="button" className="publish-share-button" disabled={loading || (!file && !text.trim())} onClick={publish}>
            {loading ? "Sharing..." : "Share to story"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReelComposer({ onClose, onDone }) {
  const input = useRef(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [audience, setAudience] = useState("everyone");
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [tagPeopleOpen, setTagPeopleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function publish() {
    if (!file) return alert("Select a Reel video");
    if (file.size > 15 * 1024 * 1024) return alert("Video must be below 15 MB for MongoDB BSON storage");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("video", file); fd.append("caption", caption); fd.append("hashtags", hashtags);
      fd.append("audience", audience);
      fd.append("mentions", JSON.stringify(taggedPeople.map(person => person._id)));
      await api("/reels", { method: "POST", body: fd });
      onDone(); alert("Reel published");
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  }

  return <Modal title="Create Reel" onClose={onClose}>
    <div className="reel-editor">
      <Film />
      <h3>New Reel</h3>
      <p>Upload a vertical video. Maximum 15 MB with the current MongoDB media model.</p>
      {file && <div className="selected-file"><Check /> {file.name}</div>}
    </div>
    <input ref={input} type="file" accept="video/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
    <button className="secondary full" onClick={() => input.current?.click()}><Upload /> Choose video</button>
    <input className="normal-input" placeholder="Write a caption..." value={caption} onChange={e => setCaption(e.target.value)} />
    <input className="normal-input" placeholder="#hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} />
    <label className="publish-audience-label" htmlFor="reel-audience">Who can see this Reel?</label>
    <select id="reel-audience" className="normal-input" value={audience} onChange={e => setAudience(e.target.value)}>
      <option value="everyone">Everyone</option>
      <option value="followers">Followers</option>
      <option value="close_friends">Close friends</option>
    </select>
    <small className="publish-audience-hint">Close friends visibility must also be enforced by your backend.</small>
    <button type="button" className={`secondary full tag-people-trigger ${taggedPeople.length ? "has-tags" : ""}`} onClick={() => setTagPeopleOpen(v => !v)}>
      <UserPlus /> {taggedPeople.length ? `Tagged ${taggedPeople.length} ${taggedPeople.length === 1 ? "person" : "people"}` : "Tag people"}
    </button>
    {tagPeopleOpen && <TagPeoplePicker selected={taggedPeople} setSelected={setTaggedPeople} onClose={() => setTagPeopleOpen(false)} />}
    <button className="primary full" onClick={publish} disabled={loading}>{loading ? "Publishing..." : "Publish Reel"}</button>
  </Modal>;
}

function InstagramMediaOptionsSheet({
  open,
  onClose,
  mediaType = "post",
  onDelete,
  deleting = false
}) {
  if (!open) return null;

  const isReel = mediaType === "reel";

  return (
    <div
      className="ig-options-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${isReel ? "Reel" : "Post"} options`}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ig-options-sheet ig-delete-only-sheet" onMouseDown={e => e.stopPropagation()}>
        <div className="ig-options-handle" />

        <button
          type="button"
          className="ig-option-row ig-option-delete"
          disabled={deleting}
          onClick={onDelete}
        >
          <Trash2 size={27} strokeWidth={1.9} />
          <span>
            {deleting
              ? `Deleting ${isReel ? "Reel" : "post"}...`
              : `Delete ${isReel ? "Reel" : "post"}`}
          </span>
        </button>

        <button type="button" className="ig-options-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function ProfileReelCard({ reel, user, onDeleted }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = String(reel.author?._id || reel.author) === String(user?._id);

  async function deleteReel() {
    if (!isOwner || deleting) return;
    const confirmed = window.confirm("Delete this Reel? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api(`/reels/${reel._id}`, { method: "DELETE" });
      setOptionsOpen(false);
      onDeleted?.(reel._id);
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="profile-reel-card">
        <video
          src={`${SERVER}${reel.mediaUrl}`}
          muted
          playsInline
          controls
          preload="metadata"
          onClick={e => e.stopPropagation()}
        />
        <div className="profile-reel-overlay">
          <div className="profile-reel-caption">
            <Film size={16} />
            <span>{reel.caption || "Reel"}</span>
          </div>
          {isOwner && (
            <button
              type="button"
              className="profile-media-more"
              aria-label="Reel options"
              title="Reel options"
              onClick={e => {
                e.stopPropagation();
                setOptionsOpen(true);
              }}
            >
              <MoreHorizontal size={21} />
            </button>
          )}
        </div>
      </div>

      {isOwner && (
        <InstagramMediaOptionsSheet
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          mediaType="reel"
          onDelete={deleteReel}
          deleting={deleting}
        />
      )}
    </>
  );
}


function ConnectionsModal({ user, type, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadConnections() {
      try {
        setLoading(true);
        setError("");
        const endpoint = type === "followers"
          ? `/follows/${user?._id}/followers`
          : `/follows/${user?._id}/following`;
        const data = await api(endpoint);
        const raw = type === "followers"
          ? (data.followers || data.users || [])
          : (data.following || data.users || data.followers || []);
        const normalized = raw
          .map(item => item?.user || item?.follower || item?.following || item)
          .filter(person => person?._id)
          .filter((person, index, arr) => arr.findIndex(x => String(x._id) === String(person._id)) === index);
        if (!cancelled) setItems(normalized);
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to load list");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadConnections();
    return () => { cancelled = true; };
  }, [type]);

  const title = type === "followers" ? "Followers" : "Following";

  return (
    <div className="connections-overlay" onClick={onClose}>
      <div className="connections-modal" onClick={e => e.stopPropagation()}>
        <div className="connections-header">
          <div>
            <h2>{title}</h2>
            <span>{user?.username ? `@${user.username}` : "ReelsGo"}</span>
          </div>
          <button type="button" onClick={onClose} aria-label={`Close ${title}`}><X /></button>
        </div>
        <div className="connections-body">
          {loading ? (
            <div className="connections-state">
              <div className="connections-spinner" />
              <span>Loading {title.toLowerCase()}...</span>
            </div>
          ) : error ? (
            <div className="connections-state connections-error">
              <AlertTriangle />
              <b>Unable to load {title.toLowerCase()}</b>
              <span>{error}</span>
            </div>
          ) : !items.length ? (
            <div className="connections-state">
              <Users />
              <b>No {title.toLowerCase()} yet</b>
              <span>{type === "followers" ? "People who follow you will appear here." : "People you follow will appear here."}</span>
            </div>
          ) : (
            <div className="connections-list">
              {items.map(person => (
                <div className="connection-row" key={person._id}>
                  <Avatar user={person} size={52} />
                  <div className="connection-info">
                    <UserLink user={person} />
                    {person?.name && <span>{person.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ user, setUser }) {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const input = useRef(null);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [isPrivate, setIsPrivate] = useState(!!user?.isPrivate);
  const [connectionsOpen, setConnectionsOpen] = useState(null);

  async function load() {
    try {
      const [p, r] = await Promise.all([api("/posts"), api("/reels")]);
      setPosts((p.posts || []).filter(x => x.author?._id === user?._id));
      setReels((r.reels || []).filter(x => x.author?._id === user?._id));
    } catch (e) { console.error(e); }
  }

  useEffect(() => { load(); }, [user?._id]);

  async function avatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Select an image");
    if (file.size > 10 * 1024 * 1024) return alert("Image must be below 10 MB");

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      setSaving(true);
      const d = await api("/users/me/avatar", { method: "POST", body: fd });
      setUser(d.user);
      localStorage.setItem("vk_user", JSON.stringify(d.user));
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      const d = await api("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, website, isPrivate })
      });

      setUser(d.user);
      localStorage.setItem("vk_user", JSON.stringify(d.user));
      setEditOpen(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const visiblePosts = posts;

  return (
    <div className="page profile-page">
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <Avatar user={user} size={96} className="profile-avatar" />
          <button
            className="avatar-camera"
            onClick={() => input.current?.click()}
            disabled={saving}
          >
            <Camera />
          </button>
          <input
            ref={input}
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={avatarUpload}
          />
        </div>

        <div className="profile-details">
          <div className="profile-line">
            <h1>{user?.username} <VerifiedBadge userId={user?._id} /></h1>
            <button
              className="secondary"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 /> Edit profile
            </button>
            <button className="icon-button profile-more">
              <MoreHorizontal />
            </button>
          </div>

          <div className="profile-stats">
            <span>
              <b>{user?.postsCount || posts.length}</b>
              <small>posts</small>
            </span>

            <button
              type="button"
              className="profile-stat-button"
              onClick={() => setConnectionsOpen("followers")}
              aria-label="View followers"
            >
              <b>{user?.followersCount || 0}</b>
              <small>followers</small>
            </button>

            <button
              type="button"
              className="profile-stat-button"
              onClick={() => setConnectionsOpen("following")}
              aria-label="View following"
            >
              <b>{user?.followingCount || 0}</b>
              <small>following</small>
            </button>
          </div>

          <b>{user?.name}</b>
          <p>{user?.bio || ""}</p>

          {user?.website && (
            <a href={user.website} target="_blank" rel="noreferrer">
              <LinkIcon /> {user.website}
            </a>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>
          <Grid3X3 /> Posts
        </button>
        <button className={tab === "reels" ? "active" : ""} onClick={() => setTab("reels")}>
          <Film /> Reels
        </button>
        <button className={tab === "tagged" ? "active" : ""} onClick={() => setTab("tagged")}>
          <Users /> Tagged
        </button>
        <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
          <Bookmark /> Saved
        </button>
      </div>

      {tab === "posts" && (
        visiblePosts.length
          ? (
            <div className="profile-grid">
              {visiblePosts.map(p => (
                <GridMedia
                  key={p._id}
                  post={p}
                  user={user}
                  onDeleted={(id) =>
                    setPosts(current =>
                      current.filter(item => String(item._id) !== String(id))
                    )
                  }
                />
              ))}
            </div>
          )
          : <EmptyTab icon={<CameraOff />} title="No posts yet" text="Share your first photo or video." />
      )}

      {tab === "reels" && (
        reels.length
          ? (
            <div className="profile-grid reels-profile-grid">
              {reels.map(r => (
                <ProfileReelCard
                  key={r._id}
                  reel={r}
                  user={user}
                  onDeleted={(id) =>
                    setReels(current =>
                      current.filter(item => String(item._id) !== String(id))
                    )
                  }
                />
              ))}
            </div>
          )
          : <EmptyTab icon={<Film />} title="No Reels yet" text="Your published Reels will appear here." />
      )}

      {tab === "tagged" && (
        posts.filter(p =>
          (p.mentions || []).some(
            m => String(m?._id || m) === String(user?._id)
          )
        ).length
          ? (
            <div className="profile-grid">
              {posts
                .filter(p =>
                  (p.mentions || []).some(
                    m => String(m?._id || m) === String(user?._id)
                  )
                )
                .map(p => (
                  <GridMedia
                    key={p._id}
                    post={p}
                    user={user}
                    onDeleted={(id) =>
                      setPosts(current =>
                        current.filter(item => String(item._id) !== String(id))
                      )
                    }
                  />
                ))}
            </div>
          )
          : <EmptyTab icon={<Users />} title="Photos of you" text="Posts where you are tagged will appear here." />
      )}

      {tab === "saved" && <SavedPage embedded user={user} />}

      {connectionsOpen && (
        <ConnectionsModal
          user={user}
          type={connectionsOpen}
          onClose={() => setConnectionsOpen(null)}
        />
      )}

      {editOpen && (
        <EditProfilePage
          user={user}
          name={name}
          setName={setName}
          bio={bio}
          setBio={setBio}
          website={website}
          setWebsite={setWebsite}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          saving={saving}
          onClose={() => setEditOpen(false)}
          onAvatarClick={() => input.current?.click()}
          onSave={saveProfile}
        />
      )}
    </div>
  );
}

function EditProfilePage({
  user,
  name,
  setName,
  bio,
  setBio,
  website,
  setWebsite,
  isPrivate,
  setIsPrivate,
  saving,
  onClose,
  onAvatarClick,
  onSave
}) {
  const [pronouns, setPronouns] = useState(user?.pronouns || "");
  const [gender, setGender] = useState(user?.gender || "Man");
  const [aiCreator, setAiCreator] = useState(!!user?.aiCreator);

  return (
    <div className="edit-profile-overlay" role="dialog" aria-modal="true">
      <div className="edit-profile-screen">
        <header className="edit-profile-topbar">
          <button
            type="button"
            className="edit-profile-back"
            onClick={onClose}
            aria-label="Back"
          >
            <ChevronRight />
          </button>

          <h1>Edit profile</h1>

          <button
            type="button"
            className="edit-profile-done"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Done"}
          </button>
        </header>

        <main className="edit-profile-scroll">
          <section className="edit-profile-photo-section">
            <div className="edit-profile-photo-row">
              <button
                type="button"
                className="edit-profile-photo-button"
                onClick={onAvatarClick}
                disabled={saving}
                aria-label="Change profile picture"
              >
                <Avatar user={user} size={168} />
              </button>

            </div>

            <button
              type="button"
              className="edit-profile-photo-link"
              onClick={onAvatarClick}
            >
              Edit profile picture
            </button>
          </section>

          <section className="edit-profile-fields">
            <div className="edit-profile-field-row">
              <label>Name</label>
              <div className="edit-profile-field-control">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="edit-profile-field-row">
              <label>Username</label>
              <div className="edit-profile-field-control">
                <input
                  value={user?.username || ""}
                  readOnly
                  aria-label="Username"
                />
              </div>
            </div>

            <div className="edit-profile-field-row">
              <label>Pronouns</label>
              <div className="edit-profile-field-control">
                <input
                  value={pronouns}
                  onChange={e => setPronouns(e.target.value)}
                  placeholder="Pronouns"
                />
              </div>
            </div>

            <div className="edit-profile-field-row edit-profile-bio-row">
              <label>Bio</label>
              <div className="edit-profile-field-control edit-profile-bio-control">
                <textarea
                  value={bio}
                  maxLength={150}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Bio"
                />
                <span>{bio.length}/150</span>
              </div>
            </div>

            <button type="button" className="edit-profile-action-row">
              <span>Links</span>
              <span className="edit-profile-action-value">
                {website || "Add links"}
                <ChevronRight />
              </span>
            </button>

            <button type="button" className="edit-profile-action-row">
              <span className="edit-profile-action-stack">
                <b>Banners</b>
                <small>Add music, profiles and more.</small>
              </span>
              <span className="edit-profile-action-value">
                Add banners
                <ChevronRight />
              </span>
            </button>

            <button type="button" className="edit-profile-action-row">
              <span>Reorder grid</span>
              <ChevronRight />
            </button>

            <button
              type="button"
              className="edit-profile-action-row"
              onClick={() => {
                const next = gender === "Man" ? "Woman" : gender === "Woman" ? "Prefer not to say" : "Man";
                setGender(next);
              }}
            >
              <span>Gender</span>
              <span className="edit-profile-action-value">
                {gender}
                <ChevronRight />
              </span>
            </button>

            <div className="edit-profile-ai-row">
              <div>
                <b>AI creator</b>
                <span>
                  Add this label if your profile features an AI-generated person.{" "}
                  <a href="#ai-info" onClick={e => e.preventDefault()}>Learn more</a>
                </span>
              </div>

              <button
                type="button"
                className={`edit-profile-toggle ${aiCreator ? "on" : ""}`}
                aria-pressed={aiCreator}
                onClick={() => setAiCreator(v => !v)}
              >
                <span />
              </button>
            </div>

            <button type="button" className="edit-profile-professional">
              Switch to professional account
            </button>

            <div className="edit-profile-privacy">
              <div>
                <b>Private account</b>
                <span>Only people you approve can follow you and see your posts and stories.</span>
              </div>

              <button
                type="button"
                className={`edit-profile-toggle ${isPrivate ? "on" : ""}`}
                aria-pressed={isPrivate}
                onClick={() => setIsPrivate(v => !v)}
              >
                <span />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function GridMedia({ post, user, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const m = post.media?.[0];

  if (!m?.url) return null;

  const isOwner =
    String(post.author?._id || post.author) === String(user?._id);

  async function deletePost() {
    if (!isOwner || deleting) return;

    const confirmed = window.confirm(
      "Delete this post? This action cannot be undone."
    );

    if (!confirmed) {
      setMenuOpen(false);
      return;
    }

    setDeleting(true);

    try {
      await api(`/posts/${post._id}`, {
        method: "DELETE"
      });

      setMenuOpen(false);

      if (onDeleted) {
        onDeleted(post._id);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: "#15181d"
        }}
      >
        <button
          className="grid-media grid-media-button"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open media"
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          {m.kind === "video" ? (
            <video
              src={`${SERVER}${m.url}`}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={`${SERVER}${m.url}`}
              alt={post.caption || ""}
            />
          )}

          {m.kind === "video" && (
            <span className="grid-video-icon">
              <Play fill="currentColor" />
            </span>
          )}
        </button>

        {isOwner && (
          <button
            type="button"
            className="profile-media-more grid-post-more"
            aria-label="Post options"
            title="Post options"
            onClick={e => {
              e.stopPropagation();
              setMenuOpen(true);
            }}
          >
            <MoreHorizontal size={20} />
          </button>
        )}

        {isOwner && (
          <InstagramMediaOptionsSheet
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            mediaType="post"
            onDelete={deletePost}
            deleting={deleting}
          />
        )}
      </div>

      {open && (
        <MediaViewer
          media={m}
          post={post}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function EmptyTab({ icon, title, text }) {
  return <div className="empty tab-empty">{icon}<h2>{title}</h2><p>{text}</p></div>;
}

function ReelsPage({ onCreate }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [feedEnded, setFeedEnded] = useState(false);
  const [commentsReel, setCommentsReel] = useState(null);
  const [shareReelTarget, setShareReelTarget] = useState(null);
  const [reelComments, setReelComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSending, setCommentSending] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [commentMenuId, setCommentMenuId] = useState(null);
  const [commentActionBusy, setCommentActionBusy] = useState(false);
  const [soundEnabledById, setSoundEnabledById] = useState({});
  const [likedById, setLikedById] = useState({});
  const [savedById, setSavedById] = useState({});
  const [likesTarget, setLikesTarget] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesError, setLikesError] = useState("");
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
  const endCardRef = useRef(null);
  const me = getUser();

  async function load() {
    try {
      const d = await api("/reels");
      setReels(d.reels || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Mark the active page so global floating Messages UI is hidden only on Reels.
  useEffect(() => {
    document.body.classList.add("reelsgo-reels-active");
    return () => document.body.classList.remove("reelsgo-reels-active");
  }, []);

  // Hide the mobile navigation while the comments sheet is open, like Instagram.
  useEffect(() => {
    document.body.classList.toggle("reelsgo-comments-open", Boolean(commentsReel));
    return () => document.body.classList.remove("reelsgo-comments-open");
  }, [commentsReel]);

  useEffect(() => {
    if (!reels.length) return;
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      if (visible.target.dataset.feedEnd === "true") {
        setFeedEnded(true);
        return;
      }

      const index = Number(visible.target.dataset.index);
      if (!Number.isNaN(index)) {
        setFeedEnded(false);
        setActiveIndex(index);
      }
    }, { root, threshold: [0.35, 0.6, 0.8] });

    cardRefs.current.forEach(card => card && observer.observe(card));
    if (endCardRef.current) observer.observe(endCardRef.current);
    return () => observer.disconnect();
  }, [reels]);

  // Only the visible Reel plays; scrolling away pauses the previous video.
  useEffect(() => {
    const videos = scrollRef.current?.querySelectorAll("video") || [];
    videos.forEach((video, index) => {
      if (index === activeIndex && !feedEnded) {
        const promise = video.play();
        if (promise && typeof promise.catch === "function") promise.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, feedEnded, reels]);

  function goToReel(index) {
    const next = Math.max(0, Math.min(index, reels.length - 1));
    const card = cardRefs.current[next];

    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
      setFeedEnded(false);
      setActiveIndex(next);
    }
  }

  function shareReel(reel) {
    setOpenMenuId(null);
    setShareReelTarget(reel);
  }

  async function deleteReel(reel) {
    const isOwner =
      String(reel.author?._id || reel.author) === String(me?._id);

    if (!isOwner || deletingId) return;

    const confirmed = window.confirm(
      "Delete this Reel? This action cannot be undone."
    );

    if (!confirmed) {
      setOpenMenuId(null);
      return;
    }

    setDeletingId(reel._id);

    try {
      await api(`/reels/${reel._id}`, {
        method: "DELETE"
      });

      setOpenMenuId(null);

      setReels(current => {
        const next = current.filter(
          item => String(item._id) !== String(reel._id)
        );

        setActiveIndex(index =>
          next.length ? Math.min(index, next.length - 1) : 0
        );

        return next;
      });
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function openReelComments(reel) {
    setCommentsReel(reel);
    setCommentMenuId(null);
    setReelComments([]);
    setCommentsError("");
    setCommentText("");
    setCommentsLoading(true);
    try {
      const data = await api(`/reels/${reel._id}/comments`);
      const loadedComments = Array.isArray(data.comments) ? data.comments : [];
      setReelComments(loadedComments);
      const actualCount = Number(data.commentsCount ?? loadedComments.length);
      setCommentsReel(current => current ? { ...current, commentsCount: actualCount } : current);
      setReels(current => current.map(item => String(item._id) === String(reel._id) ? { ...item, commentsCount: actualCount } : item));
    } catch (error) {
      setCommentsError(error?.message || "Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function submitReelComment(event) {
    event.preventDefault();
    if (!commentsReel || !commentText.trim() || commentSending) return;
    setCommentSending(true);
    setCommentsError("");
    try {
      const data = await api(`/reels/${commentsReel._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() })
      });
      if (data.comment) setReelComments(current => [...current, data.comment]);
      setCommentText("");
      setReels(current => current.map(item => String(item._id) === String(commentsReel._id)
        ? { ...item, commentsCount: (Number(item.commentsCount) || 0) + 1 }
        : item));
    } catch (error) {
      setCommentsError(error?.message || "Could not post comment.");
    } finally {
      setCommentSending(false);
    }
  }

  async function runCommentAction(action, comment) {
    if (!commentsReel || !comment || commentActionBusy) return;
    const isReelOwner = String(commentsReel.author?._id || commentsReel.author) === String(me?._id);
    const isCommentAuthor = String(comment.author?._id || comment.author) === String(me?._id);
    const commentId = String(comment._id || "");
    const targetUserId = String(comment.author?._id || comment.author || "");
    setCommentMenuId(null);

    try {
      if (action === "share") {
        const url = `${window.location.origin}/reels/${commentsReel._id}`;
        if (navigator.share) {
          try { await navigator.share({ title: "ReelsGo Reel", text: commentsReel.caption || "Watch this Reel", url }); }
          catch (error) { if (error?.name !== "AbortError") throw error; }
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          alert("Reel link copied.");
        } else {
          window.prompt("Copy this Reel link:", url);
        }
        return;
      }
      if (action === "story") {
        window.dispatchEvent(new CustomEvent("reelsgo-open-story-composer", { detail: { reelId: commentsReel._id, url: `${window.location.origin}/reels/${commentsReel._id}` } }));
        return;
      }
      if (action === "replyReel") {
        setCommentText(`@${comment.author?.username || comment.author?.name || "user"} `);
        setCommentsReel(null);
        onCreate?.();
        return;
      }
      if (action === "delete") {
        if (!isReelOwner && !isCommentAuthor) throw new Error("Only the Reel owner or comment author can delete this comment.");
        if (!window.confirm("Delete this comment?")) return;
        setCommentActionBusy(true);
        await api(`/reels/${commentsReel._id}/comments/${commentId}`, { method: "DELETE" });
        setReelComments(items => items.filter(item => String(item._id) !== commentId));
        setReels(items => items.map(item => String(item._id) === String(commentsReel._id) ? { ...item, commentsCount: Math.max(0, Number(item.commentsCount || 0) - 1) } : item));
        return;
      }
      if (action === "pin") {
        if (!isReelOwner) throw new Error("Only the Reel owner can pin comments.");
        setCommentActionBusy(true);
        const data = await api(`/reels/${commentsReel._id}/comments/${commentId}/pin`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinned: !comment.pinned }) });
        setReelComments(items => items.map(item => String(item._id) === commentId ? { ...item, pinned: Boolean(data.comment?.pinned) } : item));
        return;
      }
      if (["restrict", "block", "report"].includes(action)) {
        if (action === "restrict" && !isReelOwner) throw new Error("Only the Reel owner can restrict commenters on this Reel.");
        if (action === "block" && !isReelOwner) throw new Error("Only the Reel owner can block commenters from this Reel.");
        setCommentActionBusy(true);
        const data = await api(`/reels/${commentsReel._id}/comments/${commentId}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetUserId, reason: action === "report" ? "Comment reported by user" : undefined }) });
        if (action === "report") alert(data.message || "Comment reported.");
        else alert(data.message || (action === "block" ? "User blocked from interacting with your Reels." : "User restricted on your Reels."));
      }
    } catch (error) {
      setCommentsError(error?.message || "That comment action failed. Please try again.");
    } finally {
      setCommentActionBusy(false);
    }
  }

  async function toggleReelLike(reel) {
    const id = String(reel?._id || "");
    if (!id) return;
    try {
      const result = await api(`/reels/${id}/like`, { method: "POST" });
      setLikedById(current => ({ ...current, [id]: Boolean(result.liked) }));
      setReels(current => current.map(item => String(item._id) === id
        ? { ...item, likesCount: Number(result.likesCount ?? item.likesCount ?? 0) }
        : item));
    } catch (error) {
      alert(error?.message || "Could not like this Reel. Please sign in and try again.");
    }
  }

  async function toggleReelSave(reel) {
    const id = String(reel?._id || "");
    if (!id) return;
    try {
      const result = await api(`/reels/${id}/save`, { method: "POST" });
      setSavedById(current => ({ ...current, [id]: Boolean(result.saved) }));
      setReels(current => current.map(item => String(item._id) === id
        ? { ...item, savesCount: Number(result.savesCount ?? item.savesCount ?? 0) }
        : item));
      window.dispatchEvent(new CustomEvent("reelsgo-saved-content-updated"));
    } catch (error) {
      alert(error?.message || "Could not save this Reel. Please sign in and try again.");
    }
  }

  async function openReelLikes(reel) {
    setLikesTarget(reel);
    setLikedUsers([]);
    setLikesError("");
    setLikesLoading(true);
    try {
      const result = await api(`/reels/${reel._id}/likes`);
      setLikedUsers(Array.isArray(result.users) ? result.users : Array.isArray(result.likes) ? result.likes : []);
    } catch (error) {
      setLikesError(error?.message || "Could not load the people who liked this Reel.");
    } finally {
      setLikesLoading(false);
    }
  }

  function toggleReelSound(reelId) {
    const nextEnabled = !soundEnabledById[String(reelId)];
    setSoundEnabledById(current => ({ ...current, [String(reelId)]: nextEnabled }));
    const video = scrollRef.current?.querySelector(`[data-reel-id="${String(reelId)}"] video`);
    if (video) {
      video.muted = !nextEnabled;
      if (nextEnabled) {
        const promise = video.play();
        if (promise && typeof promise.catch === "function") promise.catch(() => {});
      }
    }
  }

  return (
    <div className="page reels-page">
      <div className="reels-mobile-header">
        <button type="button" className="reels-mobile-create" aria-label="Create Reel" onClick={onCreate}><PlusSquare /></button>
        <div className="reels-mobile-title"><b>Reels</b><button type="button" onClick={() => window.dispatchEvent(new CustomEvent("vk-open-search"))}>Friends <span className="reels-friends-avatars">{reels.slice(0, 3).map((item, i) => <span key={item._id || i}><Avatar user={item.author} size={19} /></span>)}</span></button></div>
        <button type="button" className="reels-mobile-search" aria-label="Search" onClick={() => window.dispatchEvent(new CustomEvent("vk-open-search"))}><Search /></button>
      </div>
      <div className="page-heading reels-heading">
        <div>
          <h1>Reels</h1>
          <p>Short videos from ReelsGo</p>
        </div>

        <button className="desktop-create" onClick={onCreate}>
          <Film /> Create Reel
        </button>
      </div>

      {!loading && !reels.length ? (
        <div className="empty">
          <Film />
          <h2>No Reels yet</h2>
          <p>Upload your first short video.</p>
          <button
            className="primary small"
            onClick={onCreate}
          >
            Upload Reel
          </button>
        </div>
      ) : (
        <div className="reels-stage">
          <div className="reels-scroll" ref={scrollRef}>
            {reels.map((r, index) => {
              const isOwner =
                String(r.author?._id || r.author) === String(me?._id);

              return (
                <article
                  className={`reel-feed-card ${
                    index === activeIndex ? "active" : ""
                  }`}
                  key={r._id}
                  ref={el => {
                    cardRefs.current[index] = el;
                  }}
                  data-index={index}
                  data-reel-id={r._id}
                >
                  <div className="reel-feed-media">
                    <video
                      src={`${SERVER}${r.mediaUrl}`}
                      muted={!soundEnabledById[String(r._id)]}
                      playsInline
                      controls={false}
                      onClick={e => {
                        const video = e.currentTarget;
                        if (video.paused) video.play().catch(() => {});
                        else video.pause();
                      }}
                      preload={
                        index === activeIndex ? "auto" : "metadata"
                      }
                      autoPlay={index === activeIndex}
                      loop
                    />

                    <div className="reels-mobile-actions" aria-label="Reel actions">
                      <button type="button" aria-label={likedById[String(r._id)] ? "Unlike Reel" : "Like Reel"} onClick={() => toggleReelLike(r)} className={likedById[String(r._id)] ? "is-liked" : ""}><Heart fill={likedById[String(r._id)] ? "currentColor" : "none"} /></button>
                      <button type="button" className="reels-mobile-likes-count" aria-label="See who liked this Reel" onClick={() => openReelLikes(r)}><small>{Number(r.likesCount || 0)} likes</small></button>
                      <button type="button" aria-label="Comment on Reel" onClick={() => openReelComments(r)}><MessageCircle /><small>{Number(r.commentsCount ?? 0)} comments</small></button>
                      <button type="button" aria-label="Share Reel" onClick={() => shareReel(r)}><Send /><small>Share</small></button>
                      <button type="button" aria-label={soundEnabledById[String(r._id)] ? "Mute Reel" : "Enable Reel sound"} onClick={() => toggleReelSound(r._id)}>{soundEnabledById[String(r._id)] ? <Volume2 /> : <VolumeX />}<small>{soundEnabledById[String(r._id)] ? "Sound on" : "Sound off"}</small></button>
                      <button type="button" aria-label="Save Reel" onClick={() => toggleReelSave(r)} className={savedById[String(r._id)] ? "is-saved" : ""}><Bookmark fill={savedById[String(r._id)] ? "currentColor" : "none"} /><small>{savedById[String(r._id)] ? "Saved" : "Save"}</small></button>
                    </div>
                    <div className="reel-feed-top">
                      <Avatar user={r.author} size={42} />

                      <div>
                        <UserLink user={r.author} />
                        <span>{r.caption || "Reel"}</span>
                      </div>

                      <div
                        style={{
                          marginLeft: "auto",
                          position: "relative"
                        }}
                      >
                        <button
                          type="button"
                          aria-label="Reel options"
                          title="Reel options"
                          onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(current =>
                              String(current) === String(r._id)
                                ? null
                                : r._id
                            );
                          }}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: "rgba(0,0,0,.45)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <MoreHorizontal />
                        </button>

                        {openMenuId === r._id && (
                          <div
                            onClick={e => e.stopPropagation()}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 44,
                              zIndex: 50,
                              minWidth: 170,
                              padding: 6,
                              borderRadius: 14,
                              background: "#171b21",
                              border:
                                "1px solid rgba(255,255,255,.12)",
                              boxShadow:
                                "0 18px 50px rgba(0,0,0,.5)"
                            }}
                          >
                            <button
                            type="button"
                            onClick={() => shareReel(r)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                              padding: "11px 12px",
                              borderRadius: 10,
                              background: "transparent",
                              color: "#fff",
                              textAlign: "left",
                              fontWeight: 700
                            }}
                          >
                            <Link2 size={17} />
                            Share Reel
                          </button>

                          {isOwner ? (
                              <>
                                <button
                                  type="button"
                                  disabled={deletingId === r._id}
                                  onClick={() => deleteReel(r)}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 9,
                                    padding: "11px 12px",
                                    borderRadius: 10,
                                    background: "transparent",
                                    color: "#ff5c70",
                                    textAlign: "left",
                                    fontWeight: 750
                                  }}
                                >
                                  <Trash2 size={17} />
                                  {deletingId === r._id
                                    ? "Deleting..."
                                    : "Delete Reel"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenuId(null)
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "11px 12px",
                                    borderRadius: 10,
                                    background: "transparent",
                                    color: "#fff",
                                    textAlign: "left"
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuId(null)
                                }
                                style={{
                                  width: "100%",
                                  padding: "11px 12px",
                                  borderRadius: 10,
                                  background: "transparent",
                                  color: "#fff",
                                  textAlign: "left"
                                }}
                              >
                                Close
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="reels-desktop-actions" aria-label="Reel actions">
                      <button type="button" aria-label={likedById[String(r._id)] ? "Unlike Reel" : "Like Reel"} onClick={() => toggleReelLike(r)} className={likedById[String(r._id)] ? "is-liked" : ""}><Heart fill={likedById[String(r._id)] ? "currentColor" : "none"} /></button>
                      <button type="button" className="reels-like-count-link" onClick={() => openReelLikes(r)} aria-label="See who liked this Reel">{Number(r.likesCount || 0)} likes</button>
                      <button type="button" aria-label="Open comments" onClick={() => openReelComments(r)}><MessageCircle /><small>{Number(r.commentsCount ?? 0)} comments</small></button>
                      <button type="button" aria-label="Share Reel" onClick={() => shareReel(r)}><Send /><small>Share</small></button>
                      <button type="button" aria-label="Save Reel" onClick={() => toggleReelSave(r)} className={savedById[String(r._id)] ? "is-saved" : ""}><Bookmark fill={savedById[String(r._id)] ? "currentColor" : "none"} /><small>{savedById[String(r._id)] ? "Saved" : "Save"}</small></button>
                      <button type="button" aria-label={soundEnabledById[String(r._id)] ? "Mute Reel" : "Enable Reel sound"} onClick={() => toggleReelSound(r._id)}>{soundEnabledById[String(r._id)] ? <Volume2 /> : <VolumeX />}<small>{soundEnabledById[String(r._id)] ? "Sound on" : "Sound off"}</small></button>
                    </div>
                    <div className="reel-feed-bottom">
                      <button
                        type="button"
                        title="Previous Reel"
                        aria-label="Previous Reel"
                        onClick={() =>
                          goToReel(activeIndex - 1)
                        }
                        disabled={activeIndex <= 0}
                      >
                        <ChevronUp />
                      </button>

                      <button
                        type="button"
                        title="Next Reel"
                        aria-label="Next Reel"
                        onClick={() =>
                          goToReel(activeIndex + 1)
                        }
                        disabled={
                          activeIndex >= reels.length - 1
                        }
                      >
                        <ChevronDown />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {!loading && reels.length > 0 && (
              <section className="reels-feed-end" ref={endCardRef} data-feed-end="true">
                <div className="reels-feed-end-icon"><Check /></div>
                <h2>You're all caught up</h2>
                <p>You've reached the end of Reels.</p>
                <button type="button" onClick={() => goToReel(0)}>Watch from the beginning</button>
              </section>
            )}
          </div>

          <div
            className="reels-side-controls"
            aria-label="Reel navigation"
          >
            <button
              type="button"
              title="Previous Reel"
              aria-label="Previous Reel"
              onClick={() =>
                goToReel(activeIndex - 1)
              }
              disabled={activeIndex <= 0}
            >
              <ChevronUp />
            </button>

            <span>
              {reels.length
                ? `${activeIndex + 1} / ${reels.length}`
                : ""}
            </span>

            <button
              type="button"
              title="Next Reel"
              aria-label="Next Reel"
              onClick={() =>
                goToReel(activeIndex + 1)
              }
              disabled={
                activeIndex >= reels.length - 1
              }
            >
              <ChevronDown />
            </button>
          </div>
        </div>
      )}
      {shareReelTarget && (
        <ShareSheet post={shareReelTarget} kind="reel" onClose={() => setShareReelTarget(null)} />
      )}
      {likesTarget && (
        <div className="reel-comments-backdrop reel-likes-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setLikesTarget(null); }}>
          <section className="reel-likes-panel" role="dialog" aria-modal="true" aria-label="People who liked this Reel">
            <header className="reel-comments-header"><h2>Likes</h2><button type="button" aria-label="Close likes" onClick={() => setLikesTarget(null)}><X /></button></header>
            <div className="reel-likes-list">
              {likesLoading && <p className="reel-comments-status">Loading likes…</p>}
              {!likesLoading && likesError && <p className="reel-comments-error">{likesError}</p>}
              {!likesLoading && !likesError && !likedUsers.length && <p className="reel-comments-status">No likes to show yet.</p>}
              {likedUsers.map((entry, index) => { const person = entry.user || entry.actor || entry; return <div className="reel-likes-user" key={person._id || entry._id || index}><Avatar user={person} size={42}/><div><b>{person.username || person.name || "ReelsGo user"}</b><small>{person.name && person.username ? person.name : ""}</small></div></div>; })}
            </div>
          </section>
        </div>
      )}
      {commentsReel && (
        <div className="reel-comments-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setCommentsReel(null); }}>
          <section className="reel-comments-panel" role="dialog" aria-modal="true" aria-label="Reel comments">
            <header className="reel-comments-header">
              <h2>Comments <span className="reel-comments-count">{Number(commentsReel.commentsCount ?? reelComments.length)}</span></h2>
              <button type="button" aria-label="Close comments" onClick={() => setCommentsReel(null)}><X /></button>
            </header>
            <div className="reel-comments-list">
              {commentsLoading ? <p className="reel-comments-status">Loading comments…</p> : null}
              {!commentsLoading && !reelComments.length && !commentsError ? <p className="reel-comments-status">No comments yet. Be the first to comment.</p> : null}
              {reelComments.map((comment, index) => {
                const reelOwner = String(commentsReel.author?._id || commentsReel.author) === String(me?._id);
                const ownComment = String(comment.author?._id || comment.author) === String(me?._id);
                return (
                  <article className={`reel-comment-row ${comment.pinned ? "is-pinned" : ""}`} key={comment._id || index}>
                    <Avatar user={comment.author} size={36} />
                    <div className="reel-comment-content" role="button" tabIndex={0} aria-label="Open comment options" onClick={() => setCommentMenuId(String(comment._id))} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setCommentMenuId(String(comment._id)); } }}>
                      <div className="reel-comment-author-line"><b>{comment.author?.username || comment.author?.name || "User"}</b>{comment.pinned && <span className="reel-comment-pinned-label"><PinOff size={12}/> Pinned</span>}</div>
                      <p>{comment.text}</p>
                      <small>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}</small>
                      <div className="reel-comment-inline-actions"><button type="button" onClick={event => { event.stopPropagation(); setCommentText(`@${comment.author?.username || comment.author?.name || "user"} `); }}>Reply</button>{reelOwner && <button type="button" onClick={event => { event.stopPropagation(); runCommentAction("pin", comment); }}>{comment.pinned ? "Unpin" : "Pin"}</button>}</div>
                    </div>
                    <div className="reel-comment-menu-wrap">
                      <button type="button" className="reel-comment-menu-trigger" aria-label="Comment options" onClick={() => setCommentMenuId(current => current === String(comment._id) ? null : String(comment._id))}><MoreHorizontal size={19}/></button>
                      {commentMenuId === String(comment._id) && <div className="reel-comment-options-menu">
                        {reelOwner && <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("pin", comment)}><PinOff size={17}/>{comment.pinned ? "Unpin" : "Pin"}</button>}
                        <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("replyReel", comment)}><Film size={17}/>Reply with a Reel</button>
                        <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("story", comment)}><PlusSquare size={17}/>Add to story</button>
                        <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("share", comment)}><Send size={17}/>Share</button>
                        {reelOwner && !ownComment && <>
                          <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("restrict", comment)}><UserMinus size={17}/>Restrict</button>
                          <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("block", comment)}><Ban size={17}/>Block</button>
                        </>}
                        <button type="button" disabled={commentActionBusy} onClick={() => runCommentAction("report", comment)}><Flag size={17}/>Report</button>
                        {(reelOwner || ownComment) && <button type="button" className="danger" disabled={commentActionBusy} onClick={() => runCommentAction("delete", comment)}><Trash2 size={17}/>Delete</button>}
                      </div>}
                    </div>
                  </article>
                );
              })}
              {commentsError && <p className="reel-comments-error" role="alert">{commentsError}</p>}
            </div>
            <form className="reel-comment-form" onSubmit={submitReelComment}>
              <Avatar user={me} size={34} />
              <input value={commentText} onChange={event => setCommentText(event.target.value)} placeholder="Add a comment…" maxLength={1000} aria-label="Add a comment" />
              <button type="submit" disabled={!commentText.trim() || commentSending}>{commentSending ? "Posting…" : "Post"}</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function ReelViewer({ reel, onClose }) {
  const [currentReel, setCurrentReel] = useState(reel);
  const [liked, setLiked] = useState(Boolean(reel?.likedByMe || reel?.isLiked));
  const [saved, setSaved] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSending, setCommentSending] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    setCurrentReel(reel);
    setLiked(Boolean(reel?.likedByMe || reel?.isLiked));
    setSaved(true);
  }, [reel]);

  async function toggleLike() {
    try {
      const result = await api(`/reels/${currentReel._id}/like`, { method: "POST" });
      setLiked(Boolean(result.liked));
      setCurrentReel(item => ({ ...item, likesCount: Number(result.likesCount ?? item.likesCount ?? 0) }));
    } catch (e) { setError(e.message || "Could not like this Reel."); }
  }

  async function toggleSave() {
    try {
      const result = await api(`/reels/${currentReel._id}/save`, { method: "POST" });
      setSaved(Boolean(result.saved));
      setCurrentReel(item => ({ ...item, savesCount: Number(result.savesCount ?? item.savesCount ?? 0) }));
      window.dispatchEvent(new CustomEvent("reelsgo-saved-content-updated"));
    } catch (e) { setError(e.message || "Could not save this Reel."); }
  }

  async function openComments() {
    setCommentsOpen(true);
    setCommentsLoading(true);
    setError("");
    try {
      const data = await api(`/reels/${currentReel._id}/comments`);
      setComments(Array.isArray(data.comments) ? data.comments : Array.isArray(data.data?.comments) ? data.data.comments : []);
    } catch (e) { setError(e.message || "Could not load comments."); }
    finally { setCommentsLoading(false); }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || commentSending) return;
    setCommentSending(true);
    setError("");
    try {
      const data = await api(`/reels/${currentReel._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() })
      });
      const created = data.comment || data.data?.comment;
      if (created) setComments(items => [...items, created]);
      else {
        const refreshed = await api(`/reels/${currentReel._id}/comments`);
        setComments(Array.isArray(refreshed.comments) ? refreshed.comments : []);
      }
      setCurrentReel(item => ({ ...item, commentsCount: Number(item.commentsCount || 0) + 1 }));
      setCommentText("");
    } catch (e) { setError(e.message || "Could not post comment."); }
    finally { setCommentSending(false); }
  }

  async function shareReel() {
    const url = `${window.location.origin}/reel/${currentReel._id}`;
    try {
      if (navigator.share) await navigator.share({ title: "ReelsGo Reel", text: currentReel.caption || "Watch this Reel", url });
      else {
        await navigator.clipboard.writeText(url);
        setError("Reel link copied.");
      }
    } catch (e) {
      if (e?.name !== "AbortError") setError("Could not share this Reel. Try copying its link.");
    }
  }

  const mediaSrc = currentReel?.mediaUrl
    ? (/^https?:\/\//i.test(currentReel.mediaUrl) ? currentReel.mediaUrl : `${SERVER}${currentReel.mediaUrl.startsWith("/") ? "" : "/"}${currentReel.mediaUrl}`)
    : "";

  return (
    <div className="reel-viewer-overlay saved-reel-viewer-overlay" onClick={onClose}>
      <button className="media-viewer-close" type="button" onClick={onClose} aria-label="Close Reel"><X /></button>
      <div className="reel-viewer-card saved-reel-viewer-card" onClick={e => e.stopPropagation()}>
        <div className="reel-viewer-user">
          <Avatar user={currentReel.author} size={42} />
          <div><UserLink user={currentReel.author} /><span>{currentReel.caption || "Reel"}</span></div>
        </div>
        <div className="saved-reel-player-wrap">
          <video ref={videoRef} src={mediaSrc} controls autoPlay loop playsInline preload="auto" />
          <div className="saved-reel-actions" aria-label="Reel actions">
            <button type="button" onClick={toggleLike} className={liked ? "is-liked" : ""} aria-label={liked ? "Unlike Reel" : "Like Reel"}><Heart fill={liked ? "currentColor" : "none"} /><span>{Number(currentReel.likesCount || 0)}</span></button>
            <button type="button" onClick={openComments} aria-label="View comments"><MessageCircle /><span>{Number(currentReel.commentsCount || 0)}</span></button>
            <button type="button" onClick={shareReel} aria-label="Share Reel"><Send /><span>Share</span></button>
            <button type="button" onClick={toggleSave} className={saved ? "is-saved" : ""} aria-label={saved ? "Remove saved Reel" : "Save Reel"}><Bookmark fill={saved ? "currentColor" : "none"} /><span>{saved ? "Saved" : "Save"}</span></button>
          </div>
        </div>
        {error && <div className="saved-reel-notice" role="status">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss message"><X size={14}/></button></div>}
      </div>
      {commentsOpen && <div className="saved-reel-comments-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCommentsOpen(false); }}>
        <section className="saved-reel-comments-panel" role="dialog" aria-modal="true" aria-label="Reel comments">
          <header><h3>Comments <span>{Number(currentReel.commentsCount || comments.length)}</span></h3><button type="button" onClick={() => setCommentsOpen(false)} aria-label="Close comments"><X /></button></header>
          <div className="saved-reel-comments-list">
            {commentsLoading ? <p className="saved-reel-comment-state">Loading comments…</p> : null}
            {!commentsLoading && !comments.length ? <p className="saved-reel-comment-state">No comments yet. Be the first to comment.</p> : null}
            {comments.map((comment, index) => <article className="saved-reel-comment" key={comment._id || index}><Avatar user={comment.author} size={34}/><div><b>{comment.author?.username || comment.author?.name || "User"}</b><p>{comment.text}</p><small>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}</small></div></article>)}
          </div>
          <form className="saved-reel-comment-form" onSubmit={submitComment}><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment…" maxLength={1000} aria-label="Add a comment"/><button type="submit" disabled={!commentText.trim() || commentSending}>{commentSending ? "Posting…" : "Post"}</button></form>
        </section>
      </div>}
    </div>
  );
}

const RECENT_PROFILE_SEARCHES_KEY = "reelsgo_recent_opened_profiles_v1";

function readRecentProfiles() {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_PROFILE_SEARCHES_KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && item._id) : [];
  } catch { return []; }
}

function SearchPage({ onOpenProfile, onBack }) {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(readRecentProfiles);
  const [recentMenuId, setRecentMenuId] = useState(null);
  const [recentExpanded, setRecentExpanded] = useState(false);

  async function search(v) {
    setQ(v);
    if (!v.trim()) { setUsers([]); return; }
    setLoading(true);
    try {
      const d = await api(`/users/search?q=${encodeURIComponent(v.trim())}`);
      setUsers(d.users || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally { setLoading(false); }
  }

  function openSearchedProfile(person) {
    if (!person?._id) return;
    // Only add a person after the user actually opens their profile, not just from search results.
    const previous = readRecentProfiles();
    const updated = [person, ...previous.filter(item => String(item._id) !== String(person._id))].slice(0, 20);
    try { localStorage.setItem(RECENT_PROFILE_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) { console.warn("Could not save recent profiles", e); }
    setRecent(updated);
    onOpenProfile(person._id);
  }

  function clearRecent() {
    try { localStorage.removeItem(RECENT_PROFILE_SEARCHES_KEY); } catch {}
    setRecent([]);
    setRecentMenuId(null);
  }

  function deleteRecentProfile(profileId) {
    const updated = readRecentProfiles().filter(item => String(item._id) !== String(profileId));
    try { localStorage.setItem(RECENT_PROFILE_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) { console.warn("Could not update recent profiles", e); }
    setRecent(updated);
    setRecentMenuId(null);
  }

  return (
    <div className="page rg-instagram-search-page">
      <div className="rg-search-topbar">
        <button type="button" className="rg-search-back" onClick={() => onBack ? onBack() : setQ("")} aria-label="Go back"><ChevronRight /></button>
        <div className="search-box rg-search-pill">
          <Search />
          <input value={q} onChange={e => search(e.target.value)} placeholder="Search" autoFocus />
          {q && <button className="rg-search-clear" onClick={() => { setQ(""); setUsers([]); }} aria-label="Clear search"><X /></button>}
        </div>
      </div>

      {loading && <div className="empty small-empty"><p>Searching...</p></div>}
      {!loading && q.trim() && users.length > 0 && (
        <div className="user-list" aria-label="Search results">
          {users.map(u => <button className="user-row" key={u._id} onClick={() => openSearchedProfile(u)} type="button">
            <Avatar user={u} size={48} />
            <div><b>@{u.username}</b><span>{u.name}</span></div><ChevronRight />
          </button>)}
        </div>
      )}
      {!loading && q.trim() && !users.length && <div className="empty small-empty"><Search /><h2>No users found</h2><p>Try the exact username or another name.</p></div>}

      {!q.trim() && <section className="recent-searches-section" aria-label="Recent profiles">
        <div className="recent-searches-heading"><h2>Recent</h2>{recent.length > 0 && <button type="button" className="recent-clear-button" onClick={clearRecent}>Clear all</button>}</div>
        {recent.length > 0 ? <div className="user-list recent-searches-list">
          {(recentExpanded ? recent : recent.slice(0, 5)).map(person => <div className="recent-profile-wrap" key={person._id}>
            <button className="user-row recent-profile-row" onClick={() => openSearchedProfile(person)} type="button">
              <Avatar user={person} size={48} /><div className="recent-profile-text"><b>{person.username || "user"}</b><span>{person.name || "ReelsGo member"}</span></div>
            </button>
            <div className="recent-profile-options">
              <button type="button" className="recent-remove-button" aria-label={`Remove ${person.username || "profile"} from recent searches`} onClick={() => deleteRecentProfile(person._id)}><X /></button>
            </div>
          </div>)}
        </div> : <div className="recent-searches-empty"><Clock3 /><h3>No recent profiles yet</h3><p>Search for someone and open their profile. It will appear here even after you close ReelsGo.</p></div>}
      </section>}
    </div>
  );
}

function UserProfilePage({ userId, currentUser, onBack, onMessage }) {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const d = await api(`/users/${userId}/profile`);
      setProfile(d);
    } catch (e) {
      alert(e.message);
      onBack();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTab("posts");
    load();
  }, [userId]);

  async function toggleFollow() {
    if (!profile?.user || String(profile.user._id) === String(currentUser?._id)) return;
    setFollowLoading(true);
    try {
      if (profile.followStatus === "accepted" || profile.followStatus === "pending") {
        await api(`/follows/${profile.user._id}`, { method: "DELETE" });
      } else {
        await api(`/follows/${profile.user._id}`, { method: "POST" });
      }
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return <div className="page"><div className="empty"><p>Loading profile...</p></div></div>;
  }

  if (!profile?.user) return null;

  const u = profile.user;
  const isSelf = String(u._id) === String(currentUser?._id);
  const canView = !!profile.canViewContent;
  const canViewConnections = isSelf || !!profile.canViewConnections;
  const posts = profile.posts || [];
  const reels = profile.reels || [];
  const tagged = profile.tagged || [];

  return (
    <div className="page profile-page">
      <div className="profile-back-row">
        <button className="secondary" onClick={onBack}><ChevronRight style={{ transform: "rotate(180deg)" }} /> Back to search</button>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <Avatar user={u} size={96} className="profile-avatar" />
        </div>

        <div className="profile-details">
          <div className="profile-line">
            <h1>{u.username} <VerifiedBadge userId={u?._id} /></h1>
            {!isSelf && (
              <>
                <button
                  className={profile.followStatus === "accepted" ? "secondary" : "primary"}
                  onClick={toggleFollow}
                  disabled={followLoading}
                >
                  {followLoading
                    ? "Please wait..."
                    : profile.followStatus === "accepted"
                      ? "Following"
                      : profile.followStatus === "pending"
                        ? "Requested"
                        : "Follow"}
                </button>
                <button className="secondary" onClick={() => onMessage(u._id)}>
                  <MessageCircle /> Message
                </button>
              </>
            )}
          </div>

          <div className="profile-stats">
            <span><b>{u.postsCount || posts.length}</b><small>posts</small></span>
            {canViewConnections ? (
              <>
                <button type="button" className="profile-stat-button" onClick={() => setConnectionsOpen("followers")} aria-label={`View ${u.username || "user"} followers`}>
                  <b>{u.followersCount || 0}</b><small>followers</small>
                </button>
                <button type="button" className="profile-stat-button" onClick={() => setConnectionsOpen("following")} aria-label={`View ${u.username || "user"} following`}>
                  <b>{u.followingCount || 0}</b><small>following</small>
                </button>
              </>
            ) : (
              <>
                <span className="profile-stat-locked"><b>{u.followersCount || 0}</b><small>followers</small></span>
                <span className="profile-stat-locked"><b>{u.followingCount || 0}</b><small>following</small></span>
              </>
            )}
          </div>

          <b>{u.name}</b>
          <p>{u?.bio || ""}</p>
          {u.website && <a href={u.website} target="_blank" rel="noreferrer"><LinkIcon /> {u.website}</a>}

          {u.isPrivate && !canView && !isSelf && (
            <div className="private-profile-note">
              <Lock />
              <div>
                <b>This account is private</b>
                <span>Follow this account and wait for approval to see posts and stories.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}><Grid3X3 /> Posts</button>
        <button className={tab === "reels" ? "active" : ""} onClick={() => setTab("reels")}><Film /> Reels</button>
        <button className={tab === "tagged" ? "active" : ""} onClick={() => setTab("tagged")}><Users /> Tagged</button>
      </div>

      {!canView && !isSelf ? (
        <div className="private-profile-lock">
          <div className="private-lock-icon"><Lock /></div>
          <h2>Private account</h2>
          <p>Follow this account to see their photos, videos and Reels.</p>
        </div>
      ) : (
        <>
          {tab === "posts" && (
            posts.length
              ? <div className="profile-grid">{posts.map(p => <GridMedia key={p._id} post={p} />)}</div>
              : <EmptyTab icon={<CameraOff />} title="No posts yet" text="This user has not shared any posts." />
          )}

          {tab === "reels" && (
            reels.length
              ? <div className="profile-grid reels-profile-grid">{reels.map(r => <div className="grid-reel" key={r._id}><video src={`${SERVER}${r.mediaUrl}`} controls playsInline /></div>)}</div>
              : <EmptyTab icon={<Film />} title="No Reels yet" text="This user has not shared any Reels." />
          )}

          {tab === "tagged" && (
            tagged.length
              ? <div className="profile-grid">{tagged.map(p => <GridMedia key={p._id} post={p} />)}</div>
              : <EmptyTab icon={<Users />} title="Photos of you" text="Tagged posts will appear here." />
          )}
        </>
      )}

      {connectionsOpen && (
        <ConnectionsModal
          user={u}
          type={connectionsOpen}
          onClose={() => setConnectionsOpen(null)}
        />
      )}
    </div>
  );
}


function getSharedMediaFromMessage(text) {
  const value = String(text || "");
  const match = value.match(/https?:\/\/[^\s]+\/(reel|reels|post|posts)\/([a-zA-Z0-9_-]+)/i);
  if (!match) return null;
  const type = ["reel", "reels"].includes(match[1].toLowerCase()) ? "reel" : "post";
  return { type, id: match[2], url: match[0].replace(/[),.]+$/, "") };
}

function MessageText({ text }) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const chunks = [];
  for (let i = 0; i < words.length; i += 30) chunks.push(words.slice(i, i + 30).join(" "));
  return <span className="message-text-lines">{chunks.map((chunk, index) => <span className="message-text-line" key={`${index}-${chunk.slice(0, 12)}`}>{chunk}</span>)}</span>;
}

function SharedMediaMessage({ text }) {
  const shared = useMemo(() => getSharedMediaFromMessage(text), [text]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(Boolean(shared));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadShared() {
      if (!shared) { setLoading(false); return; }
      setLoading(true);
      setFailed(false);
      try {
        const endpoint = shared.type === "reel" ? `/reels/${encodeURIComponent(shared.id)}` : `/posts/${encodeURIComponent(shared.id)}`;
        let data = null;
        try {
          data = await api(endpoint);
        } catch {}
        let found = shared.type === "reel"
          ? (data?.reel || data?.data?.reel || data)
          : (data?.post || data?.data?.post || data);
        if (String(found?._id || "") !== String(shared.id)) found = null;
        if (!found) {
          const feed = await api(shared.type === "reel" ? "/reels" : "/posts");
          const items = shared.type === "reel"
            ? (feed?.reels || feed?.data?.reels || [])
            : (feed?.posts || feed?.data?.posts || []);
          found = items.find(item => String(item?._id) === String(shared.id)) || null;
        }
        if (!cancelled) {
          if (found?._id) setMedia(found);
          else setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadShared();
    return () => { cancelled = true; };
  }, [shared?.type, shared?.id]);

  if (!shared) return <MessageText text={text} />;

  const mediaUrl = shared.type === "reel"
    ? media?.mediaUrl
    : media?.media?.[0]?.url;
  const resolvedMediaUrl = mediaUrl
    ? (/^https?:\/\//i.test(mediaUrl) ? mediaUrl : `${SERVER}${mediaUrl.startsWith("/") ? "" : "/"}${mediaUrl}`)
    : "";

  return <div className="shared-message-content" onClick={e => e.stopPropagation()}>
    <a className="shared-message-link" href={shared.url} target="_blank" rel="noreferrer">
      {loading ? <div className="shared-message-loading"><Film size={20}/><span>Loading {shared.type}…</span></div> :
        media && !failed ? <>
          <div className={`shared-message-media ${shared.type === "reel" ? "is-reel" : "is-post"}`}>
            {resolvedMediaUrl && (shared.type === "reel" || media.media?.[0]?.kind === "video")
              ? <video src={resolvedMediaUrl} controls playsInline preload="metadata" />
              : resolvedMediaUrl ? <img src={resolvedMediaUrl} alt={media.caption || "Shared post"} loading="lazy"/> : <div className="shared-message-media-fallback"><ImageIcon/></div>}
            {shared.type === "reel" && <span className="shared-message-reel-label"><Play size={13} fill="currentColor"/> Reel</span>}
          </div>
          <div className="shared-message-preview-copy">
            <b>{media.author?.username ? `@${media.author.username}` : "ReelsGo"}</b>
            <p>{media.caption || (shared.type === "reel" ? "Watch this Reel" : "View this post")}</p>
            <small>Open in ReelsGo <ChevronRight size={13}/></small>
          </div>
        </> : <div className="shared-message-unavailable"><Film size={20}/><span>{failed ? `${shared.type === "reel" ? "Reel" : "Post"} preview unavailable` : "Open shared content"}</span><small>Tap to view</small></div>}
    </a>
  </div>;
}

function MessagesPage({ openConversationId = null, openConversationData = null }) {
  const me = getUser();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState("");
  const [peopleResults, setPeopleResults] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState("");
  const [startingConversationId, setStartingConversationId] = useState(null);
  const [noteComposerOpen, setNoteComposerOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteAudience, setNoteAudience] = useState("followers");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteEditingId, setNoteEditingId] = useState(null);
  const [noteReplyTarget, setNoteReplyTarget] = useState(null);
  const [noteActionTarget, setNoteActionTarget] = useState(null);
  const [noteReplyDraft, setNoteReplyDraft] = useState("");
  const [noteReplySending, setNoteReplySending] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [requestActionId, setRequestActionId] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [conversationQuery, setConversationQuery] = useState('');
  const [conversationMenuId, setConversationMenuId] = useState(null);
  const [conversationMenuOpen, setConversationMenuOpen] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState(null);
  const [mobileConversationActions, setMobileConversationActions] = useState(null);
  const [pinnedConversationIds, setPinnedConversationIds] = useState(() => { try { return JSON.parse(localStorage.getItem("reelsgo_pinned_conversations") || "[]").map(String); } catch { return []; } });
  const [mutedConversationIds, setMutedConversationIds] = useState(() => { try { return JSON.parse(localStorage.getItem("reelsgo_muted_conversations") || "[]").map(String); } catch { return []; } });
  const longPressTimer = useRef(null);
  const suppressConversationClick = useRef(false);
  const [messageMenuId, setMessageMenuId] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Smileys");
  const emojiPickerRef = useRef(null);

  useEffect(() => { try { localStorage.setItem("reelsgo_pinned_conversations", JSON.stringify(pinnedConversationIds)); } catch {} }, [pinnedConversationIds]);
  useEffect(() => { try { localStorage.setItem("reelsgo_muted_conversations", JSON.stringify(mutedConversationIds)); } catch {} }, [mutedConversationIds]);

  function cancelConversationLongPress() {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }

  function startConversationLongPress(conversation) {
    cancelConversationLongPress();
    suppressConversationClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressConversationClick.current = true;
      setConversationMenuId(String(conversation._id));
      setMobileConversationActions(conversation);
      if (navigator.vibrate) navigator.vibrate(25);
    }, 500);
  }

  function runConversationAction(action, conversation) {
    const id = String(conversation?._id || "");
    if (!id) return;
    if (action === "delete") {
      setMobileConversationActions(null);
      setConversationMenuId(id);
      deleteConversation(conversation);
      return;
    }
    if (action === "unread") {
      setConversations(prev => prev.map(c => String(c._id) === id ? { ...c, unreadCount: Math.max(1, Number(c.unreadCount || 0)) } : c));
      if (String(active?._id) === id) setActive(prev => prev ? { ...prev, unreadCount: 1 } : prev);
    } else if (action === "pin") {
      setPinnedConversationIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev]);
    } else if (action === "mute") {
      setMutedConversationIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
    setMobileConversationActions(null);
    setConversationMenuId(null);
  }

  async function loadConversations(selectId = null) {
    try {
      const d = await api('/messages/conversations');
      const serverRows = d.conversations || [];
      // Keep locally deleted conversations hidden when the backend has no DELETE route.
      let hiddenIds = [];
      try { hiddenIds = JSON.parse(localStorage.getItem("reelsgo_hidden_conversations") || "[]"); } catch {}
      const rows = serverRows.filter(c => !hiddenIds.includes(String(c._id)));
      setConversations(rows);
      if (selectId) {
        const c = rows.find(x => String(x._id) === String(selectId));
        if (c) { setActive(c); setMobileChat(true); }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function deleteConversation(conversation) {
    if (!conversation?._id || deletingConversationId) return;
    const id = String(conversation._id);
    const person = other(conversation);
    const confirmed = window.confirm(`Delete conversation with ${person?.username ? `@${person.username}` : person?.name || "this person"}? It will be removed from your inbox.`);
    if (!confirmed) { setConversationMenuId(null); setConversationMenuOpen(false); return; }
    setDeletingConversationId(id);
    // Hide immediately so the interface works even if the deployed backend
    // does not implement DELETE /messages/conversations/:id.
    const hideLocally = () => {
      try {
        const existing = JSON.parse(localStorage.getItem("reelsgo_hidden_conversations") || "[]");
        localStorage.setItem("reelsgo_hidden_conversations", JSON.stringify([...new Set([...existing.map(String), id])]));
      } catch {}
      setConversations(prev => prev.filter(c => String(c._id) !== id));
      if (String(active?._id) === id) {
        setActive(null); setMessages([]); setMobileChat(false);
      }
      setConversationMenuId(null); setConversationMenuOpen(false);
    };
    try {
      await api(`/messages/conversations/${id}`, { method: 'DELETE' });
      hideLocally();
    } catch (e) {
      // A missing backend endpoint should not break the UI or show "API not found".
      // The conversation is hidden on this device; server-side deletion needs backend support.
      hideLocally();
      console.warn("Conversation hidden locally because server deletion is unavailable:", e?.message);
    } finally { setDeletingConversationId(null); }
  }

  async function loadNotes() {
    try { const d = await api('/notes'); setNotes(d.notes || []); } catch { setNotes([]); }
  }

  async function openNewMessagePicker() {
    setNewMessageOpen(true);
    setPeopleSearch("");
    setPeopleError("");
    setPeopleLoading(true);
    try {
      let users = [];
      const current = getUser();
      if (current?._id) {
        try {
          const following = await api(`/follows/${current._id}/following`);
          users = following.following || following.users || [];
        } catch {}
      }
      if (!users.length) {
        const result = await api(`/users/search?q=${encodeURIComponent("a")}`);
        users = result.users || result.results || [];
      }
      const currentId = String(getUser()?._id || "");
      const seen = new Set();
      setPeopleResults(users.map(item => item?.user || item).filter(user => {
        if (!user?._id || String(user._id) === currentId || seen.has(String(user._id))) return false;
        seen.add(String(user._id));
        return true;
      }));
    } catch (error) {
      setPeopleError(error.message || "Could not load users.");
    } finally { setPeopleLoading(false); }
  }

  async function searchMessagePeople(value) {
    setPeopleSearch(value);
    setPeopleError("");
    if (!value.trim()) {
      openNewMessagePicker();
      return;
    }
    setPeopleLoading(true);
    try {
      const result = await api(`/users/search?q=${encodeURIComponent(value.trim())}`);
      const currentId = String(getUser()?._id || "");
      const seen = new Set();
      setPeopleResults((result.users || result.results || []).map(item => item?.user || item).filter(user => {
        if (!user?._id || String(user._id) === currentId || seen.has(String(user._id))) return false;
        seen.add(String(user._id));
        return true;
      }));
    } catch (error) {
      setPeopleResults([]);
      setPeopleError(error.message || "Could not search users.");
    } finally { setPeopleLoading(false); }
  }

  async function startConversationWith(user) {
    if (!user?._id || startingConversationId) return;
    setStartingConversationId(String(user._id));
    setPeopleError("");
    try {
      const result = await api("/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: [String(user._id)] })
      });
      const conversation = result.conversation;
      if (!conversation?._id) throw new Error("The server did not return a conversation.");
      setConversations(current => [conversation, ...current.filter(item => String(item._id) !== String(conversation._id))]);
      setNewMessageOpen(false);
      setActive(conversation);
      setMobileChat(true);
      await openConversation(conversation);
    } catch (error) {
      setPeopleError(error.message || "Unable to start conversation.");
    } finally { setStartingConversationId(null); }
  }

  async function publishNote(event) {
    event?.preventDefault?.();
    const clean = noteDraft.trim();
    if (!clean || noteSaving) return;
    setNoteSaving(true);
    try {
      const payload = { text: clean.slice(0, 60), audience: noteAudience };
      let result;
      if (noteEditingId) {
        try {
          result = await api(`/notes/${noteEditingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        } catch (patchError) {
          if (/404|not found|method/i.test(String(patchError.message))) {
            result = await api(`/notes/${noteEditingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          } else throw patchError;
        }
        if (result.note) setNotes(current => current.map(note => String(note._id) === String(noteEditingId) ? result.note : note));
        else await loadNotes();
      } else {
        result = await api("/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (result.note) setNotes(current => [result.note, ...current.filter(note => String(note.author?._id || note.author) !== String(me?._id))]);
        else await loadNotes();
      }
      setNoteDraft(""); setNoteEditingId(null); setNoteComposerOpen(false);
    } catch (error) { alert(error.message || (noteEditingId ? "Could not update note." : "Could not publish note.")); }
    finally { setNoteSaving(false); }
  }

  function editMyNote(note) {
    setNoteEditingId(String(note?._id || ""));
    setNoteDraft(note?.text || "");
    setNoteAudience(note?.audience || "followers");
    setNoteComposerOpen(true);
  }

  async function deleteMyNote(note) {
    if (!note?._id || !window.confirm("Delete your note?")) return;
    try {
      await api(`/notes/${note._id}`, { method: "DELETE" });
      setNotes(current => current.filter(item => String(item._id) !== String(note._id)));
    } catch (error) { alert(error.message || "Could not delete note. The backend must support DELETE /api/notes/:id."); }
  }

  async function replyToNote(event) {
    event?.preventDefault?.();
    const messageText = noteReplyDraft.trim();
    const activeReplyNote = noteReplyTarget || noteActionTarget;
    const targetUser = activeReplyNote?.author;
    const targetId = targetUser?._id || targetUser;
    if (!messageText || !targetId || noteReplySending) return;
    setNoteReplySending(true);
    try {
      const conversationResult = await api("/messages/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ members: [String(targetId)] }) });
      const conversation = conversationResult.conversation;
      if (!conversation?._id) throw new Error("Could not open conversation.");
      const noteReplyText = `Reply to your note “${String(activeReplyNote?.text || "").trim()}”:\n${messageText}`;
      await api(`/messages/conversations/${conversation._id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: noteReplyText }) });
      setNoteReplyDraft(""); setNoteReplyTarget(null); setNoteActionTarget(null);
      // Refresh the inbox and load the persisted message into the opened conversation.
      await loadConversations(conversation._id);
      await openConversation(conversation);
    } catch (error) { alert(error.message || "Could not send note reply."); }
    finally { setNoteReplySending(false); }
  }

  async function loadRequests() {
    try {
      const d = await api('/follows/requests');
      setRequests(d.requests || []);
    } catch {
      setRequests([]);
    }
  }

  async function acceptFollowRequest(requestId) {
    if (!requestId || requestActionId) return;
    setRequestActionId(requestId);
    try {
      await api(`/follows/requests/${requestId}/accept`, { method: 'POST' });
      setRequests(prev => prev.filter(r => String(r._id) !== String(requestId)));
      // Refresh conversations/notes as the newly accepted follower relationship
      // can immediately affect available messaging and activity state.
      await loadConversations();
    } catch (e) {
      alert(e.message || 'Unable to accept follow request');
    } finally {
      setRequestActionId(null);
    }
  }

  async function declineFollowRequest(requestId) {
    if (!requestId || requestActionId) return;
    setRequestActionId(requestId);
    try {
      await api(`/follows/requests/${requestId}/decline`, { method: 'POST' });
      setRequests(prev => prev.filter(r => String(r._id) !== String(requestId)));
    } catch (e) {
      alert(e.message || 'Unable to reject follow request');
    } finally {
      setRequestActionId(null);
    }
  }

  useEffect(() => { loadConversations(); loadNotes(); loadRequests(); }, []);

  // Refresh unread state and the active conversation periodically.
  // This also picks up the exact seenAt time from the server so the
  // sender can see "Seen 1 min ago" without refreshing the page.
  useEffect(() => {
    let cancelled = false;

    const refreshMessagesState = async () => {
      try {
        const cd = await api('/messages/conversations');
        if (cancelled) return;

        setConversations(cd.conversations || []);

        if (!active?._id) return;

        const md = await api(`/messages/conversations/${active._id}/messages`);
        if (cancelled) return;

        const rows = md.messages || [];
        setMessages(rows);

        const unseen = rows
          .filter(
            m =>
              String(m.sender?._id) !== String(me?._id) &&
              !(m.seenBy || []).some(x => String(x?._id || x) === String(me?._id))
          )
          .slice(-50);

        if (unseen.length) {
          const seenNow = new Date().toISOString();

          await Promise.all(
            unseen.map(m =>
              api(`/messages/messages/${m._id}/seen`, { method: 'POST' }).catch(() => {})
            )
          );

          if (!cancelled) {
            setMessages(current =>
              current.map(m =>
                unseen.some(u => String(u._id) === String(m._id))
                  ? {
                      ...m,
                      seenBy: [...(m.seenBy || []), me?._id].filter(Boolean),
                      seenAt: m.seenAt || seenNow
                    }
                  : m
              )
            );
          }
        }
      } catch {}
    };

    refreshMessagesState();
    const timer = setInterval(refreshMessagesState, 4000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active?._id, me?._id]);

  useEffect(() => {
    if (!emojiOpen) return;
    const closeOnOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [emojiOpen]);

  useEffect(() => {
    if (!openConversationId) return;
    (async () => {
      try {
        // Load the inbox first, but open the conversation returned by POST even
        // if the inbox response is briefly stale or omits the new conversation.
        const cd = await api('/messages/conversations');
        const rows = cd.conversations || [];
        setConversations(rows);
        const listed = rows.find(x => String(x._id) === String(openConversationId));
        const returned = openConversationData && String(openConversationData._id) === String(openConversationId)
          ? openConversationData
          : null;
        const conversationToOpen = listed || returned;
        if (conversationToOpen) {
          setActive({ ...conversationToOpen, unreadCount: 0 });
          setMobileChat(true);
        }
        const md = await api(`/messages/conversations/${openConversationId}/messages`);
        const openedMessages = md.messages || [];
        setMessages(openedMessages);
        const unseen = openedMessages
          .filter(
            m =>
              String(m.sender?._id) !== String(me?._id) &&
              !(m.seenBy || []).some(x => String(x?._id || x) === String(me?._id))
          )
          .slice(-50);
        const seenNow = new Date().toISOString();

        await Promise.all(
          unseen.map(m =>
            api(`/messages/messages/${m._id}/seen`, { method: 'POST' }).catch(() => {})
          )
        );

        if (unseen.length) {
          setMessages(current =>
            current.map(m =>
              unseen.some(u => String(u._id) === String(m._id))
                ? {
                    ...m,
                    seenBy: [...(m.seenBy || []), me?._id].filter(Boolean),
                    seenAt: m.seenAt || seenNow
                  }
                : m
            )
          );
        }

        setConversations(current =>
          current.map(item =>
            String(item._id) === String(openConversationId)
              ? { ...item, unreadCount: 0 }
              : item
          )
        );
      } catch (e) { console.error(e); }
    })();
  }, [openConversationId, openConversationData]);

  async function openConversation(c) {
    setActive({ ...c, unreadCount: 0 });
    setMobileChat(true);
    try {
      const d = await api(`/messages/conversations/${c._id}/messages`);
      const rows = d.messages || [];
      setMessages(rows);

      const unseen = rows
        .filter(
          m =>
            String(m.sender?._id) !== String(me?._id) &&
            !(m.seenBy || []).some(x => String(x?._id || x) === String(me?._id))
        )
        .slice(-50);

      const seenNow = new Date().toISOString();

      await Promise.all(
        unseen.map(m =>
          api(`/messages/messages/${m._id}/seen`, { method: 'POST' }).catch(() => {})
        )
      );

      if (unseen.length) {
        setMessages(current =>
          current.map(m =>
            unseen.some(u => String(u._id) === String(m._id))
              ? {
                  ...m,
                  seenBy: [...(m.seenBy || []), me?._id].filter(Boolean),
                  seenAt: m.seenAt || seenNow
                }
              : m
          )
        );
      }

      // Remove the unread indicator immediately after the receiver opens the chat.
      setConversations(current =>
        current.map(item =>
          String(item._id) === String(c._id)
            ? { ...item, unreadCount: 0 }
            : item
        )
      );
      setActive(current => current ? { ...current, unreadCount: 0 } : current);
    } catch (e) { alert(e.message); }
  }

  function insertEmoji(emoji) {
    setText(current => `${current}${emoji}`);
    setEmojiOpen(true);
  }

  async function sendMessage() {
    if (!active || !text.trim() || sending) return;
    setSending(true);
    try {
      const d = await api(`/messages/conversations/${active._id}/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text.trim() })
      });
      if (d.message) setMessages(m => [...m, d.message]);
      setText('');
      await loadConversations(active._id);
    } catch (e) { alert(e.message); }
    finally { setSending(false); }
  }

  async function deleteMessage(messageId) {
    if (!messageId || deletingMessageId) return;
    const confirmed = window.confirm("Delete this message? It will be removed from the chat for everyone.");
    if (!confirmed) {
      setMessageMenuId(null);
      return;
    }
    setDeletingMessageId(messageId);
    try {
      await api(`/messages/messages/${messageId}`, { method: "DELETE" });
      setMessages(current => current.filter(message => String(message._id) !== String(messageId)));
      setMessageMenuId(null);
      if (active?._id) await loadConversations(active._id);
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingMessageId(null);
    }
  }

  function other(c) {
    return (c?.members || []).find(x => String(x._id) !== String(me?._id));
  }

  function name(c) {
    const u = other(c);
    return u?.username || u?.name || c?.title || 'Conversation';
  }

  function time(value) {
    if (!value) return '';
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function seenTime(value) {
    if (!value) return 'Seen';
    const seenAt = new Date(value).getTime();
    if (!Number.isFinite(seenAt)) return 'Seen';

    const seconds = Math.max(0, Math.floor((Date.now() - seenAt) / 1000));

    if (seconds < 10) return 'Seen just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Seen ${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Seen ${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `Seen ${days} ${days === 1 ? 'day' : 'days'} ago`;

    return `Seen ${new Date(value).toLocaleDateString([], {
      day: 'numeric',
      month: 'short'
    })}`;
  }

  const myNote = notes.find(n => String(n.author?._id) === String(me?._id));
  const otherNotes = notes.filter(n => String(n.author?._id) !== String(me?._id));
  const filteredConversations = conversations.filter(c => {
    const q = conversationQuery.trim().toLowerCase();
    if (!q) return true;
    const u = other(c);
    return String(u?.username || '').toLowerCase().includes(q) || String(u?.name || '').toLowerCase().includes(q);
  }).sort((a, b) => Number(pinnedConversationIds.includes(String(b._id))) - Number(pinnedConversationIds.includes(String(a._id))));

  return (
    <div className={`page messages-page ${mobileChat && active ? "is-mobile-chat" : ""}`}>
      <div className="messages-instagram-head">
        <div className="messages-account-title">
          <b>{me?.username || me?.name || 'Messages'}</b>
          <ChevronRight className="messages-account-chevron" />
        </div>
        <button className="messages-compose-button" type="button" aria-label="New message" onClick={openNewMessagePicker}>
          <Edit3 />
        </button>
      </div>

      <div className="messages-search-bar">
        <Search />
        <input
          value={conversationQuery}
          onChange={e => setConversationQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search messages"
        />
        {conversationQuery && <button type="button" onClick={() => setConversationQuery('')}><X /></button>}
      </div>

      <div className="messages-notes-section">
        <div className="messages-notes-header"><b>Notes</b><button onClick={loadNotes}>Refresh</button></div>
        <div className="messages-notes-scroll">
          <div className="note-card-wrap">
            <button className="message-note-card my-note" type="button" title={myNote?.text || "Share a note"} onClick={() => myNote ? setNoteActionTarget(myNote) : (setNoteEditingId(null), setNoteDraft(""), setNoteAudience("followers"), setNoteComposerOpen(true))}>
              <div className="message-note-avatar-wrap"><Avatar user={me} size={58} />{!myNote && <span className="note-add">+</span>}</div>
              <b>Your note</b><span>{myNote?.text || 'Share a note'}</span>
            </button>

          </div>
          {otherNotes.map(note => <button className="message-note-card" key={note._id} type="button" onClick={() => setNoteActionTarget(note)}>
            <div className="message-note-bubble">{note.text}</div><div className="message-note-avatar"><Avatar user={note.author} size={58} /></div>
            <UserLink user={note.author} /><span>{note.music || 'Tap for options'}</span>
          </button>)}
          {!otherNotes.length && <div className="notes-empty">Follow people and their notes will appear here.</div>}
        </div>
      </div>

      {newMessageOpen && <div className="messages-requests-overlay messages-compose-overlay" onClick={() => setNewMessageOpen(false)}><section className="messages-requests-modal new-message-modal" onClick={e => e.stopPropagation()}>
        <div className="messages-requests-head"><b>New message</b><button type="button" aria-label="Close" onClick={() => setNewMessageOpen(false)}><X /></button></div>
        <div className="new-message-search"><label htmlFor="new-message-user-search">To:</label><input id="new-message-user-search" autoFocus value={peopleSearch} onChange={e => searchMessagePeople(e.target.value)} placeholder="Search people" /></div>
        <div className="new-message-results">
          {peopleLoading ? <div className="new-message-status">Searching people…</div> : null}
          {!peopleLoading && !peopleResults.length && !peopleError ? <div className="new-message-status">Search for someone to start a conversation.</div> : null}
          {peopleResults.map(user => <button className="new-message-user-row" type="button" key={user._id} disabled={!!startingConversationId} onClick={() => startConversationWith(user)}><Avatar user={user} size={46}/><span><b>{user.name || user.username || "User"}</b><small>@{user.username || "user"}</small></span><span className="new-message-start-label">{String(startingConversationId) === String(user._id) ? "Opening…" : "Message"}</span></button>)}
          {peopleError ? <div className="new-message-error" role="alert">{peopleError}</div> : null}
        </div>
      </section></div>}

      {noteComposerOpen && <div className="messages-requests-overlay messages-compose-overlay" onClick={() => setNoteComposerOpen(false)}><section className="messages-requests-modal note-composer-modal" onClick={e => e.stopPropagation()}>
        <div className="messages-requests-head"><button type="button" className="note-cancel-button" onClick={() => setNoteComposerOpen(false)}>Cancel</button><b>{noteEditingId ? "Edit note" : "New note"}</b><button type="button" className="note-share-button" disabled={!noteDraft.trim() || noteSaving} onClick={publishNote}>{noteSaving ? (noteEditingId ? "Saving…" : "Sharing…") : (noteEditingId ? "Save" : "Share")}</button></div>
        <form className="note-composer-body" onSubmit={publishNote}><div className="note-composer-profile"><Avatar user={me} size={48}/><div><b>{me?.username || me?.name || "Your note"}</b><small>Visible for 24 hours</small></div></div><textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value.slice(0, 60))} maxLength={60} autoFocus placeholder="Share a thought…" rows={3}/><div className="note-composer-footer"><label htmlFor="note-audience">Audience</label><select id="note-audience" value={noteAudience} onChange={e => setNoteAudience(e.target.value)}><option value="followers">Followers you follow back</option><option value="close-friends">Close Friends</option></select><span>{noteDraft.length}/60</span></div><button className="note-publish-mobile" type="submit" disabled={!noteDraft.trim() || noteSaving}>{noteSaving ? (noteEditingId ? "Saving…" : "Sharing…") : (noteEditingId ? "Save changes" : "Share note")}</button></form>
      </section></div>}

      {noteActionTarget && (() => { const ownNote = String(noteActionTarget.author?._id || noteActionTarget.author) === String(me?._id); return <div className="messages-requests-overlay messages-compose-overlay note-viewer-overlay" onClick={() => { setNoteActionTarget(null); setNoteReplyDraft(""); }}><section className={`messages-requests-modal note-action-modal ${ownNote ? "note-owner-view" : "note-other-view"}`} onClick={e => e.stopPropagation()}><div className="note-sheet-handle"/><div className="note-viewer-top"><Avatar user={noteActionTarget.author} size={54}/><div className="note-viewer-copy"><b>{ownNote ? "Your note" : `${noteActionTarget.author?.username || noteActionTarget.author?.name || "User"} · now`}</b><small>{noteActionTarget.music || `Shared with ${noteActionTarget.audience === "close_friends" || noteActionTarget.audience === "close-friends" ? "Close Friends" : "followers"}`}</small></div><button type="button" className="note-viewer-close" aria-label="Close" onClick={() => { setNoteActionTarget(null); setNoteReplyDraft(""); }}><X/></button></div><div className="note-viewer-content"><p>{String(noteActionTarget.text || noteActionTarget.note || "").trim() || "No text in this note"}</p></div>{ownNote ? <div className="note-owner-view-actions"><button type="button" className="note-owner-new" onClick={() => { setNoteActionTarget(null); setNoteEditingId(null); setNoteDraft(""); setNoteAudience("followers"); setNoteComposerOpen(true); }}>Leave a new note</button><button type="button" className="note-owner-edit" onClick={() => { editMyNote(noteActionTarget); setNoteActionTarget(null); }}>Edit note</button><button type="button" className="note-owner-delete" onClick={async () => { const selected = noteActionTarget; setNoteActionTarget(null); await deleteMyNote(selected); }}>Delete note</button></div> : <form className="note-inline-reply" onSubmit={replyToNote}><input aria-label="Reply to note" autoFocus value={noteReplyDraft} onChange={e => setNoteReplyDraft(e.target.value)} placeholder={`Reply to ${noteActionTarget.author?.username || noteActionTarget.author?.name || "user"}…`} maxLength={1000}/><button type="submit" disabled={!noteReplyDraft.trim() || noteReplySending}>{noteReplySending ? "Sending…" : "Send"}</button></form>}</section></div>; })()}

      {noteReplyTarget && <div className="messages-requests-overlay messages-compose-overlay" onClick={() => setNoteReplyTarget(null)}><section className="messages-requests-modal note-composer-modal note-reply-modal" onClick={e => e.stopPropagation()}><div className="messages-requests-head"><button type="button" className="note-cancel-button" onClick={() => setNoteReplyTarget(null)}>Cancel</button><b>Reply to note</b><button type="button" className="note-share-button" disabled={!noteReplyDraft.trim() || noteReplySending} onClick={replyToNote}>{noteReplySending ? "Sending…" : "Send"}</button></div><form className="note-composer-body" onSubmit={replyToNote}><div className="note-composer-profile"><Avatar user={noteReplyTarget.author} size={48}/><div><b>{noteReplyTarget.author?.username || noteReplyTarget.author?.name || "User"}</b><small>“{noteReplyTarget.text}”</small></div></div><textarea value={noteReplyDraft} onChange={e => setNoteReplyDraft(e.target.value)} maxLength={1000} autoFocus placeholder="Reply to their note…" rows={3}/><button className="note-publish-mobile" type="submit" disabled={!noteReplyDraft.trim() || noteReplySending}>{noteReplySending ? "Sending…" : "Send reply"}</button></form></section></div>}

      {requestsOpen && <div className="messages-requests-overlay" onClick={() => setRequestsOpen(false)}><div className="messages-requests-modal" onClick={e => e.stopPropagation()}>
        <div className="messages-requests-head"><b>Follow requests</b><button onClick={() => setRequestsOpen(false)}><X /></button></div>
        {!requests.length ? (
          <div className="requests-empty">
            <UserPlus />
            <b>No requests</b>
            <span>New follow requests will appear here.</span>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(r => {
              const u = r.follower || r.requester || r.actor || {};
              const busy = String(requestActionId || '') === String(r._id);
              return (
                <div className="request-row" key={r._id}>
                  <Avatar user={u} size={48} />
                  <div className="request-row-copy">
                    <UserLink user={u} />
                    <span>wants to follow you</span>
                  </div>
                  <div className="request-actions">
                    <button
                      type="button"
                      className="request-accept-btn"
                      disabled={!!requestActionId}
                      onClick={() => acceptFollowRequest(r._id)}
                    >
                      {busy ? '...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      className="request-reject-btn"
                      disabled={!!requestActionId}
                      onClick={() => declineFollowRequest(r._id)}
                    >
                      {busy ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div></div>}

      <div className={`chat-layout instagram-chat-layout ${active ? 'has-active' : ''}`}>
        <div className="conversation-list instagram-conversation-list">
          <div className="conversation-list-title">
            <b>Messages</b>
            <button className="messages-requests-button" onClick={() => { setRequestsOpen(true); loadRequests(); }}>
              Requests {requests.length > 0 && <span>{requests.length}</span>}
            </button>
          </div>
          {loading ? <div className="chat-empty-list">Loading...</div> : filteredConversations.length ? <div className="conversation-scroll">
            {filteredConversations.map(c => {
              const u = other(c); const selected = String(active?._id) === String(c._id);
              const unread = Number(c.unreadCount || 0) > 0;
              return <div className={`conversation-item-shell ${selected ? 'active' : ''}`} key={c._id}>
                <button
                  className={`conversation-item ${selected ? 'active' : ''} ${unread ? 'unread' : ''} ${pinnedConversationIds.includes(String(c._id)) ? 'is-pinned' : ''}`}
                  onClick={() => { if (suppressConversationClick.current) { suppressConversationClick.current = false; return; } openConversation(c); }}
                  onTouchStart={() => startConversationLongPress(c)}
                  onTouchEnd={cancelConversationLongPress}
                  onTouchMove={cancelConversationLongPress}
                  onTouchCancel={cancelConversationLongPress}
                  onContextMenu={e => { e.preventDefault(); setConversationMenuId(String(c._id)); setMobileConversationActions(c); }}
                  onMouseDown={e => { if (e.pointerType !== 'touch') return; startConversationLongPress(c); }}
                  onMouseUp={cancelConversationLongPress}
                  type="button">
                  <div className="conversation-avatar-wrap">
                    <Avatar user={u} size={58} />
                    {unread && <span className="conversation-unread-dot" aria-label="Unread message" />}
                  </div>
                  <div className="conversation-copy">
                    <div className="conversation-name-line"><UserLink user={u} className={`conversation-username ${unread ? 'is-unread' : ''}`} />{pinnedConversationIds.includes(String(c._id)) && <PinOff size={13} className="conversation-pin-indicator" />}{mutedConversationIds.includes(String(c._id)) && <Bell size={13} className="conversation-mute-indicator" />}</div>
                    <span className={`conversation-preview ${unread ? 'is-unread' : ''}`}>{c.lastMessage?.text || 'Start a conversation'}</span>
                    {c.lastMessage?.createdAt && <small>{time(c.lastMessage.createdAt)}</small>}
                  </div>
                </button>
                <div className="conversation-options-wrap">
                  <button type="button" className="conversation-options-button" aria-label={`Conversation options for ${u?.username || u?.name || 'user'}`} onClick={() => { setConversationMenuId(v => v === String(c._id) ? null : String(c._id)); setConversationMenuOpen(false); }}><MoreHorizontal size={19} /></button>
                  {conversationMenuId === String(c._id) && !mobileConversationActions && <div className="conversation-options-menu"><button type="button" onClick={() => runConversationAction('unread', c)}><Mail size={17}/>Mark as unread</button><button type="button" onClick={() => runConversationAction('pin', c)}><PinOff size={17}/>{pinnedConversationIds.includes(String(c._id)) ? 'Unpin' : 'Pin'}</button><button type="button" onClick={() => runConversationAction('mute', c)}><Bell size={17}/>{mutedConversationIds.includes(String(c._id)) ? 'Unmute' : 'Mute'}</button><button className="conversation-delete-action" type="button" disabled={deletingConversationId === String(c._id)} onClick={() => deleteConversation(c)}><Trash2 size={17}/>{deletingConversationId === String(c._id) ? 'Deleting…' : 'Delete'}</button></div>}
                </div>
              </div>;
            })}
          </div> : <div className="chat-empty-list"><MessageCircle /><b>Start a conversation</b><span>Send a message to someone you follow.</span><small>Open a profile and tap Message.</small></div>}
        </div>

        <div className="chat instagram-chat">
          {!active ? <div className="instagram-chat-placeholder"><div className="message-placeholder-icon"><Send /></div><h2>Your messages</h2><p>Send private messages to your friends.</p><span>Select a conversation to start chatting.</span></div> : <>
            <div className="chat-head instagram-chat-head">
              <button type="button" className="chat-back-button" onClick={() => { setActive(null); setMobileChat(false); }}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
              <button type="button" className="chat-profile-open" onClick={() => openUserProfile(other(active)?._id)} aria-label="Open user profile"><Avatar user={other(active)} size={44} /></button>
              <div className="chat-profile-title"><UserLink user={other(active)} /><span>Active now</span></div>
              <div className="chat-header-options-wrap">
                <button type="button" className="chat-header-options-button" aria-label="Conversation options" onClick={() => setConversationMenuOpen(v => !v)}><MoreHorizontal /></button>
                {conversationMenuOpen && <div className="conversation-options-menu chat-header-options-menu"><button type="button" disabled={deletingConversationId === String(active._id)} onClick={() => deleteConversation(active)}><Trash2 size={15}/>{deletingConversationId === String(active._id) ? 'Deleting…' : 'Delete conversation'}</button></div>}
              </div>
            </div>
            <div className="chat-messages instagram-chat-messages">
              {messages.length ? messages.map(m => {
                const mine = String(m.sender?._id) === String(me?._id);
                const seen = (m.seenBy || []).some(x => String(x?._id || x) !== String(me?._id));
                return <div key={m._id} className={`message-line ${mine ? 'mine' : 'received'}`}>
                  {!mine && <Avatar user={m.sender} size={30} />}
                  <div className={`message-bubble-wrap ${mine ? 'mine' : ''}`}>
                    <div
                      className={`bubble ${mine ? 'mine' : ''}`}
                      onContextMenu={(e) => {
                        if (!mine) return;
                        e.preventDefault();
                        setMessageMenuId(messageMenuId === m._id ? null : m._id);
                      }}
                      onClick={() => { if (mine) setMessageMenuId(messageMenuId === m._id ? null : m._id); }}
                    >
                      <SharedMediaMessage text={m.text} />
                      <div className="message-meta">
                        <small>{time(m.createdAt)}</small>
                        {mine && <small>{seen ? seenTime(m.seenAt) : 'Sent'}</small>}
                      </div>
                    </div>
                    {mine && messageMenuId === m._id && (
                      <div className="message-action-menu" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => deleteMessage(m._id)} disabled={deletingMessageId === m._id}>
                          <Trash2 /> {deletingMessageId === m._id ? "Deleting..." : "Delete message"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>;
              }) : <div className="empty chat-no-messages"><div className="chat-first-message-avatar"><Avatar user={other(active)} size={74} /></div><h2>{other(active)?.name || other(active)?.username}</h2><p>@{other(active)?.username}</p><span>Start a conversation with this person.</span></div>}
            </div>
            <div className="chat-input instagram-chat-input" ref={emojiPickerRef}>
              <button type="button" className="chat-attach-button" aria-label="Attach" title="Attach"><Paperclip /></button>
              <div className="chat-message-field">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onFocus={() => {}}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Message..."
                  disabled={sending}
                  aria-label="Message"
                />
                <button
                  type="button"
                  className={`chat-smile-button ${emojiOpen ? 'active' : ''}`}
                  onClick={() => setEmojiOpen(value => !value)}
                  aria-label="Emoji"
                  title="Emoji"
                >
                  <Smile />
                </button>
                {emojiOpen && (
                  <div className="reelsgo-emoji-picker" role="dialog" aria-label="Emoji picker">
                    <div className="reelsgo-emoji-picker-head">
                      <b>Emojis</b>
                      <button type="button" onClick={() => setEmojiOpen(false)} aria-label="Close emoji picker"><X /></button>
                    </div>
                    <div className="reelsgo-emoji-tabs" role="tablist">
                      {REELSGO_EMOJI_TABS.map(category => (
                        <button
                          type="button"
                          key={category}
                          className={emojiCategory === category ? 'active' : ''}
                          onClick={() => setEmojiCategory(category)}
                          aria-label={category}
                          title={category}
                        >
                          {category === 'Smileys' ? '😀' : category === 'People' ? '👍' : category === 'Animals' ? '🐶' : category === 'Food' ? '🍕' : category === 'Travel' ? '✈️' : category === 'Objects' ? '💡' : category === 'Symbols' ? '❤️' : '🇮🇳'}
                        </button>
                      ))}
                    </div>
                    <div className="reelsgo-emoji-grid">
                      {REELSGO_EMOJI_CATEGORIES[emojiCategory].map((emoji, index) => (
                        <button type="button" key={`${emoji}-${index}`} onClick={() => insertEmoji(emoji)} aria-label={`Add ${emoji}`}>{emoji}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {text.trim() && <button type="button" className="chat-send-button" onClick={sendMessage} disabled={sending} aria-label="Send"><Send /></button>}
            </div>
          </>}
        </div>
      </div>
      {mobileConversationActions && (
        <div className="mobile-conversation-action-overlay" role="presentation" onClick={() => { setMobileConversationActions(null); setConversationMenuId(null); }}>
          <section className="mobile-conversation-action-sheet" role="dialog" aria-modal="true" aria-label="Conversation actions" onClick={e => e.stopPropagation()}>
            <div className="mobile-action-sheet-handle" />
            <div className="mobile-action-sheet-user"><Avatar user={other(mobileConversationActions)} size={42} /><div><b>{other(mobileConversationActions)?.username ? `@${other(mobileConversationActions).username}` : other(mobileConversationActions)?.name || 'Conversation'}</b><span>Conversation options</span></div></div>
            <button type="button" onClick={() => runConversationAction('unread', mobileConversationActions)}><Mail size={22}/><span>Mark as unread</span></button>
            <button type="button" onClick={() => runConversationAction('pin', mobileConversationActions)}><PinOff size={22}/><span>{pinnedConversationIds.includes(String(mobileConversationActions._id)) ? 'Unpin' : 'Pin'}</span></button>
            <button type="button" onClick={() => runConversationAction('mute', mobileConversationActions)}><Bell size={22}/><span>{mutedConversationIds.includes(String(mobileConversationActions._id)) ? 'Unmute' : 'Mute'}</span></button>
            <button type="button" className="mobile-action-delete" onClick={() => runConversationAction('delete', mobileConversationActions)}><Trash2 size={22}/><span>Delete</span></button>
          </section>
        </div>
      )}
    </div>
  );
}

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [followingIds, setFollowingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestActionId, setRequestActionId] = useState(null);

  const me = getUser();

  async function loadNotifications() {
    setLoading(true);
    try {
      const d = await api("/notifications");
      setItems(d.notifications || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadRequests() {
    setRequestsLoading(true);
    try {
      const d = await api("/follows/requests");
      setRequests(d.requests || []);
    } catch (e) {
      console.error(e);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }

  async function loadFollowing() {
    try {
      if (!me?._id) return;
      const d = await api(`/follows/${me._id}/following`);
      const rows = d.following || d.users || [];
      const ids = new Set();
      rows.forEach(item => {
        const user = item?.user || item;
        if (user?._id) ids.add(String(user._id));
      });
      setFollowingIds(ids);
    } catch (e) {
      console.error(e);
      setFollowingIds(new Set());
    }
  }

  useEffect(() => {
    loadNotifications();
    loadFollowing();
    loadRequests();
  }, []);

  async function acceptRequest(requestId) {
    if (!requestId || requestActionId) return;
    setRequestActionId(requestId);
    try {
      await api(`/follows/requests/${requestId}/accept`, { method: "POST" });
      setRequests(current => current.filter(r => String(r._id) !== String(requestId)));
      await loadNotifications();
    } catch (e) {
      alert(e.message || "Unable to accept follow request");
    } finally {
      setRequestActionId(null);
    }
  }

  async function rejectRequest(requestId) {
    if (!requestId || requestActionId) return;
    setRequestActionId(requestId);
    try {
      await api(`/follows/requests/${requestId}/decline`, { method: "POST" });
      setRequests(current => current.filter(r => String(r._id) !== String(requestId)));
      await loadNotifications();
    } catch (e) {
      alert(e.message || "Unable to reject follow request");
    } finally {
      setRequestActionId(null);
    }
  }

  function notificationType(n) {
    const type = String(n?.type || n?.kind || n?.event || "").toLowerCase();
    const text = String(n?.text || n?.message || "").toLowerCase();
    if (type.includes("comment") || text.includes("comment")) return "comment";
    if (type.includes("follow") || text.includes("follow")) return "follow";
    if (type.includes("like") || text.includes("liked") || text.includes("like")) return "like";
    if (type.includes("message") || text.includes("message")) return "message";
    if (type.includes("reel")) return "reel";
    if (type.includes("story")) return "story";
    if (type.includes("mention") || text.includes("mention")) return "mention";
    return "other";
  }

  const filteredItems = useMemo(() => {
    if (activeTab === "comments") return items.filter(n => notificationType(n) === "comment");
    if (activeTab === "follows") return items.filter(n => notificationType(n) === "follow");
    if (activeTab === "likes") return items.filter(n => notificationType(n) === "like");
    if (activeTab === "people") {
      return items.filter(n => {
        const actorId = n?.actor?._id || n?.actorId || n?.userId;
        return actorId && followingIds.has(String(actorId));
      });
    }
    return items;
  }, [items, activeTab, followingIds]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "people", label: "People you follow" },
    { id: "comments", label: "Comments" },
    { id: "follows", label: "Follows" },
    { id: "requests", label: "Requests", count: requests.length }
  ];

  return (
    <div className="page notifications-page">
      <div className="notifications-center-head">
        <h1>Notifications</h1>
        <button type="button" className="notifications-refresh" onClick={() => { loadNotifications(); loadRequests(); loadFollowing(); }} aria-label="Refresh notifications">
          <Bell />
        </button>
      </div>

      <div className="notification-tabs" role="tablist" aria-label="Notification filters">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "requests") loadRequests();
            }}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && <b className="notification-tab-count">{tab.count > 99 ? "99+" : tab.count}</b>}
          </button>
        ))}
      </div>

      {activeTab === "requests" ? (
        <section className="notification-request-center">
          <div className="notification-section-title">
            <div>
              <h2>Follow requests</h2>
              <p>People who want to follow you</p>
            </div>
            <button type="button" onClick={loadRequests}>Refresh</button>
          </div>

          {requestsLoading ? (
            <div className="notification-center-state">Loading requests...</div>
          ) : requests.length ? (
            <div className="notification-requests-list">
              {requests.map(request => {
                const person = request?.follower || request?.requester || request?.actor || request?.user || {};
                const busy = String(requestActionId || "") === String(request._id);
                return (
                  <div className="notification-request-row" key={request._id}>
                    <Avatar user={person} size={52} />
                    <div className="notification-request-copy">
                      <UserLink user={person} />
                      <span>wants to follow you</span>
                      <small>{request.createdAt ? new Date(request.createdAt).toLocaleString() : "Follow request"}</small>
                    </div>
                    <div className="notification-request-actions">
                      <button type="button" className="notification-request-accept" disabled={!!requestActionId} onClick={() => acceptRequest(request._id)}>
                        {busy ? "..." : "Accept"}
                      </button>
                      <button type="button" className="notification-request-reject" disabled={!!requestActionId} onClick={() => rejectRequest(request._id)}>
                        {busy ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="notification-center-state notification-center-empty">
              <UserPlus />
              <h3>No follow requests</h3>
              <p>New follow requests will appear here.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="notification-feed">
          {loading ? (
            <div className="notification-center-state">Loading notifications...</div>
          ) : filteredItems.length ? (
            filteredItems.map(n => (
              <div role="button" tabIndex={0} className="notification notification-card" key={n._id}
                onClick={() => {
                  const actorId = n?.actor?._id || n?.actorId;
                  if (actorId) window.dispatchEvent(new CustomEvent("vk-open-profile", { detail: { id: actorId } }));
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const actorId = n?.actor?._id || n?.actorId;
                    if (actorId) window.dispatchEvent(new CustomEvent("vk-open-profile", { detail: { id: actorId } }));
                  }
                }}>
                <Avatar user={n.actor} size={48} />
                <span className="notification-copy">
                  <span><UserLink user={n.actor} /> {n.text || n.message || "New activity on your account"}</span>
                  <small>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</small>
                </span>
                <button type="button" className="notification-delete" aria-label="Delete notification" title="Delete notification"
                  onClick={async e => {
                    e.stopPropagation();
                    try {
                      await api(`/notifications/${n._id}`, { method: "DELETE" });
                      setItems(current => current.filter(item => String(item._id) !== String(n._id)));
                    } catch (error) {
                      alert(error.message || "Could not delete notification.");
                    }
                  }}><Trash2 size={18} /></button>
              </div>
            ))
          ) : (
            <div className="notification-center-state notification-center-empty">
              <Bell />
              <h3>No notifications</h3>
              <p>New activity will appear here.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function SavedPage({ user, embedded = false }) {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("posts");
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const normalize = (data, kind) => {
      const raw = kind === "posts"
        ? (data?.posts || data?.data?.posts || data?.savedPosts || data?.saved || [])
        : (data?.reels || data?.data?.reels || data?.savedReels || data?.saved || []);
      return Array.isArray(raw)
        ? raw.map(item => kind === "posts" ? (item?.post || item) : (item?.reel || item))
          .filter(item => item && (kind === "posts" ? item._id : item._id && item.mediaUrl))
        : [];
    };
    const refreshSaved = () => {
      api("/posts/saved").then(data => setPosts(normalize(data, "posts"))).catch(() => {});
      api("/reels/saved").then(data => setReels(normalize(data, "reels"))).catch(() => {});
    };
    Promise.all([
      api("/posts/saved").catch(error => { console.error("Could not load saved posts:", error); return { posts: [] }; }),
      api("/reels/saved").catch(error => { console.error("Could not load saved Reels:", error); return { reels: [] }; })
    ]).then(([postData, reelData]) => {
      if (cancelled) return;
      setPosts(normalize(postData, "posts"));
      setReels(normalize(reelData, "reels"));
    }).finally(() => { if (!cancelled) setLoading(false); });
    window.addEventListener("reelsgo-saved-content-updated", refreshSaved);
    return () => {
      cancelled = true;
      window.removeEventListener("reelsgo-saved-content-updated", refreshSaved);
    };
  }, []);

  const totalSaved = posts.length + reels.length;
  const body = <section className={`saved-page-content${embedded ? " saved-page-embedded" : ""}`}>
    {!embedded && <header className="saved-page-header">
      <div className="saved-page-title-icon"><Bookmark size={25} strokeWidth={1.8} /></div>
      <div className="saved-page-title-copy"><h1>Saved</h1><p>Keep the posts and Reels you want to come back to.</p></div>
      <div className="saved-page-total"><strong>{totalSaved}</strong><span>saved items</span></div>
    </header>}
    <div className="saved-page-toolbar">
      <div className="saved-page-tabs" role="tablist" aria-label="Saved content">
        <button type="button" role="tab" aria-selected={activeType === "posts"} className={activeType === "posts" ? "active" : ""} onClick={() => setActiveType("posts")}><Grid3X3 size={17}/><span>Posts</span><b>{posts.length}</b></button>
        <button type="button" role="tab" aria-selected={activeType === "reels"} className={activeType === "reels" ? "active" : ""} onClick={() => setActiveType("reels")}><Film size={17}/><span>Reels</span><b>{reels.length}</b></button>
      </div>
      <span className="saved-private-note"><Lock size={13}/> Only you can see what you save</span>
    </div>
    {loading ? <div className="saved-page-state"><div className="saved-loading-mark"><Bookmark size={25}/></div><strong>Loading your saved items</strong><span>Just a moment…</span></div> : activeType === "posts" ? (
      posts.length ? <div className="profile-grid saved-posts-grid">{posts.slice(0, 100).map(p => <GridMedia key={p._id} post={p} user={user} onDeleted={id => setPosts(current => current.filter(item => String(item._id) !== String(id)))} />)}</div>
      : <div className="saved-page-empty"><div className="saved-empty-art"><Bookmark size={32} strokeWidth={1.5}/></div><h2>Save your favorites</h2><p>Tap the bookmark on a post to save it here. Your saved posts are private and only visible to you.</p></div>
    ) : (
      reels.length ? <div className="profile-grid reels-profile-grid saved-reels-grid">{reels.slice(0, 100).map(reel => <button key={reel._id} type="button" className="grid-media grid-media-button saved-reel-tile" onClick={() => setActiveReel(reel)} aria-label={`Play saved Reel${reel.caption ? `: ${reel.caption}` : ""}`}>
        <video src={`${SERVER}${reel.mediaUrl}`} muted playsInline preload="metadata" />
        <span className="saved-reel-play" aria-hidden="true"><Play size={22} fill="currentColor"/></span>
        {reel.caption ? <span className="saved-reel-caption">{reel.caption}</span> : null}
      </button>)}</div> : <div className="saved-page-empty"><div className="saved-empty-art"><Film size={32} strokeWidth={1.5}/></div><h2>Your saved Reels live here</h2><p>When you bookmark a Reel, you can find it here and watch it again anytime.</p></div>
    )}
    {activeReel && <ReelViewer reel={activeReel} onClose={() => setActiveReel(null)} />}
  </section>;
  if (embedded) return <div className="embedded-saved">{body}</div>;
  return <div className="page saved-page-shell">{body}</div>;
}

const settingsSections = [
  { id: "account", title: "Your account", icon: User, items: ["Edit profile", "Personal information", "Password", "Account privacy", "Deactivate or delete account", "Profile discovery", "Account suggestions"] },
  { id: "privacy", title: "Privacy", icon: Lock, items: ["Private account", "Activity status", "Hidden words", "Hide offensive comments", "Custom words filter", "Tags and mentions", "Allow tags from", "Allow mentions from", "Comments", "Sharing", "Allow remixing", "Allow downloads", "Story sharing", "Close Friends", "Restricted accounts", "Blocked accounts", "Muted accounts", "Close friends visibility"] },
  { id: "security", title: "Security", icon: Shield, items: ["Login alerts", "New device alerts", "Security email notifications", "Sensitive action confirmations", "Remember trusted devices", "Password change alerts", "Email change alerts", "Phone change alerts", "Active session reminders"] },
  { id: "notifications", title: "Notifications", icon: Bell, items: ["Push notifications", "Likes", "Comments", "Followers and follow requests", "Messages", "Message requests", "Story replies", "Mentions", "Live notifications", "Reels interactions", "Product announcements", "Email notifications"] },
  { id: "messages", title: "Messages and replies", icon: MessageSquareText, items: ["Message requests", "Read receipts", "Typing indicator", "Group message requests", "Story replies", "Allow sharing", "Allow message previews", "Allow voice messages", "Call notifications"] },
  { id: "content", title: "What you see", icon: Compass, items: ["Sensitive content", "Autoplay videos", "Suggested posts", "Show political content", "Use less mobile data", "Favorites feed", "Show liked posts", "Personalized recommendations", "Hide previously seen posts", "Show content in original language"] },
  { id: "media", title: "Media quality", icon: ImageIcon, items: ["Data usage saver", "Upload at highest quality", "Autoplay videos on Wi-Fi", "Autoplay videos on mobile data", "Save original photos", "Save original videos", "Allow media downloads", "Preload videos"] },
  { id: "accessibility", title: "Accessibility", icon: Smartphone, items: ["Reduce motion", "Captions", "Auto-generated captions", "Text size", "Sound effects", "Text-to-speech", "Screen reader labels", "High contrast", "Keyboard navigation"] },
  { id: "language", title: "Language", icon: Languages, items: ["App language", "Automatic translations", "Translate captions", "Translate comments", "Translate messages", "Preferred content language"] },
  { id: "help", title: "Help", icon: CircleHelp, items: ["Help center", "Report a problem", "Privacy and safety", "Community guidelines", "Terms and policies"] }
];


function CloseFriendsSettings() {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [closeFriends, setCloseFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadCloseFriends() {
    setLoading(true);
    try {
      const data = await api("/users/me/close-friends");
      setCloseFriends(data.closeFriends || []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load your Close Friends list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCloseFriends();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const term = query.trim();
      if (!term) {
        setPeople([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const data = await api(`/users/search?q=${encodeURIComponent(term)}`);
        const results = data.users || data.results || [];
        const currentId = String(getUser()?._id || "");
        const existing = new Set(
          closeFriends.map(person => String(person?._id || person?.user?._id || person))
        );
        const unique = [];
        const seen = new Set();

        for (const item of results) {
          const person = item?.user || item;
          const id = String(person?._id || "");
          if (!id || id === currentId || existing.has(id) || seen.has(id)) continue;
          seen.add(id);
          unique.push(person);
        }
        if (!cancelled) {
          setPeople(unique);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to search users.");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, closeFriends]);

  async function addPerson(person) {
    const id = String(person._id);
    setBusyId(id);
    setError("");
    setNotice("");

    try {
      const data = await api("/users/me/close-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      setCloseFriends(data.closeFriends || [...closeFriends, person]);
      setPeople(current => current.filter(p => String(p._id) !== id));
      setNotice(`@${person.username || person.name || "User"} added to Close Friends.`);
    } catch (e) {
      setError(e.message || "Unable to add this person.");
    } finally {
      setBusyId("");
    }
  }

  async function removePerson(person) {
    const id = String(person?._id || person?.user?._id || person);
    setBusyId(id);
    setError("");
    setNotice("");

    try {
      const data = await api(`/users/me/close-friends/${id}`, {
        method: "DELETE",
      });
      setCloseFriends(data.closeFriends || closeFriends.filter(
        p => String(p?._id || p?.user?._id || p) !== id
      ));
      setNotice("Person removed from Close Friends.");
    } catch (e) {
      setError(e.message || "Unable to remove this person.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="rg-close-friends">
      <div className="rg-cf-intro">
        <div className="rg-cf-icon"><Users /></div>
        <div>
          <h2>Close Friends</h2>
          <p>Choose who can see stories shared with your Close Friends audience.</p>
        </div>
      </div>

      <label className="rg-cf-search">
        <Search aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search by username or name"
          aria-label="Search users to add to Close Friends"
        />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}
      </label>

      {error && <div className="rg-cf-message error" role="alert">{error}</div>}
      {notice && <div className="rg-cf-message success" role="status">{notice}</div>}

      {query.trim() && (
        <div className="rg-cf-search-results">
          {searching ? (
            <p className="rg-cf-muted">Searching…</p>
          ) : people.length ? (
            people.map(person => (
              <div className="rg-cf-person" key={person._id}>
                <Avatar user={person} size={44} />
                <div className="rg-cf-person-info">
                  <b>@{person.username || "user"}</b>
                  <span>{person.name || "ReelsGo user"}</span>
                </div>
                <button
                  className="rg-cf-add"
                  type="button"
                  disabled={!!busyId}
                  onClick={() => addPerson(person)}
                >
                  <UserPlus size={16} />
                  {busyId === String(person._id) ? "Adding…" : "Add"}
                </button>
              </div>
            ))
          ) : (
            <p className="rg-cf-muted">No users found to add.</p>
          )}
        </div>
      )}

      <div className="rg-cf-list-heading">
        <h3>Your list</h3>
        <span>{closeFriends.length} {closeFriends.length === 1 ? "person" : "people"}</span>
      </div>

      {loading ? (
        <p className="rg-cf-muted">Loading your Close Friends…</p>
      ) : closeFriends.length ? (
        closeFriends.map(item => {
          const person = item?.user || item;
          const id = String(person?._id || person);
          return (
            <div className="rg-cf-person" key={id}>
              <Avatar user={person} size={44} />
              <div className="rg-cf-person-info">
                <b>{person?.username ? `@${person.username}` : "ReelsGo user"}</b>
                <span>{person?.name || ""}</span>
              </div>
              <button
                className="rg-cf-remove"
                type="button"
                disabled={!!busyId}
                onClick={() => removePerson(person)}
              >
                {busyId === id ? "Removing…" : "Remove"}
              </button>
            </div>
          );
        })
      ) : (
        <div className="rg-cf-empty">
          <Users />
          <b>Your Close Friends list is empty</b>
          <span>Search for people above and select Add.</span>
        </div>
      )}

      <p className="rg-cf-footnote">
        Your list is private. People are not notified when you add or remove them.
      </p>
    </div>
  );
}

function SettingsModal({ user, setUser, onClose, onLogout, onOpenVerification }) {
  const [section, setSection] = useState("account");
  const [search, setSearch] = useState("");
  const [privateAccount, setPrivateAccount] = useState(!!user?.isPrivate);
  const [selectedItem, setSelectedItem] = useState("");
  const [mobileSectionOpen, setMobileSectionOpen] = useState(false);

  const visible = settingsSections.filter(s =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.items.some(i => i.toLowerCase().includes(search.toLowerCase()))
  );

  function openSection(id) {
    setSection(id);
    setSelectedItem("");
    setMobileSectionOpen(true);
    window.requestAnimationFrame(() => {
      const el = document.querySelector(".settings-content");
      if (el) el.scrollTop = 0;
    });
  }

  function handleSettingsBack() {
    if (mobileSectionOpen) {
      setMobileSectionOpen(false);
      setSelectedItem("");
      return;
    }
    onClose();
  }

  async function savePrivacy() {
    try {
      const d = await api("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPrivate: privateAccount })
      });
      setUser(d.user);
      localStorage.setItem("vk_user", JSON.stringify(d.user));
      alert("Privacy updated");
    } catch (e) {
      alert(e.message);
    }
  }

  async function togglePrivateAccount(next) {
    const previous = privateAccount;
    setPrivateAccount(next);
    try {
      const d = await api("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPrivate: next })
      });
      setUser(d.user);
      localStorage.setItem("vk_user", JSON.stringify(d.user));
    } catch (e) {
      setPrivateAccount(previous);
      alert(e.message);
    }
  }

  const activeSection = settingsSections.find(x => x.id === section);

  return (
    <div className="overlay settings-overlay">
      <div className="settings-modal instagram-settings">
        <div className="settings-topbar">
          <button
            className="settings-back"
            onClick={handleSettingsBack}
            type="button"
            aria-label={mobileSectionOpen ? "Back to settings" : "Back to home"}
          >
            <ChevronRight
              className="settings-back-icon"
              style={{ transform: "rotate(180deg)" }}
            />
          </button>

          <h2>{mobileSectionOpen ? activeSection?.title : "Settings and activity"}</h2>

          <button
            className="settings-close-desktop"
            onClick={onClose}
            type="button"
            aria-label="Close settings"
          >
            <X />
          </button>
        </div>

        <div className="settings-search">
          <Search />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (mobileSectionOpen) setMobileSectionOpen(false);
            }}
            placeholder="Search settings"
            aria-label="Search settings"
          />
          {search && (
            <button
              className="settings-search-clear"
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X />
            </button>
          )}
        </div>

        {/* Desktop / tablet settings navigation */}
        <div className="settings-layout">
          <aside className="settings-sidebar">
            {visible.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={section === s.id ? "active" : ""}
                  onClick={() => {
                    setSection(s.id);
                    setSelectedItem("");
                  }}
                >
                  <Icon />
                  <span>{s.title}</span>
                  <ChevronRight />
                </button>
              );
            })}

            <button className="settings-logout" onClick={onLogout} type="button">
              <LogOut />
              <span>Log out</span>
            </button>
          </aside>

          <section className="settings-content">
            <div className="settings-section-title">
              <h1>{activeSection?.title}</h1>
              <p>Manage your ReelsGo experience.</p>
            </div>

            {section === "account" && (
              <>
                <AccountSettings user={user} onSelect={setSelectedItem} onOpenVerification={onOpenVerification} />
                <ToggleSettings title="Account preferences" sectionId="account" items={settingsSections.find(s => s.id === "account")?.items.filter(x => ["Profile discovery", "Account suggestions"].includes(x)) || []} onSelect={setSelectedItem} />
              </>
            )}
            {section === "privacy" && (
              <PrivacySettings
                privateAccount={privateAccount}
                setPrivateAccount={setPrivateAccount}
                togglePrivateAccount={togglePrivateAccount}
                savePrivacy={savePrivacy}
                onSelect={setSelectedItem}
              />
            )}
            {section === "privacy" && <CloseFriendsSettings />}
            {section === "privacy" && <ToggleSettings title="Additional privacy preferences" sectionId="privacy" items={settingsSections.find(s => s.id === "privacy")?.items.filter(x => !["Private account", "Restricted accounts", "Blocked accounts", "Muted accounts"].includes(x)) || []} onSelect={setSelectedItem} />}
            {section === "security" && (
              <SecuritySettings onSelect={setSelectedItem} />
            )}
            {section === "security" && <ToggleSettings title="Security preferences" sectionId="security" items={settingsSections.find(s => s.id === "security")?.items || []} onSelect={setSelectedItem} />}
            {section === "notifications" && (
                <ToggleSettings title={activeSection?.title || "Notifications"} sectionId="notifications" items={settingsSections.find(s => s.id === "notifications")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "messages" && (
                <ToggleSettings title={activeSection?.title || "Messages"} sectionId="messages" items={settingsSections.find(s => s.id === "messages")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "content" && (
                <ToggleSettings title={activeSection?.title || "Content"} sectionId="content" items={settingsSections.find(s => s.id === "content")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "media" && (
                <ToggleSettings title={activeSection?.title || "Media"} sectionId="media" items={settingsSections.find(s => s.id === "media")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "accessibility" && (
                <ToggleSettings title={activeSection?.title || "Accessibility"} sectionId="accessibility" items={settingsSections.find(s => s.id === "accessibility")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "language" && (
                <ToggleSettings title={activeSection?.title || "Language"} sectionId="language" items={settingsSections.find(s => s.id === "language")?.items || []} onSelect={setSelectedItem} />
              )}
            {section === "help" && <HelpSettings onSelect={setSelectedItem} />}

            {selectedItem && (
              <SettingDetailScreen
                item={selectedItem}
                sectionId={section}
                user={user}
                setUser={setUser}
                onBack={() => setSelectedItem("")}
              />
            )}
          </section>
        </div>

        {/* Mobile settings category list. Nothing is hidden behind the desktop sidebar. */}
        <div className={`settings-mobile ${mobileSectionOpen ? "section-open" : "section-list-open"}`}>
          {!mobileSectionOpen ? (
            <div className="settings-mobile-list">
              <div className="settings-mobile-heading">
                <h1>Settings and activity</h1>
                <p>All ReelsGo settings</p>
              </div>

              <div className="settings-mobile-categories">
                {visible.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className="settings-mobile-category"
                      onClick={() => openSection(s.id)}
                    >
                      <span className="settings-mobile-category-icon">
                        <Icon />
                      </span>
                      <span className="settings-mobile-category-copy">
                        <b>{s.title}</b>
                        <small>{s.items.length} settings</small>
                      </span>
                      <ChevronRight />
                    </button>
                  );
                })}
              </div>

              <button
                className="settings-mobile-logout"
                type="button"
                onClick={onLogout}
              >
                <LogOut />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <section className="settings-mobile-detail">
              <div className="settings-mobile-detail-head">
                <button
                  type="button"
                  onClick={() => {
                    setMobileSectionOpen(false);
                    setSelectedItem("");
                  }}
                  aria-label="Back to all settings"
                >
                  <ChevronRight style={{ transform: "rotate(180deg)" }} />
                </button>
                <div>
                  <h1>{activeSection?.title}</h1>
                  <p>{activeSection?.items.length || 0} settings</p>
                </div>
              </div>

              {section === "account" && (
                <>
                  <AccountSettings user={user} onSelect={setSelectedItem} onOpenVerification={onOpenVerification} />
                  <ToggleSettings title="Account preferences" sectionId="account" items={settingsSections.find(s => s.id === "account")?.items.filter(x => ["Profile discovery", "Account suggestions"].includes(x)) || []} onSelect={setSelectedItem} />
                </>
              )}
              {section === "privacy" && (
                <PrivacySettings
                  privateAccount={privateAccount}
                  setPrivateAccount={setPrivateAccount}
                  togglePrivateAccount={togglePrivateAccount}
                  savePrivacy={savePrivacy}
                  onSelect={setSelectedItem}
                />
              )}
              {section === "privacy" && <CloseFriendsSettings />}
              {section === "privacy" && <ToggleSettings title="Additional privacy preferences" sectionId="privacy" items={settingsSections.find(s => s.id === "privacy")?.items.filter(x => !["Private account", "Restricted accounts", "Blocked accounts", "Muted accounts"].includes(x)) || []} onSelect={setSelectedItem} />}
              {section === "security" && (
                <SecuritySettings onSelect={setSelectedItem} />
              )}
              {section === "security" && <ToggleSettings title="Security preferences" sectionId="security" items={settingsSections.find(s => s.id === "security")?.items || []} onSelect={setSelectedItem} />}
              {section === "notifications" && (
                <ToggleSettings title={activeSection?.title || "Notifications"} sectionId="notifications" items={settingsSections.find(s => s.id === "notifications")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "messages" && (
                <ToggleSettings title={activeSection?.title || "Messages"} sectionId="messages" items={settingsSections.find(s => s.id === "messages")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "content" && (
                <ToggleSettings title={activeSection?.title || "Content"} sectionId="content" items={settingsSections.find(s => s.id === "content")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "media" && (
                <ToggleSettings title={activeSection?.title || "Media"} sectionId="media" items={settingsSections.find(s => s.id === "media")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "accessibility" && (
                <ToggleSettings title={activeSection?.title || "Accessibility"} sectionId="accessibility" items={settingsSections.find(s => s.id === "accessibility")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "language" && (
                <ToggleSettings title={activeSection?.title || "Language"} sectionId="language" items={settingsSections.find(s => s.id === "language")?.items || []} onSelect={setSelectedItem} />
              )}
              {section === "help" && <HelpSettings onSelect={setSelectedItem} />}

              {selectedItem && (
                <SettingDetailScreen
                  item={selectedItem}
                  sectionId={section}
                  user={user}
                  setUser={setUser}
                  onBack={() => setSelectedItem("")}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountSettings({ user, onSelect, onOpenVerification }) {
  return <div className="settings-panel">
    <div className="settings-profile-row"><Avatar user={user} size={72} /><div><b>{user?.username} <VerifiedBadge userId={user?._id} /></b><span>{user?.email}</span></div><button className="secondary" onClick={() => onSelect("Edit profile")}>Edit profile</button></div>
    <div className="verification-settings-card">
      <div className="verification-settings-icon"><BadgeCheck /></div>
      <div className="verification-settings-copy">
        <b>{verificationStatusCache.get(String(user?._id)) === true ? "Verified account" : "Get your blue tick"}</b>
        <span>{verificationStatusCache.get(String(user?._id)) === true ? "Your ReelsGo blue badge is active." : "Enter your phone number once to activate your custom ReelsGo blue badge."}</span>
      </div>
      {verificationStatusCache.get(String(user?._id)) === true ? (
        <span className="verification-active-label"><BadgeCheck /> Active</span>
      ) : (
        <button className="primary verification-settings-button" onClick={onOpenVerification}>Get verified</button>
      )}
    </div>
    <SettingRow onClick={() => onSelect("Personal information")} icon={<User />} title="Personal information" description="Name, email and profile information" />
    <SettingRow onClick={() => onSelect("Password")} icon={<KeyRound />} title="Password" description="Change your account password" />
    <SettingRow onClick={() => onSelect("Account privacy")} icon={<Lock />} title="Account privacy" description="Public or private account" />
    <SettingRow onClick={() => onSelect("Deactivate or delete account")} icon={<Trash2 />} title="Deactivate or delete account" description="Temporarily deactivate or permanently delete" danger />
  </div>;
}

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "on" : "off"}`}
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

function PrivacySettings({ privateAccount, setPrivateAccount, togglePrivateAccount, savePrivacy, onSelect }) {
  return <div className="settings-panel">
    <div className="settings-card-highlight"><Lock /><div><b>Account privacy</b><p>When private, only approved followers can see your posts and stories.</p></div></div>
    <div className="privacy-toggle-row settings-toggle-row">
      <div><b>Private account</b><span>Only approved followers can see your posts and stories.</span></div>
      <Toggle checked={privateAccount} onChange={togglePrivateAccount} />
    </div>
    <SettingRow onClick={() => onSelect("Blocked accounts")} icon={<Ban />} title="Blocked accounts" description="Review accounts you blocked" />
    <SettingRow onClick={() => onSelect("Restricted accounts")} icon={<UserMinus />} title="Restricted accounts" description="Manage restricted people" />
    <SettingRow onClick={() => onSelect("Tags and mentions")} icon={<AtSign />} title="Tags and mentions" description="Choose who can tag or mention you" />
    <SettingRow onClick={() => onSelect("Comments")} icon={<MessageSquareText />} title="Comments" description="Control who can comment on your posts" />
    <button className="primary" onClick={savePrivacy}>Save privacy</button>
  </div>;
}

function SecuritySettings({ onSelect }) {
  return <div className="settings-panel">
    <SettingRow onClick={() => onSelect("Password")} icon={<KeyRound />} title="Password" description="Update your password regularly" />
    <SettingRow onClick={() => onSelect("Two-factor authentication")} icon={<Shield />} title="Two-factor authentication" description="Add another layer of account protection" action="Set up" />
    <SettingRow onClick={() => onSelect("Login activity")} icon={<Clock3 />} title="Login activity" description="Review recent account sessions" />
    <SettingRow onClick={() => onSelect("Where you're logged in")} icon={<Smartphone />} title="Where you're logged in" description="Review active devices" />
    <SettingRow onClick={() => onSelect("Emails from ReelsGo")} icon={<Mail />} title="Emails from ReelsGo" description="Security and account emails" />
  </div>;
}

function ToggleSettings({ title, items, sectionId = "general", onSelect }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api("/users/me/settings")
      .then(data => {
        if (active) { setValues(data?.settings || {}); setError(""); }
      })
      .catch(err => { if (active) setError(err?.message || "Unable to load saved preferences."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <div className="settings-panel rg-settings-options">
    <h2 className="panel-heading">{title}</h2>
    {loading && <p className="settings-save-status">Loading your saved preferences…</p>}
    {error && <p className="settings-save-error" role="alert">{error}</p>}
    {items.map(item => {
      const key = `${sectionId}.${item}`;
      const enabled = Object.prototype.hasOwnProperty.call(values, key) ? Boolean(values[key]) : true;
      return <SettingRow
        key={key}
        title={item}
        description={loading ? "Loading preference…" : `Currently ${enabled ? "on" : "off"}. Click to open and change this setting.`}
        icon={<SlidersHorizontal />}
        action={enabled ? "On" : "Off"}
        onClick={() => onSelect?.(item)}
      />;
    })}
  </div>;
}

function SettingDetailScreen({ item, sectionId, user, setUser, onBack }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [people, setPeople] = useState([]);
  const [peopleSearch, setPeopleSearch] = useState("");
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleBusyId, setPeopleBusyId] = useState("");

  const peopleType = item === "Blocked accounts" ? "blocked" : item === "Restricted accounts" ? "restricted" : "";
  const isPeopleList = Boolean(peopleType);

  const key = `${sectionId}.${item}`;
  const value = Object.prototype.hasOwnProperty.call(settings, key) ? Boolean(settings[key]) : true;

  useEffect(() => {
    let active = true;
    api("/users/me/settings")
      .then(data => { if (active) setSettings(data?.settings || {}); })
      .catch(err => { if (active) setError(err?.message || "Unable to load this setting."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function saveBoolean(next) {
    const previous = value;
    setSettings(current => ({ ...current, [key]: next }));
    setSaving(true); setError(""); setNotice("");
    try {
      const data = await api("/users/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: next })
      });
      setSettings(data?.settings || { ...settings, [key]: next });
      setNotice("Your change has been saved to your ReelsGo account.");
    } catch (err) {
      setSettings(current => ({ ...current, [key]: previous }));
      setError(err?.message || "Could not save this setting. Check that the backend settings route is deployed.");
    } finally { setSaving(false); }
  }

  async function saveProfile(event) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const data = await api("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, bio, website })
      });
      const serverUser = data?.user || data || {};
      const updated = { ...(user || {}), ...serverUser, name, username, email, bio, website };
      setUser?.(updated);
      localStorage.setItem("vk_user", JSON.stringify(updated));
      setName(updated.name || "");
      setUsername(updated.username || "");
      setEmail(updated.email || "");
      setBio(updated.bio || "");
      setWebsite(updated.website || "");
      setNotice("Profile information saved and updated.");
    } catch (err) { setError(err?.message || "Could not save profile information."); }
    finally { setSaving(false); }
  }

  async function changePassword(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (newPassword.length < 8) { setError("Use at least 8 characters for your new password."); return; }
    if (newPassword !== confirmPassword) { setError("The new passwords do not match."); return; }
    setSaving(true);
    try {
      const data = await api("/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setNotice(data.message || "Password updated successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) { setError(err?.message || "Password update endpoint is not available on the backend yet."); }
    finally { setSaving(false); }
  }

  const isProfile = ["Personal information", "Edit profile"].includes(item);
  const isPassword = item === "Password";

  useEffect(() => {
    if (!isPeopleList) return;
    let active = true;
    setPeopleLoading(true);
    const timer = setTimeout(() => {
      const query = new URLSearchParams({ type: peopleType, search: peopleSearch }).toString();
      api(`/users/me/settings/people?${query}`)
        .then(data => { if (active) { setPeople(Array.isArray(data?.people) ? data.people : Array.isArray(data?.users) ? data.users : []); setError(""); } })
        .catch(err => { if (active) setError(err?.message || `Unable to load ${item.toLowerCase()}.`); })
        .finally(() => { if (active) setPeopleLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [isPeopleList, peopleType, peopleSearch, item]);

  async function updatePerson(personId, action) {
    setPeopleBusyId(personId); setError(""); setNotice("");
    try {
      const url = `/users/me/settings/people/${peopleType}/${personId}`;
      const data = await api(url, {
        method: action === "add" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        ...(action === "add" ? { body: JSON.stringify({}) } : {})
      });
      if (action === "add") {
        setPeople(current => [...current.filter(p => String(p._id) !== String(personId)), data?.person].filter(Boolean));
        setNotice(`${item === "Blocked accounts" ? "Account blocked" : "Account restricted"} successfully.`);
      } else {
        setPeople(current => current.filter(p => String(p._id) !== String(personId)));
        setNotice("Account removed from this list.");
      }
      if (peopleSearch) {
        const query = new URLSearchParams({ type: peopleType, search: peopleSearch }).toString();
        const refreshed = await api(`/users/me/settings/people?${query}`);
        setPeople(Array.isArray(refreshed?.people) ? refreshed.people : Array.isArray(refreshed?.users) ? refreshed.users : []);
      }
    } catch (err) { setError(err?.message || "Could not update this account."); }
    finally { setPeopleBusyId(""); }
  }
  const isPrivateAccount = item === "Account privacy" || item === "Private account";
  const descriptions = {
    "Profile discovery": "Choose whether your account can be suggested or discovered by other ReelsGo users.",
    "Account suggestions": "Control whether ReelsGo may suggest your account to other people.",
    "Activity status": "Control whether people can see when you are active.",
    "Read receipts": "Control whether people can see when you have read their messages.",
    "Typing indicator": "Control whether people can see when you are typing.",
    "Autoplay videos": "Choose whether videos play automatically when you browse.",
    "Allow downloads": "Set your preference for allowing content downloads. Server-side download routes must enforce this choice.",
    "Close friends visibility": "Set the default preference for Close Friends story visibility. Story routes must enforce this on every request.",
    "Hidden words": "Enable or disable the hidden words preference. Filtering must also be applied to incoming comments and messages.",
  };

  return <section className="setting-detail-screen">
    <button type="button" className="setting-detail-back" onClick={onBack}><ChevronRight style={{ transform: "rotate(180deg)" }} /> Back to {settingsSections.find(s => s.id === sectionId)?.title || "Settings"}</button>
    <div className="rg-detail-heading"><span className="rg-detail-kicker">REELSGO SETTINGS</span><h2>{item}</h2><p>{descriptions[item] || `Manage ${item.toLowerCase()} for your ReelsGo account.`}</p></div>
    {error && <div className="rg-detail-message error" role="alert">{error}</div>}
    {notice && <div className="rg-detail-message success" role="status">{notice}</div>}
    {isPeopleList ? <div className="rg-detail-form rg-people-manager">
      <label>Search ReelsGo accounts<input value={peopleSearch} onChange={e => setPeopleSearch(e.target.value)} placeholder="Search by name or username" autoComplete="off" /></label>
      <p className="rg-detail-footnote">{peopleSearch.trim() ? "Search results show accounts you can add to this list." : `Accounts you have ${peopleType === "blocked" ? "blocked" : "restricted"} appear here.`}</p>
      {peopleLoading ? <p className="settings-save-status">Loading accounts…</p> : null}
      {!peopleLoading && people.length === 0 && <p className="settings-save-status">{peopleSearch.trim() ? "No matching accounts found." : `No ${peopleType} accounts yet.`}</p>}
      <div className="rg-people-results">
        {people.map(person => {
          const personId = String(person?._id || person?.id || "");
          if (!personId) return null;
          const isOnList = !peopleSearch.trim();
          const displayName = person?.name || person?.fullName || person?.username || "ReelsGo user";
          return <div className="rg-people-row" key={personId}>
            <div className="rg-people-avatar">{String(displayName).slice(0, 1).toUpperCase()}</div>
            <div className="rg-people-copy"><b>{displayName}</b><small>@{String(person?.username || "user").replace(/^@/, "")}</small></div>
            <button type="button" className={isOnList ? "secondary" : "primary"} disabled={peopleBusyId === personId} onClick={() => updatePerson(personId, isOnList ? "remove" : "add")}>{peopleBusyId === personId ? "Please wait…" : isOnList ? "Remove" : peopleType === "blocked" ? "Block" : "Restrict"}</button>
          </div>;
        })}
      </div>
    </div> : isProfile ? <form className="rg-detail-form" onSubmit={saveProfile}>
      <label>Full name<input value={name} onChange={e => setName(e.target.value)} maxLength={80} /></label>
      <label>Username<input value={username} onChange={e => setUsername(e.target.value)} maxLength={30} /></label>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Bio<textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} rows={3} /></label>
      <label>Website<input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" /></label>
      <button className="primary rg-detail-save" disabled={saving} type="submit">{saving ? "Saving…" : "Save changes"}</button>
    </form> : isPassword ? <form className="rg-detail-form" onSubmit={changePassword}>
      <label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></label>
      <label>New password<input type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={8} required /></label>
      <label>Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={8} required /></label>
      <button className="primary rg-detail-save" disabled={saving} type="submit">{saving ? "Updating…" : "Update password"}</button>
    </form> : isPrivateAccount ? <div className="rg-detail-control-card"><div><b>Private account</b><p>When enabled, only approved followers should be able to see your private content. Your backend content routes must enforce this.</p></div><Toggle checked={Boolean(user?.isPrivate)} onChange={async next => { setSaving(true); setError(""); try { const d = await api("/users/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPrivate: next }) }); setUser?.(d.user); localStorage.setItem("vk_user", JSON.stringify(d.user)); setNotice("Account privacy updated."); } catch (e) { setError(e.message); } finally { setSaving(false); } }} disabled={saving} /></div> : item === "Deactivate or delete account" ? <div className="rg-detail-control-card danger"><div><b>Account deactivation and deletion</b><p>These actions require a dedicated server endpoint and confirmation flow. No destructive action will be taken from this screen.</p></div></div> : <div className="rg-detail-control-card"><div><b>{item}</b><p>{descriptions[item] || "Turn this preference on or off. This choice is saved to your ReelsGo account."}</p><small>{loading ? "Loading saved value…" : `Currently ${value ? "on" : "off"}`}</small></div><Toggle checked={value} disabled={loading || saving} onChange={saveBoolean} /></div>}
    {!isProfile && !isPassword && !isPrivateAccount && !isPeopleList && item !== "Deactivate or delete account" && <p className="rg-detail-footnote">Changes are saved to your account. Some preferences also require the corresponding ReelsGo feature to enforce them in the backend.</p>}
  </section>;
}

function HelpSettings({ onSelect }) {
  return <div className="settings-panel"><SettingRow onClick={() => onSelect("Help center")} icon={<CircleHelp />} title="Help center" description="Find answers to common questions" /><SettingRow onClick={() => onSelect("Report a problem")} icon={<Flag />} title="Report a problem" description="Tell us when something is not working" /><SettingRow onClick={() => onSelect("Privacy and safety")} icon={<Shield />} title="Privacy and safety" description="Safety resources and policies" /><SettingRow onClick={() => onSelect("Community guidelines")} icon={<AlertTriangle />} title="Community guidelines" description="Rules for using ReelsGo" /></div>;
}

function SettingRow({ icon, title, description, action, danger, onClick }) {
  return <button onClick={onClick} className={`setting-row ${danger ? "danger-row" : ""}`}><span className="setting-row-icon">{icon}</span><span className="setting-row-text"><b>{title}</b><small>{description}</small></span>{action ? <em>{action}</em> : <ChevronRight />}</button>;
}

function Modal({ title, onClose, children }) {
  return <div className="overlay" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose}><X /></button></div><div className="modal-body">{children}</div></div></div>;
}

export default App;
