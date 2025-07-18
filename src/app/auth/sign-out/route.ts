// src/app/auth/sign-out/route.ts
import { createServerComponentClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // IMPORTANT: Call cookies() here
  const supabase = createServerComponentClient(cookies());

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });
}
