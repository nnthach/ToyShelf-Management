"use client";

import { usePathname, useRouter } from "../../i18n/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "en" | "vi") => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className="inline-flex items-center rounded-full bg-white border">
      <button
        onClick={() => switchLocale("en")}
        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all
          ${
            locale === "en"
              ? "bg-black text-white shadow"
              : "text-neutral-600 hover:text-black"
          }`}
      >
        EN
      </button>

      <button
        onClick={() => switchLocale("vi")}
        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all
          ${
            locale === "vi"
              ? "bg-black text-white shadow"
              : "text-neutral-600 hover:text-black"
          }`}
      >
        VI
      </button>
    </div>
  );
}
