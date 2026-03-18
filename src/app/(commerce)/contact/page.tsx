"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import FormSection from "@/components/contact/FormSection";
import LocationSection from "@/components/contact/LocationSection";

import { CONTACT_LOCATION_IMAGES } from "@/lib/images";

export default function ContactPage() {
  return (
    <>
      <Reveal>
        <PageHeader
          title="Connect with us"
          description="Drop us a line and let's start a conversation about your coffee journey"
          backgroundImage={CONTACT_LOCATION_IMAGES[0]}
        />
      </Reveal>
      <Reveal direction="right" delay={0.08}>
        <FormSection />
      </Reveal>
      <Reveal delay={0.08}>
        <LocationSection />
      </Reveal>
    </>
  );
}
