import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";
import { Navbar } from "./Navbar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="hero-surface flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
