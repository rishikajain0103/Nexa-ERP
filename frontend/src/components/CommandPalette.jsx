import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const commands = [
    { title: "Dashboard", shortcut: "Alt + H", path: "/dashboard" },
    { title: "Customers", shortcut: "Alt + C", path: "/customers" },
    { title: "Suppliers", shortcut: "Alt + U", path: "/suppliers" },
    { title: "Inventory", shortcut: "Alt + I", path: "/inventory" },
    { title: "Purchase Voucher", shortcut: "Alt + P", path: "/purchase" },
    { title: "Sales Voucher", shortcut: "Alt + S", path: "/sales" },
    { title: "Reports", shortcut: "Alt + R", path: "/reports" },
  ];

  const filteredCommands = commands.filter((command) =>
    command.title.toLowerCase().includes(query.toLowerCase())
  );

  const openCommand = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] pt-24 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search command... e.g. sales, inventory, reports"
            className="w-full px-4 py-4 text-lg outline-none"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command) => (
              <button
                key={command.path}
                onClick={() => openCommand(command.path)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-100 text-left"
              >
                <span className="font-semibold text-slate-800">
                  {command.title}
                </span>

                <kbd className="bg-slate-100 border px-3 py-1 rounded-lg text-sm text-slate-500">
                  {command.shortcut}
                </kbd>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No matching command found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;