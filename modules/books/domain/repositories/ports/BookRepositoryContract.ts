import { BookRepository } from "../BookRepository";

export function runBookRepositoryContract(
  createRepository: () => BookRepository,
) {
  describe("BookRepository Contract", () => {
    let repository: BookRepository;

    beforeEach(() => {
      repository = createRepository();
    });

    it("should pass", () => {
      expect(true).toBe(true);
    });
  });
}
