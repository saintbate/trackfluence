// components/TopBarRight.tsx
"use client";

import UserMenu from "@/components/UserMenu";
import { ReactNode } from "react";

export default function TopBarRight({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      {children}
      <UserMenu />
    </div>
  );
}