import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import CookieConsentBanner, {
  getStoredCookieConsent,
  saveCookieConsent,
} from "./CookieConsentBanner";

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the cookie consent banner when no consent is stored", async () => {
    render(<CookieConsentBanner />);
    await waitFor(() => {
      expect(
        screen.getByText("Strict Cookie & Privacy Policy")
      ).toBeInTheDocument();
    });
  });

  it("stores essential only consent when 'Essential Only' is clicked", async () => {
    render(<CookieConsentBanner />);
    await waitFor(() => {
      expect(screen.getByText("Essential Only")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Essential Only"));

    const consent = getStoredCookieConsent();
    expect(consent).not.toBeNull();
    expect(consent?.essential).toBe(true);
    expect(consent?.functional).toBe(false);
    expect(consent?.analytics).toBe(false);
  });

  it("stores full consent when 'Accept All' is clicked", async () => {
    render(<CookieConsentBanner />);
    await waitFor(() => {
      expect(screen.getByText("Accept All")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Accept All"));

    const consent = getStoredCookieConsent();
    expect(consent).not.toBeNull();
    expect(consent?.essential).toBe(true);
    expect(consent?.functional).toBe(true);
    expect(consent?.analytics).toBe(true);
  });

  it("opens modal on custom event 'open-cookie-preferences'", async () => {
    saveCookieConsent({ essential: true, functional: true, analytics: false });
    render(<CookieConsentBanner />);

    act(() => {
      window.dispatchEvent(new Event("open-cookie-preferences"));
    });

    await waitFor(() => {
      expect(screen.getByText("Cookie & Storage Preferences")).toBeInTheDocument();
    });
  });
});
