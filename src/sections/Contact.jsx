import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import { resumeLinks } from "../constants";
import ContactExperience from "../components/models/contact/ContactExperience";

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSubmitted) setIsSubmitted(false);
    if (submitError) setSubmitError("");
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          name: trimmedForm.name,
          email: trimmedForm.email,
          message: trimmedForm.message,
          from_name: trimmedForm.name,
          from_email: trimmedForm.email,
          reply_to: trimmedForm.email,
          to_name: "Lennox",
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
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
      setSubmitError(
        error?.text || "Message failed to send. Please try again."
      );
    } finally {
      setLoading(false); // Always stop loading, even on error
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Have questions or ideas? Let’s talk! 🚀"
        />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-5">
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
                  <div>
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

                  <div>
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
          <div className="xl:col-span-7 min-h-96">
            <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              <ContactExperience />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
