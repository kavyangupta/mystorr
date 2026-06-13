import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";
import type { Order, Product, Store } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <DashboardClient
      store={store as Store}
      initialProducts={(products as Product[]) || []}
      initialOrders={(orders as Order[]) || []}
    />
  );
}
