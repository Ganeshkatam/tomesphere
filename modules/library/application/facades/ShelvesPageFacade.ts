import { ShelvesPageDto } from "../dto/response/ShelvesPageDto";
import { getShelvesPage } from "../queries/GetShelvesPage/handler";
import { LibraryReadModel } from "../ports/read-models/LibraryReadModel";

export class ShelvesPageFacade {
  constructor(private readonly libraryReadModel: LibraryReadModel) {}

  async get(userId: string): Promise<ShelvesPageDto> {
    return getShelvesPage(this.libraryReadModel, userId);
  }
}
