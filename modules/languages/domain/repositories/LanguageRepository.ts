import { Language } from "../entities/Language";

export interface LanguageRepository {
  findById(id: string): Promise<Language | null>;
  findByCode(code: string): Promise<Language | null>;
  list(): Promise<Language[]>;
  save(entity: Language): Promise<void>;
  delete(id: string): Promise<void>;
}
