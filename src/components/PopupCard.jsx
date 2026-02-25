import { useEffect } from "react";

function PopupCard({
  isOpen,
  onClose,
  title,
  description,
  imageSrc,
  category,
  purpose,
  link,
  sector,
  status,
  extra,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const linkClass =
    "text-2xl font-bold text-amber-200 break-words leading-tight hover:text-amber-400 underline transition-colors";
  const textClass =
    "text-2xl font-bold text-amber-200 break-words leading-tight";

  const FieldBlock = ({ label, value, isLink }) => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 opacity-70 mb-1">
        {label}
      </p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {value}
        </a>
      ) : (
        <p className={textClass}>{value || "—"}</p>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="border-[0.5px] border-amber-200 bg-[radial-gradient(circle_at_50%_60%,_rgba(255,136,0,1)_0%,_#0a0a0a_70%)] rounded-lg shadow-2xl max-w-6xl max-h-[90vh] min-h-[80vh] w-full mx-4 overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-4 pb-2">
          <h2 className="text-5xl text-amber-200 text-center font-bold">
            {title}
          </h2>
          <p className="text-md text-amber-200 text-center mt-1 font-bold">
            {description || "—"}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-amber-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 pt-4 flex justify-between items-center flex-1 overflow-y-auto gap-8">
          {/* Left side */}
          <div className="flex flex-col justify-center gap-20 w-48 flex-shrink-0">
            <FieldBlock label="Category" value={category} />
            <FieldBlock label="Purpose" value={purpose} />
            <FieldBlock label="Link" value={link} isLink />
          </div>

          {/* Center image */}
          <div className="flex items-center justify-center flex-1 h-full">
            <img
              src={imageSrc}
              alt={title}
              className="w-full rounded-lg object-cover"
              style={{ height: "60vh" }}
            />
          </div>

          {/* Right side */}
          <div className="flex flex-col justify-center gap-20 w-48 flex-shrink-0">
            <FieldBlock label="Sector" value={sector} />
            <FieldBlock label="Status" value={status} />
            <FieldBlock label="-" value={extra} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupCard;
