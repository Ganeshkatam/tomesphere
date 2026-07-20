const fs = require('fs');
const path = require('path');

const queries = [
  'GetFeaturedBooks',
  'GetNewArrivals',
  'GetCollections',
  'GetGenres',
  'GetAuthors',
  'GetLanguages',
  'GetSubjects'
];

const basePath = path.join(__dirname, '..', 'modules', 'discovery', 'application', 'queries');

queries.forEach(q => {
  const dir = path.join(basePath, q);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const queryContent = `export interface ${q}Query {
  readonly limit: number;
  readonly page: number;
}
`;
  
  let itemType = 'Partial<import("@/modules/library/application/dto/response/BookDto").BookDto>';
  if (q === 'GetCollections') itemType = 'any';
  if (['GetGenres', 'GetAuthors', 'GetLanguages', 'GetSubjects'].includes(q)) itemType = 'string';

  const responseContent = `export interface ${q}ResponseDto {
  readonly items: ${itemType}[];
  readonly total: number;
  readonly page: number;
  readonly hasMore: boolean;
}
`;

  const handlerContent = `import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { ${q}Query } from "./query";
import { ${q}ResponseDto } from "./response";

export class ${q}Handler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(query: ${q}Query): Promise<${q}ResponseDto> {
    return this.readModel.${q.charAt(0).toLowerCase() + q.slice(1)}(query);
  }
}
`;

  fs.writeFileSync(path.join(dir, 'query.ts'), queryContent);
  fs.writeFileSync(path.join(dir, 'response.ts'), responseContent);
  fs.writeFileSync(path.join(dir, 'handler.ts'), handlerContent);
});

console.log("Scaffolded queries successfully.");
