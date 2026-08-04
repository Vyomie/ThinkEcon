"use client";

import { FormEvent, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { DiscussionThread } from "@/lib/content-api";

export function DiscussionBoard({ initialThreads }: { initialThreads: DiscussionThread[] }) {
  const { isSignedIn } = useUser();
  const [threads, setThreads] = useState(initialThreads); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setSending(true); setError(""); const response = await fetch("/api/discussion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body }) }); const created = await response.json(); setSending(false); if (!response.ok) return setError(created.error || "Could not publish your post."); setThreads((current) => [created, ...current]); setTitle(""); setBody(""); };
  return <main className="forum-page"><section className="page-hero"><h1>Discussion.</h1><p>Questions, arguments, and ideas from the ThinkEconomics community.</p></section>{isSignedIn ? <form className="forum-compose" onSubmit={submit}><input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Start a discussion"/><textarea required maxLength={5000} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share your question or point of view"/><button disabled={sending}>{sending ? "Publishing" : "Publish"}</button>{error && <p>{error}</p>}</form> : <section className="forum-signin"><p>Sign in to start a discussion or reply.</p><SignInButton mode="modal"><button>Sign in</button></SignInButton></section>}<section className="thread-list">{threads.map((thread) => <article key={thread.id}><Link href={`/discussion/${thread.id}`}><small>{thread.author_name}</small><h2>{thread.title}</h2><p>{thread.body}</p></Link></article>)}{!threads.length && <p>No discussions yet. Start the first one.</p>}</section></main>;
}
