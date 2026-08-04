import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function headers() { return { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""}`, "x-admin-token": process.env.ADMIN_API_TOKEN || "", "Content-Type": "application/json" }; }

export async function POST(request: Request) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!user || !email) return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  const data = await request.json();
  const isReply = Boolean(data.threadId);
  const body = isReply ? { new_thread_id: data.threadId, new_body: data.body, new_author_name: user.fullName || user.firstName || "ThinkEconomics member", new_author_email: email, new_clerk_user_id: user.id } : { new_title: data.title, new_body: data.body, new_author_name: user.fullName || user.firstName || "ThinkEconomics member", new_author_email: email, new_clerk_user_id: user.id };
  const rpc = isReply ? "create_discussion_reply" : "create_discussion_thread";
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${rpc}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  return NextResponse.json(response.ok ? await response.json() : { error: "Could not publish your post." }, { status: response.ok ? 200 : 500 });
}
