import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShortcutHelp from "../components/ShortcutHelp";

function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {

    const openHelp = () => {
      setShowHelp(true);
    };

    const handleKeyDown = (e) => {

      if (e.key === "F1") {
        e.preventDefault();
        setShowHelp(true);
      }

      if (e.key === "Escape") {
        setShowHelp(false);
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
    window.addEventListener("open-shortcuts", openHelp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-shortcuts", openHelp);
    };

  }, [navigate]);

  return showHelp ? (
    <ShortcutHelp onClose={() => setShowHelp(false)} />
  ) : null;
}

export default useKeyboardShortcuts;