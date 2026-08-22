import { AnnotationsPageDto } from "../../dto/response/AnnotationsPageDto";

export interface AnnotationsReadModel {
  getAnnotationsPage(
    userId: string,
    limit: number,
    cursor: string | null,
  ): Promise<AnnotationsPageDto>;
}
