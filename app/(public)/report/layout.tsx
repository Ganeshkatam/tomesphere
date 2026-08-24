import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report an Issue or Metadata Correction",
  description: "Submit bug reports, metadata corrections, or security notices to the TomeSphere team.",
};

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
