import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ShortcutHelp from "../components/ShortcutHelp";
import CommandPalette from "../components/CommandPalette";

function DashboardLayout({ children }) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        setShowShortcuts(true);
      }

      if (e.key === "Escape") {
        setShowShortcuts(false);
        setShowCommandPalette(false);
      }

      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      if (e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/dashboard");
      }

      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        navigate("/customers");
      }

      if (e.altKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        navigate("/suppliers");
      }

      if (e.altKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        navigate("/inventory");
      }

      if (e.altKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/purchase");
      }

      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        navigate("/sales");
      }

      if (e.altKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        navigate("/reports");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {showShortcuts && (
        <ShortcutHelp onClose={() => setShowShortcuts(false)} />
      )}

      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}

      <Sidebar />

      <main className="flex-1">
        <Navbar onOpenShortcuts={() => setShowShortcuts(true)} />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;