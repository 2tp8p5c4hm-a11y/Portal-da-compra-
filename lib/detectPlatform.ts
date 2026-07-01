export function detectPlatform(url: string): string {
  if (url.includes("meli.la")) return "mercado_livre";
  if (url.includes("shopee.com.br")) return "shopee";
  if (url.includes("amazon")) return "amazon";
  if (url.includes("aliexpress")) return "aliexpress";
  return "other";
}

export function isValidAffiliateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
