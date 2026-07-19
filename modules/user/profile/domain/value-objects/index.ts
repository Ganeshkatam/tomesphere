import { ValueObject } from "@/modules/core/domain/ValueObject";
import { ValidationError } from "@/modules/core/domain/DomainError";

interface DisplayNameProps {
  value: string;
}

export class DisplayName extends ValueObject<DisplayNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: DisplayNameProps) {
    super(props);
  }

  static create(name: string): DisplayName {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      throw new ValidationError(
        "Display name must be at least 2 characters long.",
      );
    }
    if (trimmed.length > 50) {
      throw new ValidationError("Display name cannot exceed 50 characters.");
    }
    return new DisplayName({ value: trimmed });
  }
}

interface AvatarUrlProps {
  value: string;
}

export class AvatarUrl extends ValueObject<AvatarUrlProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: AvatarUrlProps) {
    super(props);
  }

  static create(url: string): AvatarUrl {
    const trimmed = url.trim();
    if (
      trimmed &&
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://") &&
      !trimmed.startsWith("/")
    ) {
      throw new ValidationError("Avatar URL must be a valid URL or path.");
    }
    return new AvatarUrl({ value: trimmed });
  }
}

interface BiographyProps {
  value: string;
}

export class Biography extends ValueObject<BiographyProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BiographyProps) {
    super(props);
  }

  static create(bio: string): Biography {
    const trimmed = bio.trim();
    if (trimmed.length > 500) {
      throw new ValidationError("Biography cannot exceed 500 characters.");
    }
    return new Biography({ value: trimmed });
  }
}

interface LocationProps {
  value: string;
}

export class Location extends ValueObject<LocationProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: LocationProps) {
    super(props);
  }

  static create(location: string): Location {
    const trimmed = location.trim();
    if (trimmed.length > 100) {
      throw new ValidationError("Location cannot exceed 100 characters.");
    }
    return new Location({ value: trimmed });
  }
}
