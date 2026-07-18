import { ExperiencePoints } from '../value-objects/ExperiencePoints';
import { Level } from '../value-objects/Level';

/**
 * Encapsulates the algorithm for determining a user's level based on XP.
 * Extracted into a policy so it can be changed later (e.g. for seasonal balancing).
 */
export class LevelPolicy {
    static calculateLevel(xp: ExperiencePoints): Level {
        const totalXp = xp.value;
        
        // Simple baseline algorithm: 
        // Level 1: 0 - 999
        // Level 2: 1000 - 2999
        // Level 3: 3000 - 5999
        // etc. (Level N requires N * 1000 accumulated XP from previous level threshold)
        
        let level = 1;
        let minimumXp = 0;
        let nextThreshold = 1000;

        while (totalXp >= nextThreshold) {
            level++;
            minimumXp = nextThreshold;
            nextThreshold += (level * 1000);
        }

        let title = 'Reader';
        if (level >= 10) title = 'Master Reader';
        else if (level >= 5) title = 'Scholar';
        else if (level >= 2) title = 'Explorer';

        return Level.create(level, title, minimumXp);
    }
}
