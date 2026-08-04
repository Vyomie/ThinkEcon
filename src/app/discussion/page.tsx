import Link from "next/link";
import { getAnnouncement } from "@/lib/content-api";
import { discussionMediaUrl } from "@/lib/discussion-media";

export const dynamic = "force-dynamic";
export default async function Discussion() { const debate = await getAnnouncement("debate-competition-results"); return <main className="podcasts-page discussion-page"><h1>Discussion.</h1>{debate ? <section className="discussion-feature"><Link href={`/announcements/${debate.slug}`}><div style={{ backgroundImage: `url(${discussionMediaUrl(debate.cover, "photo-1528605248644-14dd04022da1")})` }}/><h2>{debate.title}</h2><p>{debate.summary}</p></Link></section> : <p>Discussion updates will appear here.</p>}</main>; }
