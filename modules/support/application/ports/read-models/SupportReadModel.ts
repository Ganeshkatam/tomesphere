import { FaqDto } from "../../dto/FaqDto";

export interface SupportReadModel {
  getFaqs(): Promise<FaqDto[]>;
}
