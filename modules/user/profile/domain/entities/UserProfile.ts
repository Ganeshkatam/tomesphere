import { AggregateRoot } from "@/modules/core/domain/AggregateRoot";
import { UserId } from "@/modules/core/domain/UserId";
import { DisplayName, AvatarUrl, Biography, Location } from "../value-objects";
import { ProfileIdentityUpdated, AvatarChanged } from "../events";

export interface UserProfileProps {
  userId: UserId;
  displayName: DisplayName;
  avatarUrl: AvatarUrl;
  biography: Biography;
  location: Location;
  updatedAt: Date;
}

export class UserProfile extends AggregateRoot<UserProfileProps> {
  get userId(): UserId {
    return this.props.userId;
  }
  get displayName(): DisplayName {
    return this.props.displayName;
  }
  get avatarUrl(): AvatarUrl {
    return this.props.avatarUrl;
  }
  get biography(): Biography {
    return this.props.biography;
  }
  get location(): Location {
    return this.props.location;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private constructor(id: string, props: UserProfileProps) {
    super(id, props);
  }

  static fromPersistence(
    id: string,
    userId: string,
    displayName: string | null,
    avatarUrl: string | null,
    biography: string | null,
    location: string | null,
    updatedAt: Date,
  ): UserProfile {
    return new UserProfile(id, {
      userId: UserId.create(userId),
      displayName: DisplayName.create(displayName || ""),
      avatarUrl: AvatarUrl.create(avatarUrl || ""),
      biography: Biography.create(biography || ""),
      location: Location.create(location || ""),
      updatedAt,
    });
  }

  updateIdentity(params: {
    displayName: string;
    biography: string;
    location: string;
  }) {
    const newDisplayName = DisplayName.create(params.displayName);
    const newBiography = Biography.create(params.biography);
    const newLocation = Location.create(params.location);

    let changed = false;

    if (this.props.displayName.value !== newDisplayName.value) {
      this.props.displayName = newDisplayName;
      changed = true;
    }
    if (this.props.biography.value !== newBiography.value) {
      this.props.biography = newBiography;
      changed = true;
    }
    if (this.props.location.value !== newLocation.value) {
      this.props.location = newLocation;
      changed = true;
    }

    if (changed) {
      this.props.updatedAt = new Date();
      this.addDomainEvent(
        new ProfileIdentityUpdated(
          this.id,
          this.props.displayName.value,
          this.props.biography.value,
          this.props.location.value,
        ),
      );
    }
  }

  changeAvatar(newUrl: string) {
    const newAvatarUrl = AvatarUrl.create(newUrl);

    if (this.props.avatarUrl.value !== newAvatarUrl.value) {
      this.props.avatarUrl = newAvatarUrl;
      this.props.updatedAt = new Date();
      this.addDomainEvent(
        new AvatarChanged(this.id, this.props.avatarUrl.value),
      );
    }
  }
}
