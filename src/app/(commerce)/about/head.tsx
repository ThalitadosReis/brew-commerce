import Preload from "@/components/Preload";
import { ABOUT_STATIC_IMAGES } from "@/lib/images";

export default function Head() {
  return <Preload images={ABOUT_STATIC_IMAGES} />;
}
