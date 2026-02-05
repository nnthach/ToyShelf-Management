import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi"],
  // locales: ["en", "vi"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
});
