import Link from "next/link";
import { getEvents, mediaUrl } from "@/lib/content-api";

export default async function Events() {
  const events = await getEvents();
  return <main className="events-page"><h1>Events.</h1><div className="events-list">{events.map((event) => <Link href={`/events/${event.slug}`} className="event-card" key={event.slug}><div className="event-image" style={{ backgroundImage: `url(${mediaUrl(event.image_url, "photo-1522202176988-66273c2fd55f")})` }}/><h2>{event.title}</h2></Link>)}{!events.length && <p>No events have been announced.</p>}</div></main>;
}
