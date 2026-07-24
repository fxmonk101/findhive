import { useState } from "react";
import { UtilityBar } from "./UtilityBar";
import { MainHeader } from "./MainHeader";
import { CategoryNav } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 shadow-sm">
        <UtilityBar />
        <MainHeader onMenuClick={() => setMenuOpen(true)} />
        <CategoryNav />
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}