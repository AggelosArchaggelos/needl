import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const developmentSecret = randomBytes(32).toString("hex");
const secret = () => process.env.STUDIO_ACCESS_SECRET || (process.env.NODE_ENV === "development" ? developmentSecret : "");
export const pricingAccessConfigured = () => secret().length >= 32;
export function issuePricingAccess() {
  if (!pricingAccessConfigured()) throw Error("Studio access is not configured");
  const payload = Buffer.from(JSON.stringify({ scope: "studio-pricing", expires: Date.now() + 3600000 })).toString("base64url");
  return payload + "." + createHmac("sha256", secret()).update(payload).digest("base64url");
}
export function hasPricingAccess(token?: string) {
  if (!token || !pricingAccessConfigured()) return false;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.scope === "studio-pricing" && typeof data.expires === "number" && data.expires > Date.now();
  } catch { return false; }
}
