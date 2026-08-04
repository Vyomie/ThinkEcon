"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = { slug: string; title: string; summary: string };
export function PublishedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&select=slug,title,summary&order=created_at.desc`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "" } }).then((response) => response.ok ? response.json() : []).then(setPosts); }, []);
  return <>{posts.map((post, index) => <Link href={`/blog/${post.slug}`} key={post.slug}><span>+</span><div><h2>{post.title}</h2><small>{post.summary}</small></div></Link>)}</>;
}
