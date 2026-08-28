import { GetAutocompleteSuggestionsHandler } from "./handler";
import { GetAutocompleteSuggestionsQuery } from "./query";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

describe("GetAutocompleteSuggestionsHandler", () => {
  let mockReadModel: jest.Mocked<SupabaseSearchReadModel>;
  let handler: GetAutocompleteSuggestionsHandler;

  beforeEach(() => {
    mockReadModel = {
      search: jest.fn(),
      autocomplete: jest.fn().mockResolvedValue([
        { type: "Book", title: "Dune", subtitle: "Frank Herbert", url: "/book/dune" },
        { type: "Book", title: "Dune Messiah", subtitle: "Frank Herbert", url: "/book/dune-messiah" },
      ]),
      getRecentSearches: jest.fn(),
      getTrendingSearches: jest.fn(),
    } as any;

    handler = new GetAutocompleteSuggestionsHandler(mockReadModel);
  });

  it("should return formatted suggestions from read model", async () => {
    const result = await handler.handle(new GetAutocompleteSuggestionsQuery("du"));

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Dune");
    expect(mockReadModel.autocomplete).toHaveBeenCalledWith("du");
  });

  it("should delegate query string accurately", async () => {
    await handler.handle(new GetAutocompleteSuggestionsQuery("Foundation"));

    expect(mockReadModel.autocomplete).toHaveBeenCalledWith("Foundation");
  });
});
