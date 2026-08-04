"use client";
import { CircleUserRound } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
export function AuthControls({ enabled }: { enabled: boolean }) { if (!enabled) return null; return <Authed />; }
function Authed() { const { isSignedIn, isLoaded } = useUser(); if (!isLoaded) return null; if (isSignedIn) return <div className="auth-controls"><a href="/admin">Admin</a><UserButton/></div>; return <SignInButton mode="modal"><button className="sign-in auth-anon" aria-label="Sign in"><CircleUserRound size={25}/></button></SignInButton>; }
