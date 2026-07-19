import { ReadingSessionCompleted } from "@/modules/reading/reader/domain/Events";
import {
  ApplyReadingActivity,
  ApplyReadingActivityRequest,
} from "@/modules/user/progress/application/commands/ApplyReadingActivity/handler";

export class ReadingActivityCoordinator {
  constructor(
    private readonly applyReadingActivityHandler: ApplyReadingActivity,
  ) {}

  public async onReadingSessionCompleted(
    event: ReadingSessionCompleted,
  ): Promise<void> {
    const request: ApplyReadingActivityRequest = {
      userId: event.readerId,
      minutes: Math.ceil(event.durationSeconds / 60),
      pages: event.pagesRead,
      date: event.timestamp,
    };

    try {
      await this.applyReadingActivityHandler.execute(request);
    } catch (error) {
      console.error(
        "Failed to apply reading activity in Progress domain:",
        error,
      );
    }
  }
}
