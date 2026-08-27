import { SecurityPageDto } from "../dto/SecurityPageDto";
import { SecurityReadModel } from "../ports/SecurityReadModel";

/**
 * Security Page Facade
 *
 * Aggregates data from SecurityReadModel (CQRS query side) to compose the SecurityPageDto.
 *
 * Pattern: One page → One facade → One DTO
 */
export class SecurityPageFacade {
  constructor(
    private readonly securityReadModel: SecurityReadModel,
  ) {}

  async getSecurityPage(userId: string): Promise<SecurityPageDto> {
    const security = await this.securityReadModel.getSecurityOverview(userId);

    return {
      password: {
        hasPassword: security?.hasPassword ?? true,
        lastPasswordChange: security?.lastPasswordChange ?? null,
      },
      deletion: {
        canDelete: true,
      },
    };
  }
}
