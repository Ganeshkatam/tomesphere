import { DomainEvent } from "@/shared/kernel/DomainEvent";
import { ProfileDto } from "../../queries/GetProfile/read-model";

export interface UpdateProfileOutput {
  readonly output: ProfileDto;
  readonly events: DomainEvent[];
}
