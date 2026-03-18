"use client";

import { CircleNotchIcon } from "@phosphor-icons/react";
import { useForm, type FieldErrors } from "react-hook-form";

import Button from "../common/Button";

const contactItems = [
  {
    heading: "Email",
    info: "contact@brew.com",
  },
  {
    heading: "Phone",
    info: "+41 76 123 45 67",
  },
  {
    heading: "Office",
    info: "123 Coffee St, Roastery City",
  },
  {
    heading: "Hours",
    hours: [
      { day: "Monday – Friday", time: "9:00 – 18:00" },
      { day: "Saturday", time: "10:00 – 16:00" },
      { day: "Sunday", time: "Closed" },
    ],
  },
] as const;

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const inputClass =
  "w-full bg-transparent border-b border-black/20 py-3 text-sm outline-none transition-colors focus:border-black placeholder:text-black/30";

export default function FormSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        reset();
      } else {
        console.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  const handleError = (errors: FieldErrors<ContactFormValues>) => {
    const fields: Array<keyof ContactFormValues> = ["name", "email", "subject", "message"];
    for (const field of fields) {
      const err = errors[field];
      if (!err) continue;
      console.error(typeof err?.message === "string" ? err.message : "Please check the highlighted field.");
      break;
    }
  };

  return (
    <section className="bg-white px-4 md:px-6 py-14 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 lg:mb-14">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700 mb-3">
            Get in touch
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black max-w-xl">
            We&apos;d love to hear from you
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* form */}
          <form onSubmit={handleSubmit(onSubmit, handleError)} className="space-y-6" noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">Name</span>
                <input
                  {...register("name", { required: "Please tell us your name." })}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">Email</span>
                <input
                  {...register("email", {
                    required: "We need your email to get back to you.",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email." },
                  })}
                  type="email"
                  placeholder="Your email address"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">Subject</span>
              <input
                {...register("subject", { required: "Please provide a subject." })}
                placeholder="How can we help?"
                aria-invalid={Boolean(errors.subject)}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-2 block">Message</span>
              <textarea
                {...register("message", { required: "Let us know how we can help." })}
                rows={5}
                placeholder="Tell us more about your inquiry..."
                aria-invalid={Boolean(errors.message)}
                className={inputClass + " resize-none"}
              />
            </label>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full lg:w-fit"
            >
              {isSubmitting && <CircleNotchIcon className="w-4 h-4 animate-spin" weight="bold" />}
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>

          {/* contact info */}
          <div className="grid lg:grid-cols-2 gap-x-8 gap-y-10 content-start">
            {contactItems.map((item) => (
              <div key={item.heading} className="space-y-2 border-t border-black/10 pt-4">
                <p className="text-[11px] uppercase tracking-[0.25em] text-amber-700">
                  {item.heading}
                </p>
                {"hours" in item ? (
                  <div className="space-y-1">
                    {item.hours.map(({ day, time }) => (
                      <div key={day} className="flex justify-between gap-4 text-sm">
                        <span className="text-black/60">{day}</span>
                        <span className="font-medium text-black tabular-nums">{time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-black">{item.info}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
