import { Subject } from "../entities/Subject";

export interface SubjectRepository {
  findById(id: string): Promise<Subject | null>;
  save(entity: Subject): Promise<void>;
  delete(id: string): Promise<void>;
}
