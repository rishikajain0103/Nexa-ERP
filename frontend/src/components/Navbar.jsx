function Navbar({ onOpenShortcuts }) {
  const user = JSON.parse(localStorage.getItem("nexa_user")) || {};

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-bold">Nexa ERP</h2>
        <p className="text-slate-500 text-sm">
          Keyboard First Business Software
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onOpenShortcuts}
          className="bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2"
        >
          ⌨ Keyboard Shortcuts
        </button>

        <div className="text-right">
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {(user.full_name || "U")[0]}
        </div>
      </div>
    </header>
  );
}

export default Navbar;