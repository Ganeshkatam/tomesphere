import { ValueObject } from "@/shared/kernel/ValueObject";

export interface BookFileProps {
  id: string;
  format: string;
  storagePath: string;
  mimeType: string;
  checksum: string | null;
  size: number | null;
  version: number;
  isPrimary: boolean;
}

export class BookFile extends ValueObject<BookFileProps> {
  private constructor(props: BookFileProps) {
    super(props);
  }

  static create(props: BookFileProps): BookFile {
    return new BookFile(props);
  }

  get id(): string {
    return this.props.id;
  }
  get format(): string {
    return this.props.format;
  }
  get storagePath(): string {
    return this.props.storagePath;
  }
  get mimeType(): string {
    return this.props.mimeType;
  }
  get checksum(): string | null {
    return this.props.checksum;
  }
  get size(): number | null {
    return this.props.size;
  }
  get version(): number {
    return this.props.version;
  }
  get isPrimary(): boolean {
    return this.props.isPrimary;
  }
}
