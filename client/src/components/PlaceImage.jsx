import { useMemo, useState } from "react";
import {
  getDestinationImageCandidates,
  getPlaceImageCandidates,
} from "../utils/placeImages";

export default function PlaceImage({
  title,
  destination,
  fallbackImage,
  alt,
  loading = "lazy",
  ...props
}) {
  const candidates = useMemo(() => {
    if (destination) {
      return getDestinationImageCandidates(destination, fallbackImage);
    }

    return getPlaceImageCandidates(title, fallbackImage);
  }, [destination, fallbackImage, title]);

  const [imageIndex, setImageIndex] = useState(0);

  const src = candidates[imageIndex] || candidates[candidates.length - 1];

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => {
        setImageIndex((currentIndex) => {
          if (currentIndex >= candidates.length - 1) {
            return currentIndex;
          }

          return currentIndex + 1;
        });
      }}
    />
  );
}