"use client";

import { ReactNode } from "react";
import {
  CircleNotchIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { useForm, type FieldErrors } from "react-hook-form";

import Button from "../common/Button";
import Section from "../common/Section";
import { useToast } from "@/contexts/ToastContext";

type ContactItemType = {
  heading: string;
  info: string;
  text: string;
  icon: ReactNode;
};

const iconClasses = "h-7 w-7 lg:h-8 lg:w-8";
const contactItems: ContactItemType[] = [
  {
    heading: "Email",
    info: "contact@brew.com",
    text: "We'll respond within one business day",
    icon: <EnvelopeIcon weight="light" className={iconClasses} />,
  },
  {
    heading: "Phone",
    info: "+41 76 123 45 67",
    text: "Our team is ready to chat about your coffee needs",
    icon: <PhoneIcon weight="light" className={iconClasses} />,
  },
  {
    heading: "Office",
    info: "123 Coffee St, Roastery City",
    text: "Visit our roastery and experience our coffee craft",
    icon: <MapPinIcon weight="light" className={iconClasses} />,
  },
  {
    heading: "Hours",
    info: "",
    text: "",
    icon: <ClockIcon weight="light" className={iconClasses} />,
  },
];

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function FormSection() {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          "Thank you! Your message has been sent successfully.",
          "success"
        );
        reset();
      } else {
        showToast(
          data.error || "Failed to send message. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      showToast("An error occurred. Please try again later.", "error");
    }
  };

  const handleError = (errors: FieldErrors<ContactFormValues>) => {
    const orderedFields: Array<keyof ContactFormValues> = [
      "name",
      "email",
      "subject",
      "message",
    ];

    for (const field of orderedFields) {
      const fieldError = errors[field];
      if (!fieldError) continue;

      const message =
        typeof fieldError?.message === "string"
          ? fieldError.message
          : "Please double-check the highlighted field.";

      showToast(message, "error");
      break;
    }
  };

  return (
    <section className="bg-white/90">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-24">
        <Section
          className="ml-0 text-left"
          subtitle="Reach"
          title="Get in Touch"
          description="We select beans with precision, roast with care, and deliver pure flavor in every package."
        />

        <div className="grid lg:grid-cols-2 gap-8 space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit, handleError)}
            className="space-y-4"
            noValidate
          >
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm text-black/75">
                <span className="font-medium">Name</span>
                <input
                  {...register("name", {
                    required: "Please tell us your name.",
                  })}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  className="w-full font-normal bg-black/10 px-4 py-4 text-sm outline-none transition focus:bg-black/5"
                />
              </label>
              <label className="text-sm text-black/75">
                <span className="font-medium">Email</span>
                <input
                  {...register("email", {
                    required: "We need your email to get back to you.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email.",
                    },
                  })}
                  type="email"
                  placeholder="Your email address"
                  aria-invalid={Boolean(errors.email)}
                  className="w-full font-normal bg-black/10 px-4 py-4 text-sm outline-none transition focus:bg-black/5"
                />
              </label>
            </div>

            <label className="block text-sm text-black/75">
              <span className="font-medium">Subject</span>
              <input
                {...register("subject", {
                  required: "Please provide a subject.",
                })}
                placeholder="How can we help?"
                aria-invalid={Boolean(errors.subject)}
                className="w-full font-normal bg-black/10 px-4 py-4 text-sm outline-none transition focus:bg-black/5"
              />
            </label>

            <label className="block text-sm text-black/75">
              <span className="font-medium">Message</span>
              <textarea
                {...register("message", {
                  required: "Let us know how we can help.",
                })}
                rows={6}
                placeholder="Tell us more about your inquiry..."
                aria-invalid={Boolean(errors.message)}
                className="w-full font-normal bg-black/10 px-4 py-4 text-sm outline-none transition focus:bg-black/5"
              />
            </label>

            <Button
              type="submit"
              variant="primary"
              className="w-full lg:w-fit flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <CircleNotchIcon
                  className="w-5 h-5 animate-spin"
                  weight="bold"
                />
              )}
              <span>{isSubmitting ? "Sending..." : "Send message"}</span>
            </Button>
          </form>

          <div className="grid md:grid-cols-2 gap-8">
            {contactItems.map((item) => (
              <article
                key={item.heading}
                className="flex flex-col items-center text-center space-y-2"
              >
                <div className="text-black">{item.icon}</div>
                <h5 className="text-lg font-semibold text-black">
                  {item.heading}
                </h5>
                <p className="text-sm text-black/50">{item.text}</p>

                {item.heading === "Hours" ? (
                  <div className="text-sm text-black">
                    <p>Mon-Fri: 9:00-18:00</p>
                    <p>Saturday: 10:00-16:00</p>
                    <p>Sunday: Closed</p>
                  </div>
                ) : (
                  <>
                    {item.info && (
                      <p className="text-sm text-black">{item.info}</p>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
