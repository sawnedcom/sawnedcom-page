// src/app/api/contact/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// Handler for POST request (when the form is submitted)
export async function POST(request: Request) {
  try {
    // Extract data from the request body
    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // Insert data into 'contact_messages' table in Supabase
    const { data, error } = await supabaseAdmin.from("contact_messages").insert([{ name, email, subject, message }]);

    // Handle Supabase error
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save message. Database error." }, { status: 500 });
    }

    // Success response
    return NextResponse.json({ message: "Your message has been sent successfully!", data }, { status: 200 });
  } catch (error) {
    // General error handling (e.g. JSON parsing failure)
    console.error("Unexpected error in contact API:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
