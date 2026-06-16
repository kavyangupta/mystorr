"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, ArrowLeft, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/ui/toast";
import { Confetti } from "@/components/ui/confetti";
import { WhatsAppIcon } from "@/components/icons";
import {
  appHost,
  appUrl,
  sanitizeSlug,
  isValidSlug,
  normalizeWhatsApp,
  isValidUpi,
  cn,
} from "@/lib/utils";
import type { StoreMode } from "@/lib/types";

type SlugState = "idle" | "checking" | "available" | "taken" | "invalid";

export default function OnboardingFlow({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();

  const [step, setStep] = React.useState(1);

  // Step 1
  const [storeName, setStoreName] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [mode, setMode] = React.useState<StoreMode | null>(null);
  const [slugState, setSlugState] = React.useState<SlugState>("idle");

  // Step 2
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [bio, setBio] = React.useState("");

  // Step 3
  const [whatsapp, setWhatsapp] = React.useState("");
  const [upi, setUpi] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // Debounced slug availability check
  React.useEffect(() => {
    if (!storeName) {
      setSlugState("idle");
      return;
    }
    if (!isValidSlug(storeName)) {
      setSlugState("invalid");
      return;
    }
    setSlugState("checking");
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("stores")
        .select("id")
        .eq("store_name", storeName)
        .maybeSingle();
      setSlugState(data ? "taken" : "available");
    }, 500);
    return () => clearTimeout(t);
  }, [storeName, supabase]);

  const step1Valid =
    slugState === "available" &&
    displayName.trim().length > 0 &&
    displayName.length <= 50 &&
    mode !== null;

  const normalizedWa = normalizeWhatsApp(whatsapp);
  const upiValid = isValidUpi(upi);
  const step3Valid = !!normalizedWa && upiValid;

  const liveHost = `${appHost()}/${storeName}`;
  const liveUrl = `${appUrl()}/${storeName}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(liveUrl);
      toast("Link copied! Share it everywhere 🎉", "success");
    } catch {
      toast("Could not copy — long-press to copy the link", "error");
    }
  }

  function shareOnWhatsApp() {
    const text = `My shop is live! Browse and order here 👇\n${liveUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function handleCreate() {
    if (!step3Valid || !mode) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("stores").insert({
        user_id: userId,
        store_name: storeName,
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        profile_image_url: profileImage,
        whatsapp_number: normalizedWa,
        upi_id: upi.trim(),
        store_mode: mode,
        is_open: true,
        is_pro: false,
        instagram_handle: null,
      });
      if (error) throw error;
      setStep(4); // celebration screen
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create store";
      toast(msg.includes("duplicate") ? "That store URL is taken" : msg, "error");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-app px-4 pb-10 pt-6">
        {/* Progress */}
        {step <= 3 && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 text-sm text-muted hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <span className="text-sm font-bold text-brand">MYSTORR</span>
              )}
              <span className="text-xs text-muted">Step {step} of 3</span>
            </div>
            <div className="mt-3 flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    n <= step ? "bg-brand" : "bg-line"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <section>
            <h1 className="text-2xl font-extrabold text-ink">
              Let&apos;s set up your store
            </h1>
            <p className="mt-1 text-sm text-muted">
              Pick your link and what you sell.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <Label htmlFor="slug">Your store URL</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    value={storeName}
                    maxLength={30}
                    placeholder="yourshop"
                    onChange={(e) => setStoreName(sanitizeSlug(e.target.value))}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {slugState === "checking" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted" />
                    )}
                    {slugState === "available" && (
                      <Check className="h-4 w-4 text-whatsapp" />
                    )}
                    {(slugState === "taken" || slugState === "invalid") && (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  {appHost()}/
                  <span className="font-medium text-ink">
                    {storeName || "yourshop"}
                  </span>
                  {slugState === "taken" && (
                    <span className="ml-2 text-red-500">Already taken</span>
                  )}
                  {slugState === "available" && (
                    <span className="ml-2 text-whatsapp">Available</span>
                  )}
                </p>
              </div>

              <div>
                <Label htmlFor="displayName">Your shop name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  maxLength={50}
                  placeholder="Anjali's Kitchen"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <Label>How do you sell?</Label>
                <div className="space-y-2.5">
                  <ModeCard
                    emoji="📦"
                    title="Product Catalogue"
                    body="For selling fixed products like jewellery, clothes, homemade items."
                    selected={mode === "catalogue"}
                    onClick={() => setMode("catalogue")}
                  />
                  <ModeCard
                    emoji="🍱"
                    title="Daily Menu"
                    body="For home chefs and food sellers who update their menu every morning."
                    selected={mode === "menu"}
                    onClick={() => setMode("menu")}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="text-2xl font-extrabold text-ink">Add your profile</h1>
            <p className="mt-1 text-sm text-muted">
              A photo and short bio build trust.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex flex-col items-center">
                <ImageUpload
                  value={profileImage}
                  onChange={setProfileImage}
                  shape="circle"
                  label="Photo"
                />
                <p className="mt-2 text-xs text-muted">JPG, PNG or WEBP · max 3MB</p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  maxLength={120}
                  placeholder="Homemade North Indian tiffins, delivered fresh daily."
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className="mt-1 text-right text-xs text-muted">
                  {bio.length}/120
                </p>
              </div>

              <Button className="w-full" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="text-2xl font-extrabold text-ink">
              How do customers pay you?
            </h1>
            <p className="mt-1 text-sm text-muted">
              Customers pay you directly via UPI — money lands straight in your
              account.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <div className="flex items-center gap-2">
                  <span className="flex h-11 items-center rounded-lg border border-line bg-background px-3 text-sm text-muted">
                    +91
                  </span>
                  <Input
                    id="whatsapp"
                    inputMode="numeric"
                    maxLength={10}
                    value={whatsapp}
                    placeholder="9876543210"
                    onChange={(e) =>
                      setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />
                </div>
                {whatsapp.length > 0 && !normalizedWa && (
                  <p className="mt-1 text-xs text-red-500">
                    Enter a valid 10-digit Indian mobile number
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="upi">UPI ID</Label>
                <Input
                  id="upi"
                  value={upi}
                  placeholder="name@okicici or 9876543210@ybl"
                  onChange={(e) => setUpi(e.target.value)}
                />
                {upi.length > 0 && !upiValid && (
                  <p className="mt-1 text-xs text-red-500">
                    UPI ID must contain @ (e.g. name@okicici)
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={!step3Valid}
                loading={saving}
                onClick={handleCreate}
              >
                Create my store
              </Button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="pt-6 text-center">
            <Confetti />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#7C3AED] text-4xl shadow-[0_8px_30px_rgba(83,74,183,0.35)]">
              🎉
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink">
              Your shop is live!
            </h1>
            <p className="mt-2 text-sm text-muted">
              Share this link on WhatsApp, your Instagram bio and society groups.
              Customers can start browsing right away.
            </p>

            {/* The live link */}
            <div className="mt-6 rounded-2xl border-2 border-brand/20 bg-brand/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Your shop link
              </p>
              <p className="mt-1 break-all text-base font-bold text-brand">
                {liveHost}
              </p>
            </div>

            <button
              onClick={copyLink}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-bold text-white transition-colors hover:bg-brand/90"
            >
              <Copy className="h-5 w-5" /> Copy my link
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp text-base font-bold text-white transition-colors hover:bg-whatsapp/90"
            >
              <WhatsAppIcon className="h-5 w-5" /> Share on WhatsApp
            </button>

            <button
              onClick={() => router.replace("/dashboard")}
              className="mt-5 text-sm font-semibold text-muted hover:text-ink"
            >
              Go to my dashboard →
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  emoji,
  title,
  body,
  selected,
  onClick,
}: {
  emoji: string;
  title: string;
  body: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-card border-2 bg-white p-4 text-left transition-colors",
        selected ? "border-brand bg-brand/5" : "border-line hover:border-brand/40"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="text-sm font-bold text-ink">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
        </div>
      </div>
    </button>
  );
}
