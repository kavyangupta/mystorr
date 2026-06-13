import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UpdateMenuClient from "./update-menu-client";
import type { Product, Store } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UpdateMenuPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) redirect("/onboarding");
  if ((store as Store).store_mode !== "menu") redirect("/dashboard");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  return (
    <UpdateMenuClient
      store={store as Store}
      products={(products as Product[]) || []}
    />
  );
}
