function EmptyState({ title, message }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 mt-2">{message}</p>
    </div>
  );
}

export default EmptyState;