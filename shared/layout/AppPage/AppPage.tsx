import React from "react";
import { PageContainer } from "../PageContainer";

export interface AppPageProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function AppPage({ children, className = "", ...props }: AppPageProps) {
  return (
    <PageContainer>
      <main className={`py-12 ${className}`} {...props}>
        {children}
      </main>
    </PageContainer>
  );
}
