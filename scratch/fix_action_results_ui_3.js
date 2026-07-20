const fs = require('fs');

const fileFixes = {
  'modules/reading/home/components/widgets/ContinueReadingWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const book = result.data.book;', 'const book = result.book;'],
    ['const progress = result.data.progressPercentage;', 'const progress = result.progressPercentage;']
  ],
  'modules/reading/home/components/widgets/CurrentReadingWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const books = result.data.books;', 'const books = result.books;']
  ],
  'modules/reading/home/components/widgets/GoalWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const { progress, goal, isStreakActive } = result.data;', 'const { progress, goal, isStreakActive } = result;']
  ],
  'modules/reading/home/components/widgets/LibraryWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const { totalBooks, savedCollections, readingNowCount } = result.data;', 'const { totalBooks, savedCollections, readingNowCount } = result;']
  ],
  'modules/reading/home/components/widgets/ReadingCalendarWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const heatMap = result.data.activityHeatMap;', 'const heatMap = result.activityHeatMap;']
  ],
  'modules/reading/home/components/widgets/StatisticsWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const { booksCompleted, pagesRead, totalTimeMinutes } = result.data;', 'const { booksCompleted, pagesRead, totalTimeMinutes } = result;']
  ],
  'modules/reading/home/components/widgets/StreakWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const { currentStreakDays, longestStreakDays, nextMilestoneDays } = result.data;', 'const { currentStreakDays, longestStreakDays, nextMilestoneDays } = result;']
  ],
  'modules/reading/home/components/widgets/SuggestedReadsWidget.tsx': [
    ['if (!result || !result.success) {', 'if (!result) {'],
    ['<p className="text-sm text-red-400">{result.error}</p>', '<p className="text-sm text-red-400">Error</p>'],
    ['const { books, rationale } = result.data;', 'const { books, rationale } = result;']
  ],
  'modules/reading/home/presentation/screens/HomeScreen.tsx': [
    ['continueReadingResult.success ? continueReadingResult.data : null', 'continueReadingResult || null'],
    ['readingStreakResult.success && readingStreakResult.data ? readingStreakResult.data.currentStreakDays : 0', 'readingStreakResult ? readingStreakResult.currentStreakDays : 0']
  ],
  'modules/reading/library/infrastructure/read-models/SupabaseLibrarySnapshotReadModel.ts': [
    ['const [{ count: totalBooks }, { count: unreadBooks }, { count: readingNowCount }, { data: recentBooks }] =', 'const [ totalBooksObj, unreadBooksObj, readingNowCountObj, recentBooksObj ] ='],
    ['await Promise.all([', `await Promise.all([`]
  ]
};

for (const [file, replacements] of Object.entries(fileFixes)) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
      content = content.split(search).join(replace);
    }
    if (file === 'modules/reading/library/infrastructure/read-models/SupabaseLibrarySnapshotReadModel.ts') {
      content = content.replace(
        'const [ totalBooksObj, unreadBooksObj, readingNowCountObj, recentBooksObj ] =',
        `const [ totalBooksObj, unreadBooksObj, readingNowCountObj, recentBooksObj ] =`
      );
      // Let's just fix it directly with regex to avoid destructuring error
      content = content.replace(
        /const \[\{ count: totalBooks \}, \{ count: unreadBooks \}, \{ count: readingNowCount \}, \{ data: recentBooks \}\] =/g,
        `const res1 = await this.client.from("user_books").select("*", { count: "exact", head: true }).eq("user_id", userId);\n      const res2 = await this.client.from("user_books").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "unread");\n      const res3 = await this.client.from("user_books").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "reading");\n      const res4 = await this.client.from("user_books").select("books(cover_url)").eq("user_id", userId).order("updated_at", { ascending: false }).limit(4);\n      const totalBooks = res1.count; const unreadBooks = res2.count; const readingNowCount = res3.count; const recentBooks = res4.data; //`
      );
      content = content.replace(/await Promise\.all\(\[\s+this\.client\.[^\]]+\]\);/g, '');
    }
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } catch (e) { console.error(e) }
}
