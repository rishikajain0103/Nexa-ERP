function Loading({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 mt-3 text-sm">{text}</p>
      </div>
    </div>
  );
}

export default Loading;