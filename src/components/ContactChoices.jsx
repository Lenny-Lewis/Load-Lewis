import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, MessageSquare, Phone } from "lucide-react";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { track } from "../lib/analytics";
import { mailtoUrl, telUrl, whatsappUrl } from "../lib/contact";

const CHOICE =
  "flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-black";
const ICON = "size-5 flex-none";

/**
 * The ways to reach Lennox, each carrying a ready-written message: WhatsApp and email
 * open with it typed, and the contact form starts with it. The list opens in place,
 * pushing what's below down, and its choices slide in like the nav pill's links.
 *
 * `message` goes in the contact form; `fullMessage` (defaults to `message`) goes in
 * WhatsApp and email, which can carry extra context such as the page link.
 * `source` and `tags` label the analytics events.
 */
const ContactChoices = ({ id, open, label, message, fullMessage = message, subject, includeCall = false, source, tags }) => {
  const reduceMotion = useReducedMotion();

  const choices = [
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon className={ICON} />,
      props: {
        href: whatsappUrl(fullMessage),
        target: "_blank",
        rel: "noreferrer",
        onClick: () => track("whatsapp_click", { whatsapp_source: source, ...tags }),
      },
    },
    {
      label: "Email",
      icon: <Mail aria-hidden="true" className={ICON} />,
      props: {
        href: mailtoUrl(subject, `${fullMessage}\n\n`),
        onClick: () => track("email_click", { email_source: source, ...tags }),
      },
    },
    includeCall && {
      label: "Call",
      icon: <Phone aria-hidden="true" className={ICON} />,
      props: { href: telUrl, onClick: () => track("phone_click", { phone_source: source, ...tags }) },
    },
    { label: "Contact form", icon: <MessageSquare aria-hidden="true" className={ICON} />, to: "/#contact" },
  ].filter(Boolean);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.ul
          id={id}
          aria-label={label}
          initial={reduceMotion ? false : { height: 0 }}
          animate={{ height: "auto" }}
          exit={reduceMotion ? undefined : { height: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="m-0 flex list-none flex-col gap-2 overflow-hidden p-0 pt-3"
        >
          {choices.map(({ label: choiceLabel, icon, props, to }, index) => (
            <motion.li
              key={choiceLabel}
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              {to ? (
                <Link to={to} state={{ message }} className={CHOICE}>
                  {icon}
                  {choiceLabel}
                </Link>
              ) : (
                <a {...props} className={CHOICE}>
                  {icon}
                  {choiceLabel}
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default ContactChoices;
