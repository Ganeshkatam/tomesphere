import { ProfileRepository } from '../ProfileRepository';
import { InMemoryProfileRepository } from './InMemoryProfileRepository';
import { UserProfile } from '../../entities/UserProfile';

describe('ProfileRepository Contract', () => {
    let repository: ProfileRepository;

    beforeEach(() => {
        repository = new InMemoryProfileRepository();
    });

    it('✓ should return null for a non-existent profile', async () => {
        const profile = await repository.findByUserId({ value: 'user-1', equals: () => false } as any);
        expect(profile).toBeNull();
    });

    it('✓ should save and retrieve a profile', async () => {
        const profile = UserProfile.fromPersistence(
            'user-1',
            'user-1',
            'Test User',
            'https://test.com/avatar.png',
            '',
            '',
            new Date()
        );
        profile.updateIdentity({
            displayName: 'Updated User',
            biography: 'Bio',
            location: 'Earth'
        });
        
        await repository.save(profile);
        
        const retrieved = await repository.findByUserId(profile.userId);
        
        expect(retrieved).not.toBeNull();
        expect(retrieved?.userId.value).toBe('user-1');
        expect(retrieved?.displayName.value).toBe('Updated User');
        expect(retrieved?.biography.value).toBe('Bio');
        expect(retrieved?.location.value).toBe('Earth');
        expect(retrieved?.avatarUrl.value).toBe('https://test.com/avatar.png');
    });

    it('✓ should overwrite an existing profile', async () => {
        const profile = UserProfile.fromPersistence(
            'user-1',
            'user-1',
            'Test User',
            'https://test.com/avatar.png',
            '',
            '',
            new Date()
        );
        await repository.save(profile);

        profile.updateIdentity({
            displayName: 'Updated Name',
            biography: 'Bio',
            location: 'Earth'
        });
        await repository.save(profile);

        const retrieved = await repository.findByUserId(profile.userId);
        expect(retrieved?.displayName.value).toBe('Updated Name');
    });
});
