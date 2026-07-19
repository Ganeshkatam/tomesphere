import { RemoveIndexedBookInput } from "./input";

export class RemoveIndexedBookCommand {
  constructor(public readonly input: RemoveIndexedBookInput) {}
}
