import { useState, useMemo, useCallback } from "react";
import DigitalCards from "./DigitalCards";
import InfiniteCarousel from "./InfiniteCarousel";
import PopupCard from "./PopUpCard";
import { data } from "../data/Data";

function DigitalAssets() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = useCallback((cardData) => {
    setSelectedCard(cardData);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedCard(null);
  }, []);

  const midpoint = Math.ceil(data.length / 2);

  const firstHalfItems = useMemo(
    () =>
      data.slice(0, midpoint).map((item) => (
        <div
          key={item.id}
          className="h-full w-full flex items-center justify-center"
        >
          <DigitalCards
            onCardClick={handleCardClick}
            imageSrc={item.thumbnailURL}
            imageAlt={item.name}
            title={item.name}
            description={item.description}
            category={item.categories?.join(" / ")}
            purpose={item.altPurpose}
            link={item.link}
            sector={item.sector}
            status={item.status}
            extra={item.extra}
          />
        </div>
      )),
    [handleCardClick]
  );

  const secondHalfItems = useMemo(
    () =>
      data.slice(midpoint).map((item) => (
        <div
          key={item.id}
          className="h-full w-full flex items-center justify-center"
        >
          <DigitalCards
            onCardClick={handleCardClick}
            imageSrc={item.thumbnailURL}
            imageAlt={item.name}
            title={item.name}
            description={item.description}
            category={item.categories?.join(" / ")}
            purpose={item.altPurpose}
            link={item.link}
            sector={item.sector}
            status={item.status}
            extra={item.extra}
          />
        </div>
      )),
    [handleCardClick]
  );

  return (
    <div className="bg-amber-200 min-h-screen">
      <div className="bg-black flex flex-col min-h-screen py-12">
        <div className="text-5xl px-5 text-amber-200 font-amiri italic mb-8 inline-block underline">
          Digital Assets
        </div>
        <div className="flex-1 flex flex-col justify-center gap-8">
          <InfiniteCarousel
            items={firstHalfItems}
            gap="50px"
            bgColour="bg-amber-200"
          />
          <InfiniteCarousel
            items={secondHalfItems}
            gap="50px"
            bgColour="bg-amber-200"
          />
        </div>
      </div>

      <PopupCard
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={selectedCard?.title || "—"}
        imageSrc={selectedCard?.imageSrc}
        description={selectedCard?.description}
        category={selectedCard?.category}
        purpose={selectedCard?.purpose}
        link={selectedCard?.link}
        sector={selectedCard?.sector}
        status={selectedCard?.status}
        extra={selectedCard?.extra}
      />
    </div>
  );
}

export default DigitalAssets;
