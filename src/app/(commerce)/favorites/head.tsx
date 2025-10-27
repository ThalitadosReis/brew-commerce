import Preload from "@/components/Preload";
import { FAVORITES_STATIC_IMAGES } from "@/lib/images/favorites";

export default function Head() {
  return <Preload images={FAVORITES_STATIC_IMAGES} />;
}
