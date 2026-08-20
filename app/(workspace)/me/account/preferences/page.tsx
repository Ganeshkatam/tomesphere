export const dynamic = "force-dynamic";

export default function PreferencesPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">App Preferences</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize your reading experience and notifications.</p>
      <div className="text-sm text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
        Form fields will go here...
      </div>
    </div>
  );
}
