import React from "react";
import { ReaderShell } from "../../../exp/layouts/ReaderShell";

export default function ReaderPreview() {
  return (
    <ReaderShell showChrome={true}>
      <h1 className="font-serif font-bold text-4xl mb-8 text-[#04162e]">Chapter 1</h1>
      <p className="mb-6">
        This is a preview of the immersive reader layout. Notice how the text is constrained 
        to a highly legible line length (approximately 65-70 characters), allowing the eye to 
        track comfortably from the end of one line to the beginning of the next.
      </p>
      <p className="mb-6">
        The typography uses Atkinson Hyperlegible (if available) for maximum readability, 
        and the background is the Warm Parchment color (#fbf9f8) to reduce harsh glare and eye strain 
        compared to pure white.
      </p>
      <p className="mb-6">
        In the real application, clicking anywhere in this text area would smoothly slide the top and 
        bottom chrome off the screen, creating a completely distraction-free environment. 
      </p>
    </ReaderShell>
  );
}
