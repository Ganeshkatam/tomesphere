import { PreferencesPageDto } from "../dto/PreferencesPageDto";
import { PreferencesReadModel } from "../queries/GetPreferences";

export class PreferencesPageFacade {
  constructor(private readonly preferencesReadModel: PreferencesReadModel) {}

  async getPreferencesPage(userId: string): Promise<PreferencesPageDto> {
    const preferences = await this.preferencesReadModel.getPreferences({
      userId,
    });
    return { preferences };
  }
}
