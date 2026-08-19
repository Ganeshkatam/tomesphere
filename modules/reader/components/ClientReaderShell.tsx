"use client";

import dynamic from "next/dynamic";
import { ReaderPageDto } from "@/modules/reader/application/dto/ReaderPageDto";

// Dynamically import the ReaderShell with ssr disabled
// This prevents Next.js from attempting to render pdfjs-dist on the server
// which crashes due to missing browser globals like DOMMatrix.
const DynamicReaderShell = dynamic(
  () => import("./ReaderShell").then((mod) => mod.ReaderShell),
  { ssr: false }
);

export function ClientReaderShell({ data }: { data: ReaderPageDto }) {
  return <DynamicReaderShell data={data} />;
}
