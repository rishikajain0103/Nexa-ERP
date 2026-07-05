function PageHeader({ title, subtitle, buttonText, onButtonClick }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PageHeader;