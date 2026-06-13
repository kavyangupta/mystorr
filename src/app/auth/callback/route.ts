import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: store } = await supabase
          .from("stores")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        return NextResponse.redirect(
          `${origin}${store ? "/dashboard" : "/onboarding"}`
        );
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
