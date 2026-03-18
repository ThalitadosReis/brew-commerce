"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import FormSection from "@/components/contact/FormSection";

import { CONTACT_LOCATION_IMAGES } from "@/lib/images/contact";

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
    </>
  );
}
