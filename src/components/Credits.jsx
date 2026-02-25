import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewDimension from "./NewDimension";
import TrapezoidDimension from "./TrapezoidDimension";

export default function Credits() {
  const navigate = useNavigate();
  const [sceneScale, setSceneScale] = useState(1);
  const [contentScale, setContentScale] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [doorContentOpacity, setDoorContentOpacity] = useState(1);
  const [showNewDimension, setShowNewDimension] = useState(false);
  const [showTrapezoidDimension, setShowTrapezoidDimension] = useState(false);
  const [pageFadeOpacity, setPageFadeOpacity] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(true);
  const [hasTransition, setHasTransition] = useState(false);
  const timeoutRefs = useRef([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleDoorClick = (e) => {
    if (!animationComplete) {
      console.log("⚠️ Door clicked during transition - ignoring click");
      e.stopPropagation();
      return;
    }

    // Reset hover effects immediately
    e.currentTarget.style.boxShadow =
      "0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4)";
    e.currentTarget.style.transform = "scale(1)";

    const doorTransitionDuration = 2500;
    const dimensionItemsDuration = 2000;
    const showDimensionDelay = 1250;

    console.log("🚪 DOOR TRANSITION STARTED");
    console.log(
      `⏱️ Door Transition Duration: ${doorTransitionDuration}ms (${
        doorTransitionDuration / 1000
      }s)`
    );

    clearAllTimeouts();
    setAnimationComplete(false);

    // Start transition
    setHasTransition(true);

    // Fade out the door content (text, shadow, etc.)
    setDoorContentOpacity(0);

    // Trigger scene zoom
    setTimeout(() => {
      setSceneScale(8);
    }, 10);

    // Show "New Dimension" content and start content scale
    const timeout1 = setTimeout(() => {
      setShowNewDimension(true);
      setContentScale(1 / 8);
      setContentOpacity(1);
      console.log("✨ DIMENSION ITEMS TRANSITION STARTED");
      console.log(
        `⏱️ Dimension Items Duration: ${dimensionItemsDuration}ms (${
          dimensionItemsDuration / 1000
        }s) - content-fade animation`
      );
    }, showDimensionDelay);

    // Log when door finishes
    const timeout2 = setTimeout(() => {
      console.log("✅ DOOR TRANSITION FINISHED");
    }, doorTransitionDuration);

    // Log when dimension items finish
    const timeout3 = setTimeout(() => {
      console.log("✅ DIMENSION ITEMS TRANSITION FINISHED");
    }, showDimensionDelay + dimensionItemsDuration);

    // Enable button only after BOTH transitions complete
    const totalDuration = Math.max(
      doorTransitionDuration,
      showDimensionDelay + dimensionItemsDuration
    );
    const timeout4 = setTimeout(() => {
      setAnimationComplete(true);
      console.log("🔓 Button enabled - all transitions complete");
      console.log("---");
    }, totalDuration);

    console.log(
      `⏱️ Total time until button enabled: ${totalDuration}ms (${
        totalDuration / 1000
      }s)`
    );

    timeoutRefs.current.push(timeout1, timeout2, timeout3, timeout4);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();

    if (!animationComplete) {
      console.log(
        "⚠️ Return to Door button clicked during transition - ignoring click"
      );
      console.log("⏳ Please wait for animation to complete");
      return;
    }

    const transitionDuration = 2500;

    console.log("🔙 RETURN TO DOOR TRANSITION STARTED");
    console.log(
      `⏱️ Return Transition Duration: ${transitionDuration}ms (${
        transitionDuration / 1000
      }s)`
    );
    console.log(`📊 Scene Scale before: ${sceneScale}`);
    console.log(`📊 Content Scale before: ${contentScale}`);

    clearAllTimeouts();
    setAnimationComplete(false);

    // Fade out the content as zoom starts (both happen together)
    setContentOpacity(0);

    // Scene zooms out while content stays at 1/8 (keeps visual size constant)
    setTimeout(() => {
      setSceneScale(1);
      console.log("📊 Triggered: Scene scale -> 1 (zooming out)");
      console.log("📊 Content fading out simultaneously");
    }, 10);

    // After scene zoom completes, hide content and reset scales
    const timeout1 = setTimeout(() => {
      setShowNewDimension(false);
      setContentScale(1); // Reset for next time
      setContentOpacity(1); // Reset for next time
      setDoorContentOpacity(1); // No delay - instant to avoid jerk
      setHasTransition(false);
      setAnimationComplete(true);
      console.log("✅ RETURN TO DOOR TRANSITION FINISHED");
      console.log("---");
    }, transitionDuration);

    timeoutRefs.current.push(timeout1);
  };

  const handleTrapezoidClick = (e) => {
    e.stopPropagation();

    if (!animationComplete) {
      console.log("⚠️ Trapezoid clicked during transition - ignoring click");
      return;
    }

    console.log("🔺 Trapezoid clicked - fading to TrapezoidDimension");
    setAnimationComplete(false);

    // Fade out the entire page
    setPageFadeOpacity(0);

    // After fade completes, show TrapezoidDimension
    const timeout = setTimeout(() => {
      setShowTrapezoidDimension(true);
      setPageFadeOpacity(1); // Fade back in with new content
      setAnimationComplete(true);
    }, 1000);

    timeoutRefs.current.push(timeout);
  };

  const handleBackFromTrapezoid = () => {
    console.log("🔙 Returning from TrapezoidDimension");
    setAnimationComplete(false);

    // Fade out
    setPageFadeOpacity(0);

    // After fade completes, hide TrapezoidDimension
    const timeout = setTimeout(() => {
      setShowTrapezoidDimension(false);
      setPageFadeOpacity(1); // Fade back in
      setAnimationComplete(true);
    }, 1000);

    timeoutRefs.current.push(timeout);
  };

  return (
    <>
      {/* Show TrapezoidDimension if active */}
      {showTrapezoidDimension ? (
        <div
          className="w-full h-screen"
          style={{
            opacity: pageFadeOpacity,
            transition: "opacity 1000ms ease-in-out",
          }}
        >
          <TrapezoidDimension onBack={handleBackFromTrapezoid} />
        </div>
      ) : (
        /* Credits page */
        <div
          className="relative w-full h-screen overflow-hidden bg-black"
          style={{
            opacity: pageFadeOpacity,
            transition: "opacity 1000ms ease-in-out",
          }}
        >
          {/* Click blocker overlay during animations */}
          {!animationComplete && (
            <div
              className="absolute inset-0 z-[100]"
              style={{
                pointerEvents: "auto",
                cursor: "default",
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("⚠️ Click blocked - animation in progress");
              }}
            />
          )}

          {/* Back to Home button - top left corner */}
          {!showNewDimension && (
            <div className="absolute top-8 left-8 z-50">
              <button
                onClick={handleBackToHome}
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
                  ← Home
                </span>
              </button>
            </div>
          )}

          {/* Entire scene that zooms */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${sceneScale})`,
              transition: hasTransition
                ? "transform 2500ms ease-in-out"
                : "none",
              transformOrigin: "center center",
              willChange: hasTransition ? "transform" : "auto",
            }}
          >
            {/* Black background with all the text and door */}
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              {/* Top text */}
              {!showNewDimension && (
                <div className="absolute top-1/2 -translate-y-[260px] text-center">
                  <p
                    className="text-white text-3xl font-bold"
                    style={{
                      textShadow:
                        "0 0 25px rgba(255, 255, 255, 0.9), 0 0 45px rgba(255, 255, 255, 0.7)",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    Creator of the website
                  </p>
                </div>
              )}

              {/* Left side texts */}
              {!showNewDimension && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-right"
                  style={{
                    left: "200px",
                    transform: "perspective(400px) rotateY(25deg)",
                    transformOrigin: "left center",
                  }}
                >
                  <div
                    className="font-bold italic mb-0"
                    style={{
                      fontSize: "5rem",
                      fontFamily: "Georgia, serif",
                      color: "#4dd4ff",
                      textShadow:
                        "0 0 20px rgba(77, 212, 255, 0.5), 0 0 35px rgba(77, 212, 255, 0.25)",
                      lineHeight: "1.2",
                    }}
                  >
                    Star / Xue Yi
                    <br />
                    &nbsp;
                  </div>
                  <div
                    className="font-bold italic"
                    style={{
                      fontSize: "5rem",
                      fontFamily: "Georgia, serif",
                      color: "#4dd4ff",
                      textShadow:
                        "0 0 20px rgba(77, 212, 255, 0.5), 0 0 35px rgba(77, 212, 255, 0.25)",
                      lineHeight: "1.2",
                    }}
                  >
                    Programmer
                  </div>
                </div>
              )}

              {/* Right side texts */}
              {!showNewDimension && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-left"
                  style={{
                    right: "200px",
                    transform: "perspective(400px) rotateY(-25deg)",
                    transformOrigin: "right center",
                  }}
                >
                  <div
                    className="font-bold italic mb-0"
                    style={{
                      fontSize: "5rem",
                      fontFamily: "Georgia, serif",
                      color: "#ffb366",
                      textShadow:
                        "0 0 20px rgba(255, 179, 102, 0.5), 0 0 35px rgba(255, 179, 102, 0.25)",
                      lineHeight: "1.2",
                      paddingTop: "1rem",
                    }}
                  >
                    RJ / Alvin Koay
                    <br />
                    &nbsp;
                  </div>
                  <div
                    className="font-bold italic"
                    style={{
                      fontSize: "5rem",
                      fontFamily: "Georgia, serif",
                      color: "#ffb366",
                      textShadow:
                        "0 0 20px rgba(255, 179, 102, 0.5), 0 0 35px rgba(255, 179, 102, 0.25)",
                      lineHeight: "1.2",
                    }}
                  >
                    Researching
                    <br />
                    design
                  </div>
                </div>
              )}

              {/* Door container */}
              <div className="relative">
                {/* Shadow below door - now clickable trapezoid */}
                {!showNewDimension && (
                  <>
                    {/* Blurred trapezoid background */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 bg-white blur-sm transition-opacity duration-300"
                      style={{
                        width: "656px",
                        height: "200px",
                        clipPath:
                          "polygon(30.5% 0%, 69.5% 0%, 100% 100%, 0% 100%)",
                        transformOrigin: "top center",
                        opacity: 0.6,
                        pointerEvents: "none",
                      }}
                      id="trapezoid-bg"
                    ></div>

                    {/* Invisible clickable area + Gratitude text */}
                    <div
                      onClick={handleTrapezoidClick}
                      className={`absolute top-full left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300 ${
                        animationComplete && !showNewDimension
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      style={{
                        width: "656px",
                        height: "200px",
                        clipPath:
                          "polygon(30.5% 0%, 69.5% 0%, 100% 100%, 0% 100%)",
                        pointerEvents: showNewDimension ? "none" : "auto",
                      }}
                      onMouseEnter={(e) => {
                        if (animationComplete && !showNewDimension) {
                          const bg = document.getElementById("trapezoid-bg");
                          if (bg) bg.style.opacity = "0.8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!showNewDimension) {
                          const bg = document.getElementById("trapezoid-bg");
                          if (bg) bg.style.opacity = "0.6";
                        }
                      }}
                    >
                      <p
                        className="text-black text-xl font-bold transition-all duration-300"
                        style={{
                          pointerEvents: "none",
                          fontFamily: "Georgia, serif",
                          fontStyle: "italic",
                          marginTop: "20px",
                        }}
                        id="gratitude-text"
                      >
                        Gratitude
                      </p>
                    </div>
                  </>
                )}

                {/* The door */}
                <div
                  onClick={handleDoorClick}
                  className={`w-64 h-96 bg-white flex items-center justify-center relative transition-all duration-300 ${
                    animationComplete && !showNewDimension
                      ? "cursor-pointer hover:scale-105"
                      : "cursor-default"
                  }`}
                  style={{
                    boxShadow:
                      "0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4)",
                    transform: animationComplete ? undefined : "scale(1)",
                    pointerEvents: showNewDimension ? "none" : "auto",
                  }}
                  onMouseEnter={(e) => {
                    if (animationComplete && !showNewDimension) {
                      e.currentTarget.style.boxShadow =
                        "0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4)";
                  }}
                >
                  {/* Click to enter text - inside door */}
                  {!showNewDimension && animationComplete && (
                    <p
                      className="text-black text-sm tracking-wide font-medium absolute"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      Click to enter
                    </p>
                  )}

                  {/* New Dimension content */}
                  {showNewDimension && (
                    <div
                      className="text-center"
                      style={{
                        transform: `scale(${contentScale})`,
                        opacity: contentOpacity,
                        transition: hasTransition
                          ? "transform 2500ms ease-in-out, opacity 2500ms ease-in-out"
                          : "none",
                        willChange: hasTransition
                          ? "transform, opacity"
                          : "auto",
                      }}
                    >
                      <NewDimension
                        onReturnClick={handleBackClick}
                        animationComplete={animationComplete}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style>{`
        @keyframes content-fade {
          0% {
            opacity: 0;
          }
          100% { 
            opacity: 1;
          }
        }
        .animate-content-fade {
          animation: content-fade 2s ease-out forwards;
        }
      `}</style>
        </div>
      )}
    </>
  );
}
