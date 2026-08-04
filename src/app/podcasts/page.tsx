"use client";

import { useEffect, useState } from "react";

type Podcast = { id: string; title: string; description: string; video_url: string; thumbnail_url: string | null };
function embed(url: string) { const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/); return match ? `https://www.youtube.com/embed/${match[1]}` : url; }

export default function Podcasts() {
  const [episodes, setEpisodes] = useState<Podcast[]>([]);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/podcasts?published=eq.true&select=*&order=created_at.desc`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "" } }).then((response) => response.ok ? response.json() : []).then(setEpisodes); }, []);
  return <main className="podcasts-page"><h1>Podcasts.</h1><div className="podcast-grid">{episodes.map((episode) => <article key={episode.id}><iframe src={embed(episode.video_url)} title={episode.title} allowFullScreen/><h2>{episode.title}</h2><p>{episode.description}</p></article>)}{!episodes.length && <p>New episodes will appear here.</p>}</div></main>;
}
