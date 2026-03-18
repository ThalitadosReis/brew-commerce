import Preload from "@/components/Preload";
import { COLLECTION_STATIC_IMAGES } from "@/lib/images";

export default function Head() {
  return <Preload images={COLLECTION_STATIC_IMAGES} />;
}
