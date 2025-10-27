import Preload from "@/components/Preload";
import { ABOUT_IMAGES } from "@/lib/images/about";

export default function Head() {
  return <Preload images={ABOUT_IMAGES} />;
}
