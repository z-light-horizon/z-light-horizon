import React from "react";
import DimensionImg from "../assets/imgs/TP_Photo.jpg";

export default function NewDimension({ onReturnClick, animationComplete }) {
  return (
    <div
      className="animate-content-fade flex flex-col items-center justify-center"
      style={{
        width: "65rem", // Bigger width
        height: "50rem", // Bigger height
        padding: "2.5rem",
        position: "relative",
        gap: "0rem", // Bigger gap
      }}
    >
      {/* Return to Door button - top left */}
      <div className="absolute" style={{ top: "1.5rem", left: "1.5rem" }}>
        <button
          onClick={onReturnClick}
          className={`text-black font-bold relative overflow-hidden group ${
            animationComplete
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            pointerEvents: animationComplete ? "auto" : "none",
            background: "transparent",
            border: "none",
            padding: "0.4rem 0.8rem",
            fontSize: "1.3rem",
          }}
        >
          {/* White background that appears on hover */}
          <span
            className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style={{ zIndex: -1 }}
          ></span>

          {/* Black outline on hover */}
          <span className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

          {/* Text that stays black */}
          <span className="relative z-10 transition-colors duration-300">
            ← Back
          </span>
        </button>
      </div>

      {/* Text at top */}
      <div className="flex-shrink-0">
        <h1
          className="font-bold text-black tracking-tight text-center"
          style={{
            fontSize: "1.9rem",
            fontFamily: "Georgia, serif",
            lineHeight: "1.4",
          }}
        >
          And definitely
          <br />
          thank you to our
          <br />
          True Parent and Heavenly Parent
        </h1>
      </div>

      {/* Image at bottom - horizontal rectangle */}
      <div className="flex-shrink-0">
        <img
          src={DimensionImg}
          alt="Mountain landscape"
          className="rounded-lg"
          style={{
            width: "28rem",
            height: "32rem",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
