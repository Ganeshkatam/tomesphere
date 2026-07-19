"use client";

import { useAnnotationStore } from "../state/annotation-store";
import type { TextContent } from "@/modules/reader/application/ports/DocumentEngine";
import { useEffect, useState } from "react";

interface AnnotationLayerProps {
  pageNumber: number;
  textContent: TextContent | null;
  scale: number;
}

export function AnnotationLayer({
  pageNumber,
  textContent,
  scale,
}: AnnotationLayerProps) {
  const { annotations, activeAnnotationId, setActiveAnnotation } =
    useAnnotationStore();

  // Filter annotations for this specific page
  const pageAnnotations = Object.values(annotations).filter(
    (a) => a.anchor.pageNumber === pageNumber,
  );

  if (pageAnnotations.length === 0) return null;

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {pageAnnotations.map((annotation) => {
        const isSelected = activeAnnotationId === annotation.id;
        const baseColor = getTailwindColor(annotation.color || "yellow");

        return (
          <div key={annotation.id} className="absolute pointer-events-auto">
            {annotation.anchor.type === "text" &&
              annotation.anchor.rects.map((rect, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveAnnotation(annotation.id)}
                  className={`absolute cursor-pointer mix-blend-multiply transition-opacity ${
                    isSelected
                      ? "opacity-80 ring-2 ring-blue-500"
                      : "opacity-40 hover:opacity-60"
                  }`}
                  style={{
                    left: `${rect.x * 100}%`,
                    top: `${rect.y * 100}%`,
                    width: `${rect.width * 100}%`,
                    height: `${rect.height * 100}%`,
                    backgroundColor: baseColor,
                  }}
                  title={annotation.noteText || "Highlight"}
                />
              ))}

            {annotation.anchor.type === "area" && (
              <div
                onClick={() => setActiveAnnotation(annotation.id)}
                className={`absolute cursor-pointer border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : `border-${baseColor}-500 bg-${baseColor}-500/10 hover:bg-${baseColor}-500/20`
                }`}
                style={{
                  left: `${annotation.anchor.rect.x * 100}%`,
                  top: `${annotation.anchor.rect.y * 100}%`,
                  width: `${annotation.anchor.rect.width * 100}%`,
                  height: `${annotation.anchor.rect.height * 100}%`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function getTailwindColor(color: string): string {
  switch (color) {
    case "yellow":
      return "#facc15";
    case "green":
      return "#4ade80";
    case "blue":
      return "#60a5fa";
    case "pink":
      return "#f472b6";
    case "purple":
      return "#c084fc";
    default:
      return "#facc15";
  }
}
