/**
 * Company profiles on the Work page. Each `content` list holds the text of the profile's
 * first PREVIEW_PAGES pages, word for word; visitors request the rest.
 * Keep the remaining pages out of this file and /public, because both are publicly readable.
 * `pages` is the full length of the profile. Block types are rendered in ProfileBlocks.jsx.
 */
export const PREVIEW_PAGES = 3;

export const companyProfilePath = (slug) => `/work/company-profiles/${slug}`;

const VILLAGIO_IMAGES = "/images/company-profiles/villagio-travel-tours";
const SHANZY_IMAGES = "/images/company-profiles/shanzy-solutions";

export const companyProfiles = [
  {
    slug: "villagio-travel-tours",
    title: "Villagio Travel & Tours",
    excerpt:
      "A company profile for a Nairobi travel company, presenting its services, destinations and accreditation to corporate, government and NGO clients.",
    date: "Nov 4, 2026",
    pages: 9,
    accent: "#ef7d3a",
    cover: { src: `${VILLAGIO_IMAGES}/cover.webp`, alt: "Wildebeest herd crossing the savanna with safari vehicles behind it" },
    content: [
      { type: "heading", eyebrow: "Karibu", text: "A WORD FROM OUR DIRECTOR" },
      {
        type: "text",
        text: "Thank you for taking the time to get to know Villagio Travel & Tours. When we opened our doors in 2009, we set out to make travel simple, safe and enjoyable for every person who walked in, whether they were booking a single air ticket or planning a company retreat for a hundred staff.",
      },
      {
        type: "text",
        text: "Over the years we have learnt that great travel is about far more than tickets and hotel rooms. It is about being looked after: a call to confirm your pickup, a quick answer when a flight changes, and a plan that fits your budget instead of stretching it. That is the standard every member of our team works to.",
      },
      {
        type: "text",
        text: "Today Villagio is a destination management company licensed by the Tourism Regulatory Authority and a member of the Kenya Association of Tour Operators. Our work now spans leisure holidays, corporate travel, tailor-made safaris and ground handling across Eastern, Central and Southern Africa.",
      },
      {
        type: "text",
        text: "Whether you are a corporate client, an organisation planning an event or a family dreaming of a holiday, we would be glad to plan your next journey with you.",
      },
      { type: "signature", name: "B. Wamuyu", role: "Director, Villagio Travel & Tours" },
      {
        type: "stats",
        items: [
          { value: "2009", label: "Year established" },
          { value: "15+", label: "Years in travel" },
          { value: "10", label: "African countries covered" },
          { value: "TRA", label: "Licensed DMC" },
        ],
      },
      { type: "heading", eyebrow: "Who we are", text: "ABOUT VILLAGIO" },
      {
        type: "text",
        text: "Villagio Enterprises, trading as Villagio Travel & Tours, is a Kenyan travel management company based at Suite 302, 3rd Floor, AACC Building, along Waiyaki Way in Westlands, Nairobi. We arrange business and leisure travel for corporates, government agencies, non-governmental organisations, schools, faith groups, families and individual travellers.",
      },
      {
        type: "text",
        text: "Our team handles every part of the trip in one place: flights, hotels, transfers, safaris, visas and events. Clients deal with a single point of contact who knows their preferences, follows up on every booking and stays reachable until they are safely home.",
      },
      {
        type: "text",
        text: "We are licensed by the Tourism Regulatory Authority (TRA) under the Ministry of Tourism and Wildlife, and we work both as a travel agency for outbound travellers and as a destination management company (DMC) for visitors arriving in Africa. Our multilingual guides, professional chauffeurs and experienced planners make every safari, beach break or city trip safe and seamless.",
      },
      { type: "heading", eyebrow: "What drives us", text: "VISION, MISSION & VALUES" },
      {
        type: "callouts",
        items: [
          {
            title: "Our Vision",
            text: "To be East Africa’s most trusted travel partner, known for journeys that are well planned, fairly priced and remembered for the right reasons.",
          },
          {
            title: "Our Mission",
            text: "To plan and deliver seamless travel and tour experiences through personal attention, reliable partners and honest advice, so that every client travels with confidence.",
          },
        ],
      },
      {
        type: "cards",
        columns: 3,
        items: [
          { title: "TRUST", text: "We give straight answers on fares, fees and options, and we deliver what we confirm." },
          { title: "CARE", text: "We treat every traveller as our own guest, before, during and after the trip." },
          { title: "EXCELLENCE", text: "We sweat the details so that our clients never have to." },
        ],
      },
      { type: "heading", eyebrow: "Who we serve", text: "OUR CLIENTS" },
      {
        type: "list",
        items: [
          { label: "Corporate organisations", text: "staff travel, executive trips, incentive travel and annual retreats." },
          { label: "Government & public institutions", text: "official travel, delegations and conference logistics." },
          { label: "NGOs & development partners", text: "field missions, workshops and visiting consultants." },
          { label: "Schools & colleges", text: "educational trips, sports tours and graduation trips." },
          { label: "Churches & community groups", text: "pilgrimages, retreats and group holidays." },
          { label: "Families & individuals", text: "honeymoons, holidays, birthdays and once-in-a-lifetime trips." },
        ],
      },
      { type: "image", src: `${VILLAGIO_IMAGES}/clients.webp`, alt: "View from an aircraft window" },
    ],
  },
  {
    slug: "shanzy-solutions",
    title: "Shanzy Solutions Ltd",
    excerpt:
      "A company profile for a Nairobi supplies and construction company, setting out its two divisions and how it delivers work for institutions and homeowners.",
    date: "Nov 4, 2026",
    pages: 7,
    accent: "#1aa3e8",
    cover: { src: `${SHANZY_IMAGES}/cover.webp`, alt: "Building under construction with a crane and stacked materials" },
    content: [
      { type: "heading", text: "Who We Are" },
      {
        type: "text",
        text: "Shanzy Solutions Ltd is a private limited company incorporated in Kenya under the Companies Act, 2015, with its registered office on Desai Road in Ngara, Nairobi. The company brings two essential services under one roof: the supply of quality goods and the delivery of building and construction works. We serve government ministries, county governments, schools, hospitals, NGOs, private businesses and individual homeowners who need a partner that can both source the materials and put up the structure.",
      },
      {
        type: "text",
        text: "Our approach is simple. Every client gets a clear scope, an honest quotation and a schedule we can actually keep. Whether the order is a box of stationery or a multi-storey building, we treat it with the same attention to detail, the same respect for the budget and the same pride in the finished result.",
      },
      {
        type: "text",
        text: "Because we handle both procurement and construction in-house, our clients deal with one point of contact, one invoice trail and one team accountable from the first site visit to the final handover.",
      },
      { type: "quote", text: "“One partner from purchase order to practical completion.”" },
      { type: "heading", text: "Leadership" },
      {
        type: "text",
        text: "Shanzy Solutions Ltd is owned and directed by Sharon Jedidah Nyawira Macharia, who serves as the company’s sole Director and Shareholder. She provides the strategic direction of the business, oversees client relationships and ensures that every supply order and construction contract is delivered to the standards the company has set for itself.",
      },
      { type: "heading", text: "Our Purpose" },
      {
        type: "callouts",
        items: [
          {
            title: "Our Vision",
            text: "To be Kenya’s first-choice partner for dependable supplies and well-built structures that stand the test of time.",
          },
          {
            title: "Our Mission",
            text: "To source and deliver quality goods on time and to build safe, durable and cost-effective structures, while treating every client, worker and community with fairness and respect.",
          },
        ],
      },
      { type: "heading", text: "Core Values" },
      {
        type: "table",
        rows: [
          { label: "Integrity", value: "We quote honestly, report openly and keep our word on price, quality and time." },
          { label: "Workmanship", value: "We build to approved drawings and specifications, and we do not hide shortcuts behind plaster." },
          { label: "Safety", value: "Every worker goes home safe. Protective equipment and site discipline are non-negotiable." },
          { label: "Accountability", value: "We own our results, fix our mistakes quickly and stand behind every handover." },
          { label: "Partnership", value: "We grow with our clients, suppliers and local communities, not at their expense." },
        ],
      },
      { type: "heading", text: "Company Details" },
      {
        type: "table",
        rows: [
          { label: "Company Name", value: "Shanzy Solutions Ltd" },
          { label: "Company Type", value: "Private Limited Company" },
          { label: "Date of Incorporation", value: "12 November 2025" },
          { label: "Director", value: "Sharon Jedidah Nyawira Macharia" },
          { label: "Registered Office", value: "Block E 25, Desai Road, Ngara, Starehe, Nairobi County" },
          { label: "Postal Address", value: "P.O. Box 47249-00100, G.P.O. Nairobi" },
          { label: "Telephone", value: "+254 727 884 730" },
          { label: "Email", value: "shanzysolutionsltd@gmail.com" },
        ],
      },
    ],
  },
];
