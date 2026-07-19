import { UpdateIndexedBookInput } from "./input";

export class UpdateIndexedBookCommand {
  constructor(public readonly input: UpdateIndexedBookInput) {}
}
