"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

type Comment = { id: string; author_name: string; body: string };
const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const admins = new Set(["thinkecon@gmail.com", "vyom1907patel@gmail.com"]);

export function CommentSection({ enabled, postSlug }: { enabled: boolean; postSlug: string }) {
  if (!enabled || !base || !key) return <section className="comments"><h2>Join the discussion.</h2></section>;
  return <AuthenticatedComments postSlug={postSlug} />;
}

function AuthenticatedComments({ postSlug }: { postSlug: string }) {
  const { isSignedIn, user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const isAdmin = admins.has(user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "");

  useEffect(() => { fetch(`${base}/rest/v1/comments?post_slug=eq.${encodeURIComponent(postSlug)}&select=id,author_name,body&order=created_at.desc`, { headers: { apikey: key! } }).then((response) => response.ok ? response.json() : []).then(setComments); }, [postSlug]);
  const post = async () => { if (!text.trim() || !user) return; setSending(true); const payload = { post_slug: postSlug, author_id: user.id, author_name: user.fullName || user.firstName || "ThinkEconomics member", body: text.trim() }; const response = await fetch(`${base}/rest/v1/comments`, { method: "POST", headers: { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(payload) }); const created = await response.json(); if (response.ok && created[0]) { setComments([created[0], ...comments]); setText(""); } setSending(false); };
  const remove = async (id: string) => { const response = await fetch("/api/admin", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "comment", id }) }); if (response.ok) setComments((current) => current.filter((comment) => comment.id !== id)); };
  return <section className="comments"><h2>Join the discussion.</h2>{isSignedIn ? <div className="comment-form"><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a thought"/><button onClick={post} disabled={sending}>{sending ? "Posting" : "Post comment"}</button></div> : <SignInButton mode="modal"><button className="sign-in">Sign in to comment</button></SignInButton>}<div className="comment-list">{comments.map((comment) => <article key={comment.id}><div className="comment-meta"><strong>{comment.author_name}</strong>{isAdmin && <button onClick={() => remove(comment.id)}>Delete</button>}</div><p>{comment.body}</p></article>)}</div></section>;
}
