import { GetTrendingSearchesHandler } from "./handler";
import { GetTrendingSearchesQuery } from "./query";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

describe("GetTrendingSearchesHandler", () => {
  let mockReadModel: jest.Mocked<SupabaseSearchReadModel>;
  let handler: GetTrendingSearchesHandler;

  beforeEach(() => {
    mockReadModel = {
      search: jest.fn(),
      autocomplete: jest.fn(),
      getRecentSearches: jest.fn(),
      getTrendingSearches: jest.fn().mockResolvedValue(["dune", "tolkien", "cyberpunk"]),
    } as any;

    handler = new GetTrendingSearchesHandler(mockReadModel);
  });

  it("should return trending search terms from read model", async () => {
    const result = await handler.handle(new GetTrendingSearchesQuery());

    expect(result).toEqual(["dune", "tolkien", "cyberpunk"]);
    expect(mockReadModel.getTrendingSearches).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when read model returns empty list", async () => {
    mockReadModel.getTrendingSearches.mockResolvedValue([]);

    const result = await handler.handle(new GetTrendingSearchesQuery());

    expect(result).toEqual([]);
  });
});
