import { ProfileRepository } from "../../domain/repositories/ProfileRepository";
import { ProfileDto } from "../queries/GetProfile/read-model";
import { getProfile } from "../queries/GetProfile/handler";
import { GetProgressDashboard, GetProgressDashboardOutput } from "../../../../progress/application/queries/GetProgressDashboard/handler";
import { UserAchievementsReadModel, UserAchievementDto } from "../../../../progress/application/ports/read-models/UserAchievementsReadModel";

export interface ProfilePageDto {
  profile: ProfileDto | null;
  progress: GetProgressDashboardOutput | null;
  badges: UserAchievementDto[];
}

export class ProfilePageFacade {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly progressQuery: GetProgressDashboard,
    private readonly achievementsReadModel: UserAchievementsReadModel
  ) {}

  async get(userId: string): Promise<ProfilePageDto> {
    const [profile, progress, badges] = await Promise.all([
      getProfile(this.profileRepo, userId).catch(() => null),
      this.progressQuery.execute(userId).catch(() => null),
      this.achievementsReadModel.getUserAchievements(userId).catch(() => []),
    ]);

    return {
      profile,
      progress,
      badges,
    };
  }
}
