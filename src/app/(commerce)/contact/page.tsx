"use client";

import PageHeader from "@/components/common/PageHeader";
import FormSection from "@/components/contact/FormSection";
import LocationSection from "@/components/contact/LocationSection";

export default function ContactPage() {
  return (
    <div className="bg-black/5 py-24 space-y-24">
      <PageHeader
        title="Connect with us"
        description="Drop us a line and let's start a conversation about your coffee journey"
      />
      <FormSection />
      <LocationSection />
    </div>
  );
}
