"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/ui/toast";
import {
  rupeesToPaise,
  cn,
  CATEGORY_META,
  CATEGORY_ORDER,
  DIETARY_TAGS,
  SERVES_OPTIONS,
  DAY_NAMES,
  DAY_NAMES_SHORT,
} from "@/lib/utils";
import type { Product, ProductCategory, StoreMode } from "@/lib/types";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeMode: StoreMode;
  product: Product | null; // null = create
  onSaved: (product: Product) => void;
  /** Pre-select a category when adding a new menu item. */
  defaultCategory?: ProductCategory;
}

export function ProductFormModal({
  open,
  onClose,
  storeId,
  storeMode,
  product,
  onSaved,
  defaultCategory,
}: ProductFormModalProps) {
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();
  const isMenu = storeMode === "menu";

  const [image, setImage] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [priceRupees, setPriceRupees] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [available, setAvailable] = React.useState(true);

  // menu-mode fields
  const [category, setCategory] = React.useState<ProductCategory>("todays_special");
  const [dietary, setDietary] = React.useState<string[]>([]);
  const [serves, setServes] = React.useState<string>("");
  const [prepTime, setPrepTime] = React.useState("");
  const [weeklyDay, setWeeklyDay] = React.useState<number>(0);
  const [festivalName, setFestivalName] = React.useState("");
  const [festivalDeadline, setFestivalDeadline] = React.useState("");

  // catalogue-mode stock fields
  const [limited, setLimited] = React.useState(false);
  const [quantity, setQuantity] = React.useState("");

  const [showMore, setShowMore] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setShowMore(false);
    if (product) {
      setImage(product.image_url);
      setName(product.name);
      setPriceRupees(String(product.price / 100));
      setDescription(product.description || "");
      setAvailable(product.is_available);
      setCategory(product.category);
      setDietary(product.dietary_tags || []);
      setServes(product.serves || "");
      setPrepTime(product.prep_time_mins ? String(product.prep_time_mins) : "");
      setWeeklyDay(product.weekly_day ?? 0);
      setFestivalName(product.festival_name || "");
      setFestivalDeadline(product.festival_deadline || "");
      setLimited(product.quantity_available >= 0);
      setQuantity(
        product.quantity_available >= 0 ? String(product.quantity_available) : ""
      );
    } else {
      setImage(null);
      setName("");
      setPriceRupees("");
      setDescription("");
      setAvailable(true);
      setCategory(defaultCategory || "todays_special");
      setDietary([]);
      setServes("");
      setPrepTime("");
      setWeeklyDay(new Date().getDay());
      setFestivalName("");
      setFestivalDeadline("");
      setLimited(false);
      setQuantity("");
    }
  }, [open, product, defaultCategory]);

  function toggleDietary(tag: string) {
    setDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast("Dish name is required", "error");
      return;
    }
    const price = parseFloat(priceRupees);
    if (isNaN(price) || price < 0) {
      toast("Enter a valid price", "error");
      return;
    }
    if (isMenu && category === "festival_special" && !festivalName.trim()) {
      toast("Add the festival or occasion name", "error");
      return;
    }

    // stock quantity (catalogue only — menu manages stock in the morning flow)
    let qty = product ? product.quantity_available : -1;
    if (!isMenu) {
      qty = -1;
      if (limited) {
        const parsed = parseInt(quantity, 10);
        if (isNaN(parsed) || parsed < 0) {
          toast("Enter a valid quantity", "error");
          return;
        }
        qty = parsed;
      }
    }

    setSaving(true);
    try {
      const base = {
        name: trimmedName,
        description: description.trim() || null,
        price: rupeesToPaise(price),
        image_url: image,
        is_available: available,
      };

      const payload = isMenu
        ? {
            ...base,
            quantity_available: qty,
            category,
            dietary_tags: dietary,
            serves: serves || null,
            prep_time_mins: prepTime ? parseInt(prepTime, 10) : null,
            weekly_day: category === "weekly_special" ? weeklyDay : null,
            festival_name:
              category === "festival_special" ? festivalName.trim() || null : null,
            festival_deadline:
              (category === "festival_special" || category === "preorder") &&
              festivalDeadline
                ? festivalDeadline
                : null,
            // New today's-special items start switched on for today.
            is_todays_special:
              category === "todays_special"
                ? product
                  ? product.is_todays_special
                  : true
                : false,
          }
        : {
            ...base,
            quantity_available: qty,
            is_todays_special: false,
          };

      if (product) {
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id)
          .select()
          .single();
        if (error) throw error;
        onSaved(data as Product);
        toast(isMenu ? "Dish updated" : "Product updated", "success");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({ ...payload, store_id: storeId, order_index: 0 })
          .select()
          .single();
        if (error) throw error;
        onSaved(data as Product);
        toast(isMenu ? "Dish added" : "Product added", "success");
      }
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save", "error");
    } finally {
      setSaving(false);
    }
  }

  // ----- Catalogue mode: original simple form ------------------------------
  if (!isMenu) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={product ? "Edit product" : "Add product"}
      >
        <div className="space-y-4">
          <div>
            <Label>Product photo</Label>
            <div className="mx-auto w-40">
              <ImageUpload value={image} onChange={setImage} shape="square" />
            </div>
          </div>

          <div>
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={name}
              maxLength={80}
              placeholder="Handmade earrings"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="p-price">Price (₹)</Label>
            <Input
              id="p-price"
              inputMode="decimal"
              value={priceRupees}
              placeholder="299"
              onChange={(e) =>
                setPriceRupees(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="mb-0">Limited stock</Label>
              <Toggle
                checked={limited}
                onChange={setLimited}
                activeColor="bg-brand"
                label="Limited stock"
              />
            </div>
            {limited ? (
              <Input
                className="mt-2"
                inputMode="numeric"
                value={quantity}
                placeholder="Quantity available"
                onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
              />
            ) : (
              <p className="mt-1 text-xs text-muted">Unlimited quantity</p>
            )}
          </div>

          <div>
            <Label htmlFor="p-desc">Description (optional)</Label>
            <Textarea
              id="p-desc"
              value={description}
              maxLength={200}
              placeholder="Materials, size, care instructions…"
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-muted">
              {description.length}/200
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-line p-3">
            <span className="text-sm font-medium text-ink">Available</span>
            <Toggle checked={available} onChange={setAvailable} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ----- Menu mode: simple-first dish form ---------------------------------
  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit dish" : "Add dish"}>
      <div className="space-y-4">
        <div>
          <Label>Dish photo</Label>
          <div className="mx-auto w-40">
            <ImageUpload value={image} onChange={setImage} shape="square" />
          </div>
        </div>

        <div>
          <Label htmlFor="p-name">Dish name</Label>
          <Input
            id="p-name"
            value={name}
            maxLength={80}
            placeholder="Veg Thali"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="p-price">Price (₹)</Label>
          <Input
            id="p-price"
            inputMode="decimal"
            value={priceRupees}
            placeholder="120"
            onChange={(e) =>
              setPriceRupees(e.target.value.replace(/[^0-9.]/g, ""))
            }
          />
        </div>

        {/* Category — the one decision that shapes everything */}
        <div>
          <Label>When is this available?</Label>
          <div className="space-y-2">
            {CATEGORY_ORDER.map((c) => {
              const meta = CATEGORY_META[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors",
                    active ? "border-brand bg-brand/5" : "border-line"
                  )}
                >
                  <span className="text-xl leading-none">{meta.emoji}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-ink">
                      {meta.label}
                    </span>
                    <span className="block text-xs text-muted">{meta.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional: weekly day */}
        {category === "weekly_special" && (
          <div>
            <Label>Which day each week?</Label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES_SHORT.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setWeeklyDay(i)}
                  className={cn(
                    "rounded-lg border py-2 text-xs font-semibold transition-colors",
                    weeklyDay === i
                      ? "border-brand bg-brand text-white"
                      : "border-line text-muted"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">
              Shows only on {DAY_NAMES[weeklyDay]}.
            </p>
          </div>
        )}

        {/* Conditional: festival */}
        {category === "festival_special" && (
          <>
            <div>
              <Label htmlFor="p-fest">Festival / occasion</Label>
              <Input
                id="p-fest"
                value={festivalName}
                maxLength={40}
                placeholder="Diwali"
                onChange={(e) => setFestivalName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p-fest-date">Available until (optional)</Label>
              <Input
                id="p-fest-date"
                type="date"
                value={festivalDeadline}
                onChange={(e) => setFestivalDeadline(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Conditional: pre-order deadline */}
        {category === "preorder" && (
          <div>
            <Label htmlFor="p-pre-date">Order-by date (optional)</Label>
            <Input
              id="p-pre-date"
              type="date"
              value={festivalDeadline}
              onChange={(e) => setFestivalDeadline(e.target.value)}
            />
          </div>
        )}

        {/* More options */}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-ink"
        >
          More options
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform",
              showMore && "rotate-180"
            )}
          />
        </button>

        {showMore && (
          <div className="space-y-4 rounded-lg bg-background p-3">
            <div>
              <Label>Dietary</Label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_TAGS.map((tag) => {
                  const active = dietary.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietary(tag)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-muted"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Portion size</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {SERVES_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      setServes((prev) => (prev === s.value ? "" : s.value))
                    }
                    className={cn(
                      "rounded-lg border py-2 text-xs font-semibold transition-colors",
                      serves === s.value
                        ? "border-brand bg-brand text-white"
                        : "border-line text-muted"
                    )}
                  >
                    {s.value === "family" ? "Family" : s.value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="p-prep">Ready in (minutes, optional)</Label>
              <Input
                id="p-prep"
                inputMode="numeric"
                value={prepTime}
                placeholder="30"
                onChange={(e) => setPrepTime(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <Label htmlFor="p-desc">Short description (optional)</Label>
              <Textarea
                id="p-desc"
                value={description}
                maxLength={80}
                placeholder="Dal, sabzi, 4 rotis, rice & salad."
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-1 text-right text-xs text-muted">
                {description.length}/80
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-line p-3">
          <div>
            <span className="block text-sm font-medium text-ink">
              Show on my menu
            </span>
            <span className="block text-xs text-muted">
              Turn off to hide without deleting
            </span>
          </div>
          <Toggle checked={available} onChange={setAvailable} activeColor="bg-brand" />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} loading={saving}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
