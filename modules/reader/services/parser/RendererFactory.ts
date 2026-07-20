import { ReaderRenderer } from "../../application/ports/ReaderRenderer";
import { EpubJsRenderer } from "./epub/EpubJsRenderer";
import { PdfJsRenderer } from "./pdf/PdfJsRenderer";

export class RendererFactory {
  static create(fileType: "pdf" | "epub"): ReaderRenderer {
    if (fileType === "epub") {
      return new EpubJsRenderer();
    }
    if (fileType === "pdf") {
      return new PdfJsRenderer();
    }
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}
