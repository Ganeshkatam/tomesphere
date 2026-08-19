import { AggregateRoot } from "@/shared/kernel/AggregateRoot";
import { UserId } from "@/shared/kernel/UserId";

export interface AppearancePreferences {
  themeMode: "light" | "dark" | "system";
  language: string;
}

export interface ReaderPreferences {
  theme: "light" | "dark" | "sepia";
  fontFamily: string;
  fontSize: string;
  lineHeight: number;
  pageMargins: number;
  scrollMode: "scroll" | "paginated";
  dictionaryLanguage: string;
  textAlignment: "left" | "justify";
  hyphenation: boolean;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  weeklyDigest: boolean;
  pushNotifications: boolean;
}

export interface UserPreferencesProps {
  userId: UserId;
  appearance: AppearancePreferences;
  reader: ReaderPreferences;
  notifications: NotificationPreferences;
  updatedAt: Date;
}

export class UserPreferences extends AggregateRoot<UserPreferencesProps> {
  get userId(): UserId {
    return this.props.userId;
  }
  get appearance(): AppearancePreferences {
    return this.props.appearance;
  }
  get reader(): ReaderPreferences {
    return this.props.reader;
  }
  get notifications(): NotificationPreferences {
    return this.props.notifications;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private constructor(id: string, props: UserPreferencesProps) {
    super(id, props);
  }

  static create(
    id: string,
    userId: string,
    appearance?: Partial<AppearancePreferences>,
    reader?: Partial<ReaderPreferences>,
    notifications?: Partial<NotificationPreferences>,
  ): UserPreferences {
    return new UserPreferences(id, {
      userId: UserId.create(userId),
      appearance: {
        themeMode: appearance?.themeMode ?? "system",
        language: appearance?.language ?? "en",
      },
      reader: {
        theme: reader?.theme ?? "light",
        fontFamily: reader?.fontFamily ?? "Inter",
        fontSize: reader?.fontSize ?? "16px",
        lineHeight: reader?.lineHeight ?? 1.6,
        pageMargins: reader?.pageMargins ?? 20,
        scrollMode: reader?.scrollMode ?? "scroll",
        dictionaryLanguage: reader?.dictionaryLanguage ?? "en",
        textAlignment: reader?.textAlignment ?? "left",
        hyphenation: reader?.hyphenation ?? false,
      },
      notifications: {
        emailAlerts: notifications?.emailAlerts ?? true,
        weeklyDigest: notifications?.weeklyDigest ?? true,
        pushNotifications: notifications?.pushNotifications ?? true,
      },
      updatedAt: new Date(),
    });
  }

  static fromPersistence(
    id: string,
    userId: string,
    appearance: AppearancePreferences,
    reader: ReaderPreferences,
    notifications: NotificationPreferences,
    updatedAt: Date,
  ): UserPreferences {
    return new UserPreferences(id, {
      userId: UserId.create(userId),
      appearance,
      reader,
      notifications,
      updatedAt,
    });
  }

  updateAppearance(appearance: Partial<AppearancePreferences>) {
    this.props.appearance = { ...this.props.appearance, ...appearance };
    this.props.updatedAt = new Date();
  }

  updateReader(reader: Partial<ReaderPreferences>) {
    this.props.reader = { ...this.props.reader, ...reader };
    this.props.updatedAt = new Date();
  }

  updateNotifications(notifications: Partial<NotificationPreferences>) {
    this.props.notifications = {
      ...this.props.notifications,
      ...notifications,
    };
    this.props.updatedAt = new Date();
  }
}
