export interface UserAchievementDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earnedAt: string;
}

export interface UserAchievementsReadModel {
  getUserAchievements(userId: string): Promise<UserAchievementDto[]>;
}
