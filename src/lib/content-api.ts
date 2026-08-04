export type Announcement = { slug: string; title: string; summary: string; body: string; cover: string | null };
export type EventItem = { slug: string; title: string; description: string; body: string | null; event_date: string | null; location: string | null; image_url: string | null; application_url: string | null; meeting_url: string | null };
export type PodcastItem = { title: string; description: string; video_url: string; thumbnail_url: string | null };
export type DiscussionThread = { id: string; title: string; body: string; author_name: string; created_at: string };
export type DiscussionReply = { id: string; thread_id: string; body: string; author_name: string; created_at: string };

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
async function query<T>(path: string): Promise<T[]> { if (!base || !key) return []; const response = await fetch(`${base}/rest/v1/${path}`, { headers: { apikey: key }, cache: "no-store" }); return response.ok ? response.json() : []; }

export const getAnnouncements = () => query<Announcement>("announcements?published=eq.true&select=slug,title,summary,body,cover&order=created_at.desc");
export async function getAnnouncement(slug: string) { return (await getAnnouncements()).find((item) => item.slug === slug) || null; }
export const getEvents = () => query<EventItem>("events?published=eq.true&select=slug,title,description,body,event_date,location,image_url,application_url,meeting_url&order=event_date.asc.nullslast,created_at.desc");
export async function getEvent(slug: string) { return (await getEvents()).find((item) => item.slug === slug) || null; }
export const getPodcasts = () => query<PodcastItem>("podcasts?published=eq.true&select=title,description,video_url,thumbnail_url&order=created_at.desc");
export const getDiscussionThreads = () => query<DiscussionThread>("discussion_threads?select=id,title,body,author_name,created_at&order=created_at.desc");
export const getDiscussionReplies = (threadId: string) => query<DiscussionReply>(`discussion_replies?thread_id=eq.${threadId}&select=id,thread_id,body,author_name,created_at&order=created_at.asc`);
export function mediaUrl(value: string | null | undefined, fallback: string) { if (!value) return `https://images.unsplash.com/${fallback}?auto=format&fit=crop&w=1400&q=85`; return value.startsWith("http") ? value : `https://images.unsplash.com/${value}?auto=format&fit=crop&w=1400&q=85`; }
