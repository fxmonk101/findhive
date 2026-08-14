import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Send } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useT } from "@/lib/i18n";

export function UtilityBar() {
  const t = useT();
  return (
    <div className="hidden bg-primary text-primary-foreground md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
        <LocaleSwitcher />
        <div className="hidden lg:block" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 opacity-80">
            <a href="#" aria-label="Facebook" className="hover:text-accent"><Facebook size={13} /></a>
            <a href="#" aria-label="X" className="hover:text-accent"><Twitter size={13} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-accent"><Linkedin size={13} /></a>
            <a href="#" aria-label="Telegram" className="hover:text-accent"><Send size={13} /></a>
          </div>
          <span className="opacity-30">|</span>
          <Link to="/faqs" className="hover:text-accent">{t("nav.newsletter")}</Link>
          <Link to="/contact" className="hover:text-accent">{t("nav.contact")}</Link>
          <Link to="/faqs" className="hover:text-accent">{t("nav.faqs")}</Link>
        </div>
      </div>
    </div>
  );
}