import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh text-foreground">
      <SideNav />
      <main className="lg:pl-[280px] pb-24 lg:pb-0 min-h-dvh">{children}</main>
      <BottomNav />
    </div>
  );
}
