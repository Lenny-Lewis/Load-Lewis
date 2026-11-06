/**
 * Project pages, shown at /work/:slug. Each entry drives its page and its "More Projects" card.
 *
 * `price` marks a site as for sale: it adds the price to the page and card, plus a buy section.
 * Leave it out for work that isn't for sale.
 * `panel` is the gradient behind the screenshots, sampled from the colours of the site's hero.
 */
export const caseStudyPath = (slug) => `/work/${slug}`;

// `coverSrc` swaps the captured hero for an existing cover image, which is wider than the captures.
const study = ({ slug, heroAlt, coverSrc, galleryAlts, featureAlt, ...rest }) => ({
  slug,
  details: [{ label: "Category", value: rest.category }],
  hero: { src: coverSrc ?? `/images/case-studies/${slug}/hero.webp`, alt: heroAlt, wide: Boolean(coverSrc) },
  gallery: [
    { src: `/images/case-studies/${slug}/gallery-1.webp`, alt: galleryAlts[0] },
    { src: `/images/case-studies/${slug}/gallery-2.webp`, alt: galleryAlts[1] },
  ],
  feature: { src: `/images/case-studies/${slug}/feature.webp`, alt: featureAlt },
  ...rest,
});

export const caseStudies = [
  study({
    slug: "zedos-technologies",
    title: "Zed OS Technologies",
    category: "Company Website",
    panel: ["#8e8d8d", "#2a2a2a"],
    liveUrl: "https://www.zedostechnologies.co.ke/",
    summary:
      "A company website for a Kisumu-based business, bringing supplies, software, data and AI together under one clear message.",
    heroAlt: "Zed OS Technologies homepage with an interactive 3D centerpiece",
    galleryAlts: ["About section explaining who Zed OS serves", "Five-step process beside a 3D model"],
    featureAlt: "Eight numbered service cards",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Zed OS Technologies offers an unusually wide range of services, from general supplies and vehicle hire to software systems, data analytics and AI.",
          "The challenge was presenting all of that to private companies, NGOs and government institutions without the business looking scattered or hard to understand.",
        ],
      },
      {
        heading: "One Clear Message",
        paragraphs: [
          "The homepage opens with “One partner for”, then rotates through what the company does. An interactive 3D centerpiece that visitors can drag and rotate gives the first screen a memorable focal point.",
        ],
      },
    ],
    body: [
      {
        heading: "Showing How the Work Happens",
        paragraphs: [
          "Instead of only describing the process, the site shows it. Five clear steps, from client request to delivery, sit beside a 3D model of a connected system, so a broad business reads as one organized operation.",
        ],
      },
    ],
    outro: [
      {
        heading: "Eight Services, One Simple Layout",
        paragraphs: [
          "All eight services share the same card layout, with a numbered image, a short description and a clear next step. Visitors can scan the full range quickly and go straight to what they need.",
        ],
      },
    ],
  }),
  study({
    slug: "nhm",
    title: "NHM",
    category: "Museum Website",
    price: "$250",
    panel: ["#8f8f90", "#3f3f3f"],
    liveUrl: "https://nhm-xi.vercel.app/",
    summary:
      "A natural history museum website that turns fossils and prehistoric life into a story visitors want to scroll through.",
    coverSrc: "/images/projects/web/Neo_Museum-1.png",
    heroAlt: "NHM homepage with a large wordmark and Tyrannosaurus rex skeleton",
    galleryAlts: ["Flying reptile skeleton section", "Fossil collection cards"],
    featureAlt: "Geological timeline section",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Museum websites often read like catalogues: full of facts, but with little of the wonder of walking through a gallery.",
          "This site sets out to bring that sense of discovery online, while still giving visitors the practical details they need before they come.",
        ],
      },
      {
        heading: "A Museum You Can Scroll",
        paragraphs: [
          "Each section works like a room in an exhibition. Large fossil imagery and short, confident headlines lead visitors from the story of life on Earth through dinosaurs, ancient life and marine life.",
        ],
      },
    ],
    body: [
      {
        heading: "Science, Made Inviting",
        paragraphs: [
          "Specimen details such as period, length and height are presented like exhibit labels, so facts stay easy to scan. A timeline moves through the Triassic, Jurassic and Cretaceous without overwhelming the page.",
        ],
      },
    ],
    outro: [
      {
        heading: "Ready for a Real Institution",
        paragraphs: [
          "With exhibitions, learning content and answers to common questions already structured, the site can be adapted for a museum, heritage site or education project.",
        ],
      },
    ],
  }),
  study({
    slug: "lithos",
    title: "Lithos",
    category: "Education Website",
    price: "$150",
    panel: ["#6b4a3a", "#1a100c"],
    liveUrl: "https://lithos-blush.vercel.app/",
    summary:
      "A geology learning website that makes deep time feel dramatic, with field guides, courses and plans in one clear path.",
    heroAlt: "Lithos homepage with layered rock imagery",
    galleryAlts: ["Field guides, geology and plans", "Orange call to action"],
    featureAlt: "Learning collections below the hero",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Geology can feel dry and academic online, which makes it harder to attract curious newcomers alongside serious field researchers.",
          "Lithos needed to feel exciting at first glance, while staying clear enough for people to find the right learning material quickly.",
        ],
      },
      {
        heading: "Layers as the Big Idea",
        paragraphs: [
          "The hero uses layered, molten-looking rock and an elegant headline, “Layers hold tales of time”, so the subject itself becomes the visual identity.",
        ],
      },
    ],
    body: [
      {
        heading: "A Clear Way In",
        paragraphs: [
          "Below the hero, the site narrows down to three simple routes: field guides, geology and plans. Each has one image, one short description and one next step.",
        ],
      },
    ],
    outro: [
      {
        heading: "Built to Convert",
        paragraphs: [
          "A bold orange call to action closes the page with one clear invitation to sign up. The compact structure suits any course, membership or learning product.",
        ],
      },
    ],
  }),
  study({
    slug: "consentinel",
    title: "ConSentinel",
    category: "SaaS Website",
    price: "$150",
    panel: ["#b9c8df", "#79869b"],
    liveUrl: "https://con-sentinel.vercel.app/",
    summary:
      "A landing page for a cloud security product, using calm, glassy visuals to make a complex service feel trustworthy.",
    heroAlt: "ConSentinel homepage with a glass sphere",
    galleryAlts: ["Core capabilities section", "Three-step workflow section"],
    featureAlt: "Call to action and footer",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Security products are hard to explain and easy to make intimidating. Visitors need to understand the value quickly and feel confident before they try anything.",
        ],
      },
      {
        heading: "Calm Over Alarm",
        paragraphs: [
          "Rather than the usual dark, threatening look, the design uses soft blues and a glass sphere that suggests protection. “Smarter Security Starts Here” gets the message across straight away.",
        ],
      },
    ],
    body: [
      {
        heading: "Complex Ideas, Simply Structured",
        paragraphs: [
          "Capabilities are grouped into three clear cards: threat detection, access control and compliance reporting. A separate three-step workflow shows how little effort it takes to get started.",
        ],
      },
    ],
    outro: [
      {
        heading: "One Clear Next Step",
        paragraphs: [
          "The page closes with a single invitation to get started, making it a strong starting point for security, cloud or other technical SaaS products.",
        ],
      },
    ],
  }),
  study({
    slug: "mojito",
    title: "Mojito",
    category: "Cocktail Bar Website",
    price: "$300",
    panel: ["#6b6a58", "#101010"],
    liveUrl: "https://gsap-cocktails-website-nine.vercel.app/",
    summary:
      "An immersive cocktail bar website with GSAP scroll animation, where the drinks and atmosphere do the selling.",
    heroAlt: "Mojito homepage with a large wordmark and cocktail",
    galleryAlts: ["Photo grid of cocktails", "Bartender section"],
    featureAlt: "Featured cocktail with recipe details",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "A bar sells an atmosphere, and a plain menu page can't capture that. The site needed to give visitors a feel for the place before they walk in.",
        ],
      },
      {
        heading: "Motion as Atmosphere",
        paragraphs: [
          "Smooth scroll animation moves visitors through the experience, with drinks and tropical leaves framing a bold wordmark for a rich, moody first impression.",
        ],
      },
    ],
    body: [
      {
        heading: "Menu Meets Story",
        paragraphs: [
          "Popular cocktails and mocktails sit beside the craft behind them, so the menu feels like part of the experience rather than an afterthought.",
        ],
      },
    ],
    outro: [
      {
        heading: "Every Drink Gets Its Moment",
        paragraphs: [
          "Individual cocktails get their own spotlight, with ingredients and flavour notes, which suits a bar, restaurant or drinks brand.",
        ],
      },
    ],
  }),
  study({
    slug: "zed-gaming",
    title: "ZED Gaming",
    category: "Gaming Website",
    price: "$300",
    panel: ["#a1b9e7", "#373e50"],
    liveUrl: "https://zed-gaming.vercel.app/",
    summary:
      "A cinematic gaming landing page with bold typography, immersive scenes and animated reveals built around a play economy.",
    heroAlt: "ZED Gaming section inviting players to discover a shared adventure",
    galleryAlts: ["Full-screen fantasy city scene", "Product grid with character art"],
    featureAlt: "Immersive scene with animated framing",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Gaming audiences expect a first impression with real energy, and a broad idea like a shared play economy can easily feel abstract.",
        ],
      },
      {
        heading: "Big, Cinematic Moments",
        paragraphs: [
          "Oversized type and full-screen scenes make the page feel closer to a game trailer than a website, with each scroll revealing a new part of the world.",
        ],
      },
    ],
    body: [
      {
        heading: "One World, Many Products",
        paragraphs: [
          "A bold grid of products with distinct artwork shows how the pieces connect, while keeping each one easy to recognize.",
        ],
      },
    ],
    outro: [
      {
        heading: "Made for Launches",
        paragraphs: [
          "The structure suits games, entertainment launches and other products that need to build excitement from the first screen.",
        ],
      },
    ],
  }),
  study({
    slug: "vanguard",
    title: "Vanguard",
    category: "Agency Website",
    // Add price: "$300" here once the hero's Ninja Turtles and Witcher art has been replaced.
    panel: ["#6e1515", "#180e0e"],
    liveUrl: "https://vanguard-zeta-ruddy.vercel.app/",
    summary: "A bold agency website built on one attitude: design, disrupt and conquer.",
    coverSrc: "/images/projects/web/Vanguard.webp",
    heroAlt: "Vanguard homepage with the headline Design. Disrupt. Conquer.",
    galleryAlts: ["Project cards", "Capabilities section"],
    featureAlt: "Closing call to action",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Creative agencies often look alike. Vanguard needed a presence that would feel confident and memorable from the first second.",
        ],
      },
      {
        heading: "Attitude First",
        paragraphs: [
          "Heavy condensed type and a deep red palette give the brand its voice, turning three short words into the whole message.",
        ],
      },
    ],
    body: [
      {
        heading: "Work Front and Center",
        paragraphs: [
          "Large project cards lead with imagery and a single achievement, so visitors see the range of work without reading much.",
        ],
      },
    ],
    outro: [
      {
        heading: "Built to Start Conversations",
        paragraphs: [
          "Clear capabilities and a direct closing invitation keep the energy going through to the final call to action.",
        ],
      },
    ],
  }),
  study({
    slug: "pawello",
    title: "Pawello",
    category: "Pet Care Website",
    panel: ["#938471", "#3c3b39"],
    liveUrl: "https://tedious-backgrounds-421163.framer.app/",
    summary:
      "A warm, friendly website for a pet care service, designed to reassure owners and make booking feel easy.",
    heroAlt: "Pawello homepage with a large wordmark and a cat being held",
    galleryAlts: ["About section", "Grooming services"],
    featureAlt: "Grooming pricing cards",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Taking a pet to the clinic can be stressful for owners. A cold, clinical website only adds to that, even when the care itself is excellent.",
        ],
      },
      {
        heading: "Calm From the First Screen",
        paragraphs: [
          "A real moment of care and a huge friendly wordmark set the tone immediately, and warm tones carry that feeling through the rest of the page.",
        ],
      },
    ],
    body: [
      {
        heading: "Clear Choices",
        paragraphs: [
          "Services are laid out as simple cards with photos and plain descriptions, so owners can see what's included at a glance.",
        ],
      },
    ],
    outro: [
      {
        heading: "Easy to Book",
        paragraphs: [
          "Clear pricing and a booking button that's always close by remove the guesswork, helping owners go from browsing to booking.",
        ],
      },
    ],
  }),
  study({
    slug: "recueil",
    title: "Recueil",
    category: "Subscription Brand Website",
    panel: ["#777f9d", "#2a3855"],
    liveUrl: "https://alert-apartment-762464.framer.app/",
    summary:
      "A website for a monthly fragrance club, where every section feels as considered as the perfume itself.",
    heroAlt: "Recueil homepage with a perfume bottle",
    galleryAlts: ["Fragrance details", "Member stories"],
    featureAlt: "Materials library with a floral image",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Fragrance is hard to sell online because you can't smell it through a screen. The site has to create desire through mood, language and imagery alone.",
        ],
      },
      {
        heading: "Selling a Feeling",
        paragraphs: [
          "Soft blues, elegant type and dreamlike product imagery give the bottle room to be the star, with “One bottle at a time” explaining the idea in a few words.",
        ],
      },
    ],
    body: [
      {
        heading: "Scent, Put Into Words",
        paragraphs: [
          "Each fragrance is described through its notes and a small moment, like “the bright minutes after rain”, helping visitors imagine what they can't yet smell.",
        ],
      },
    ],
    outro: [
      {
        heading: "An Easy Way to Join",
        paragraphs: [
          "Three simple steps and clearly compared plans make starting a subscription feel straightforward, without breaking the calm, premium mood.",
        ],
      },
    ],
  }),
  study({
    slug: "sham-project",
    title: "Sham Project",
    category: "Creative Studio Website",
    panel: ["#959595", "#3a3a3a"],
    liveUrl: "https://victorious-actions-723983.framer.app/",
    summary:
      "An editorial creative studio website with bold typography and a monochrome visual direction.",
    heroAlt: "Sham homepage with the headline Break Out The Square Space",
    galleryAlts: ["Studio statistics and services", "Service list with moody imagery"],
    featureAlt: "Pricing section",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Subscription creative studios need to look distinctive, because their own visual taste is what they're selling.",
        ],
      },
      {
        heading: "Monochrome With Intent",
        paragraphs: [
          "Removing color puts the focus on type, composition and moody imagery, giving the studio a strong editorial character.",
        ],
      },
    ],
    body: [
      {
        heading: "A Clear Offer",
        paragraphs: [
          "Services, results and pricing are presented in simple blocks, so the subscription model is easy to understand despite the expressive design.",
        ],
      },
    ],
    outro: [
      {
        heading: "Ready to Grow",
        paragraphs: [
          "With pricing, common questions and a blog already in place, the site has room to grow with the studio.",
        ],
      },
    ],
  }),
  study({
    slug: "ageincy",
    title: "Ageincy",
    category: "Agency Website",
    panel: ["#616161", "#141414"],
    liveUrl: "https://compassionate-time-092074.framer.app/",
    summary:
      "A dark, modern website for a digital agency offering brand identity, UI/UX design, development and marketing.",
    heroAlt: "Ageincy homepage",
    galleryAlts: ["Featured project", "Client testimonials"],
    featureAlt: "Agency figures and projects",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Agencies offering several services risk blurring together. Visitors need to understand what's on offer and see proof without working for it.",
        ],
      },
      {
        heading: "Quiet Confidence",
        paragraphs: [
          "A minimal dark interface and restrained typography let the agency's message and work stand out.",
        ],
      },
    ],
    body: [
      {
        heading: "Four Services, Clearly Told",
        paragraphs: [
          "Brand identity, UI/UX design, web development and digital marketing each get a short, plain description, moving from idea to launch.",
        ],
      },
    ],
    outro: [
      {
        heading: "Proof Close to the Offer",
        paragraphs: [
          "Featured projects and testimonials sit beside the services, giving visitors reasons to trust the agency before they get in touch.",
        ],
      },
    ],
  }),
  study({
    slug: "latte-have",
    title: "Latte Have",
    category: "Coffee Shop Website",
    panel: ["#d5c3a8", "#9a8167"],
    liveUrl: "https://traditional-checklist-769919.framer.app/",
    summary: "A warm, inviting website for a coffee shop, with a menu that's easy to browse on any device.",
    heroAlt: "Latte Have homepage with coffee and pastries",
    galleryAlts: ["Coffee menu", "Drinks and pastries menu"],
    featureAlt: "Coffee news and about section",
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Most people visit a coffee shop's website for two things: what's on the menu and what the place feels like. Many sites make both harder to find than they should be.",
        ],
      },
      {
        heading: "Cozy From the First Scroll",
        paragraphs: [
          "Cream tones and close-up photography bring out the warmth of the shop, with the Explore Menu button right under the headline.",
        ],
      },
    ],
    body: [
      {
        heading: "A Menu That Reads Easily",
        paragraphs: [
          "Drinks and pastries are organized into simple lists with clear prices and short descriptions, paired with large food photography.",
        ],
      },
    ],
    outro: [
      {
        heading: "More Than a Menu",
        paragraphs: [
          "Coffee news and the story behind the shop give regulars a reason to return, and help new visitors feel welcome before they arrive.",
        ],
      },
    ],
  }),
];
