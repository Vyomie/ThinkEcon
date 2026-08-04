import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { getAnnouncement } from "@/lib/content-api";
import { discussionMediaUrl } from "@/lib/discussion-media";

export const dynamic = "force-dynamic";
export default async function AnnouncementDetail({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getAnnouncement((await params).slug);
  if (!item) notFound();
  return <main className="article-page"><article><h1>{item.title}</h1><p className="article-summary">{item.summary}</p><div className="article-cover" style={{ backgroundImage: `url(${discussionMediaUrl(item.cover, "photo-1491309055486-24ae51108062")})` }}/><ArticleContent body={item.body}/></article></main>;
}
