import React from "react";
import { getDiscoveryConfiguration } from "./getDiscoveryConfiguration";
import { getDiscoveryFacade } from "../../application/facades";

jest.mock("../../application/facades", () => ({
  getDiscoveryFacade: jest.fn(),
}));

describe("getDiscoveryConfiguration", () => {
  const mockFacade = {
    getAuthors: jest.fn().mockResolvedValue({ total: 10, items: [] }),
    getCollections: jest.fn().mockResolvedValue({ total: 10, items: [] }),
    getFeatured: jest.fn().mockResolvedValue({ total: 10, items: [] }),
    getNewArrivals: jest.fn().mockResolvedValue({ total: 10, items: [] }),
    getTrending: jest.fn().mockResolvedValue({ totalCount: 10, books: [] }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDiscoveryFacade as jest.Mock).mockResolvedValue(mockFacade);
  });

  it("returns authors configuration and calls getAuthors", async () => {
    const config = await getDiscoveryConfiguration("authors");
    expect(mockFacade.getAuthors).toHaveBeenCalledWith({ limit: 24, page: 1 });
    expect(config.mode).toBe("authors");
    expect(config.title).toBe("Popular Authors");
  });

  it("returns collections configuration and calls getCollections", async () => {
    const config = await getDiscoveryConfiguration("collections");
    expect(mockFacade.getCollections).toHaveBeenCalledWith({ limit: 24, page: 1 });
    expect(config.mode).toBe("collections");
    expect(config.title).toBe("Curated Collections");
  });

  it("returns featured configuration and calls getFeatured", async () => {
    const config = await getDiscoveryConfiguration("featured");
    expect(mockFacade.getFeatured).toHaveBeenCalledWith({ limit: 24, page: 1 });
    expect(config.mode).toBe("featured");
    expect(config.title).toBe("Editor's Picks");
  });

  it("returns new arrivals configuration and calls getNewArrivals", async () => {
    const config = await getDiscoveryConfiguration("new");
    expect(mockFacade.getNewArrivals).toHaveBeenCalledWith({ limit: 24, page: 1 });
    expect(config.mode).toBe("new");
    expect(config.title).toBe("Recently Added");
  });

  it("returns trending configuration and calls getTrending", async () => {
    const config = await getDiscoveryConfiguration("trending");
    expect(mockFacade.getTrending).toHaveBeenCalledWith({ period: "daily", limit: 24, page: 1 });
    expect(config.mode).toBe("trending");
    expect(config.title).toBe("Popular Now");
  });
});
