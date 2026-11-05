import { Component, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useReducedMotion } from "framer-motion";

import TitleHeader from "../components/TitleHeader";
import Globe3D from "@/components/ui/3d-globe";
import useInView from "../hooks/useInView";

// Kept outside the component so the globe's settings stay stable between renders.
const HOME_BASE = { lat: -1.2921, lng: 36.8219, label: "Nairobi" };

// A spread across every inhabited continent, standing in for worldwide reach.
const ROUTE_DESTINATIONS = [
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
  { lat: 43.6532, lng: -79.3832, label: "Toronto" },
  { lat: 19.4326, lng: -99.1332, label: "Mexico City" },
  { lat: 4.711, lng: -74.0721, label: "Bogotá" },
  { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
  { lat: -34.6037, lng: -58.3816, label: "Buenos Aires" },
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 40.4168, lng: -3.7038, label: "Madrid" },
  { lat: 52.52, lng: 13.405, label: "Berlin" },
  { lat: 59.3293, lng: 18.0686, label: "Stockholm" },
  { lat: 41.0082, lng: 28.9784, label: "Istanbul" },
  { lat: 6.5244, lng: 3.3792, label: "Lagos" },
  { lat: 30.0444, lng: 31.2357, label: "Cairo" },
  { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { lat: 19.076, lng: 72.8777, label: "Mumbai" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  { lat: -6.2088, lng: 106.8456, label: "Jakarta" },
  { lat: 31.2304, lng: 121.4737, label: "Shanghai" },
  { lat: 25.033, lng: 121.5654, label: "Taipei" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  { lat: -36.8509, lng: 174.7645, label: "Auckland" },
];

// Less ambient light and a stronger sun give the Moon real shadows. The starting
// turn puts Nairobi just left of centre, so the spin carries it across the view.
const GLOBE_CONFIG = {
  bumpScale: 5,
  autoRotateSpeed: 1,
  showSpace: true,
  ambientIntensity: 0.3,
  pointLightIntensity: 2,
  routes: { origin: HOME_BASE, destinations: ROUTE_DESTINATIONS },
  initialRotation: { x: 0.15, y: ((-90 - HOME_BASE.lng - 25) * Math.PI) / 180 },
};
const STILL_GLOBE_CONFIG = { ...GLOBE_CONFIG, autoRotateSpeed: 0 };

// The preloader holds the page until this fires.
const announceGlobeReady = () => {
  window.__CONTACT_3D_READY__ = true;
  window.dispatchEvent(new CustomEvent("contact-3d-ready"));
};

// No WebGL or a failed texture only loses the globe, not the page around it.
class GlobeBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    announceGlobeReady();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const Contact = () => {
  const reduceMotion = useReducedMotion();
  const { elementRef: globeRef, isInView: globeInView } = useInView({ rootMargin: "200px" });
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
              <img src="/images/contact/contact.png" alt="" aria-hidden="true" />
              <span>Have questions or ideas? Let&apos;s talk!</span>
            </>
          }
        />
        <div className="grid-12-cols mt-16">
          <div className="lg:col-span-5 mt-8 lg:mt-12">
            <h2 className="contact-heading">
              Let&apos;s work
              <span>together</span>
            </h2>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form w-full flex flex-col gap-5"
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
              <div className="flex flex-col md:flex-row gap-5 w-full">
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

              <button type="submit" disabled={loading} className="contact-form-submit">
                {loading ? "Sending..." : isSubmitted ? "Message Sent" : "Send Message"}
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
          <div className="lg:col-span-7 min-h-96">
            <div ref={globeRef} className="w-full h-full rounded-3xl overflow-hidden">
              <GlobeBoundary>
                {/* Not draggable on phones: it would block page scrolling over the globe. */}
                <Globe3D
                  className="contact-globe-fade h-[350px] sm:h-[460px] md:h-[520px] lg:h-full lg:min-h-[520px] max-md:pointer-events-none"
                  config={reduceMotion ? STILL_GLOBE_CONFIG : GLOBE_CONFIG}
                  frameloop={globeInView ? "always" : "never"}
                  onReady={announceGlobeReady}
                />
              </GlobeBoundary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
