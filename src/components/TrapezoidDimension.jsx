import React from "react";

export default function TrapezoidDimension({ onBack }) {
  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #c9a961 0%, #d4af37 25%, #8b7355 50%, #4a4a4a 100%)",
      }}
    >
      <div className="text-center max-w-4xl px-8">
        {/* Gratitude Title */}
        <h1
          className="text-white font-bold mb-16"
          style={{
            fontSize: "6rem",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          Gratitude
        </h1>

        {/* Thank you message */}
        <p
          className="text-white mb-12"
          style={{
            fontSize: "2rem",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            lineHeight: "1.6",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Thank you to Abel on Discord as well for doing it too,
          <br />
          even if on a smaller scale — and thank you to his sources as well.
          <br />I really appreciate all the effort
        </p>

        {/* Return button - top left corner */}
        <div className="absolute top-8 left-8">
          <button
            onClick={onBack}
            className="text-white font-bold relative overflow-hidden group"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              background: "transparent",
              border: "none",
              padding: "0.5rem 1rem",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            {/* White background that appears on hover */}
            <span
              className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ zIndex: -1 }}
            ></span>

            {/* Black outline on hover */}
            <span className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            {/* Text that changes color on hover */}
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              ← Back
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
