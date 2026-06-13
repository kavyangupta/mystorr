"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { getOrderingStatus, cn } from "@/lib/utils";
import type { Store } from "@/lib/types";

export function MenuStatusBar({ store }: { store: Store }) {
  // Compute on the client so the customer's local time is used.
  const [status, setStatus] = React.useState(() => getOrderingStatus(store));

  React.useEffect(() => {
    setStatus(getOrderingStatus(store));
    const id = setInterval(() => setStatus(getOrderingStatus(store)), 60_000);
    return () => clearInterval(id);
  }, [store]);

  const tone =
    status.state === "open"
      ? {
          wrap: "bg-whatsapp/10 text-whatsapp",
          dot: "bg-whatsapp",
        }
      : status.state === "holiday"
      ? {
          wrap: "bg-amber-100 text-amber-800",
          dot: "bg-amber-500",
        }
      : {
          wrap: "bg-zinc-100 text-zinc-600",
          dot: "bg-zinc-400",
        };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        tone.wrap
      )}
    >
      {status.state === "open" ? (
        <span className={cn("h-2.5 w-2.5 animate-pulse rounded-full", tone.dot)} />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>{status.message}</span>
      {status.detail && (
        <span className="font-normal opacity-80">· {status.detail}</span>
      )}
    </div>
  );
}
