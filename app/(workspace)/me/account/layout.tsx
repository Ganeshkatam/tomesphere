import React from "react";
import { AccountLayoutShell } from "@/modules/account/presentation/components/AccountLayoutShell";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayoutShell>{children}</AccountLayoutShell>;
}
