import { notFound } from "next/navigation";
import { BookingDialog } from "@/components/booking-dialog";
import { StudioSignupForm } from "@/components/studio-signup-form";
import { studios } from "@/lib/data/studios";

export const dynamic = "force-dynamic";
export default function EmailTests() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <div className="mx-auto max-w-2xl space-y-8 px-6 py-16">
    <h1 className="font-display text-3xl text-paper">Local email delivery tests</h1>
    <p className="text-paper-dim">Use fictional details labelled TEST. Booking goes only to aggkritharas@gmail.com. The listing form uses the configured owner email. Nothing is added to the directory.</p>
    <BookingDialog studio={studios[0]} localEmailTest trigger={<button className="rounded-xl bg-red px-6 py-3 text-paper">Open test booking form</button>} />
    <h2 className="font-display text-2xl text-paper">Studio listing enquiry</h2>
    <StudioSignupForm />
  </div>;
}
