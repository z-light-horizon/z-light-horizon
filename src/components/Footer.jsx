import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const handleClick = (name) => {
    alert(name);
  };

  return (
    <footer className="relative w-full bg-black pt-12 pb-0 m-0 overflow-hidden">
      {/* Half Oval Container */}
      <div className="relative mx-auto w-full max-w-3xl px-4">
        {/* Oval Background */}
        <div className="relative mx-auto w-full">
          {/* Glow Layer Behind */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50% / 100%",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              height: "260px",
              background:
                "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.3) 50%, rgba(251, 191, 36, 0) 100%)",
              filter: "blur(20px)",
              transform: "scale(1.1)",
            }}
          />

          {/* Main Oval */}
          <div
            className="absolute inset-0 bg-gradient-radial"
            style={{
              borderRadius: "50% / 100%",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              height: "260px",
              background:
                "radial-gradient(ellipse 80% 100% at 50% 50%, #fde68a 0%, #fcd34d 50%, #fbbf24 100%)",
              boxShadow:
                "inset 0 10px 20px rgba(180, 83, 9, 0.4), inset 0 -10px 15px rgba(180, 83, 9, 0.35), inset 15px 0 20px rgba(180, 83, 9, 0.4), inset -15px 0 20px rgba(180, 83, 9, 0.4)",
            }}
          />

          {/* Content */}
          <div className="relative h-[260px] flex flex-col items-center justify-center px-8 gap-3 pt-8">
            {/* Top Title */}
            <a
              href="#top"
              className="text-5xl md:text-6xl font-serif italic text-black hover:underline cursor-pointer text-center"
            >
              Z-Light Horizon
            </a>

            {/* Bottom Text */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-black text-lg md:text-xl font-serif">
              <button
                onClick={() => handleClick("Global")}
                className="text-3xl md:text-4xl font-bold hover:underline cursor-pointer"
              >
                Global
              </button>
              <button
                onClick={() => handleClick("Heavenly Parent's Holy Committee")}
                className="text-center hover:underline cursor-pointer"
              >
                <div className="italic text-lg md:text-xl">
                  Heavenly Parent's
                </div>
                <div className="italic -mt-1 text-lg md:text-xl">
                  Holy Committee
                </div>
              </button>
              <button
                onClick={() => handleClick("Links")}
                className="font-bold text-2xl md:text-3xl hover:underline cursor-pointer"
              >
                Links
              </button>
              <button
                onClick={() => handleClick("Center")}
                className="font-bold text-2xl md:text-3xl hover:underline cursor-pointer"
              >
                Center
              </button>
            </div>

            {/* Credits Link */}
            <Link
              to="/credits"
              className="text-black font-serif italic text-2xl md:text-3xl cursor-pointer mt-1 text-center transition-all duration-200 hover:font-bold hover:underline"
              style={{ letterSpacing: "1.9em", marginRight: "-1.9em" }}
            >
              Credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
