import type { Metadata } from "next";
import { AccountClient } from "@/components/account-client";

export const metadata: Metadata = {
  title: "Your account — Needl",
  description: "Sign in to see your saved studios and artists.",
};

export default function AccountPage() {
  return <AccountClient />;
}
