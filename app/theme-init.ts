/**
 * Inline pre-hydration script to resolve the initial theme before React mounts.
 * This prevents theme flashing by synchronously checking localStorage and OS preferences
 * and applying the correct CSS variables/theme class to the documentElement.
 */
export const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme') || 'system';
      var isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;
