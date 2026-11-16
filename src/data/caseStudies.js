/**
 * Project pages, shown at /work/:slug. Each entry drives its page and its "More Projects" card.
 *
 * `siteTerms` or `saleTerms` marks a project as for sale: it adds the price range to the page and
 * card, a choice of sale options, and an entry in the Pricing section. Leave it out for work that
 * isn't for sale.
 * `sold` adds a Sold tag to the card and a Sold status to the page.
 * `result` adds a real client outcome and review; only add it with the client's own words.
 * `quotes` adds real quotes from people testing the project, under the same rule.
 * `outcomes` lists three points on the value a project brings, each with an optional `stat`. With
 * `result` or `quotes` they show as results, so use only real figures or the client's own words.
 * Without them they show as "Built to Deliver" under a concept note: say what the work is designed
 * to do, never claim it has been measured.
 * `panel` is the gradient behind the screenshots, sampled from the colours of the site's hero.
 */
export const caseStudyPath = (slug) => `/work/${slug}`;

// `coverSrc` swaps the captured hero for an existing cover image, which is wider than the captures.
const study = ({ slug, heroAlt, coverSrc, galleryAlts, featureAlt, ...rest }) => ({
  slug,
  details: [
    { label: "Category", value: rest.category },
    ...(rest.client ? [{ label: "Client", value: rest.client }] : []),
  ],
  hero: { src: coverSrc ?? `/images/case-studies/${slug}/hero.webp`, alt: heroAlt, wide: Boolean(coverSrc) },
  gallery: [
    { src: `/images/case-studies/${slug}/gallery-1.webp`, alt: galleryAlts[0] },
    { src: `/images/case-studies/${slug}/gallery-2.webp`, alt: galleryAlts[1] },
  ],
  feature: { src: `/images/case-studies/${slug}/feature.webp`, alt: featureAlt },
  ...rest,
});

const money = (amount) => `$${amount.toLocaleString("en-US")}`;

// Choosing maintenance lowers the sale price: about 10% off with yearly, 5% off with monthly.
const saleTerms = ({ full, yearly, monthly, yearlyFee, monthlyFee, note }) => ({
  price: `${money(yearly)}–${money(full)}`,
  // The lowest amount a buyer can actually pay: the yearly plan's price comes with maintenance.
  saleFrom: full,
  saleNote: `${note} Maintenance plans have a 12-month minimum.`,
  saleOptions: [
    {
      name: "Sale plus yearly maintenance",
      price: money(yearly),
      term: `Plus ${money(yearlyFee)} per year, ${money(yearly + yearlyFee)} in the first year`,
      note: `Adds bug fixes and security updates, paid yearly to save ${money(monthlyFee * 12 - yearlyFee)} a year.`,
      summary: `With yearly maintenance: ${money(yearly)} + ${money(yearlyFee)} per year`,
    },
    {
      name: "Sale plus monthly maintenance",
      price: money(monthly),
      term: `Plus ${money(monthlyFee)} per month, ${money(monthly + monthlyFee * 12)} in the first year`,
      note: "The same maintenance, paid monthly.",
      summary: `With monthly maintenance: ${money(monthly)} + ${money(monthlyFee)} per month`,
    },
    {
      name: "Full sale",
      price: money(full),
      term: "One-time payment",
      note: "It's yours to run and maintain.",
      summary: `Full sale: ${money(full)}`,
    },
  ],
});

// Websites share a flat fee: a percentage of these prices would be too small to be worth billing.
// No website sells below 30,000 KES (about 32,000 at the cheapest): at 126.5–130 KES per USD, keep every option at $240 or more.
const siteTerms = (full, yearly, monthly) =>
  saleTerms({
    full,
    yearly,
    monthly,
    yearlyFee: 150,
    monthlyFee: 15,
    note: "Every option includes the site files, setup help and rebranding to your details. Hosting is separate.",
  });

const RTMS_IMAGES = "/images/mobile_apps/rtms";

