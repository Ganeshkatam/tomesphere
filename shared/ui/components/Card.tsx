import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all hover:-translate-y-1 hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[2/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`relative w-full ${aspectRatio} overflow-hidden bg-slate-800 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 flex flex-col ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-base font-medium text-[var(--text-primary)] leading-tight mb-1 truncate ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardSubtitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-[var(--text-secondary)] truncate ${className}`}>
      {children}
    </p>
  );
}
