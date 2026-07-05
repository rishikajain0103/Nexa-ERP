function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;