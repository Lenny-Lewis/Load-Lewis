/**
 * Article content.
 *
 * Rich text in `paragraphs`, `bullets`, `outro` and `tip`: wrap words in
 * **double asterisks** to bold them (rendered as highlighted white text).
 * Optional per section:
 *   quote: { text, author }  – pull-quote shown after the section
 *   tip: "..."               – a "Tip:" callout
 * Newest article first: the home "Thoughts" section shows the first two.
 */
export const articles = [
  {
    id: "why-motion-and-3d-make-portfolios-memorable",
    slug: "why-motion-and-3d-make-portfolios-memorable",
    title: "Why Motion and 3D Make Portfolios Memorable",
    subtitle: "Motion and real-time 3D turn a portfolio from a list of projects into an experience people remember — when they are used with restraint, purpose, and an eye on performance.",
    date: "Nov 2, 2026",
    readTime: "6 min read",
    tag: "Motion & 3D",
    cardDesc: "How purposeful animation and real-time 3D turn a portfolio into an experience people remember.",
    image: "/images/thoughts/motion-and-3d.webp",
    sections: [
      {
        heading: "Attention Is Earned in Seconds",
        paragraphs: [
          "A recruiter or client opening your portfolio is usually comparing it with a dozen others. Static pages blur together; a site that **moves with intent** gives people a reason to stay. Motion guides the eye to what matters first, and a well-placed 3D scene signals **craft, confidence, and technical range** before a single line of copy is read."
        ],
        quote: { text: "Animation is not the art of drawings that move but the art of movements that are drawn.", author: "Norman McLaren" }
      },
      {
        heading: "Motion as a Storytelling Tool",
        paragraphs: [
          "Good motion is choreography, not decoration. Every transition should answer a question for the visitor:"
        ],
        bullets: [
          "Where should I look first?",
          "What changed, and what caused it?",
          "What can I interact with?"
        ],
        outro: "Scroll-driven reveals, staggered text and gentle easing let a page **unfold like a story** instead of arriving all at once.",
        quote: { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" }
      },
      {
        heading: "Real-Time 3D Shows What You Can Build",
        paragraphs: [
          "Tools like **Three.js, React Three Fiber and Spline** make it possible to put interactive 3D straight into the browser. A scene that reacts to the cursor or to scrolling proves something a screenshot cannot: that you can **ship complex, interactive work** that runs smoothly for real users."
        ],
        tip: "Give every 3D scene a job. A model that reacts to the visitor reads as skill; a model that just spins reads as filler.",
        quote: { text: "The details are not the details. They make the design.", author: "Charles Eames" }
      },
      {
        heading: "Performance Is Part of the Experience",
        paragraphs: [
          "The most beautiful scene fails if it stutters. Heavy assets, unoptimised textures and animations that fight the main thread are **the fastest way to lose a visitor**. Treat performance as a design constraint from day one:"
        ],
        bullets: [
          "Animate only transform and opacity wherever possible",
          "Lazy-load 3D scenes and keep them alive across routes",
          "Pause rendering when a scene is off-screen",
          "Respect prefers-reduced-motion for every effect"
        ],
        outro: "Smoothness reads as quality. A site that stays at **60 frames per second** feels expensive, even when the visuals are simple.",
        quote: { text: "Fast is my favourite feature.", author: "Larry Page" }
      },
      {
        heading: "Restraint Is the Real Skill",
        paragraphs: [
          "When everything moves, nothing stands out. The portfolios people remember use motion and 3D in **a few deliberate moments** — a hero that comes alive, a reveal that rewards scrolling, a detail that responds to touch — and let the rest of the page stay calm and readable."
        ],
        quote: { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
      },
      {
        heading: "Bringing It Together",
        paragraphs: [
          "Motion and 3D are at their best when they serve the work instead of competing with it. Start with a clear story, add movement where it **clarifies or delights**, keep performance non-negotiable, and your portfolio stops being a list of projects — it becomes **an experience people remember**."
        ]
      }
    ]
  },
  {
    id: "building-trust-through-clear-design",
    slug: "building-trust-through-clear-design",
    title: "Building Trust Through Clear Design",
    subtitle: "Vintage car restoration blends engineering, artistry, and historical research to revive automobiles from past eras.",
    date: "May 5, 2025",
    readTime: "7 min read",
    tag: "Design Philosophy",
    cardDesc: "How thoughtful visual choices create a stronger sense of reliability for modern brands.",
    image: "/images/thoughts/First%20one.avif",
    sections: [
      {
        heading: "Why Restore Vintage Cars?",
        paragraphs: [
          "Vintage car restoration is more than a hobby—it's a way to preserve the craftsmanship, engineering, and cultural heritage of past decades. Each restored car tells a story, reflecting design innovation, mechanical ingenuity, and the era in which it was created. For enthusiasts, restoring a vintage car is a journey that connects history, artistry, and technical skill."
        ]
      },
      {
        heading: "The Restoration Process",
        paragraphs: [
          "Restoration begins long before tools meet metal. Enthusiasts and mechanics start with meticulous research, studying:"
        ],
        bullets: [
          "Original factory drawings and blueprints",
          "Historic color charts and paint formulations",
          "Interior materials and trim details",
          "Mechanical specifications and assembly methods"
        ],
        outro: "The goal is authenticity—every restored car should closely mirror its original form, preserving both function and character."
      },
      {
        heading: "Mechanical Rebuilding",
        paragraphs: [
          "Engines, transmissions, and suspension systems require detailed attention. This often involves:"
        ],
        bullets: [
          "Careful disassembly and cleaning of components",
          "Machining worn parts to precise tolerances",
          "Rebuilding and fine-tuning for performance and reliability",
          "Custom fabrication or sourcing rare components no longer in production"
        ],
        outro: "Restorers may spend months tracking down elusive parts, turning the mechanical process into both a challenge and a labor of love."
      },
      {
        heading: "Bodywork and Paint",
        paragraphs: [
          "Restoring the exterior is an art form. Specialists repair rust, reshape panels, and apply paint finishes that match the car's original hue and texture. Every curve, chrome trim, and detail is treated with museum-level care, ensuring the car looks and feels as it did decades ago."
        ]
      },
      {
        heading: "Interior Craftsmanship",
        paragraphs: [
          "The interior brings the car's personality to life. Leather, stitching, wood panels, gauges, and upholstery must faithfully replicate the original design. Skilled artisans often spend weeks on this stage, combining traditional techniques with modern precision to achieve a seamless restoration."
        ]
      },
      {
        heading: "The Value of Preservation",
        paragraphs: [
          "Vintage car restoration keeps automotive history alive. It celebrates:"
        ],
        bullets: [
          "Design heritage and the evolution of style",
          "Engineering advancements and mechanical ingenuity",
          "The passion and dedication of artisans and enthusiasts"
        ],
        outro:
          "Each restored car is a rolling piece of history, a tangible connection to the past, and a testament to human creativity."
      },
      {
        heading: "Bringing Your Passion Online",
        paragraphs: [
          "If you're inspired by vintage cars and want to showcase your restoration projects, a professional portfolio website can make your work shine. With free Framer templates, you can build eye-catching, fully customizable websites without starting from scratch. Present your projects, tell your story, and celebrate craftsmanship online with ease: Templyo."
        ]
      },
      {
        heading: "One Workflow for Every Platform",
        paragraphs: [
          "Most restorers don't post on just one network. Short clips work on TikTok and Reels, detailed progress fits Instagram carousels, and longer walkthroughs belong on YouTube or Facebook. Posting each platform separately means rewriting captions, re-uploading media, and switching between apps — time you'd rather spend on the car."
        ]
      }
    ]
  },
  {
    id: "the-role-of-art-direction-in-branding",
    slug: "the-role-of-art-direction-in-branding",
    title: "The Role of Art Direction in Branding",
    subtitle: "Why visual direction helps brands create emotion and a distinct point of view.",
    date: "Jun 16, 2025",
    readTime: "5 min read",
    tag: "Art Direction",
    cardDesc: "Why visual direction helps brands create emotion and a distinct point of view.",
    image: "/images/thoughts/second%20one.avif",
    sections: [
      {
        heading: "Beyond Mere Aesthetics",
        paragraphs: [
          "Art direction is fundamentally about emotional resonance and intentional tension. While graphic design organizes information and UX clarifies utility, art direction defines the soul and sensory atmosphere of a brand."
        ]
      },
      {
        heading: "Cinematic Narrative in Web Spaces",
        paragraphs: [
          "Modern web experiences are no longer static brochures; they are dynamic editorial stories. By blending motion choreography with stark analog photographic aesthetics, digital platforms can elicit genuine emotion and memorable intrigue."
        ],
        bullets: [
          "Choreographing motion and scroll pacing to guide focus",
          "Harmonizing analog grain and digital precision",
          "Selecting evocative photography that communicates unspoken values",
          "Disciplined typography that conveys conviction without shouting"
        ],
        outro: "Every design decision either reinforces the brand narrative or dilutes it."
      },
      {
        heading: "Crafting a Point of View",
        paragraphs: [
          "Commoditized templates blend into ambient background noise. Distinct art direction creates friction in the best way possible: it stops the scroll, leaves a lasting imprint, and gives a brand a recognizable soul."
        ]
      }
    ]
  },
  {
    id: "how-creative-teams-build-brand-systems",
    slug: "how-creative-teams-build-brand-systems",
    title: "How Creative Teams Build Brand Systems",
    subtitle: "A look at the workflows that keep branding consistent across every touchpoint.",
    date: "Jun 16, 2025",
    readTime: "6 min read",
    tag: "Brand Systems",
    cardDesc: "A look at the workflows that keep branding consistent across every touchpoint.",
    image: "/images/thoughts/brand-systems.webp",
    sections: [
      {
        heading: "Cohesion Over Uniformity",
        paragraphs: [
          "Great brand systems provide guidance without stifling innovation. They establish foundational rules of proportion, kinetic rhythm, and tonal clarity so cross-functional creative teams can build with speed and conviction."
        ]
      },
      {
        heading: "The Modern Creative Stack",
        paragraphs: [
          "From digital product interfaces to physical packaging and editorial campaigns, visual consistency requires disciplined design tokens, living component libraries, and unified artistic direction."
        ],
        bullets: [
          "Living design systems that scale effortlessly across teams",
          "Shared typography and modular grid foundations",
          "Rigorous quality standards across web, mobile, and print",
          "Fostering creative ownership while preserving brand integrity"
        ],
        outro: "When systems are built with empathy for the creators using them, the resulting brand identity feels effortless and immortal."
      }
    ]
  },
  {
    id: "the-rise-of-modern-tech-startup-websites",
    slug: "the-rise-of-modern-tech-startup-websites",
    title: "The Rise of Modern Tech Startup Websites",
    subtitle: "Why tech startups need clear, high trust digital experiences to communicate and attract users.",
    date: "Jun 16, 2025",
    readTime: "6 min read",
    tag: "Web Craft",
    cardDesc: "Why tech startups need clear, high trust digital experiences to communicate and attract users.",
    image: "/images/thoughts/third%20one.avif",
    sections: [
      {
        heading: "High Trust as the Primary Metric",
        paragraphs: [
          "In an increasingly crowded market, users evaluate tech products by the intentionality of their digital presentation. Clear visual hierarchy, restrained motion, and transparent copywriting turn fleeting visits into committed users."
        ]
      },
      {
        heading: "The Power of Editorial Clarity",
        paragraphs: [
          "The most successful modern tech startups don't rely on generic template SaaS aesthetics. They use bold editorial storytelling, tactile micro-interactions, and refined typography to communicate maturity and reliability from the first interaction."
        ],
        bullets: [
          "Clear value proposition communicated above the fold",
          "Tactile physics and interactive product previews",
          "Sub-second load times with optimized asset delivery",
          "Design that conveys trust, stability, and enduring value"
        ],
        outro: "When technical innovation is paired with world-class digital craft, products become category-defining."
      }
    ]
  }
];
