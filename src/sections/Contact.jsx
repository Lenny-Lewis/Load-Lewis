import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import { resumeLinks } from "../constants";
import EarthCanvas from "../canvas/Earth";

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const getSubmitErrorMessage = (error) => {
    const errorText = `${error?.text || ""} ${error?.message || ""}`.toLowerCase();

    if (errorText.includes("invalid grant")) {
      return "Email delivery is temporarily unavailable. The Gmail account connected to EmailJS needs to be reconnected.";
    }

    if (errorText.includes("gmail")) {
      return "Email delivery is temporarily unavailable. Please reconnect the Gmail account connected to EmailJS.";
    }

    return error?.text || "Message failed to send. Please try again.";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSubmitted) setIsSubmitted(false);
    if (submitError) setSubmitError("");
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic bot trap: real users should never touch this field.
    if (honeypot.trim()) {
      return;
    }

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.message) {
      setForm(trimmedForm);
      formRef.current?.reportValidity();
      return;
    }

    setSubmitError("");
    setLoading(true); // Show loading state

    try {
      const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS is not configured. Set the VITE_APP_EMAILJS_* environment variables."
        );
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: trimmedForm.name,
          email: trimmedForm.email,
          message: trimmedForm.message,
          from_name: trimmedForm.name,
          from_email: trimmedForm.email,
          reply_to: trimmedForm.email,
          to_name: "Lennox",
        },
        publicKey
      );

      // Reset form and stop loading
      setForm({ name: "", email: "", message: "" });
      setIsSubmitted(true);
    } catch (error) {
      console.error("EmailJS Error:", {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        error,
      });
      setIsSubmitted(false);
      setSubmitError(getSubmitErrorMessage(error));
    } finally {
      setLoading(false); // Always stop loading, even on error
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub={
            <>
              <img src="/images/contact.png" alt="" aria-hidden="true" />
              <span>Have questions or ideas? Let&apos;s talk!</span>
            </>
          }
        />
        <div className="grid-12-cols mt-16">
          <div className="lg:col-span-5">
            <div className="flex-center card-border rounded-xl p-10">
              <div className="w-full flex flex-col gap-8">
                <div className="contact-quick-grid">
                  <div className="contact-quick-card">
                    <p className="about-kicker">Response Time</p>
                    <h3>Within 24-48 Hours</h3>
                  </div>
                  <div className="contact-quick-card">
                    <p className="about-kicker">Location</p>
                    <h3>Kenya</h3>
                  </div>
                  <a
                    href={resumeLinks.cv}
                    download
                    className="contact-quick-card contact-download"
                  >
                    <p className="about-kicker">Resume & CV</p>
                    <h3>Download Profile</h3>
                  </a>
                </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-7"
                >
                  <input
                    type="text"
                    name="company"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="sr-only"
                  />
                  <div className="flex flex-col md:flex-row gap-7 w-full">
                    <div className="flex-1">
                      <label htmlFor="name">Your name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="What’s your good name?"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label htmlFor="email">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="What’s your email address?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can I help you?"
                      rows="5"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading}>
                    <div className="cta-button group">
                      <div className="bg-circle" />
                      <p className="text">
                        {loading
                          ? "Sending..."
                          : isSubmitted
                          ? "Message Sent"
                          : "Send Message"}
                      </p>
                      <div className="arrow-wrapper">
                        <img src="/images/arrow-down.svg" alt="arrow" />
                      </div>
                    </div>
                  </button>

                  {(isSubmitted || submitError) && (
                    <p
                      className={`text-sm ${
                        submitError ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {submitError || "Message sent successfully."}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 min-h-96">
            <div className="w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              <EarthCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
