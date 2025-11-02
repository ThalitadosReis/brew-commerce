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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type ContactItemType = {
  heading: string;
  info: string;
  text: string;
  icon: ReactNode;
};

const contactItems: ContactItemType[] = [
  {
    heading: "Email",
    info: "contact@brew.com",
    text: "We'll respond within one business day",
    icon: <EnvelopeIcon size={32} />,
  },
  {
    heading: "Phone",
    info: "+14 76 123 45 67",
    text: "Our team is ready to chat about your coffee needs",
    icon: <PhoneIcon size={32} />,
  },
  {
    heading: "Office",
    info: "123 Coffee St, Roastery City",
    text: "Visit our roastery and experience our coffee craft",
    icon: <MapPinIcon size={32} />,
  },
  {
    heading: "Hours",
    info: "",
    text: "",
    icon: <ClockIcon size={32} />,
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
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

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
        form.reset();
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
    <section className="max-w-7xl mx-auto px-8">
      <Section
        className="ml-0 text-left"
        subtitle="Reach"
        title="Get in Touch"
        description="We select beans with precision, roast with care, and deliver pure flavor in every package."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleError)}
            className="space-y-4"
            noValidate
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Please tell us your name." }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="block text-sm mb-2">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
                        aria-invalid={fieldState.invalid}
                        className="h-auto px-4 py-4 bg-black/5 border border-transparent placeholder-black/25 focus:bg-white transition-all text-sm md:text-base aria-invalid=true:border-red-400"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "We need your email to get back to you.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email.",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="block text-sm mb-2">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        aria-invalid={fieldState.invalid}
                        className="h-auto px-4 py-4 bg-black/5 border border-transparent placeholder-black/25 focus:bg-white transition-all text-sm md:text-base aria-invalid=true:border-red-400"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "Please provide a subject." }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="block text-sm mb-2">Subject</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="How can we help?"
                      aria-invalid={fieldState.invalid}
                      className="h-auto px-4 py-4 bg-black/5 border border-transparent placeholder-black/25 focus:bg-white transition-all text-sm md:text-base aria-invalid=true:border-red-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              rules={{ required: "Let us know how we can help." }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="block text-sm mb-2">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      aria-invalid={fieldState.invalid}
                      className="h-auto px-4 py-4 bg-black/5 border border-transparent placeholder-black/25 focus:bg-white transition-all text-sm md:text-base aria-invalid=true:border-red-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full lg:w-fit flex items-center justify-center space-x-2"
            >
              {isSubmitting && (
                <CircleNotchIcon
                  className="w-5 h-5 animate-spin"
                  weight="bold"
                />
              )}
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            </Button>
          </form>
        </Form>

        {/* grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {contactItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div>{item.icon}</div>
              <h5>{item.heading}</h5>
              <p>{item.text}</p>

              {item.heading === "Hours" ? (
                <div>
                  <p>Mon-Fri: 9:00-18:00</p>
                  <p>Saturday: 10:00-16:00</p>
                  <p>Sunday: Closed</p>
                </div>
              ) : (
                <>{item.info && <p>{item.info}</p>}</>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
