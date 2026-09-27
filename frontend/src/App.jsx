import React, { useEffect, useMemo, useRef, useState } from "react";
import reelsGoLogo from "../image.png";
import {
  Home, Search, PlusSquare, Heart, MessageCircle, User, Settings, LogOut,
  Camera, Menu, X, Image as ImageIcon, Film, Bookmark, Compass, MoreHorizontal,
  Send, Grid3X3, Users, Lock, Shield, Trash2, Archive, Edit3, Check, UserPlus,
  UserMinus, Flag, ChevronRight, Play, Bell, Mic, Smile, Paperclip, Upload,
  SlidersHorizontal, KeyRound, Eye, EyeOff, HelpCircle, Languages, Moon, Sun,
  Link as LinkIcon, AtSign, UserRoundCheck, Smartphone, Mail, CircleUser,
  Clock3, Ban, MessageSquareText, CircleHelp, AlertTriangle, CameraOff, ChevronUp, ChevronDown, CircleMinus, HeartOff, SendHorizontal, Download, Maximize2, Link2, Handshake, PinOff, QrCode
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

function App() {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [page, setPage] = useState("home");
  const [createOpen, setCreateOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedRefresh, setFeedRefresh] = useState(0);
  const [profileUserId, setProfileUserId] = useState(null);
  const [openConversationId, setOpenConversationId] = useState(null);

  useEffect(() => {
    if (!token) return;
    const openMessages = () => navigate("messages");
    window.addEventListener("vk-open-messages", openMessages);
    return () => window.removeEventListener("vk-open-messages", openMessages);
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
    setPage("home");
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
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <Nav icon={<Compass />} label="Explore" active={page === "explore"} onClick={() => navigate("explore")} />
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
        {page === "search" && <SearchPage onOpenProfile={(id) => { setProfileUserId(id); setPage("user-profile"); }} />}
        {page === "user-profile" && profileUserId && <UserProfilePage userId={profileUserId} currentUser={user} onBack={() => navigate("search")} onMessage={async (id) => {
          try {
            const d = await api("/messages/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ members: [id] }) });
            setOpenConversationId(d.conversation?._id || null);
            navigate("messages");
          } catch (e) { alert(e.message); }
        }} />}
        {page === "explore" && <ExplorePage />}
        {page === "reels" && <ReelsPage onCreate={() => setReelOpen(true)} />}
        {page === "messages" && <MessagesPage openConversationId={openConversationId} />}
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
      {settingsOpen && <SettingsModal user={user} setUser={setUser} onClose={() => setSettingsOpen(false)} onLogout={logout} />}
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

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      const map = new Map();
      const add = (person) => {
        if (!person?._id) return;
        if (String(person._id) === String(user?._id)) return;
        const id = String(person._id);
        if (!map.has(id)) map.set(id, person);
      };

      for (const post of posts || []) add(post?.author);

      try {
        const d = await api(`/follows/${user._id}/following`);
        for (const item of (d.following || d.users || [])) add(item?.user || item);
      } catch {}

      try {
        const d = await api(`/follows/${user._id}/followers`);
        for (const item of (d.followers || d.users || [])) add(item?.user || item);
      } catch {}

      if (!cancelled) setPeople(Array.from(map.values()).slice(0, 6));
    }

    loadSuggestions();
    return () => { cancelled = true; };
  }, [posts, user?._id]);

  async function follow(person) {
    const id = String(person._id);
    try {
      await api(`/follows/${person._id}`, { method: "POST" });
      setFollowing(prev => new Set([...prev, id]));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <aside className="suggestions-rail">
      <div className="rail-account">
        <Avatar user={user} size={56} />
        <div className="rail-account-info">
          <UserLink user={user} className="rail-username" />
          <span>{user?.name || "ReelsGo user"}</span>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Switch</button>
      </div>

      <div className="suggestions-title">
        <b>Suggested for you</b>
        <button>See all</button>
      </div>

      <div className="suggestion-list">
        {people.map(person => {
          const isFollowing = following.has(String(person._id));
          return (
            <div className="suggestion-row" key={person._id}>
              <Avatar user={person} size={42} />
              <div className="suggestion-copy">
                <UserLink user={person} />
                <span>Suggested for you</span>
              </div>
              <button className={isFollowing ? "following" : "follow"} onClick={() => !isFollowing && follow(person)}>
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rail-footer">
        About · Help · Press · API · Jobs · Privacy · Terms<br />
        Locations · Language<br /><br />
        © 2026 REELSGO
      </div>

      <button className="floating-messages" onClick={() => window.dispatchEvent(new CustomEvent("vk-open-messages"))}>
        <Send />
        <b>Messages</b>
        <span className="floating-avatars">
          {people.slice(0, 3).map(person => <Avatar key={person._id} user={person} size={25} />)}
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
          {!post.hideLikeCount && <b>{post.likesCount || 0} likes</b>}

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

function ShareSheet({ post, onClose }) {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
          users = (d.conversations || []).map(c => (c.members || []).find(m => String(m?._id) !== String(getUser()?._id))).filter(Boolean);
        } catch {}
      }

      const unique = [];
      const seen = new Set();
      for (const item of users) {
        const person = item?.user || item;
        if (!person?._id) continue;
        const id = String(person._id);
        if (seen.has(id)) continue;
        seen.add(id);
        unique.push(person);
      }
      setPeople(unique);
    } catch (e) {
      console.error(e);
      setPeople([]);
    } finally { setLoading(false); }
  }

  useEffect(() => { loadPeople(); }, []);

  async function sendPost() {
    if (!selected || sending) return;
    setSending(true);
    try {
      const d = await api("/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: [selected._id] })
      });
      const conversation = d.conversation;
      if (!conversation?._id) throw new Error("Unable to create conversation");
      const postLink = `${window.location.origin}/post/${post._id}`;
      await api(`/messages/conversations/${conversation._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Shared a post with you: ${postLink}` })
      });
      alert(`Post sent to @${selected.username}`);
      onClose();
    } catch (e) { alert(e.message); }
    finally { setSending(false); }
  }

  const filtered = people.filter(person => `${person.username || ""} ${person.name || ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="share-sheet-overlay" onClick={onClose}>
      <div className="share-sheet glass-panel" onClick={e => e.stopPropagation()}>
        <div className="share-sheet-handle" />
        <div className="share-sheet-head">
          <div><h2>Share</h2><p>Send this post to someone</p></div>
          <button className="icon-button" type="button" onClick={onClose}><X /></button>
        </div>
        <div className="share-search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people" autoFocus /></div>
        <div className="share-people">
          {loading ? <div className="share-loading">Loading people...</div> : filtered.length ? filtered.map(person => {
            const active = String(selected?._id) === String(person._id);
            return (
              <button key={person._id} type="button" className={`share-person ${active ? "selected" : ""}`} onClick={() => setSelected(person)}>
                <div className="share-person-avatar">
                  <Avatar user={person} size={64} />
                  {active && <span className="share-selected-check"><Check /></span>}
                </div>
                <b>@{person.username}</b>
                <span>{person.name || "ReelsGo user"}</span>
              </button>
            );
          }) : (
            <div className="share-empty"><Users /><b>No people found</b><span>Follow people to quickly share posts with them.</span></div>
          )}
        </div>
        <button className="share-send-button" type="button" disabled={!selected || sending} onClick={sendPost}>
          <Send />
          {sending ? "Sending..." : selected ? `Send to @${selected.username}` : "Select a person"}
        </button>
      </div>
    </div>
  );
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
            <h1>{user?.username}</h1>
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

              <button
                type="button"
                className="edit-profile-avatar-button"
                onClick={() => alert("Avatar selection can be connected to your avatar system later.")}
                aria-label="Choose avatar"
              >
                <CircleUser />
              </button>
            </div>

            <button
              type="button"
              className="edit-profile-photo-link"
              onClick={onAvatarClick}
            >
              Edit picture or avatar
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
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
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

  useEffect(() => {
    if (!reels.length) return;

    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number(visible.target.dataset.index);
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      { root, threshold: [0.35, 0.6, 0.8] }
    );

    cardRefs.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, [reels]);

  function goToReel(index) {
    const next = Math.max(0, Math.min(index, reels.length - 1));
    const card = cardRefs.current[next];

    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      setActiveIndex(next);
    }
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

  return (
    <div className="page reels-page">
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
                >
                  <div className="reel-feed-media">
                    <video
                      src={`${SERVER}${r.mediaUrl}`}
                      muted
                      playsInline
                      controls
                      preload={
                        index === activeIndex ? "auto" : "metadata"
                      }
                      autoPlay={index === activeIndex}
                      loop
                    />

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
    </div>
  );
}

function ReelViewer({ reel, onClose }) {
  return (
    <div className="reel-viewer-overlay" onClick={onClose}>
      <button className="media-viewer-close" type="button" onClick={onClose}><X /></button>
      <div className="reel-viewer-card" onClick={e => e.stopPropagation()}>
        <div className="reel-viewer-user">
          <Avatar user={reel.author} size={42} />
          <div><UserLink user={reel.author} /><span>{reel.caption || "Reel"}</span></div>
        </div>
        <video src={`${SERVER}${reel.mediaUrl}`} controls autoPlay loop playsInline />
      </div>
    </div>
  );
}

function SearchPage({ onOpenProfile }) {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search(v) {
    setQ(v);
    if (!v.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const d = await api(`/users/search?q=${encodeURIComponent(v.trim())}`);
      setUsers(d.users || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Search</h1>
          <p>Find people on ReelsGo</p>
        </div>
      </div>

      <div className="search-box">
        <Search />
        <input
          value={q}
          onChange={e => search(e.target.value)}
          placeholder="Search username or name"
          autoFocus
        />
        {q && (
          <button
            className="icon-button"
            onClick={() => { setQ(""); setUsers([]); }}
            aria-label="Clear search"
          >
            <X />
          </button>
        )}
      </div>

      {loading && <div className="empty small-empty"><p>Searching...</p></div>}

      {!loading && users.length > 0 && (
        <div className="user-list">
          {users.map(u => (
            <button
              className="user-row"
              key={u._id}
              onClick={() => onOpenProfile(u._id)}
              type="button"
            >
              <Avatar user={u} size={48} />
              <div>
                <b>@{u.username}</b>
                <span>{u.name}</span>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      )}

      {!loading && q && !users.length && (
        <div className="empty small-empty">
          <Search />
          <h2>No users found</h2>
          <p>Try the exact username or another name.</p>
        </div>
      )}

      {!q && (
        <div className="empty small-empty">
          <User />
          <h2>Search for people</h2>
          <p>Tap a person from the results to open their profile.</p>
        </div>
      )}
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
            <h1>{u.username}</h1>
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

function ExplorePage() {
  return <div className="page"><div className="page-heading"><div><h1>Explore</h1><p>Discover photos, videos and creators</p></div></div><div className="explore-feature"><Compass /><h2>Explore</h2><p>Recommended content will appear here as your community grows.</p></div></div>;
}

function MessagesPage({ openConversationId = null }) {
  const me = getUser();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [requestActionId, setRequestActionId] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [conversationQuery, setConversationQuery] = useState('');
  const [messageMenuId, setMessageMenuId] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Smileys");
  const emojiPickerRef = useRef(null);

  async function loadConversations(selectId = null) {
    try {
      const d = await api('/messages/conversations');
      const rows = d.conversations || [];
      setConversations(rows);
      if (selectId) {
        const c = rows.find(x => String(x._id) === String(selectId));
        if (c) { setActive(c); setMobileChat(true); }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function loadNotes() {
    try { const d = await api('/notes'); setNotes(d.notes || []); } catch { setNotes([]); }
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
        const [cd, md] = await Promise.all([
          api('/messages/conversations'),
          api(`/messages/conversations/${openConversationId}/messages`)
        ]);
        const rows = cd.conversations || [];
        setConversations(rows);
        const c = rows.find(x => String(x._id) === String(openConversationId));
        if (c) {
          setActive({ ...c, unreadCount: 0 });
          setMobileChat(true);
        }
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
  }, [openConversationId]);

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
  });

  return (
    <div className={`page messages-page ${mobileChat && active ? "is-mobile-chat" : ""}`}>
      <div className="messages-instagram-head">
        <div className="messages-account-title">
          <b>{me?.username || me?.name || 'Messages'}</b>
          <ChevronRight className="messages-account-chevron" />
        </div>
        <button className="messages-compose-button" type="button" aria-label="New message">
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
          <button className="message-note-card my-note" type="button">
            <div className="message-note-avatar-wrap"><Avatar user={me} size={58} />{!myNote && <span className="note-add">+</span>}</div>
            <b>Your note</b><span>{myNote?.text || 'Share a note'}</span>
          </button>
          {otherNotes.map(note => {
            const c = conversations.find(x => x.members?.some(m => String(m._id) === String(note.author?._id)));
            return <button className="message-note-card" key={note._id} type="button" onClick={() => c && openConversation(c)}>
              <div className="message-note-bubble">{note.text}</div><div className="message-note-avatar"><Avatar user={note.author} size={58} /></div>
              <UserLink user={note.author} /><span>{note.music || 'Note'}</span>
            </button>;
          })}
          {!otherNotes.length && <div className="notes-empty">Follow people and their notes will appear here.</div>}
        </div>
      </div>

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
              return <button className={`conversation-item ${selected ? 'active' : ''} ${unread ? 'unread' : ''}`} key={c._id} onClick={() => openConversation(c)}>
                <div className="conversation-avatar-wrap">
                  <Avatar user={u} size={58} />
                  {unread && <span className="conversation-unread-dot" aria-label="Unread message" />}
                </div>
                <div className="conversation-copy">
                  <UserLink user={u} className={`conversation-username ${unread ? 'is-unread' : ''}`} />
                  <span className={`conversation-preview ${unread ? 'is-unread' : ''}`}>{c.lastMessage?.text || 'Start a conversation'}</span>
                  {c.lastMessage?.createdAt && <small>{time(c.lastMessage.createdAt)}</small>}
                </div>
              </button>;
            })}
          </div> : <div className="chat-empty-list"><MessageCircle /><b>Start a conversation</b><span>Send a message to someone you follow.</span><small>Open a profile and tap Message.</small></div>}
        </div>

        <div className="chat instagram-chat">
          {!active ? <div className="instagram-chat-placeholder"><div className="message-placeholder-icon"><Send /></div><h2>Your messages</h2><p>Send private messages to your friends.</p><span>Select a conversation to start chatting.</span></div> : <>
            <div className="chat-head instagram-chat-head">
              <button type="button" className="chat-back-button" onClick={() => { setActive(null); setMobileChat(false); }}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
              <Avatar user={other(active)} size={44} /><div><UserLink user={other(active)} /><span>Active now</span></div>
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
                      <span>{m.text}</span>
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
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with activity on your account</p>
        </div>
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
              <button type="button" className="notification notification-card" key={n._id} onClick={() => {
                const actorId = n?.actor?._id || n?.actorId;
                if (actorId) window.dispatchEvent(new CustomEvent("vk-open-profile", { detail: { id: actorId } }));
              }}>
                <Avatar user={n.actor} size={48} />
                <span className="notification-copy">
                  <span><UserLink user={n.actor} /> {n.text || n.message || "New activity on your account"}</span>
                  <small>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</small>
                </span>
                <ChevronRight className="notification-arrow" />
              </button>
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api("/posts/saved").then(d => setPosts(d.posts || [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);
  const body = loading
    ? <div className="empty"><Bookmark /><p>Loading saved posts...</p></div>
    : posts.length
      ? <div className="profile-grid">{posts.slice(0, 30).map(p => (
        <GridMedia
          key={p._id}
          post={p}
          user={user}
          onDeleted={(id) => setPosts(current => current.filter(item => String(item._id) !== String(id)))}
        />
      ))}</div>
      : <EmptyTab icon={<Bookmark />} title="Saved posts" text="Posts you save will appear here." />;
  if (embedded) return <div className="embedded-saved">{body}</div>;
  return <div className="page"><div className="page-heading"><div><h1>Saved</h1><p>Your saved collection</p></div></div>{body}</div>;
}

const settingsSections = [
  { id: "account", title: "Your account", icon: User, items: ["Edit profile", "Personal information", "Password", "Account privacy", "Deactivate or delete account"] },
  { id: "privacy", title: "Privacy", icon: Lock, items: ["Account privacy", "Hidden words", "Tags and mentions", "Comments", "Sharing", "Restricted accounts", "Blocked accounts", "Muted accounts"] },
  { id: "security", title: "Security", icon: Shield, items: ["Password", "Two-factor authentication", "Login activity", "Saved login information", "Emails from ReelsGo"] },
  { id: "notifications", title: "Notifications", icon: Bell, items: ["Push notifications", "Posts, stories and comments", "Following and followers", "Messages", "Calls", "Live and Reels"] },
  { id: "messages", title: "Messages and replies", icon: MessageSquareText, items: ["Message requests", "Messages", "Story replies", "Read receipts", "Typing indicator", "Group messages"] },
  { id: "content", title: "What you see", icon: Compass, items: ["Content preferences", "Sensitive content", "Suggested content", "Favorites", "Muted accounts"] },
  { id: "media", title: "Media quality", icon: ImageIcon, items: ["Data usage", "Upload at highest quality", "Autoplay videos", "Accessibility"] },
  { id: "accessibility", title: "Accessibility", icon: Smartphone, items: ["Reduce motion", "Captions", "Text size", "Sound"] },
  { id: "language", title: "Language", icon: Languages, items: ["App language", "Translations"] },
  { id: "help", title: "Help", icon: CircleHelp, items: ["Help center", "Report a problem", "Privacy and safety", "Terms"] }
];

function SettingsModal({ user, setUser, onClose, onLogout }) {
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
              <AccountSettings user={user} onSelect={setSelectedItem} />
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
            {section === "security" && (
              <SecuritySettings onSelect={setSelectedItem} />
            )}
            {section === "notifications" && (
              <ToggleSettings
                title="Notifications"
                items={[
                  "Likes",
                  "Comments",
                  "Followers and follow requests",
                  "Messages",
                  "Story replies",
                  "Reels interactions",
                  "Live notifications",
                  "Email notifications"
                ]}
              />
            )}
            {section === "messages" && (
              <ToggleSettings
                title="Messages and replies"
                items={[
                  "Message requests",
                  "Read receipts",
                  "Typing indicator",
                  "Group message requests",
                  "Story replies",
                  "Allow sharing"
                ]}
              />
            )}
            {section === "content" && (
              <ToggleSettings
                title="What you see"
                items={[
                  "Sensitive content",
                  "Autoplay videos",
                  "Suggested posts",
                  "Show political content",
                  "Use less mobile data",
                  "Favorites"
                ]}
              />
            )}
            {section === "media" && (
              <ToggleSettings
                title="Media quality"
                items={[
                  "Upload at highest quality",
                  "Use less mobile data",
                  "Autoplay videos",
                  "Save original photos",
                  "Save original videos"
                ]}
              />
            )}
            {section === "accessibility" && (
              <ToggleSettings
                title="Accessibility"
                items={[
                  "Reduce motion",
                  "Captions",
                  "Text-to-speech",
                  "Sound effects",
                  "Large text"
                ]}
              />
            )}
            {section === "language" && (
              <ToggleSettings
                title="Language"
                items={[
                  "English",
                  "Automatic translations",
                  "Translate captions",
                  "Translate comments"
                ]}
              />
            )}
            {section === "help" && <HelpSettings onSelect={setSelectedItem} />}

            {selectedItem && (
              <div className="setting-detail">
                <button
                  type="button"
                  className="setting-detail-back"
                  onClick={() => setSelectedItem("")}
                >
                  <ChevronRight style={{ transform: "rotate(180deg)" }} />
                  Back to {activeSection?.title}
                </button>
                <b>{selectedItem}</b>
                <p>
                  This option is currently represented in the ReelsGo
                  interface. Account changes are saved only where a backend
                  endpoint is connected.
                </p>
              </div>
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
                <AccountSettings user={user} onSelect={setSelectedItem} />
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
              {section === "security" && (
                <SecuritySettings onSelect={setSelectedItem} />
              )}
              {section === "notifications" && (
                <ToggleSettings
                  title="Notifications"
                  items={[
                    "Likes",
                    "Comments",
                    "Followers and follow requests",
                    "Messages",
                    "Story replies",
                    "Reels interactions",
                    "Live notifications",
                    "Email notifications"
                  ]}
                />
              )}
              {section === "messages" && (
                <ToggleSettings
                  title="Messages and replies"
                  items={[
                    "Message requests",
                    "Read receipts",
                    "Typing indicator",
                    "Group message requests",
                    "Story replies",
                    "Allow sharing"
                  ]}
                />
              )}
              {section === "content" && (
                <ToggleSettings
                  title="What you see"
                  items={[
                    "Sensitive content",
                    "Autoplay videos",
                    "Suggested posts",
                    "Show political content",
                    "Use less mobile data",
                    "Favorites"
                  ]}
                />
              )}
              {section === "media" && (
                <ToggleSettings
                  title="Media quality"
                  items={[
                    "Upload at highest quality",
                    "Use less mobile data",
                    "Autoplay videos",
                    "Save original photos",
                    "Save original videos"
                  ]}
                />
              )}
              {section === "accessibility" && (
                <ToggleSettings
                  title="Accessibility"
                  items={[
                    "Reduce motion",
                    "Captions",
                    "Text-to-speech",
                    "Sound effects",
                    "Large text"
                  ]}
                />
              )}
              {section === "language" && (
                <ToggleSettings
                  title="Language"
                  items={[
                    "English",
                    "Automatic translations",
                    "Translate captions",
                    "Translate comments"
                  ]}
                />
              )}
              {section === "help" && <HelpSettings onSelect={setSelectedItem} />}

              {selectedItem && (
                <div className="setting-detail">
                  <button
                    type="button"
                    className="setting-detail-back"
                    onClick={() => setSelectedItem("")}
                  >
                    <ChevronRight style={{ transform: "rotate(180deg)" }} />
                    Back to {activeSection?.title}
                  </button>
                  <b>{selectedItem}</b>
                  <p>
                    This option is currently represented in the ReelsGo
                    interface. Account changes are saved only where a backend
                    endpoint is connected.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountSettings({ user, onSelect }) {
  return <div className="settings-panel">
    <div className="settings-profile-row"><Avatar user={user} size={72} /><div><b>{user?.username}</b><span>{user?.email}</span></div><button className="secondary" onClick={() => onSelect("Edit profile")}>Edit profile</button></div>
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

function ToggleSettings({ title, items }) {
  const [values, setValues] = useState(() => Object.fromEntries(items.map(x => [x, localStorage.getItem(`vk_setting_${x}`) !== "false"])));
  function flip(item) {
    setValues(v => { const next = !v[item]; localStorage.setItem(`vk_setting_${item}`, String(next)); return { ...v, [item]: next }; });
  }
  return <div className="settings-panel"><h2 className="panel-heading">{title}</h2>{items.map(item =>
    <div className="setting-switch" key={item}>
      <span><b>{item}</b><small>Manage this preference for your account.</small></span>
      <Toggle checked={!!values[item]} onChange={() => flip(item)} />
    </div>
  )}</div>;
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
