"use client";
import { FormEvent, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { DiscussionReply } from "@/lib/content-api";

export function DiscussionReplies({ threadId, initialReplies }: { threadId: string; initialReplies: DiscussionReply[] }) {
  const { isSignedIn } = useUser(); const [replies, setReplies] = useState(initialReplies); const [body, setBody] = useState(""); const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const response = await fetch("/api/discussion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ threadId, body }) }); const created = await response.json(); if (!response.ok) return setError(created.error || "Could not publish your reply."); setReplies((current) => [...current, created]); setBody(""); };
  return <section className="reply-list"><h2>Replies</h2>{replies.map((reply) => <article key={reply.id}><small>{reply.author_name}</small><p>{reply.body}</p></article>)}{isSignedIn ? <form className="forum-compose" onSubmit={submit}><textarea required value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add to the discussion"/><button>Reply</button>{error && <p>{error}</p>}</form> : <section className="forum-signin"><p>Sign in to reply.</p><SignInButton mode="modal"><button>Sign in</button></SignInButton></section>}</section>;
}
