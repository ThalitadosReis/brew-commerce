import Preload from "@/components/Preload";
import { HOMEPAGE_IMAGES } from "@/lib/images/home";

export default function Head() {
  return <Preload images={HOMEPAGE_IMAGES} />;
}
