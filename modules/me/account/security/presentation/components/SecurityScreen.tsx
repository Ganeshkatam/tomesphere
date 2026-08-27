"use client";

import { PasswordSection } from "./PasswordSection";
import { SignOutSection } from "./SignOutSection";
import { DangerZone } from "./DangerZone";
import { SecurityPageDto } from "../../application/dto/SecurityPageDto";

export function SecurityScreen({
  dto,
  userId,
}: {
  dto: SecurityPageDto;
  userId: string;
}) {
  return (
    <div className="space-y-8">
      <PasswordSection />

      <div className="pt-2">
        <SignOutSection />
      </div>

      <div className="pt-8 mt-8 border-t border-[var(--border-default)]">
        <DangerZone userId={userId} />
      </div>
    </div>
  );
}
