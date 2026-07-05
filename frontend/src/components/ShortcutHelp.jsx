function ShortcutHelp({ onClose }) {
  const shortcuts = [
    ["F1", "Open Keyboard Help"],
    ["Esc", "Close Help"],
    ["Alt + H", "Dashboard"],
    ["Alt + C", "Customers"],
    ["Alt + U", "Suppliers"],
    ["Alt + I", "Inventory"],
    ["Alt + P", "Purchase"],
    ["Alt + S", "Sales"],
    ["Alt + R", "Reports"],
    ["Ctrl + K", "Open Command Palette"],
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold">⌨ Keyboard Shortcuts</h2>

          <button
            onClick={onClose}
            className="text-3xl hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {shortcuts.map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between border-b py-3"
            >
              <kbd className="bg-slate-200 rounded px-3 py-1 font-semibold">
                {key}
              </kbd>

              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShortcutHelp;