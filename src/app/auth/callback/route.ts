// src/app/auth/callback/route.ts
import { createServerComponentClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // IMPORTANT: Call cookies() here
    const supabase = createServerComponentClient(cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${error.message}`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
