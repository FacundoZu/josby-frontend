import { useEffect } from "react";

/**
 * Props:
 * - message: string (texto a mostrar)
 * - type: "success" | "error" | "info"
 * - onClose: () => void
 */
export default function Toast({ message, type = "info", onClose }) {
  const TYPE_STYLES = {
    success: "border-[#38A169] text-[#22543D]",
    error: "border-[#E53E3E] text-[#742A2A]",
    info: "border-[#3182CE] text-[#2A4365]",
  };

  const ICONS = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️",
  };

  // Autocierre a los 4 segundos
  useEffect(() => {
    if (!onClose) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [onClose]);

  const styleClasses = TYPE_STYLES[type] || TYPE_STYLES.info;
  const icon = ICONS[type] || ICONS.info;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex max-w-sm items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-lg ${styleClasses}`}
      >
        <div className="mt-0.5 text-lg">{icon}</div>
        <div className="flex-1 text-sm leading-snug">{message}</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-xs font-semibold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
