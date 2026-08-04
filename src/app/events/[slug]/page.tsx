import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { getEvent, mediaUrl } from "@/lib/content-api";

export const dynamic = "force-dynamic";
export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();
  return <main className="article-page event-detail"><article><h1>{event.title}</h1>{event.event_date && <p className="event-date">{new Date(`${event.event_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}{event.location ? ` · ${event.location}` : ""}</p>}<div className="article-cover" style={{ backgroundImage: `url(${mediaUrl(event.image_url, "photo-1522202176988-66273c2fd55f")})` }}/><ArticleContent body={event.body || event.description}/>{(event.application_url || event.meeting_url) && <div className="event-links">{event.application_url && <a href={event.application_url}>Apply</a>}{event.meeting_url && <a href={event.meeting_url}>Meeting link</a>}</div>}</article></main>;
}
