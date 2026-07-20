const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceStr) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(searchRegex, replaceStr);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${filePath}`);
        }
    }
}

// Me module issues
replaceInFile('app/(workspace)/me/collections/page.tsx', /SupabaseDashboardReadModel(Repository)?/g, 'SupabaseDashboardReadModel');
replaceInFile('app/(workspace)/me/page.tsx', /SupabaseDashboardReadModel(Repository)?/g, 'SupabaseDashboardReadModel');
replaceInFile('app/api/v1/me/dashboard/route.ts', /SupabaseDashboardReadModel(Repository)?/g, 'SupabaseDashboardReadModel');

// Rename the me dashboard read model if it wasn't renamed correctly
if (fs.existsSync('modules/me/application/repositories/DashboardReadModelRepository.ts')) {
    if (!fs.existsSync('modules/me/application/ports/read-models')) {
        fs.mkdirSync('modules/me/application/ports/read-models', { recursive: true });
    }
    fs.renameSync('modules/me/application/repositories/DashboardReadModelRepository.ts', 'modules/me/application/ports/read-models/DashboardReadModel.ts');
}

if (fs.existsSync('modules/me/infrastructure/repositories/SupabaseDashboardReadModelRepository.ts')) {
    if (!fs.existsSync('modules/me/infrastructure/read-models')) {
        fs.mkdirSync('modules/me/infrastructure/read-models', { recursive: true });
    }
    fs.renameSync('modules/me/infrastructure/repositories/SupabaseDashboardReadModelRepository.ts', 'modules/me/infrastructure/read-models/SupabaseDashboardReadModel.ts');
}

// Also rename SupabaseDashboardReadModelRepository inside the file
replaceInFile('modules/me/infrastructure/read-models/SupabaseDashboardReadModel.ts', /SupabaseDashboardReadModelRepository/g, 'SupabaseDashboardReadModel');
replaceInFile('modules/me/infrastructure/read-models/SupabaseDashboardReadModel.ts', /DashboardReadModelRepository/g, 'DashboardReadModel');


// DiscoveryReadModel issues
replaceInFile('modules/discovery/application/ports/read-models/DiscoveryReadModel.ts', /\.\.\/queries/g, '../../queries');

// LibraryReadModel issues
replaceInFile('modules/library/application/ports/read-models/LibraryReadModel.ts', /\.\.\/\.\.\/application\/dto/g, '../../dto');

// Dashboard handler
replaceInFile('modules/me/application/queries/GetDashboardOverview/handler.ts', /\.\.\/\.\.\/ports\/read-models/g, '../../ports/read-models');

// Announcements
replaceInFile('modules/platform/announcements/application/ports/read-models/AnnouncementReadModel.ts', /\.\.\/\.\.\/application\/dto/g, '../../dto');
replaceInFile('modules/platform/announcements/application/queries/GetActiveAnnouncements/handler.ts', /\.\.\/\.\.\/\.\.\/\.\.\/application/g, '../../../application');

// Statistics
replaceInFile('modules/platform/statistics/application/ports/read-models/PlatformStatisticsReadModel.ts', /\.\.\/\.\.\/application\/queries/g, '../../queries');
replaceInFile('modules/platform/statistics/application/queries/GetPlatformStatistics/handler.ts', /\.\.\/\.\.\/\.\.\/\.\.\/application/g, '../../../application');

// Support
replaceInFile('modules/platform/support/application/ports/read-models/SupportReadModel.ts', /\.\.\/\.\.\/application\/dto/g, '../../dto');

// Ensure HomeScreen uses new names
replaceInFile('modules/reading/home/presentation/screens/HomeScreen.tsx', /Supabase(.*?)\/repositories\/Supabase(.*?)ReadRepository/g, 'Supabase$1/read-models/Supabase$2ReadModel');

console.log("Fixes applied!");
