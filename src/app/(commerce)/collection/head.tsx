import Preload from "@/components/Preload";
import { COLLECTION_STATIC_IMAGES } from "@/lib/images/collection";

export default function Head() {
  return <Preload images={COLLECTION_STATIC_IMAGES} />;
}
