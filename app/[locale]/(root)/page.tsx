import { useTranslations } from "next-intl";
import React from "react";

export default function HomePage() {
  const t = useTranslations("home");
  return <div>{t("header")}</div>;
}
