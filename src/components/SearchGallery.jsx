import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PopupCard from "./PopupCard";
import { data } from "../data/Data";

const SearchGallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGalleryPage = location.pathname === "/gallery";
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    purpose: [],
    sector: [],
  });

  // Pick up search term passed from ThreeDimension
  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  const filterOptions = {
    Purpose: {
      key: "purpose",
      options: ["Creativity", "Information", "Community"],
    },
    Sector: {
      key: "sector",
      options: ["Public", "Private"],
    },
  };

  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const resetFilters = () => {
    setActiveFilters({ purpose: [], sector: [] });
    setSearchTerm("");
    setShowFilter(false);
  };

  const hasActiveFilters =
    activeFilters.purpose.length > 0 ||
    activeFilters.sector.length > 0 ||
    searchTerm.trim() !== "";

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      term === "" ||
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.categories?.some((c) => c.toLowerCase().includes(term)) ||
      item.sector?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term) ||
      item.altPurpose?.toLowerCase().includes(term);

    const matchesPurpose =
      activeFilters.purpose.length === 0 ||
      activeFilters.purpose.some(
        (p) => p.toLowerCase() === item.altPurpose?.toLowerCase()
      );

    const matchesSector =
      activeFilters.sector.length === 0 ||
      activeFilters.sector.some(
        (s) => s.toLowerCase() === item.sector?.toLowerCase()
      );

    return matchesSearch && matchesPurpose && matchesSector;
  });

  const handleCardClick = (item) => {
    setSelectedCard(item);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCard(null);
  };

  const itemsPerRow = 6;
  const rowCount = Math.ceil(filteredData.length / itemsPerRow);
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push(filteredData.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
  }

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Back Button */}
      {isGalleryPage && (
        <div className="absolute top-8 left-8 z-10">
          <button
            onClick={() => navigate("/")}
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
            <span
              className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ zIndex: -1 }}
            ></span>
            <span className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              ← Back
            </span>
          </button>
        </div>
      )}

      {/* Search Bar Section */}
      <div className="max-w-3xl mx-auto mb-8 w-full">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute -inset-1 bg-orange-500 rounded-full blur-lg opacity-50"></div>
            <div className="relative flex items-center bg-gradient-to-r from-amber-200 to-yellow-300 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search by name, category, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-600"
              />
              <button className="px-6 py-3 hover:bg-white/20 transition-colors">
                <Search className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Filter Button */}
          <div className="relative">
            <div className="absolute -inset-1 bg-orange-500 rounded-full blur-lg opacity-50"></div>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className={`relative p-3 bg-gradient-to-r from-amber-200 to-yellow-300 rounded-full hover:from-amber-300 hover:to-yellow-400 transition-colors ${
                activeFilters.purpose.length > 0 ||
                activeFilters.sector.length > 0
                  ? "ring-2 ring-white"
                  : ""
              }`}
            >
              <Filter className="w-6 h-6 text-gray-800" />
            </button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
                {Object.entries(filterOptions).map(
                  ([label, { key, options }]) => (
                    <div
                      key={key}
                      className="p-4 border-b border-gray-100 last:border-0"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        {label}
                      </p>
                      <div className="flex flex-col gap-1">
                        {options.map((option) => (
                          <button
                            key={option}
                            onClick={() => toggleFilter(key, option)}
                            className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              activeFilters[key].includes(option)
                                ? "bg-amber-300 text-gray-800"
                                : "text-gray-700 hover:bg-amber-100"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Reset / X Button */}
          <div className="relative">
            <div className="absolute -inset-1 bg-orange-500 rounded-full blur-lg opacity-50"></div>
            <button
              onClick={resetFilters}
              className={`relative p-3 bg-gradient-to-r from-amber-200 to-yellow-300 rounded-full hover:from-amber-300 hover:to-yellow-400 transition-colors ${
                hasActiveFilters
                  ? "opacity-100"
                  : "opacity-40 cursor-not-allowed"
              }`}
              disabled={!hasActiveFilters}
              title="Reset all filters"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        {(activeFilters.purpose.length > 0 ||
          activeFilters.sector.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {[...activeFilters.purpose, ...activeFilters.sector].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-amber-300 text-gray-800 text-xs font-bold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Result count */}
        {hasActiveFilters && (
          <p className="text-amber-200 text-sm mt-3 text-center">
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}{" "}
            found
            {searchTerm.trim() !== "" ? ` for "${searchTerm}"` : ""}
          </p>
        )}
      </div>

      {/* Gallery Grid */}
      {filteredData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-amber-200 text-2xl font-bold">No results found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {rows.map((rowItems, rowIndex) => (
            <div key={rowIndex} className="relative -mx-8">
              <div className="absolute inset-0 bg-amber-200"></div>
              <div className="relative px-4">
                <div className="grid grid-cols-6 gap-4">
                  {rowItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <div className="aspect-video w-full">
                        <img
                          src={item.thumbnailURL}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-black/50">
                        <p className="text-white text-sm font-medium truncate">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Card */}
      <PopupCard
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={selectedCard?.name || "—"}
        imageSrc={selectedCard?.thumbnailURL}
        description={selectedCard?.description}
        category={selectedCard?.categories?.join(" / ")}
        purpose={selectedCard?.altPurpose}
        link={selectedCard?.link}
        sector={selectedCard?.sector}
        status={selectedCard?.status}
        extra={selectedCard?.extra}
      />
    </div>
  );
};

export default SearchGallery;
