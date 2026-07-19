import { UserProfile } from "./UserProfile";
import { ValidationError } from "@/shared/kernel/DomainError";
import { ProfileIdentityUpdated, AvatarChanged } from "../events";

describe("UserProfile", () => {
  const validDate = new Date();

  function createValidProfile() {
    return UserProfile.fromPersistence(
      "profile-1",
      "user-1",
      "John Doe",
      "http://example.com/avatar.jpg",
      "A passionate reader.",
      "New York",
      validDate,
    );
  }

  describe("Identity updates", () => {
    it("should update identity correctly", () => {
      const profile = createValidProfile();

      profile.updateIdentity({
        displayName: "Jane Doe",
        biography: "Avid writer.",
        location: "London",
      });

      expect(profile.displayName.value).toBe("Jane Doe");
      expect(profile.biography.value).toBe("Avid writer.");
      expect(profile.location.value).toBe("London");
    });

    it("should emit ProfileIdentityUpdated only once when state changes", () => {
      const profile = createValidProfile();

      profile.updateIdentity({
        displayName: "Jane Doe",
        biography: "Avid writer.",
        location: "London",
      });

      const events = profile.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProfileIdentityUpdated);

      const event = events[0] as ProfileIdentityUpdated;
      expect(event.displayName).toBe("Jane Doe");
      expect(event.biography).toBe("Avid writer.");
      expect(event.location).toBe("London");
    });

    it("should NOT emit event if identity values are identical", () => {
      const profile = createValidProfile();

      profile.updateIdentity({
        displayName: "John Doe",
        biography: "A passionate reader.",
        location: "New York",
      });

      const events = profile.pullDomainEvents();
      expect(events).toHaveLength(0);
    });

    it("should reject empty names", () => {
      const profile = createValidProfile();

      expect(() => {
        profile.updateIdentity({
          displayName: "",
          biography: "Avid writer.",
          location: "London",
        });
      }).toThrow(ValidationError);
    });

    it("should reject biography that exceeds limit", () => {
      const profile = createValidProfile();
      const longBio = "a".repeat(501);

      expect(() => {
        profile.updateIdentity({
          displayName: "Jane Doe",
          biography: longBio,
          location: "London",
        });
      }).toThrow(ValidationError);
    });
  });

  describe("Avatar updates", () => {
    it("should validate avatar format", () => {
      const profile = createValidProfile();

      expect(() => {
        profile.changeAvatar("not-a-url");
      }).toThrow(ValidationError);
    });

    it("should emit AvatarChanged event on success", () => {
      const profile = createValidProfile();

      profile.changeAvatar("https://example.com/new-avatar.jpg");

      const events = profile.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AvatarChanged);
    });

    it("should NOT emit event if avatar URL is identical", () => {
      const profile = createValidProfile();

      profile.changeAvatar("http://example.com/avatar.jpg");

      const events = profile.pullDomainEvents();
      expect(events).toHaveLength(0);
    });
  });
});
