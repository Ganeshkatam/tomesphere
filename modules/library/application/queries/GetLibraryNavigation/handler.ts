import { CollectionRepository } from "../../../domain/repositories/CollectionRepository";
import {
  LibraryNavigationDto,
  SmartFilterDto,
  LibraryViewDto,
} from "../../dto/response/LibraryPageDto";

export async function getLibraryNavigation(
  collectionRepository: CollectionRepository,
  userId: string,
): Promise<LibraryNavigationDto> {
  const collections = await collectionRepository.getCollections(userId);

  const views: LibraryViewDto[] = [
    { id: "overview", type: "overview", title: "Overview" },
    { id: "status:reading", type: "status", title: "Reading" },
    { id: "status:want_to_read", type: "status", title: "Want to Read" },
    { id: "status:finished", type: "status", title: "Finished" },
  ];

  const collectionViews: LibraryViewDto[] = collections.map((c) => ({
    id: `collection:${c.id}`,
    type: "collection",
    title: c.name,
    count: c.itemCount,
  }));

  const smartFilters: SmartFilterDto[] = [
    {
      id: "smart:recently_added",
      type: "smart-filter",
      title: "Recently Added",
    },
    {
      id: "smart:recently_opened",
      type: "smart-filter",
      title: "Recently Opened",
    },
  ];

  return {
    views,
    collections: collectionViews,
    smartFilters,
  };
}
