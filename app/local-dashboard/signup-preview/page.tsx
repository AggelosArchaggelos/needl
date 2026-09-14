import { notFound } from "next/navigation";
import { StudioSignupForm } from "@/components/studio-signup-form";

export const dynamic = "force-dynamic";

export default function LocalSignupPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-6 text-center text-sm text-paper-dim">
        Local preview of a successful enquiry. No email sent and no studio listed.
      </p>
      <StudioSignupForm previewSuccess />
    </div>
  );
}
