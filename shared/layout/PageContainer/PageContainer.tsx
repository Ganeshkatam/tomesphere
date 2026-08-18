import React from "react";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className = "", ...props }: PageContainerProps) {
  return (
    <div
      className={`w-full mx-auto max-w-[var(--page-max-width)] px-[var(--page-padding-x)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
