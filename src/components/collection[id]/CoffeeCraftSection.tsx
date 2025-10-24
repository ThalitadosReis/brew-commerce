"use client";

import Head from "next/head";
import ContentBlock from "../common/ContentBlock";

export default function CoffeeCraftSection() {
  const image =
    "https://images.pexels.com/photos/7175961/pexels-photo-7175961.jpeg";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={image} />
      </Head>

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
        image={image}
        imagePosition="left"
      />
    </>
  );
}
