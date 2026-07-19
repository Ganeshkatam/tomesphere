const fs = require('fs');

function replaceFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(path, content);
  console.log('Fixed', path);
}

replaceFile('modules/reading/reader/application/commands/StartReadingSession/handler.ts', [
  ['return {\r\n        success: true,\r\n        data: { sessionId: session.id },\r\n      };', 'return { sessionId: session.id };'],
  ['return {\n        success: true,\n        data: { sessionId: session.id },\n      };', 'return { sessionId: session.id };']
]);

replaceFile('modules/reading/reader/application/commands/FinishReadingSession/handler.ts', [
  ['return {\r\n        success: true,\r\n        data: { sessionId: session.id, durationSeconds: session.totalDurationSeconds },\r\n      };', 'return { sessionId: session.id, durationSeconds: session.totalDurationSeconds };'],
  ['return {\n        success: true,\n        data: { sessionId: session.id, durationSeconds: session.totalDurationSeconds },\n      };', 'return { sessionId: session.id, durationSeconds: session.totalDurationSeconds };']
]);

replaceFile('modules/reading/reader/application/commands/LogHighlight/handler.ts', [
  ['return {\r\n        success: true,\r\n        data: { highlightId: highlight.id },\r\n      };', 'return { highlightId: highlight.id };'],
  ['return {\n        success: true,\n        data: { highlightId: highlight.id },\n      };', 'return { highlightId: highlight.id };']
]);

replaceFile('modules/reading/search/actions/search.ts', [
  ['import { ActionResult } from "@/shared/core/types/ActionResult";\n', ''],
  ['import { ActionResult } from "@/shared/core/types/ActionResult";\r\n', ''],
  ['return {\n      success: true,\n      data: result,\n    };', 'return result;'],
  ['return {\r\n      success: true,\r\n      data: result,\r\n    };', 'return result;']
]);

replaceFile('modules/reading/library/actions/library.ts', [
  ['import { ActionResult } from "@/shared/core/types/ActionResult";\n', ''],
  ['import { ActionResult } from "@/shared/core/types/ActionResult";\r\n', '']
]);

replaceFile('modules/reading/reader/application/ReaderService.ts', [
  ['if (!highlightsRes.success) throw new Error(highlightsRes.error);', ''],
  ['if (!highlightsRes) throw new Error("Failed to get highlights");', ''],
  ['highlightsRes.data', 'highlightsRes'],
  ['if (!res.success) throw new Error(res.error);', ''],
  ['res.data', 'res'],
  ['if (!notesRes.success) throw new Error(notesRes.error);', ''],
  ['notesRes.data', 'notesRes'],
  ['if (!bookmarksRes.success) throw new Error(bookmarksRes.error);', ''],
  ['bookmarksRes.data', 'bookmarksRes']
]);

replaceFile('modules/reading/reader/presentation/screens/ReadingScreen.tsx', [
  ['if (!bookRes.success) throw new Error("Failed to load book");', ''],
  ['const bookDetail = bookRes.data;', 'const bookDetail = bookRes;'],
  ['if (!userRes.success) throw new Error("User not found");', ''],
  ['const user = userRes.data;', 'const user = userRes;']
]);

replaceFile('modules/reading/search/components/SearchClient.tsx', [
  ['if (!res.success) {', 'if (false) {'],
  ['const { books, count, page: newPage, hasMore: more } = res.data;', 'const { books, count, page: newPage, hasMore: more } = res;'],
  ['setResults(res.data.books);', 'setResults(res.books);'],
  ['setResults((prev) => [...prev, ...res.data.books]);', 'setResults((prev) => [...prev, ...res.books]);']
]);

replaceFile('modules/reading/search/components/SearchSuggestions.tsx', [
  ['if (json.success && json.data) {', 'if (json) {'],
  ['json.data.forEach', 'json.forEach'],
  ['setSuggestions(json.data);', 'setSuggestions(json);']
]);

replaceFile('modules/reading/search/presentation/screens/SearchScreen.tsx', [
  ['const initialBooks = initialResults.success ? initialResults.data.books : [];', 'const initialBooks = initialResults.books || [];'],
  ['const initialCount = initialResults.success ? initialResults.data.count : 0;', 'const initialCount = initialResults.count || 0;'],
  ['const hasMore = initialResults.success ? initialResults.data.hasMore : false;', 'const hasMore = initialResults.hasMore || false;']
]);

replaceFile('modules/user/profile/actions/notifications.ts', [
  ['if (!res.success) {', 'if (!res) {'],
  ['return { email: res.data.email || "", phone: res.data.phone || "" };', 'return { email: res.email || "", phone: res.phone || "" };']
]);

replaceFile('modules/user/profile/presentation/components/ProfileEditForm.tsx', [
  ['if (uploadRes.success) {', 'if (uploadRes) {'],
  ['avatar_url: uploadRes.url,', 'avatar_url: uploadRes,'],
  ['avatar_url: uploadRes.url,', 'avatar_url: uploadRes,']
]);

replaceFile('modules/shared/navigation/components/QuickAccessSidebar.tsx', [
  ['const isLoggedIn = sessionRes.success ? sessionRes.data.isLoggedIn : false;', 'const isLoggedIn = sessionRes ? sessionRes.isLoggedIn : false;']
]);

// Handle reading home widgets
const widgets = [
  'LibraryWidget', 'ReadingCalendarWidget', 'StatisticsWidget', 'StreakWidget', 'SuggestedReadsWidget'
];
widgets.forEach(w => {
  try {
    const p = `modules/reading/home/components/widgets/${w}.tsx`;
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/if \(\!result \|\| \!result\.success\) \{/g, 'if (!result) {');
    c = c.replace(/if \(!result\.success\) return null;/g, 'if (!result) return null;');
    c = c.replace(/result\.error/g, '"Error"');
    c = c.replace(/result\.data/g, 'result');
    fs.writeFileSync(p, c);
  } catch (e) {}
});

replaceFile('modules/reading/home/presentation/screens/HomeScreen.tsx', [
  ['continueReadingResult.success ? continueReadingResult.data : null', 'continueReadingResult'],
  ['readingStreakResult.success && readingStreakResult.data ? readingStreakResult.data.currentStreakDays : 0', 'readingStreakResult ? readingStreakResult.currentStreakDays : 0']
]);

replaceFile('modules/reading/library/presentation/screens/LibraryScreen.tsx', [
  ['const collections = collectionsRes.success ? collectionsRes.data : [];', 'const collections = collectionsRes || [];'],
  ['setCollections(collectionsRes.success ? collectionsRes.data : []);', 'setCollections(collectionsRes || []);'],
  ['if (collectionsRes.success) {', 'if (collectionsRes) {'],
  ['setCollections(collectionsRes.data);', 'setCollections(collectionsRes);']
]);

replaceFile('modules/reading/reader/annotations/actions/sync.ts', [
  ['if (!user.success) {', 'if (!user) {'],
  ['userId: user.data.id,', 'userId: user.id,']
]);

replaceFile('modules/reading/reader/annotations/services/annotation-sync.ts', [
  ['if (!syncRes.success) {', 'if (!syncRes) {']
]);
