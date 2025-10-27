import ContentBlock from "@/components/common/ContentBlock";
import { CRAFT_IMAGE } from "@/lib/images/products";

export default function CoffeeCraftSection() {
  return (
    <ContentBlock
      contentClassName="!p-0"
      subtitle="Craft"
      title="The art of coffee roasting"
      text={
        <>
          <p>
            We select only the finest beans from sustainable farms. Each batch
            is roasted with precision and care.
          </p>
          <ul className="list-disc pl-5 mt-4">
            <li>Small batch roasting ensures maximum flavor</li>
            <li>Direct trade with Ethiopian farmers</li>
            <li>Sustainable and ethical coffee production</li>
          </ul>
        </>
      }
      image={CRAFT_IMAGE}
      imagePosition="left"
    />
  );
}
