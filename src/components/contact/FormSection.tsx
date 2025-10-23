"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  CircleNotchIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import Button from "../common/Button";

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
    icon: <EnvelopeIcon size={32} weight="light" />,
  },
  {
    heading: "Phone",
    info: "+14 76 123 45 67",
    text: "Our team is ready to chat about your coffee needs",
    icon: <PhoneIcon size={32} weight="light" />,
  },
  {
    heading: "Office",
    info: "123 Coffee St, Roastery City",
    text: "Visit our roastery and experience our coffee craft",
    icon: <MapPinIcon size={32} weight="light" />,
  },
  {
    heading: "Hours",
    info: "",
    text: "",
    icon: <ClockIcon size={32} weight="light" />,
  },
];

export default function FormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // clear status message
  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus.type]);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="mb-12 lg:mb-24 space-y-4">
        <h5 className="text-lg font-heading">Reach</h5>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading">
          Get in Touch
        </h2>
        <p className="text-body">
          We select beans with precision, roast with care, and deliver pure
          flavor in every package.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitStatus.type && (
            <div
              className={`p-4 border ${
                submitStatus.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 bg-black/5 border border-transparent placeholder-black/30 focus:outline-none focus:border-black/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block font-heading text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black/5 border border-transparent placeholder-black/30 focus:outline-none focus:border-black/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-heading text-sm mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-black/5 border border-transparent placeholder-black/30 focus:outline-none focus:border-black/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-heading text-sm mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Tell us more about your inquiry..."
              className="w-full px-4 py-3 bg-black/5 border border-transparent placeholder-black/30 focus:outline-none focus:border-black/10 focus:bg-white transition-all resize-none"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2"
          >
            {isSubmitting && (
              <CircleNotchIcon className="w-5 h-5 animate-spin" weight="bold" />
            )}
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
          </Button>
        </form>

        {/* grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {contactItems.map((item, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-xl lg:text-2xl font-heading font-semibold">
                {item.heading}
              </h3>
              <p className="text-sm text-black/70">{item.text}</p>

              {item.heading === "Hours" ? (
                <div className="text-black/70">
                  <p>Mon-Fri: 9:00-18:00</p>
                  <p>Saturday: 10:00-16:00</p>
                  <p>Sunday: Closed</p>
                </div>
              ) : (
                <>{item.info && <p className="text-black/70">{item.info}</p>}</>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
