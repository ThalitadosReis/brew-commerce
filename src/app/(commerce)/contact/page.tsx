"use client";

import FormSection from "@/components/contact/FormSection";
import LocationSection from "@/components/contact/LocationSection";

export default function ContactPage() {
  return (
    <div className="bg-black/5 py-24 space-y-24 lg:space-y-32">
      <div className="max-w-2xl mx-auto text-center py-24 px-6 space-y-8">
        <h1 className="text-5xl md:text-6xl font-heading">Connect with us</h1>
        <p className="text-sm font-body">
          {
            "Drop us a line and let's start a conversation about your coffee journey"
          }
        </p>
      </div>

      <FormSection />
      <LocationSection />
    </div>
  );
}
