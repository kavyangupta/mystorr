import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/utils";

export default function StoreNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-app rounded-card bg-card p-8 text-center shadow-card">
        <div className="text-5xl">🔍</div>
        <h1 className="mt-4 text-xl font-extrabold text-ink">
          This store doesn&apos;t exist yet
        </h1>
        <p className="mt-2 text-sm text-muted">
          The link may be wrong, or the shop hasn&apos;t been created.
        </p>
        <Link href="/" className="mt-6 block">
          <Button variant="brand" className="w-full">
            Create your own shop on {APP_NAME}
          </Button>
        </Link>
      </div>
    </div>
  );
}
