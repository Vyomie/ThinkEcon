import Link from "next/link";
import { getAnnouncements } from "@/lib/content-api";
import { discussionMediaUrl } from "@/lib/discussion-media";

export const dynamic = "force-dynamic";
export default async function Announcements() {
  const announcements = await getAnnouncements();
  return <main className="inner-page"><section className="page-hero"><h1>Announcements.</h1></section><section className="announcement-grid">{announcements.map((item) => <Link href={`/announcements/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${discussionMediaUrl(item.cover, "photo-1491309055486-24ae51108062")})` }}/><h2>{item.title}</h2><p>{item.summary}</p></Link>)}{!announcements.length && <p>No announcements yet.</p>}</section></main>;
}
