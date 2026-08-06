import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminEmails = new Set(["thinkecon@gmail.com", "vyom1907patel@gmail.com"]);

async function authorize() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email || !adminEmails.has(email)) return null;
  return user;
}

function headers() {
  return {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""}`,
    "x-admin-token": process.env.ADMIN_API_TOKEN || "",
    "Content-Type": "application/json",
  };
}

export async function GET(request: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind"); const id = searchParams.get("id");
  if (kind && id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_get_item`, { method: "POST", headers: headers(), body: JSON.stringify({ target_kind: kind, target_id: id }) });
    return NextResponse.json(response.ok ? await response.json() : { error: "Could not load this item." }, { status: response.ok ? 200 : 500 });
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_feed`, { method: "POST", headers: headers() });
  return NextResponse.json(response.ok ? await response.json() : { error: "Could not load the queue." }, { status: response.ok ? 200 : 500 });
}

export async function PATCH(request: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_update_item`, { method: "POST", headers: headers(), body: JSON.stringify({ target_kind: data.kind, target_id: data.id, new_title: data.title || null, new_summary: data.summary || null, new_body: data.body || null, new_cover: data.cover || null, new_description: data.description || null, new_video_url: data.videoUrl || null, new_event_date: data.eventDate || null, new_location: data.location || null, new_image_url: data.imageUrl || null, new_application_url: data.applicationUrl || null, new_meeting_url: data.meetingUrl || null }) });
  return NextResponse.json(response.ok ? { ok: true } : { error: "Could not save this item." }, { status: response.ok ? 200 : 500 });
}

export async function DELETE(request: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { kind, id } = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_delete_item`, { method: "POST", headers: headers(), body: JSON.stringify({ target_kind: kind, target_id: id }) });
  return NextResponse.json(response.ok ? { ok: true } : { error: "Could not delete the item." }, { status: response.ok ? 200 : 500 });
}

export async function POST(request: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const isPodcast = data.type === "podcast";
  const isEvent = data.type === "event";
  const rpc = isPodcast ? "admin_create_podcast" : isEvent ? "admin_create_event" : "admin_create_blog";
  const body = isPodcast ? { new_title: data.title, new_description: data.description, new_video_url: data.videoUrl } : isEvent ? { new_title: data.title, new_description: data.description, new_event_date: data.eventDate || null, new_location: data.location || null, new_image_url: data.imageUrl || null, new_body: data.body || null, new_application_url: data.applicationUrl || null, new_meeting_url: data.meetingUrl || null } : { new_title: data.title, new_summary: data.summary, new_body: data.body };
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${rpc}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  return NextResponse.json(response.ok ? await response.json() : { error: "Could not create the item." }, { status: response.ok ? 200 : 500 });
}
