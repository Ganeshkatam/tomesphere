import { DomainEvent } from "@/modules/core/domain/DomainEvent";
import { ProfileDto } from "../../queries/GetProfile/read-model";

export interface UpdateProfileOutput {
  readonly output: ProfileDto;
  readonly events: DomainEvent[];
}
