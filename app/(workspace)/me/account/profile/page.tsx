export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Public Profile</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage how you appear to others on TomeSphere.</p>
      <div className="text-sm text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
        Form fields will go here...
      </div>
    </div>
  );
}
