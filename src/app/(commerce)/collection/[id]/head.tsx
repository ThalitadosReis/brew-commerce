import Preload from "@/components/Preload";
import { PRODUCT_STATIC_IMAGES } from "@/lib/images";

export default function Head() {
  return <Preload images={PRODUCT_STATIC_IMAGES} />;
}
