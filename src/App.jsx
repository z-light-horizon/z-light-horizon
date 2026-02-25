import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ContactUs from "./components/ContactUs";
import SearchGallery from "./components/SearchGallery";
import Footer from "./components/Footer";
import Credits from "./components/Credits";

const ThreeDimension = lazy(() => import("./components/ThreeDimension"));
const DigitalAssets = lazy(() => import("./components/DigitalAssets"));
const BestPick = lazy(() => import("./components/BestPick"));

function App() {
  return (
    <>
      {/* Mobile block screen */}

      {/* <div className="flex lg:hidden min-h-screen items-center justify-center bg-black px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🖥️</div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Best viewed on desktop
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            This experience was designed for larger screens. <br />
            Please visit us on a desktop or laptop for the full experience.
          </p>
        </div>
      </div> */}

      {/* Desktop only content */}
      <div className="flex min-h-screen flex-col bg-black">
        {/* <div className="hidden lg:flex min-h-screen flex-col bg-black"> */}
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={null}>
                  <ThreeDimension />
                  <DigitalAssets />
                  <BestPick />
                  <div id="contact">
                    <ContactUs />
                  </div>
                </Suspense>
              }
            />
            <Route path="/gallery" element={<SearchGallery />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </div>

        <Routes>
          <Route path="/" element={<Footer />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
