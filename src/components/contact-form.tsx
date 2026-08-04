"use client";

import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function ContactForm({ enabled }: { enabled: boolean }) {
  if (!enabled) return <main className="contact-page"><section><h1>Bring a good question.</h1></section></main>;
  return <ContactGate />;
}

function ContactGate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  if (!isLoaded) return null;
  const submit = async () => {
    if (!message.trim() || !user || !base || !key) return;
    setStatus("sending");
    const response = await fetch(`${base}/rest/v1/contact_messages`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ author_id: user.id, author_name: user.fullName || user.firstName || "ThinkEconomics member", email: user.primaryEmailAddress?.emailAddress || "", message: message.trim() }) });
    if (response.ok) { setMessage(""); setStatus("sent"); } else setStatus("error");
  };
  return <main className={`contact-page ${isSignedIn ? "" : "contact-auth-required"}`}><section><h1>Bring a good question.</h1><p>Want to collaborate, contribute, or invite ThinkEconomics into a conversation? Reach out.</p></section>{isSignedIn ? <form onSubmit={(event) => { event.preventDefault(); submit(); }}><label>Name<input value={user?.fullName || ""} readOnly/></label><label>Email<input type="email" value={user?.primaryEmailAddress?.emailAddress || ""} readOnly/></label><label>Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to talk about?" rows={5}/></label><button disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send message"}</button>{status === "sent" && <p>Message sent.</p>}{status === "error" && <p>Could not send your message.</p>}</form> : <section className="contact-login"><p>Sign in to contact ThinkEconomics.</p><SignInButton mode="modal"><button className="contact-signin-link">Sign in</button></SignInButton></section>}</main>;
}