export const caseStudies = [
  study({
    slug: "zedos-technologies",
    title: "Zed OS Technologies",
    category: "Company Website",
    client: "Zed OS Technologies",
    sold: true,
    result: {
      outcome: "We now have our home on the web and are globally recognised. Our clients can reach us much more easily, and marketing our products has become 100% easier.",
      review: "It has been such a journey with Lennox Lewis. I was referred to him by a startup and straight away I understood why. He works diligently, very well and is always on time, always asking, always updating. I would definitely recommend him. He has a good understanding of projects and how things work.",
      attribution: "Zed OS Tech CEO",
    },
    outcomes: [
      { stat: "100%", title: "Easier to market", text: "The CEO's own words for how much simpler marketing their products has become, now that everything points to one site." },
      { title: "Easier to reach", text: "Clients can now find and contact the business much more easily than before." },
      { title: "Recognised further afield", text: "A Kisumu business now has a home on the web and, in the CEO's words, is globally recognised." },
    ],
    valueLead:
      "The site had one job: make a broad business easy to understand, reach and market. Here's what changed after launch, in the client's own words.",
    panel: ["#8e8d8d", "#2a2a2a"],
    liveUrl: "https://www.zedostechnologies.co.ke/",
    summary:
      "A company website for a Kisumu-based business, bringing supplies, software, data and AI together under one clear message.",
    heroAlt: "Zed OS Technologies homepage with an interactive 3D centerpiece",
    galleryAlts: ["About section explaining who Zed OS serves", "Five-step process beside a 3D model"],
    featureAlt: "What we do section with large service photos and a thumbnail rail",
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
          "A rotating headline was chosen over a long list of services because visitors decide in seconds whether a company is for them. Leading with “one partner” makes the range read as a strength, and the 3D centerpiece keeps people on the first screen long enough to see it.",
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
    ...siteTerms(380, 340, 360),
    outcomes: [
      { title: "Interest that turns into visits", text: "Exhibition stories sit beside visit details and common questions, so a curious reader has everything needed to plan a trip." },
      { title: "Fewer repeat questions", text: "Answers to what visitors usually ask are already on the page, which takes pressure off front desk and email." },
      { title: "A site that keeps working", text: "Exhibitions and learning content are structured to be swapped as collections change, without a redesign." },
    ],
    valueLead:
      "For a museum, the website's job is to turn curiosity into a planned visit.",
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
          "This approach was chosen because people decide to visit a museum on feeling as much as facts. Leading with spectacle and keeping facts short gives visitors the wonder first and the detail when they want it.",
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
    ...siteTerms(280, 250, 265),
    outcomes: [
      { title: "Newcomers who stay", text: "A dramatic first screen makes a dry subject feel exciting, giving casual visitors a reason to keep scrolling." },
      { title: "Quicker routes to content", text: "Three clear paths (field guides, geology and plans) take learners to the right material in one click." },
      { title: "More sign-ups", text: "The page ends on a single, bold call to action, so interest has one obvious place to go." },
    ],
    valueLead:
      "For a learning business, the website's job is to turn curious visitors into members.",
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
          "Using the subject itself as the visual identity, rather than stock classroom imagery, shows newcomers what makes geology exciting before asking them to read anything.",
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
    ...siteTerms(290, 260, 275),
    outcomes: [
      { title: "Trust before the first click", text: "A calm, protective look replaces the usual scare tactics, so buyers feel confident enough to try the product." },
      { title: "Value understood quickly", text: "Three capability cards explain the product in seconds, cutting the time sales spends explaining basics." },
      { title: "A short path to trial", text: "A three-step workflow and one closing call to action show how little effort it takes to get started." },
    ],
    valueLead:
      "For a security product, the website's job is to earn enough trust for a visitor to start a trial.",
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
          "This was chosen because fear-led security marketing makes buyers hesitate, while a calm look signals a product that's in control. People buying protection want to feel safe, so the design makes them feel that first.",
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
    ...siteTerms(450, 405, 430),
    outcomes: [
      { title: "Atmosphere that sells", text: "Scroll animation gives visitors a feel for the bar before they arrive, which a plain menu page can't do." },
      { title: "A menu that drives orders", text: "Each cocktail gets its own spotlight with ingredients and flavour notes, helping guests decide before they sit down." },
      { title: "A stronger brand", text: "A rich, moody first impression sets the bar apart from competitors with template sites." },
    ],
    valueLead:
      "For a bar, the website's job is to fill seats by selling the night before the drink.",
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
          "Motion was chosen over static photos because people choose a bar for how it feels, and animation is the closest a website gets to atmosphere. It gives the menu the same sense of theatre as the room.",
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
    ...siteTerms(480, 430, 455),
    outcomes: [
      { title: "Launch-day excitement", text: "Trailer-style scenes and oversized type give players a reason to stay and explore from the first screen." },
      { title: "A clear product range", text: "A bold product grid shows how everything connects, so an abstract idea like a play economy becomes easy to follow." },
      { title: "Reusable for every launch", text: "The structure is built to carry new games and announcements without starting over." },
    ],
    valueLead:
      "For a game launch, the website's job is to build excitement and keep players coming back for what's next.",
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
          "A trailer-style approach was chosen because players judge a launch the way they judge a trailer: in the first few seconds. Showing the world instead of explaining it makes an abstract idea easier to buy into.",
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
    // Add ...siteTerms(420, 380, 400) here once the hero's Ninja Turtles and Witcher art has been replaced.
    outcomes: [
      { title: "Remembered after one visit", text: "A bold voice and strong colour help the agency stand out in a market where most sites look alike." },
      { title: "Proof at a glance", text: "Project cards lead with imagery and a single achievement, so prospects see the range of work without reading much." },
      { title: "More conversations", text: "Clear capabilities and a direct closing invitation turn interest into enquiries." },
    ],
    valueLead:
      "For an agency, the website's job is to win the first conversation with a client.",
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
          "A strong, narrow voice was chosen over a broad, polite one because an agency is hired for its point of view. A site that commits to an attitude shows clients the agency will commit to theirs.",
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
    ...siteTerms(320, 290, 305),
    outcomes: [
      { title: "Owners who feel at ease", text: "Warm tones and a real moment of care reassure worried pet owners before they book." },
      { title: "Fewer pricing questions", text: "Services and prices are laid out plainly, so owners know what to expect without calling first." },
      { title: "More bookings", text: "A booking button stays close by on every section, making it easy to go from browsing to booking." },
    ],
    valueLead:
      "For a pet clinic, the website's job is to turn a worried owner into a booked appointment.",
    panel: ["#938471", "#3c3b39"],
    liveUrl: "https://pawello-tawny.vercel.app/",
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
          "This was chosen because owners pick a clinic on trust before price. Showing care first eases the worry that stops people from booking, and the warm palette keeps the site from feeling clinical.",
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
    outcomes: [
      { title: "Desire without a sample", text: "Mood, imagery and vivid scent descriptions help visitors imagine a fragrance they can't smell through a screen." },
      { title: "A premium feel that supports the price", text: "A calm, considered design matches the product, so a subscription feels worth paying for." },
      { title: "Easier sign-ups", text: "Three simple steps and clearly compared plans remove friction from starting a subscription." },
    ],
    valueLead:
      "For a subscription brand, the website's job is to turn a first visit into a recurring customer.",
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
          "This was chosen because fragrance can't be sampled online, so the site has to sell the mood a scent creates. Giving the bottle space and keeping the palette soft lets imagination do the work a sample would.",
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
    outcomes: [
      { title: "Taste on show", text: "A distinctive editorial look shows prospects the studio's eye before they see a single project." },
      { title: "An offer that's easy to buy", text: "Services, results and pricing sit in simple blocks, so a subscription model is quick to understand." },
      { title: "Room to grow", text: "Pricing, common questions and a blog are already in place for the studio to build on." },
    ],
    valueLead:
      "For a creative studio, the website's job is to sell its taste and make the subscription easy to buy.",
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
          "Monochrome was chosen because a creative studio's website is its first portfolio piece. Taking colour away shows restraint and a confident eye, the qualities clients are paying for.",
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
    outcomes: [
      { title: "Services that stand apart", text: "Four services each get a short, plain description, so visitors see the full offer without confusion." },
      { title: "Trust without searching", text: "Featured projects and testimonials sit next to the services, giving proof right where prospects are deciding." },
      { title: "Message first", text: "A restrained dark interface keeps attention on the agency's work and what it offers." },
    ],
    valueLead:
      "For a multi-service agency, the website's job is to make the offer clear and back it with proof.",
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
          "Restraint was chosen because an agency's own site shouldn't compete with its work. A quiet interface lets the projects and testimonials carry the pitch.",
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
    outcomes: [
      { title: "The menu in one tap", text: "The Explore Menu button sits right under the headline, answering the main reason people visit a café's site." },
      { title: "More first visits", text: "Warm photography and cosy tones give new customers a feel for the shop before they walk in." },
      { title: "Regulars who come back", text: "Coffee news and the shop's story give returning customers a reason to check in again." },
    ],
    valueLead:
      "For a café, the website's job is to get people through the door and bring regulars back.",
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
          "This was chosen because people mostly visit a café's site to see the menu and decide whether to go. Putting both the mood and the menu button on the first screen answers both questions straight away.",
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
  // A mobile app: `showcase` replaces the landscape gallery and feature panels, which would crop
  // portrait screenshots. Figures come from the project's own write-up.
  {
    slug: "ksu-rtms",
    title: "KSU RTMS",
    category: "Mobile App and Website",
    details: [
      { label: "Category", value: "Mobile App and Website" },
      { label: "Status", value: "In pre-launch testing" },
    ],
    ...saleTerms({
      full: 5000,
      yearly: 4500,
      monthly: 4750,
      yearlyFee: 750,
      monthlyFee: 75,
      note: "Every option includes the mobile app, website and server code, setup help and rebranding to your details. Hosting and app store fees are separate.",
    }),
    backTo: "/work?tab=mobile",
    quotes: [
      {
        text: "The project holds up so well, is fast and well optimised, also has so many customisable features, I cannot say enough about how easy and helpful it is.",
        attribution: "Chair of Department, Kisii University",
      },
      {
        text: "As a pen tester and cyber security analyst, security is pretty well done with backend concepts properly catered for, definitely a must have for any academic institution globally.",
        attribution: "Tester, penetration tester and cyber security analyst",
      },
    ],
    outcomes: [
      { stat: "32", title: "Students using it in testing", text: "Along with 4 supervisors, a project coordinator and an administrator at Kisii University, all working in one system." },
      { stat: "600", title: "People online at once", text: "Handled by a server limited to 1 CPU in a local load test. That test hasn't been repeated on live hosting yet." },
      { stat: "$95–$115", title: "A month to run", text: "Estimated hosting, database, file storage and email for 400–600 users, checked on 6 November 2026." },
    ],
    valueLead:
      "The goal is to save departments the time spent chasing progress, compiling reports and balancing supervisors by hand. The system is still in pre-launch testing, so these are figures from testing, not from a full rollout.",
    panel: ["#3f5a7d", "#0f1a2a"],
    summary:
      "A mobile app and website that manage final-year student projects from the first proposal to final completion, shown here in its Kisii University branding.",
    hero: {
      src: `${RTMS_IMAGES}/cover.webp`,
      alt: "KSU RTMS project management system cover with a grid of app screens",
      wide: true,
    },
    showcase: {
      tilted: {
        src: `${RTMS_IMAGES}/showcase_tilted.webp`,
        alt: "Tilted documents, home and progress screens with cards lifting off them",
      },
      grid: {
        src: `${RTMS_IMAGES}/showcase_grid.webp`,
        alt: "Diagonal grid of onboarding, login, notifications and settings screens",
        title: "KSU-RTMS",
        byline: "Mobile app and website",
        text: "Students, supervisors and department leaders can do their work on either one, with fingerprint sign-in on the app. An account works on both, and both show the same data.",
        cta: "Ask about this system",
      },
    },
    intro: [
      {
        heading: "The Problem",
        paragraphs: [
          "Final-year projects are often managed through email, paper forms and spreadsheets. Files and feedback get spread across inboxes, students can't easily see where they stand, and departments have to ask each supervisor for progress.",
          "Some supervisors end up with too many students, similar topics are hard to spot by hand, and completion reports have to be put together manually.",
        ],
      },
      {
        heading: "One Shared System",
        paragraphs: [
          "Students, supervisors, department leaders and administrators all work in one place. An account works on both the mobile app and the website, and both show the same data.",
          "A single shared system was chosen over separate tools for each role because the problems came from information being spread out. With one source of truth, students, supervisors and departments see the same status without chasing each other.",
        ],
      },
    ],
    body: [
      {
        heading: "From Proposal to Completion",
        paragraphs: [
          "During the open dates, a student submits a proposal, chooses a supervisor and can invite one partner. After approval, they upload five chapters and the full documentation one stage at a time, and each approval unlocks the next stage.",
          "Supervisors approve, ask for revisions or reject with comments. They also see a proposal's similarity to other projects and an estimate of how likely a document is to be AI-written, as guides rather than final judgements. Marks are recorded out of 100, and only supervisors can see them.",
        ],
      },
    ],
    outro: [
      {
        heading: "A Clear View for Every Role",
        paragraphs: [
          "Each supervisor can hold up to 10 active projects, which keeps workloads balanced. Heads of Department and Project Coordinators can see all students and projects, along with proposal status, milestone summaries and completion reports.",
          "Administrators work from the website, where they import users from a CSV file, set academic periods and proposal dates, manage departments and programmes, and view the audit log.",
        ],
      },
      {
        heading: "Security Built In",
        paragraphs: [
          "Accounts use email verification and email codes as an extra sign-in check, with fingerprint sign-in on the mobile app. Users can view and sign out of active sessions and manage trusted devices, and permissions for each role are enforced on the server.",
        ],
      },
      {
        heading: "Where It Stands",
        paragraphs: [
          "The system is in pre-launch testing at Kisii University, with 32 students, 4 supervisors, a project coordinator and an administrator using it. Push notifications are built, but testing on a phone is still pending.",
          "It's built with Expo (React Native), React and Vite, Node.js and Express, and MongoDB, with Cloudflare R2 for files and Brevo for email. It's designed for 400–600 students and supervisors. In a local load test, a server limited to 1 CPU kept up with 600 people online at once, but that test hasn't been repeated on live hosting.",
        ],
      },
      {
        heading: "What It Costs to Run",
        paragraphs: [
          "Going live with 400–600 users is estimated at about $95–$115 per month for hosting, database, file storage and email. App store fees are separate: $25 one time for Google Play and $99 per year for Apple. That comes to about $1,260–$1,500 for the first year.",
          "These are estimates based on prices checked on 6 November 2026, and they can change. They don't include a custom domain, taxes, support staff or optional SMS alerts.",
        ],
      },
    ],
  },
];
