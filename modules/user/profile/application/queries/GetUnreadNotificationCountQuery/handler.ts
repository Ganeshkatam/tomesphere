export interface NotificationReadModel {
  getUnreadCount(userId: string): Promise<number>;
}

export interface GetUnreadNotificationCountQuery {
  readonly userId: string;
}

export class GetUnreadNotificationCountQueryHandler {
  constructor(private readonly repo: NotificationReadModel) {}

  async execute(query: GetUnreadNotificationCountQuery): Promise<number> {
    return await this.repo.getUnreadCount(query.userId);
  }
}
