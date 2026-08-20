import React from "react";
import { DiscoveryCategory, DiscoveryConfiguration } from "../types/DiscoveryConfiguration";
import { getDiscoveryFacade } from "../../application/facades";
import { AuthorGrid } from "../components/AuthorGrid";
import { CollectionGrid } from "../components/CollectionGrid";
import { BookGrid } from "../components/BookGrid";

export async function getDiscoveryConfiguration(
  category: DiscoveryCategory
): Promise<DiscoveryConfiguration> {
  const facade = await getDiscoveryFacade();

  switch (category) {
    case "authors": {
      const data = await facade.getAuthors({ limit: 24, page: 1 });
      return {
        mode: "authors",
        title: "Popular Authors",
        description: `Explore ${data.total} items in this category.`,
        gridContent: <AuthorGrid items={data.items} />,
      };
    }
    case "collections": {
      const data = await facade.getCollections({ limit: 24, page: 1 });
      return {
        mode: "collections",
        title: "Curated Collections",
        description: `Explore ${data.total} items in this category.`,
        gridContent: <CollectionGrid items={data.items} />,
      };
    }
    case "featured": {
      const data = await facade.getFeatured({ limit: 24, page: 1 });
      return {
        mode: "featured",
        title: "Editor's Picks",
        description: `Explore ${data.total} items in this category.`,
        gridContent: <BookGrid items={data.items} />,
      };
    }
    case "new": {
      const data = await facade.getNewArrivals({ limit: 24, page: 1 });
      return {
        mode: "new",
        title: "Recently Added",
        description: `Explore ${data.total} items in this category.`,
        gridContent: <BookGrid items={data.items} />,
      };
    }
    case "trending": {
      const data = await facade.getTrending({ period: "daily", limit: 24, page: 1 });
      return {
        mode: "trending",
        title: "Popular Now",
        description: `Explore ${data.totalCount} items in this category.`,
        gridContent: <BookGrid items={data.books} />,
      };
    }
  }
}
