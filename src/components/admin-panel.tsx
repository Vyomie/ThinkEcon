"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  AlertCircle, CalendarDays, CheckCircle2, Eye, FileText, LayoutDashboard,
  LoaderCircle, MessageCircle, MessagesSquare, Mic2, Newspaper, Pencil,
  Plus, Search, Trash2, UploadCloud, X,
} from "lucide-react";
import { ArticleContent } from "@/components/article-content";

type Kind = "comment" | "feedback" | "blog" | "podcast" | "event" | "discussion" | "reply";
type Tab = "overview" | "feedback" | "blogs" | "podcasts" | "events" | "discussions" | "comments";
type Item = { kind: Kind; id: string; author_name: string; body: string; context: string; created_at: string };
type Editing = Record<string, string> & { kind: Kind; id: string };

const admins = new Set(["thinkecon@gmail.com", "vyom1907patel@gmail.com"]);
const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "blogs", label: "Journal", icon: Newspaper },
  { id: "podcasts", label: "Podcasts", icon: Mic2 },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "discussions", label: "Discussion", icon: MessagesSquare },
  { id: "comments", label: "Comments", icon: MessageCircle },
  { id: "feedback", label: "Feedback", icon: FileText },
];
const tabKinds: Partial<Record<Tab, Kind>> = { feedback: "feedback", blogs: "blog", podcasts: "podcast", events: "event", comments: "comment" };
const emptyBlog = { title: "", summary: "", body: "" };
const emptyPodcast = { title: "", description: "", videoUrl: "" };
const emptyEvent = { title: "", description: "", body: "", eventDate: "", location: "", imageUrl: "", applicationUrl: "", meetingUrl: "" };

export function AdminPanel({ enabled }: { enabled: boolean }) {
  if (!enabled) return <AdminGate title="Administration is not configured" body="Add Clerk environment variables to enable the editorial workspace." />;
  return <SignedInAdmin />;
}

function AdminGate({ title, body, signIn = false }: { title: string; body: string; signIn?: boolean }) {
  return <main className="admin-gate"><div><span>ThinkEconomics</span><h1>{title}</h1><p>{body}</p>{signIn ? <SignInButton mode="modal"><button className="admin-primary">Sign in to continue</button></SignInButton> : null}</div></main>;
}

function SignedInAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [blog, setBlog] = useState(emptyBlog);
  const [podcast, setPodcast] = useState(emptyPodcast);
  const [event, setEvent] = useState(emptyEvent);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [preview, setPreview] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  const isAdmin = admins.has(email);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin");
    if (response.ok) {
      const data: Array<Omit<Item, "kind"> & { kind: string }> = await response.json();
      setItems(data.filter((item) => item.kind !== "announcement") as Item[]);
    }
    else setError("The editorial queue could not be loaded.");
    setLoading(false);
  }, []);

  useEffect(() => { if (isSignedIn && isAdmin) void load(); }, [isAdmin, isSignedIn, load]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 3500); return () => window.clearTimeout(timer); }, [notice]);

  const counts = useMemo(() => ({
    blog: items.filter((item) => item.kind === "blog").length,
    event: items.filter((item) => item.kind === "event").length,
    discussion: items.filter((item) => item.kind === "discussion" || item.kind === "reply").length,
    conversation: items.filter((item) => ["discussion", "reply", "comment"].includes(item.kind)).length,
    inbox: items.filter((item) => item.kind === "feedback").length,
  }), [items]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTab = tab === "overview" ? true : tab === "discussions" ? item.kind === "discussion" || item.kind === "reply" : item.kind === tabKinds[tab];
      const matchesQuery = !term || `${item.author_name} ${item.body} ${item.context}`.toLowerCase().includes(term);
      return matchesTab && matchesQuery;
    });
  }, [items, query, tab]);

  async function create(type: "blog" | "podcast" | "event", payload: Record<string, string>) {
    setWorking(true); setError("");
    const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, ...payload }) });
    if (!response.ok) setError(`The ${type} could not be published.`);
    else {
      if (type === "blog") { setBlog(emptyBlog); setPreview(false); }
      if (type === "podcast") setPodcast(emptyPodcast);
      if (type === "event") setEvent(emptyEvent);
      setNotice(`${type[0].toUpperCase()}${type.slice(1)} published.`);
      await load();
    }
    setWorking(false);
  }

  async function importDocument(file?: File) {
    if (!file) return;
    setWorking(true); setError("");
    const data = new FormData(); data.append("file", file);
    const response = await fetch("/api/admin/parse-document", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok) setError(result.error || "The document could not be imported.");
    else {
      const fallbackTitle = result.fileName.replace(/\.(md|markdown|pdf)$/i, "").replace(/[-_]+/g, " ");
      setBlog((current) => ({ ...current, title: current.title || fallbackTitle, body: result.body }));
      setNotice(result.pages ? `Converted ${result.pages} PDF pages into a web article.` : "Markdown imported into the editor.");
    }
    if (fileInput.current) fileInput.current.value = "";
    setWorking(false);
  }

  async function startEdit(item: Item) {
    setWorking(true); setError("");
    const response = await fetch(`/api/admin?kind=${item.kind}&id=${item.id}`);
    if (!response.ok) setError("This item could not be opened for editing.");
    else {
      const data = await response.json();
      const fields = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));
      setEditing({ ...fields, kind: item.kind, id: item.id } as Editing);
    }
    setWorking(false);
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault(); if (!editing) return;
    setWorking(true); setError("");
    const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (!response.ok) setError("Changes could not be saved.");
    else { setEditing(null); setNotice("Changes saved."); await load(); }
    setWorking(false);
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete this ${item.kind}? This cannot be undone.`)) return;
    setWorking(true); setError("");
    const response = await fetch("/api/admin", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: item.kind, id: item.id }) });
    if (!response.ok) setError("The item could not be deleted.");
    else { setItems((current) => current.filter((entry) => entry.id !== item.id)); setNotice("Item deleted."); }
    setWorking(false);
  }

  if (!isLoaded) return <AdminGate title="Opening the workspace" body="Checking your account…" />;
  if (!isSignedIn) return <AdminGate title="Editorial workspace" body="Sign in with an approved ThinkEconomics account to continue." signIn />;
  if (!isAdmin) return <AdminGate title="Access not granted" body="This account is signed in, but it is not on the administration list." />;

  return (
    <main className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>TE</span><div><strong>ThinkEconomics</strong><small>Editorial desk</small></div></div>
        <nav aria-label="Admin sections">{tabs.map(({ id, label, icon: Icon }) => <button className={tab === id ? "is-active" : ""} onClick={() => { setTab(id); setQuery(""); }} key={id}><Icon size={18} />{label}<span>{id === "overview" ? items.length : id === "discussions" ? counts.discussion : items.filter((item) => item.kind === tabKinds[id]).length}</span></button>)}</nav>
        <div className="admin-account"><span>{user.fullName?.slice(0, 1) || "A"}</span><div><strong>{user.fullName || "Administrator"}</strong><small>{email}</small></div></div>
      </aside>

      <section className="admin-main">
        <header className="admin-header"><div><p>Editorial workspace</p><h1>{tabs.find((item) => item.id === tab)?.label}</h1></div><div className="admin-health"><span /><div><strong>All systems ready</strong><small>{items.length} records synced</small></div></div></header>
        {error ? <div className="admin-alert" role="alert"><AlertCircle size={19} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={17} /></button></div> : null}
        {notice ? <div className="admin-toast" role="status"><CheckCircle2 size={18} />{notice}</div> : null}

        {tab === "overview" ? <Overview counts={counts} recent={items.slice(0, 5)} onNavigate={setTab} /> : null}
        {tab === "blogs" ? <BlogComposer value={blog} setValue={setBlog} working={working} preview={preview} setPreview={setPreview} fileInput={fileInput} onImport={importDocument} onSubmit={() => create("blog", blog)} /> : null}
        {tab === "podcasts" ? <PodcastComposer value={podcast} setValue={setPodcast} working={working} onSubmit={() => create("podcast", podcast)} /> : null}
        {tab === "events" ? <EventComposer value={event} setValue={setEvent} working={working} onSubmit={() => create("event", event)} /> : null}

        {tab !== "overview" ? <section className="admin-library">
          <div className="admin-library-head"><div><p>Content library</p><h2>{tabs.find((item) => item.id === tab)?.label}</h2></div><label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this section" /></label></div>
          <ContentQueue items={visible} loading={loading} working={working} onEdit={startEdit} onRemove={remove} />
        </section> : null}
      </section>

      {editing ? <EditDialog editing={editing} setEditing={setEditing} working={working} onSubmit={saveEdit} onClose={() => setEditing(null)} /> : null}
      {working ? <div className="admin-working" aria-label="Working"><LoaderCircle size={25} /></div> : null}
    </main>
  );
}

function Overview({ counts, recent, onNavigate }: { counts: { blog: number; event: number; discussion: number; conversation: number; inbox: number }; recent: Item[]; onNavigate: (tab: Tab) => void }) {
  const cards = [
    ["Journal entries", counts.blog, "blogs", Newspaper], ["Upcoming events", counts.event, "events", CalendarDays],
    ["Conversations", counts.conversation, "discussions", MessagesSquare], ["Feedback inbox", counts.inbox, "feedback", FileText],
  ] as const;
  return <><section className="admin-metrics">{cards.map(([label, count, target, Icon]) => <button onClick={() => onNavigate(target)} key={label}><span><Icon size={19} /></span><strong>{count}</strong><p>{label}</p></button>)}</section><section className="admin-overview-grid"><article className="admin-quick"><p className="admin-section-label">Quick publish</p><h2>What are we sharing next?</h2><div><button onClick={() => onNavigate("blogs")}><Newspaper size={20} />New journal entry<Plus size={18} /></button><button onClick={() => onNavigate("events")}><CalendarDays size={20} />New event<Plus size={18} /></button><button onClick={() => onNavigate("podcasts")}><Mic2 size={20} />New podcast<Plus size={18} /></button></div></article><article className="admin-recent"><p className="admin-section-label">Recently updated</p><h2>Latest activity</h2>{recent.length ? recent.map((item) => <div key={item.id}><span>{item.kind.slice(0, 1).toUpperCase()}</span><div><strong>{item.context || item.author_name}</strong><small>{item.kind} · {new Date(item.created_at).toLocaleDateString()}</small></div></div>) : <p>No activity yet.</p>}</article></section></>;
}

function BlogComposer({ value, setValue, working, preview, setPreview, fileInput, onImport, onSubmit }: { value: typeof emptyBlog; setValue: (value: typeof emptyBlog | ((value: typeof emptyBlog) => typeof emptyBlog)) => void; working: boolean; preview: boolean; setPreview: (value: boolean) => void; fileInput: React.RefObject<HTMLInputElement | null>; onImport: (file?: File) => void; onSubmit: () => void }) {
  return <section className="admin-composer"><div className="admin-composer-head"><div><p className="admin-section-label">Create</p><h2>New journal entry</h2><span>Write in Markdown or turn a PDF into a native web article.</span></div><button type="button" className="admin-secondary" onClick={() => setPreview(!preview)}><Eye size={18} />{preview ? "Edit" : "Preview"}</button></div>{preview ? <div className="admin-preview"><h1>{value.title || "Untitled article"}</h1><p>{value.summary || "Add a short summary to frame the article."}</p><ArticleContent body={value.body || "Your article preview will appear here."} /></div> : <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><div className="admin-form-grid"><label className="admin-field admin-field-wide"><span>Title</span><input required value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} placeholder="A clear, compelling title" /></label><label className="admin-field admin-field-wide"><span>Summary</span><textarea required value={value.summary} onChange={(event) => setValue({ ...value, summary: event.target.value })} placeholder="The argument in one or two sentences" rows={3} /></label><label className="admin-field admin-field-wide"><span>Article body · Markdown</span><textarea className="admin-editor" required value={value.body} onChange={(event) => setValue({ ...value, body: event.target.value })} placeholder={'## Start with a section\n\nWrite the article here…'} /></label></div><div className="admin-import"><input ref={fileInput} hidden type="file" accept=".md,.markdown,.pdf,text/markdown,application/pdf" onChange={(event) => void onImport(event.target.files?.[0])} /><button type="button" onClick={() => fileInput.current?.click()} disabled={working}><UploadCloud size={20} /><span><strong>Import Markdown or PDF</strong><small>PDF text becomes responsive article content · 12 MB max</small></span></button><button className="admin-primary" disabled={working || !value.title || !value.summary || !value.body}><Plus size={18} />Publish entry</button></div></form>}</section>;
}

function PodcastComposer({ value, setValue, working, onSubmit }: { value: typeof emptyPodcast; setValue: (value: typeof emptyPodcast) => void; working: boolean; onSubmit: () => void }) {
  return <SimpleComposer title="New podcast" note="Publish a YouTube episode to the podcast library." onSubmit={onSubmit} working={working}><label className="admin-field"><span>Episode title</span><input required value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })} /></label><label className="admin-field"><span>YouTube URL</span><input required type="url" value={value.videoUrl} onChange={(e) => setValue({ ...value, videoUrl: e.target.value })} /></label><label className="admin-field admin-field-wide"><span>Description</span><textarea required rows={4} value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></label></SimpleComposer>;
}

function EventComposer({ value, setValue, working, onSubmit }: { value: typeof emptyEvent; setValue: (value: typeof emptyEvent) => void; working: boolean; onSubmit: () => void }) {
  return <SimpleComposer title="New event" note="Create an event page with practical details and links." onSubmit={onSubmit} working={working}><label className="admin-field"><span>Event title</span><input required value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })} /></label><label className="admin-field"><span>Date</span><input type="date" value={value.eventDate} onChange={(e) => setValue({ ...value, eventDate: e.target.value })} /></label><label className="admin-field admin-field-wide"><span>Short description</span><input required value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></label><label className="admin-field admin-field-wide"><span>Full details · Markdown</span><textarea rows={6} value={value.body} onChange={(e) => setValue({ ...value, body: e.target.value })} /></label><label className="admin-field"><span>Location</span><input value={value.location} onChange={(e) => setValue({ ...value, location: e.target.value })} /></label><label className="admin-field"><span>Image URL</span><input type="url" value={value.imageUrl} onChange={(e) => setValue({ ...value, imageUrl: e.target.value })} /></label><label className="admin-field"><span>Application URL</span><input type="url" value={value.applicationUrl} onChange={(e) => setValue({ ...value, applicationUrl: e.target.value })} /></label><label className="admin-field"><span>Meeting URL</span><input type="url" value={value.meetingUrl} onChange={(e) => setValue({ ...value, meetingUrl: e.target.value })} /></label></SimpleComposer>;
}

function SimpleComposer({ title, note, onSubmit, working, children }: { title: string; note: string; onSubmit: () => void; working: boolean; children: React.ReactNode }) {
  return <section className="admin-composer"><div className="admin-composer-head"><div><p className="admin-section-label">Create</p><h2>{title}</h2><span>{note}</span></div></div><form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><div className="admin-form-grid">{children}</div><div className="admin-form-actions"><button className="admin-primary" disabled={working}><Plus size={18} />Publish</button></div></form></section>;
}

function ContentQueue({ items, loading, working, onEdit, onRemove }: { items: Item[]; loading: boolean; working: boolean; onEdit: (item: Item) => void; onRemove: (item: Item) => void }) {
  if (loading) return <div className="admin-empty"><LoaderCircle className="spin" size={27} /><h3>Loading content</h3></div>;
  if (!items.length) return <div className="admin-empty"><FileText size={28} /><h3>Nothing here yet</h3><p>Published content and community activity will appear in this list.</p></div>;
  return <div className="admin-content-list">{items.map((item) => <article key={item.id}><div className="admin-kind">{item.kind.slice(0, 2).toUpperCase()}</div><div className="admin-item-copy"><small>{item.kind} · {new Date(item.created_at).toLocaleDateString()}</small><h3>{item.context || item.author_name}</h3><p>{item.body}</p></div><div className="admin-item-actions"><button disabled={working} onClick={() => void onEdit(item)} aria-label={`Edit ${item.context}`}><Pencil size={17} /></button><button disabled={working} className="is-danger" onClick={() => void onRemove(item)} aria-label={`Delete ${item.context}`}><Trash2 size={17} /></button></div></article>)}</div>;
}

function EditDialog({ editing, setEditing, working, onSubmit, onClose }: { editing: Editing; setEditing: (value: Editing) => void; working: boolean; onSubmit: (event: FormEvent) => void; onClose: () => void }) {
  const update = (key: string, value: string) => setEditing({ ...editing, [key]: value });
  return <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="admin-dialog" onSubmit={onSubmit}><header><div><p className="admin-section-label">Editing {editing.kind}</p><h2>{editing.title || editing.context || "Content item"}</h2></div><button type="button" onClick={onClose} aria-label="Close editor"><X size={21} /></button></header><div className="admin-dialog-fields">{!["comment", "feedback", "reply"].includes(editing.kind) ? <label className="admin-field"><span>Title</span><input required value={editing.title || ""} onChange={(e) => update("title", e.target.value)} /></label> : null}{editing.summary !== undefined ? <label className="admin-field"><span>Summary</span><textarea required rows={3} value={editing.summary} onChange={(e) => update("summary", e.target.value)} /></label> : null}{editing.description !== undefined ? <label className="admin-field"><span>Description</span><textarea required rows={3} value={editing.description} onChange={(e) => update("description", e.target.value)} /></label> : null}<label className="admin-field"><span>Content</span><textarea className="admin-editor" required value={editing.body || ""} onChange={(e) => update("body", e.target.value)} /></label>{editing.videoUrl !== undefined ? <label className="admin-field"><span>Video URL</span><input type="url" required value={editing.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} /></label> : null}{editing.kind === "event" ? <><label className="admin-field"><span>Date</span><input type="date" value={editing.eventDate || ""} onChange={(e) => update("eventDate", e.target.value)} /></label><label className="admin-field"><span>Location</span><input value={editing.location || ""} onChange={(e) => update("location", e.target.value)} /></label><label className="admin-field"><span>Image URL</span><input value={editing.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} /></label></> : null}</div><footer><button type="button" className="admin-secondary" onClick={onClose}>Cancel</button><button className="admin-primary" disabled={working}><CheckCircle2 size={18} />Save changes</button></footer></form></div>;
}
