import Preload from "@/components/Preload";
import { CONTACT_STATIC_IMAGES } from "@/lib/images";

export default function Head() {
  return <Preload images={CONTACT_STATIC_IMAGES} />;
}
