import { ArchiveBookHandler } from "./ArchiveBookCommand";
import { RestoreBookHandler } from "./RestoreBookCommand";
import { ReplaceBookFilesHandler } from "./ReplaceBookFilesCommand";
import { ChangeBookLanguageHandler } from "./ChangeBookLanguageCommand";

describe("Deferred Book Management Commands", () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("ArchiveBookHandler should not throw and should warn", async () => {
    const handler = new ArchiveBookHandler();
    await expect(handler.execute({ id: "book-123" })).resolves.not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("[Deferred]"));
  });

  it("RestoreBookHandler should not throw and should warn", async () => {
    const handler = new RestoreBookHandler();
    await expect(handler.execute({ id: "book-123" })).resolves.not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("[Deferred]"));
  });

  it("ReplaceBookFilesHandler should not throw and should warn", async () => {
    const handler = new ReplaceBookFilesHandler();
    await expect(handler.execute({ id: "book-123", files: [] })).resolves.not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("[Deferred]"));
  });

  it("ChangeBookLanguageHandler should not throw and should warn", async () => {
    const handler = new ChangeBookLanguageHandler();
    await expect(handler.execute({ id: "book-123", language: "fr" })).resolves.not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("[Deferred]"));
  });
});
