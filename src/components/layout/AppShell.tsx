import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SideNav />
      <main className="lg:pl-60 pb-20 lg:pb-0 min-h-dvh">{children}</main>
      <BottomNav />
    </div>
  );
}
