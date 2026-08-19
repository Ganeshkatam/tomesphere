import { SecurityPageDto } from "../dto/SecurityPageDto";
import { SecurityReadModel } from "../ports/SecurityReadModel";
import { ExportRequestRepository } from "../../../export/domain/repositories/ExportRequestRepository";

/**
 * Security Page Facade
 *
 * Aggregates data from SecurityReadModel (CQRS query side) and
 * ExportRequestRepository to compose the SecurityPageDto.
 *
 * Pattern: One page → One facade → One DTO
 */
export class SecurityPageFacade {
  constructor(
    private readonly securityReadModel: SecurityReadModel,
    private readonly exportRequestRepository: ExportRequestRepository,
  ) {}

  async getSecurityPage(userId: string): Promise<SecurityPageDto> {
    const [security, activeExport] = await Promise.all([
      this.securityReadModel.getSecurityOverview(userId),
      this.exportRequestRepository.findActiveRequest(userId),
    ]);

    return {
      password: {
        hasPassword: true,
        lastPasswordChange: null, // Hardcoded for V1
      },
      exportData: activeExport
        ? {
            status: activeExport.status,
            downloadUrl: activeExport.downloadUrl,
            requestedAt: activeExport.requestedAt,
          }
        : null,
      deletion: {
        canDelete: true,
      },
    };
  }
}
