import Preload from "@/components/Preload";
import { CONTACT_STATIC_IMAGES } from "@/lib/images.contact";

export default function Head() {
  return <Preload images={CONTACT_STATIC_IMAGES} />;
}
