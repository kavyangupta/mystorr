"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/ui/toast";
import {
  normalizeWhatsApp,
  isValidUpi,
  sanitizeSlug,
  isValidSlug,
  appHost,
  cn,
  DAY_NAMES_SHORT,
} from "@/lib/utils";
import type { Store, StoreMode } from "@/lib/types";

export default function SettingsClient({ store }: { store: Store }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();

  const [storeName, setStoreName] = React.useState(store.store_name);
  const [displayName, setDisplayName] = React.useState(store.display_name);
  const [bio, setBio] = React.useState(store.bio || "");
  const [profileImage, setProfileImage] = React.useState<string | null>(
    store.profile_image_url
  );
  const [instagram, setInstagram] = React.useState(store.instagram_handle || "");
  const [whatsapp, setWhatsapp] = React.useState(
    store.whatsapp_number ? store.whatsapp_number.replace(/^91/, "") : ""
  );
  const [upi, setUpi] = React.useState(store.upi_id || "");
  const [mode, setMode] = React.useState<StoreMode>(store.store_mode);

  // menu-mode fields
  const [orderStart, setOrderStart] = React.useState(store.order_start_time || "");
  const [orderEnd, setOrderEnd] = React.useState(store.order_end_time || "");
  const [days, setDays] = React.useState<number[]>(
    Array.isArray(store.operating_days) && store.operating_days.length
      ? store.operating_days
      : [0, 1, 2, 3, 4, 5, 6]
  );
  const [deliveryInfo, setDeliveryInfo] = React.useState(store.delivery_info || "");
  const [minOrder, setMinOrder] = React.useState(store.min_order || "");
  const [advanceNotice, setAdvanceNotice] = React.useState(
    store.advance_order_notice || ""
  );
  const [holidayMode, setHolidayMode] = React.useState(store.holiday_mode);
  const [holidayReturn, setHolidayReturn] = React.useState(
    store.holiday_return_date || ""
  );

  const [saving, setSaving] = React.useState(false);

  function toggleDay(i: number) {
    setDays((prev) =>
      prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i].sort()
    );
  }

  const slugChanged = storeName !== store.store_name;

  async function handleSave() {
    if (!isValidSlug(storeName)) {
      toast("Store URL can only use lowercase letters, numbers and hyphens", "error");
      return;
    }
    if (!displayName.trim()) {
      toast("Shop name is required", "error");
      return;
    }
    const normalizedWa = normalizeWhatsApp(whatsapp);
    if (!normalizedWa) {
      toast("Enter a valid 10-digit WhatsApp number", "error");
      return;
    }
    if (!isValidUpi(upi)) {
      toast("Enter a valid UPI ID", "error");
      return;
    }

    setSaving(true);
    try {
      if (slugChanged) {
        const { data: taken } = await supabase
          .from("stores")
          .select("id")
          .eq("store_name", storeName)
          .neq("id", store.id)
          .maybeSingle();
        if (taken) {
          toast("That store URL is already taken", "error");
          setSaving(false);
          return;
        }
      }

      const { error } = await supabase
        .from("stores")
        .update({
          store_name: storeName,
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          profile_image_url: profileImage,
          instagram_handle: instagram.trim().replace(/^@/, "") || null,
          whatsapp_number: normalizedWa,
          upi_id: upi.trim(),
          store_mode: mode,
          order_start_time: mode === "menu" ? orderStart || null : store.order_start_time,
          order_end_time: mode === "menu" ? orderEnd || null : store.order_end_time,
          operating_days: mode === "menu" ? days : store.operating_days,
          delivery_info:
            mode === "menu" ? deliveryInfo.trim() || null : store.delivery_info,
          min_order: mode === "menu" ? minOrder.trim() || null : store.min_order,
          advance_order_notice:
            mode === "menu"
              ? advanceNotice.trim() || null
              : store.advance_order_notice,
          holiday_mode: mode === "menu" ? holidayMode : store.holiday_mode,
          holiday_return_date:
            mode === "menu"
              ? holidayMode
                ? holidayReturn || null
                : null
              : store.holiday_return_date,
        })
        .eq("id", store.id);
      if (error) throw error;
      toast("Saved", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-app items-center gap-2 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="ml-1 text-base font-bold text-ink">Settings</span>
        </div>
      </nav>

      <main className="mx-auto max-w-app px-4 py-4">
        <div className="flex flex-col items-center">
          <ImageUpload
            value={profileImage}
            onChange={setProfileImage}
            shape="circle"
            label="Photo"
          />
          <p className="mt-2 text-xs text-muted">Tap to change photo</p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <Label htmlFor="s-slug">Store URL</Label>
            <Input
              id="s-slug"
              value={storeName}
              maxLength={30}
              onChange={(e) => setStoreName(sanitizeSlug(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted">
              {appHost()}/<span className="font-medium text-ink">{storeName}</span>
            </p>
            {slugChanged && (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Changing your URL will break all previously shared links.
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="s-name">Shop name</Label>
            <Input
              id="s-name"
              value={displayName}
              maxLength={50}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="s-bio">Bio</Label>
            <Textarea
              id="s-bio"
              value={bio}
              maxLength={120}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-muted">{bio.length}/120</p>
          </div>

          <div>
            <Label htmlFor="s-ig">Instagram handle</Label>
            <Input
              id="s-ig"
              value={instagram}
              placeholder="yourhandle"
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="s-wa">WhatsApp number</Label>
            <div className="flex items-center gap-2">
              <span className="flex h-11 items-center rounded-lg border border-line bg-background px-3 text-sm text-muted">
                +91
              </span>
              <Input
                id="s-wa"
                inputMode="numeric"
                maxLength={10}
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="s-upi">UPI ID</Label>
            <Input
              id="s-upi"
              value={upi}
              placeholder="name@okicici"
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>

          <div>
            <Label>Store mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("catalogue")}
                className={cn(
                  "rounded-lg border-2 p-3 text-left transition-colors",
                  mode === "catalogue"
                    ? "border-brand bg-brand/5"
                    : "border-line"
                )}
              >
                <div className="text-xl">📦</div>
                <p className="mt-1 text-sm font-bold text-ink">Catalogue</p>
              </button>
              <button
                type="button"
                onClick={() => setMode("menu")}
                className={cn(
                  "rounded-lg border-2 p-3 text-left transition-colors",
                  mode === "menu" ? "border-brand bg-brand/5" : "border-line"
                )}
              >
                <div className="text-xl">🍱</div>
                <p className="mt-1 text-sm font-bold text-ink">Daily Menu</p>
              </button>
            </div>
          </div>

          {mode === "menu" && (
            <div className="space-y-5 rounded-xl border border-line bg-background p-4">
              <p className="text-sm font-bold text-ink">Kitchen settings</p>

              {/* Ordering hours */}
              <div>
                <Label>Ordering hours (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={orderStart}
                    onChange={(e) => setOrderStart(e.target.value)}
                    className="bg-white"
                  />
                  <span className="text-sm text-muted">to</span>
                  <Input
                    type="time"
                    value={orderEnd}
                    onChange={(e) => setOrderEnd(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <p className="mt-1 text-xs text-muted">
                  Customers see when you&apos;re taking orders. Leave blank for all day.
                </p>
              </div>

              {/* Operating days */}
              <div>
                <Label>Days you cook</Label>
                <div className="grid grid-cols-7 gap-1">
                  {DAY_NAMES_SHORT.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={cn(
                        "rounded-lg border py-2 text-xs font-semibold transition-colors",
                        days.includes(i)
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-muted"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery + min order */}
              <div>
                <Label htmlFor="s-delivery">Delivery info (optional)</Label>
                <Input
                  id="s-delivery"
                  value={deliveryInfo}
                  maxLength={60}
                  placeholder="Free delivery above ₹200"
                  className="bg-white"
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="s-minorder">Min order (optional)</Label>
                  <Input
                    id="s-minorder"
                    value={minOrder}
                    maxLength={20}
                    placeholder="₹100"
                    className="bg-white"
                    onChange={(e) => setMinOrder(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="s-advance">Advance notice</Label>
                  <Input
                    id="s-advance"
                    value={advanceNotice}
                    maxLength={30}
                    placeholder="1 day ahead"
                    className="bg-white"
                    onChange={(e) => setAdvanceNotice(e.target.value)}
                  />
                </div>
              </div>

              {/* Holiday mode */}
              <div className="rounded-lg border border-line bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-medium text-ink">
                      Holiday mode
                    </span>
                    <span className="block text-xs text-muted">
                      Pause orders while you&apos;re away
                    </span>
                  </div>
                  <Toggle
                    checked={holidayMode}
                    onChange={setHolidayMode}
                    activeColor="bg-amber-500"
                  />
                </div>
                {holidayMode && (
                  <div className="mt-3">
                    <Label htmlFor="s-return">Back on (optional)</Label>
                    <Input
                      id="s-return"
                      type="date"
                      value={holidayReturn}
                      onChange={(e) => setHolidayReturn(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
