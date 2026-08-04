import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { ArticleContent } from "@/components/article-content";
import { getPost } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <main className="article-page"><article><h1>{post.title}</h1><p className="article-summary">{post.summary}</p><div className="article-cover" style={{ backgroundImage: `url(https://images.unsplash.com/${post.cover || "photo-1456324504439-367cee3b3c32"}?auto=format&fit=crop&w=1800&q=85)` }}/><ArticleContent body={post.body}/></article><CommentSection postSlug={post.slug} enabled={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)}/></main>;
}
