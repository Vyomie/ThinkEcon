import Link from "next/link";
import { getPosts } from "@/lib/blogs";

export default async function Blog() {
  const posts = await getPosts();
  return <main className="inner-page"><section className="page-hero"><h1>Ideas worth staying with.</h1></section><section className="article-list journal-list">{posts.map((post) => <Link href={`/blog/${post.slug}`} key={post.slug}><div className="journal-thumb" style={{ backgroundImage: `url(https://images.unsplash.com/${post.cover || "photo-1456324504439-367cee3b3c32"}?auto=format&fit=crop&w=900&q=85)` }}/><div><h2>{post.title}</h2><small>{post.summary}</small></div></Link>)}</section></main>;
}
