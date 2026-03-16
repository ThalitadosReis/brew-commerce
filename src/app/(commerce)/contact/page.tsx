"use client";

import Reveal from "@/components/Reveal";
import PageHeader from "@/components/common/PageHeader";
import FormSection from "@/components/contact/FormSection";
import LocationSection from "@/components/contact/LocationSection";

export default function ContactPage() {
  return (
    <>
      <Reveal>
        <PageHeader
          title="Connect with us"
          description="Drop us a line and let's start a conversation about your coffee journey"
        />
      </Reveal>
      <Reveal direction="right" delay={0.08}>
        <FormSection />
      </Reveal>
      <Reveal direction="left" delay={0.12}>
        <LocationSection />
      </Reveal>
    </>
  );
}
