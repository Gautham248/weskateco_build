// ---------------------------------------------------------------------------
// Contact-enquiry routing table — the operational core of the Contact Us page.
// Edit this file to add, remove or reorder reasons without touching any UI.
// ---------------------------------------------------------------------------

export type FieldOption = string;

export interface RouteField {
  name: string;
  type: "select" | "text" | "url" | "date" | "textarea";
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: readonly string[];
  /** Render as a multi-choice checkbox / chip group instead of a single select. */
  multi?: true;
  /** Field spans the full grid row. */
  wide?: true;
}

export interface RouteEntry {
  team: string;
  sla: string;
  prefix: string;
  legend: string;
  note: string;
  fields: readonly RouteField[];
}

// ── Reason groups (for the <select> optgroups) ────────────────────────────

export interface ReasonOption {
  value: string;
  label: string;
}

export interface ReasonGroup {
  group: string;
  options: readonly ReasonOption[];
}

export const REASONS: readonly ReasonGroup[] = [
  {
    group: "Products — Sphere & the WeSkate store",
    options: [
      {
        value: "product-info",
        label: "Product details, sizing or availability",
      },
      { value: "product-advice", label: "Help me choose the right setup" },
      {
        value: "sphere",
        label: "Sphere Skateboards — pro decks, custom and team",
      },
    ],
  },
  {
    group: "Coaching — WeSkate Academy",
    options: [
      { value: "academy", label: "Coaching, camps or school programmes" },
    ],
  },
  {
    group: "Skateparks — WB Skateparks",
    options: [
      { value: "park-build", label: "Build a new skatepark" },
      {
        value: "park-upgrade",
        label: "Repair, resurface or upgrade an existing park",
      },
      {
        value: "park-consult",
        label: "Skatepark consultation or feasibility study",
      },
    ],
  },
  {
    group: "Trade & distribution — Toucan Distribution",
    options: [
      { value: "dealer", label: "Become a stockist or dealer" },
      { value: "bulk", label: "Bulk or institutional order" },
      { value: "brand-in", label: "Distribute your brand in India" },
    ],
  },
  {
    group: "Existing customers",
    options: [
      { value: "support", label: "Order, delivery, returns or warranty" },
    ],
  },
  {
    group: "Brand & community",
    options: [
      { value: "partnership", label: "Sponsorship, collaboration or event" },
      { value: "press", label: "Press and media" },
      { value: "careers", label: "Careers and internships" },
    ],
  },
  {
    group: "Anything else",
    options: [{ value: "other", label: "Something else" }],
  },
];

// ── Reason labels (for the success receipt) ───────────────────────────────

export const REASON_LABELS: Record<string, string> = {
  "product-info": "Product details, sizing or availability",
  "product-advice": "Help me choose the right setup",
  sphere: "Sphere Skateboards — pro decks, custom and team",
  academy: "Coaching, camps or school programmes",
  "park-build": "Build a new skatepark",
  "park-upgrade": "Repair, resurface or upgrade an existing park",
  "park-consult": "Skatepark consultation or feasibility study",
  dealer: "Become a stockist or dealer",
  bulk: "Bulk or institutional order",
  "brand-in": "Distribute your brand in India",
  support: "Order, delivery, returns or warranty",
  partnership: "Sponsorship, collaboration or event",
  press: "Press and media",
  careers: "Careers and internships",
  other: "Something else",
};

// ── Routing table ─────────────────────────────────────────────────────────

export const ROUTES: Record<string, RouteEntry> = {
  "product-info": {
    team: "WeSkate store team",
    sla: "24 hours",
    prefix: "PRD",
    legend: "ABOUT THE PRODUCT",
    note: "Give us the product name and your pincode and we can confirm stock, price and delivery in one reply.",
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        required: true,
        options: [
          "Skateboards — completes",
          "Skateboard decks",
          "Surfskates — completes",
          "Surfskate decks",
          "Trucks",
          "Wheels and bearings",
          "Protective gear",
          "Apparel",
          "Accessories and spares",
        ],
      },
      {
        name: "productName",
        type: "text",
        label: "Product or brand name",
        required: true,
        hint: "For example: Sphere Maneki Beginner Complete.",
      },
      {
        name: "queryType",
        type: "select",
        multi: true,
        required: true,
        wide: true,
        label: "What you need to know",
        options: [
          "Is it in stock",
          "Size, specification or fit",
          "Price, offers or EMI",
          "Will it fit my current setup",
          "Delivery time to my pincode",
          "Difference between two products",
        ],
      },
      {
        name: "pincode",
        type: "text",
        label: "Delivery pincode",
        hint: "So we can confirm serviceability and delivery time.",
      },
    ],
  },

  "product-advice": {
    team: "WeSkate store team",
    sla: "24 hours",
    prefix: "PRD",
    legend: "ABOUT THE RIDER",
    note: "Answer these and we will send two or three specific setups with prices, not a catalogue link.",
    fields: [
      {
        name: "riderFor",
        type: "select",
        label: "Who is this for",
        required: true,
        options: ["Myself", "My child", "A gift", "A group or team"],
      },
      {
        name: "riderLevel",
        type: "select",
        label: "Experience level",
        required: true,
        options: [
          "Never skated before",
          "Beginner — still learning to ride",
          "Can ride, starting tricks",
          "Intermediate",
          "Advanced",
        ],
      },
      {
        name: "riderAge",
        type: "select",
        label: "Age group",
        required: true,
        options: ["Under 8", "8 – 12", "13 – 17", "Adult"],
      },
      {
        name: "shoeSize",
        type: "select",
        label: "Shoe size (UK)",
        hint: "Decides the right deck width.",
        options: ["Below 5", "5 – 7", "8 – 10", "11 and above"],
      },
      {
        name: "ridingStyle",
        type: "select",
        label: "Type of riding",
        required: true,
        options: [
          "Cruising and commuting",
          "Park and street tricks",
          "Surfskate — surf or snowboard training",
          "Learning basics only",
          "Not sure — advise us",
        ],
      },
      {
        name: "buildPref",
        type: "select",
        label: "Complete or custom build",
        options: ["Ready-made complete", "Build my own setup", "Advise me"],
      },
      {
        name: "budget",
        type: "select",
        label: "Budget",
        required: true,
        options: [
          "Under ₹5,000",
          "₹5,000 – 8,000",
          "₹8,000 – 15,000",
          "₹15,000 – 25,000",
          "Above ₹25,000",
        ],
      },
      {
        name: "gearNeeded",
        type: "select",
        label: "Protective gear needed",
        options: [
          "Yes, include it",
          "Already have it",
          "Tell me what is essential",
        ],
      },
    ],
  },

  sphere: {
    team: "Sphere brand desk — WeSkate",
    sla: "2 working days",
    prefix: "SPH",
    legend: "ABOUT YOUR SPHERE ENQUIRY",
    note: "Sphere is our own brand, so pro deck, custom graphic and team enquiries come to us directly.",
    fields: [
      {
        name: "sphereTopic",
        type: "select",
        label: "What is this about",
        required: true,
        options: [
          "Sphere product range and availability",
          "Pro deck specification or graphics",
          "Custom graphics or a collaboration",
          "Team rider or ambassador enquiry",
          "Warranty or quality issue on a Sphere product",
          "Stocking Sphere in my store",
          "Sphere for an event or activation",
        ],
      },
      {
        name: "sphereLine",
        type: "select",
        label: "Product line",
        options: [
          "Beginner completes",
          "Pro decks",
          "Surfskates",
          "Toucan components",
          "Not specific",
        ],
      },
      {
        name: "sphereProduct",
        type: "text",
        label: "Product or graphic name",
        hint: "If your enquiry is about a specific item.",
      },
      {
        name: "sphereQty",
        type: "select",
        label: "Quantity involved",
        options: [
          "Single unit",
          "2 – 10 units",
          "11 – 50 units",
          "Above 50 units",
          "Not applicable",
        ],
      },
    ],
  },

  academy: {
    team: "WeSkate Academy — programmes",
    sla: "2 working days",
    prefix: "ACD",
    legend: "ABOUT THE PROGRAMME",
    note: "We run coaching in and around Bengaluru and Kerala, and travel for larger programmes.",
    fields: [
      {
        name: "programType",
        type: "select",
        label: "What you are looking for",
        required: true,
        options: [
          "Individual lessons",
          "Group lessons",
          "School or college programme",
          "Corporate or CSR workshop",
          "Holiday camp",
          "Event or one-day activation",
          "Coach training",
        ],
      },
      {
        name: "participants",
        type: "select",
        label: "Number of participants",
        required: true,
        options: ["1 – 2", "3 – 10", "11 – 30", "31 – 100", "More than 100"],
      },
      {
        name: "ageGroup",
        type: "select",
        label: "Age group",
        required: true,
        options: ["Under 8", "8 – 12", "13 – 17", "Adults", "Mixed ages"],
      },
      {
        name: "skillLevel",
        type: "select",
        label: "Skill level",
        options: [
          "Complete beginners",
          "Some experience",
          "Mixed levels",
          "Intermediate or advanced",
        ],
      },
      {
        name: "venue",
        type: "select",
        label: "Venue",
        options: [
          "We have a venue",
          "Please suggest one",
          "At a WeSkate location",
          "Not decided",
        ],
      },
      {
        name: "equipment",
        type: "select",
        label: "Equipment needed",
        options: [
          "Yes — boards and gear required",
          "Some have their own",
          "No, all equipped",
        ],
      },
      {
        name: "timeline",
        type: "select",
        label: "Preferred start",
        required: true,
        options: [
          "Within 2 weeks",
          "Within a month",
          "1 – 3 months",
          "Just exploring",
        ],
      },
    ],
  },

  "park-build": {
    team: "WB Skateparks — projects desk",
    sla: "1 working day",
    prefix: "WBP",
    legend: "ABOUT THE SITE",
    note: "These answers let us give you an indicative cost and timeline in the first reply, rather than after three rounds of email.",
    fields: [
      {
        name: "orgType",
        type: "select",
        label: "Type of organisation",
        required: true,
        options: [
          "Government or municipal body",
          "Real estate or township developer",
          "School, college or university",
          "Hotel, resort or club",
          "Private or community group",
          "NGO or CSR programme",
          "Other",
        ],
      },
      {
        name: "siteLocation",
        type: "text",
        label: "Site location (city, state)",
        required: true,
      },
      {
        name: "siteArea",
        type: "select",
        label: "Approximate area available",
        required: true,
        options: [
          "Under 2,000 sq ft",
          "2,000 – 5,000 sq ft",
          "5,000 – 10,000 sq ft",
          "10,000 – 25,000 sq ft",
          "Over 25,000 sq ft",
          "Not measured yet",
        ],
      },
      {
        name: "siteCover",
        type: "select",
        label: "Indoor or outdoor",
        options: ["Outdoor", "Indoor", "Partly covered", "Not decided"],
      },
      {
        name: "buildType",
        type: "select",
        label: "Preferred construction",
        options: [
          "Poured concrete",
          "Modular or prefabricated",
          "Not sure — please advise",
        ],
      },
      {
        name: "landStatus",
        type: "select",
        label: "Status of the land",
        required: true,
        options: [
          "Identified and approved",
          "Identified, approvals pending",
          "Still identifying a site",
        ],
      },
      {
        name: "budget",
        type: "select",
        label: "Indicative budget",
        required: true,
        options: [
          "Under ₹15 lakh",
          "₹15 – 40 lakh",
          "₹40 lakh – ₹1 crore",
          "₹1 – 3 crore",
          "Above ₹3 crore",
          "Not finalised",
        ],
      },
      {
        name: "budgetStatus",
        type: "select",
        label: "Is the budget sanctioned",
        required: true,
        options: [
          "Yes, approved",
          "In approval process",
          "Not yet — early stage",
        ],
      },
      {
        name: "timeline",
        type: "select",
        label: "Target completion",
        required: true,
        options: [
          "Within 3 months",
          "3 – 6 months",
          "6 – 12 months",
          "Beyond 12 months",
          "Exploring only",
        ],
      },
      {
        name: "tender",
        type: "select",
        label: "Is this a tender or RFP",
        options: [
          "No",
          "Yes — tender or RFP",
          "Yes — with a submission deadline",
        ],
      },
      {
        name: "docsLink",
        type: "url",
        label: "Link to drawings, tender documents or site photos",
        wide: true,
        placeholder: "https://",
        hint: "Google Drive, Dropbox or WeTransfer link. Nothing to share yet is fine — we will ask later.",
      },
    ],
  },

  "park-upgrade": {
    team: "WB Skateparks — projects desk",
    sla: "1 working day",
    prefix: "WBP",
    legend: "ABOUT THE EXISTING PARK",
    note: "Photographs of the damage move this faster than anything else — mention in your message that you can share them.",
    fields: [
      {
        name: "orgType",
        type: "select",
        label: "Type of organisation",
        required: true,
        options: [
          "Government or municipal body",
          "Real estate or township developer",
          "School, college or university",
          "Hotel, resort or club",
          "Private or community group",
          "NGO or CSR programme",
          "Other",
        ],
      },
      {
        name: "siteLocation",
        type: "text",
        label: "Park location (city, state)",
        required: true,
      },
      {
        name: "parkAge",
        type: "select",
        label: "Age of the park",
        options: [
          "Under 2 years",
          "2 – 5 years",
          "5 – 10 years",
          "Over 10 years",
          "Not sure",
        ],
      },
      {
        name: "workType",
        type: "select",
        label: "What needs attention",
        required: true,
        options: [
          "Surface cracking or resurfacing",
          "Coping, rails or metalwork",
          "Drainage or water pooling",
          "Adding new obstacles",
          "Full rebuild",
          "Not sure — needs inspection",
        ],
      },
      {
        name: "originalBuilder",
        type: "select",
        label: "Who built the original park",
        options: [
          "WB Skateparks",
          "Another contractor",
          "Built in-house",
          "Not known",
        ],
      },
      {
        name: "budget",
        type: "select",
        label: "Indicative budget",
        required: true,
        options: [
          "Under ₹5 lakh",
          "₹5 – 15 lakh",
          "₹15 – 40 lakh",
          "Above ₹40 lakh",
          "Not finalised",
        ],
      },
      {
        name: "timeline",
        type: "select",
        label: "When it is needed",
        required: true,
        options: [
          "Urgent — within a month",
          "1 – 3 months",
          "3 – 6 months",
          "Planning for next year",
        ],
      },
      {
        name: "docsLink",
        type: "url",
        label: "Link to photographs of the damage",
        wide: true,
        placeholder: "https://",
        hint: "Google Drive, Dropbox or WeTransfer link. This is the single fastest way to get an accurate answer.",
      },
    ],
  },

  "park-consult": {
    team: "WB Skateparks — design desk",
    sla: "2 working days",
    prefix: "WBP",
    legend: "ABOUT THE STUDY",
    note: "Consultation and design can be commissioned on their own, with no commitment to a build.",
    fields: [
      {
        name: "orgType",
        type: "select",
        label: "Type of organisation",
        required: true,
        options: [
          "Government or municipal body",
          "Real estate or township developer",
          "School, college or university",
          "Hotel, resort or club",
          "Private or community group",
          "NGO or CSR programme",
          "Architecture or design firm",
          "Other",
        ],
      },
      {
        name: "siteLocation",
        type: "text",
        label: "Site or project location",
        required: true,
      },
      {
        name: "scope",
        type: "select",
        label: "What you need from us",
        required: true,
        options: [
          "Feasibility and site assessment",
          "Concept design only",
          "Detailed design and drawings",
          "Costing and BOQ support",
          "Community consultation",
          "Not sure yet",
        ],
      },
      {
        name: "stage",
        type: "select",
        label: "Stage of the project",
        required: true,
        options: [
          "Just an idea",
          "Internal approval stage",
          "Budget approved, design pending",
          "Tender being prepared",
        ],
      },
      {
        name: "timeline",
        type: "select",
        label: "When the output is needed",
        options: [
          "Within 2 weeks",
          "Within a month",
          "1 – 3 months",
          "No fixed date",
        ],
      },
      {
        name: "docsLink",
        type: "url",
        label: "Link to site drawings or a brief",
        wide: true,
        placeholder: "https://",
        hint: "Google Drive, Dropbox or WeTransfer link, if you already hold any.",
      },
    ],
  },

  dealer: {
    team: "Toucan Distribution — trade desk",
    sla: "1 working day",
    prefix: "TDT",
    legend: "ABOUT YOUR BUSINESS",
    note: "Trade pricing and the dealer catalogue are shared after a short verification.",
    fields: [
      {
        name: "bizName",
        type: "text",
        label: "Registered business name",
        required: true,
      },
      {
        name: "bizType",
        type: "select",
        label: "Type of business",
        required: true,
        options: [
          "Skate or surf shop",
          "Sports goods retailer",
          "Lifestyle or concept store",
          "Online marketplace seller",
          "Own e-commerce website",
          "Regional distributor",
          "Skatepark or academy",
          "Other",
        ],
      },
      {
        name: "gstin",
        type: "text",
        label: "GSTIN",
        required: true,
        hint: "15 characters. Required for a trade account.",
      },
      {
        name: "channel",
        type: "select",
        label: "Where you sell",
        required: true,
        options: [
          "Physical store only",
          "Online only",
          "Both store and online",
        ],
      },
      {
        name: "bizAge",
        type: "select",
        label: "Years in business",
        options: [
          "Less than 1 year",
          "1 – 3 years",
          "3 – 7 years",
          "More than 7 years",
        ],
      },
      {
        name: "currentBrands",
        type: "text",
        label: "Brands you currently stock",
        wide: true,
        hint: "Helps us judge fit and avoid territory clashes.",
      },
      {
        name: "monthlyValue",
        type: "select",
        label: "Expected monthly purchase value",
        required: true,
        options: [
          "Under ₹50,000",
          "₹50,000 – ₹2 lakh",
          "₹2 – 5 lakh",
          "Above ₹5 lakh",
          "Not sure yet",
        ],
      },
      {
        name: "categories",
        type: "select",
        multi: true,
        required: true,
        wide: true,
        label: "Categories you want to carry",
        options: [
          "Skateboards",
          "Surfskates",
          "Protective gear",
          "Apparel",
          "Accessories and spares",
        ],
      },
    ],
  },

  bulk: {
    team: "Toucan Distribution — trade desk",
    sla: "1 working day",
    prefix: "TDT",
    legend: "ABOUT THE ORDER",
    note: "Bulk pricing improves with quantity and lead time. Give us both and you get a usable quote first time.",
    fields: [
      {
        name: "buyerType",
        type: "select",
        label: "Type of buyer",
        required: true,
        options: [
          "School or university",
          "Corporate or CSR programme",
          "Hotel, resort or club",
          "Government or sports body",
          "Event or activation agency",
          "NGO or foundation",
          "Reseller",
          "Other",
        ],
      },
      {
        name: "products",
        type: "select",
        multi: true,
        required: true,
        wide: true,
        label: "What you need",
        options: [
          "Complete skateboards",
          "Complete surfskates",
          "Protective gear",
          "Apparel",
          "Decks or components",
        ],
      },
      {
        name: "quantity",
        type: "select",
        label: "Approximate quantity",
        required: true,
        options: [
          "Under 10 units",
          "10 – 25 units",
          "25 – 100 units",
          "100 – 500 units",
          "Over 500 units",
        ],
      },
      {
        name: "branding",
        type: "select",
        label: "Custom branding required",
        options: [
          "No",
          "Yes — logo printing",
          "Yes — full custom graphics",
          "Please advise on options",
        ],
      },
      {
        name: "requiredBy",
        type: "date",
        label: "Required by",
        required: true,
      },
      {
        name: "budget",
        type: "select",
        label: "Indicative budget",
        options: [
          "Under ₹50,000",
          "₹50,000 – ₹2 lakh",
          "₹2 – 10 lakh",
          "Above ₹10 lakh",
          "Need a quote first",
        ],
      },
      {
        name: "gstin",
        type: "text",
        label: "GSTIN",
        hint: "If you require a GST invoice.",
      },
      {
        name: "addons",
        type: "select",
        label: "Training or setup also needed",
        options: [
          "No, products only",
          "Yes — coaching or training",
          "Yes — installation or setup",
          "Would like to discuss",
        ],
      },
      {
        name: "docsLink",
        type: "url",
        label: "Link to your requirement list or purchase order",
        wide: true,
        placeholder: "https://",
        hint: "If you already have a list or an indent prepared.",
      },
    ],
  },

  "brand-in": {
    team: "Toucan Distribution — brand partnerships",
    sla: "3 working days",
    prefix: "TDT",
    legend: "ABOUT YOUR BRAND",
    note: "Inbound distribution proposals are reviewed in batches, so this one takes a little longer to come back.",
    fields: [
      {
        name: "brandName",
        type: "text",
        label: "Brand name",
        required: true,
      },
      {
        name: "brandUrl",
        type: "url",
        label: "Website or catalogue link",
        required: true,
        placeholder: "https://",
      },
      {
        name: "brandCountry",
        type: "text",
        label: "Country of origin",
        required: true,
      },
      {
        name: "brandCategory",
        type: "select",
        label: "Category",
        required: true,
        options: [
          "Skateboards and components",
          "Surfskates",
          "Protective gear",
          "Footwear",
          "Apparel",
          "Skatepark equipment",
          "Other",
        ],
      },
      {
        name: "indiaPresence",
        type: "select",
        label: "Current presence in India",
        required: true,
        options: [
          "None",
          "Marketplaces only",
          "Existing distributor — changing",
          "Existing distributor — adding a second",
        ],
      },
      {
        name: "dealType",
        type: "select",
        label: "Arrangement sought",
        options: [
          "Exclusive national distribution",
          "Non-exclusive distribution",
          "Regional distribution",
          "Manufacturing or white label",
          "Not decided",
        ],
      },
      {
        name: "annualVolume",
        type: "select",
        label: "Indicative annual volume",
        options: [
          "Under ₹10 lakh",
          "₹10 – 50 lakh",
          "₹50 lakh – ₹2 crore",
          "Above ₹2 crore",
          "Cannot estimate",
        ],
      },
    ],
  },

  support: {
    team: "WeSkate customer care",
    sla: "24 hours",
    prefix: "CSD",
    legend: "ABOUT YOUR ORDER",
    note: "Your order number is on the confirmation email and begins with #.",
    fields: [
      {
        name: "issueType",
        type: "select",
        label: "What is the issue",
        required: true,
        options: [
          "Where is my order",
          "Delay in delivery",
          "Wrong item received",
          "Damaged in transit",
          "Return or exchange",
          "Refund status",
          "Warranty or product defect",
          "Cancel an order",
          "Change a delivery address",
        ],
      },
      {
        name: "orderNumber",
        type: "text",
        label: "Order number",
        required: true,
        placeholder: "#1234",
      },
      {
        name: "orderDate",
        type: "date",
        label: "Order date",
      },
      {
        name: "productName",
        type: "text",
        label: "Product name",
      },
    ],
  },

  partnership: {
    team: "WeSkate brand team",
    sla: "5 working days",
    prefix: "BRD",
    legend: "ABOUT THE PROPOSAL",
    note: "Rider and creator applications are reviewed monthly. Event proposals are reviewed as they arrive.",
    fields: [
      {
        name: "partnerType",
        type: "select",
        label: "Type of proposal",
        required: true,
        options: [
          "Rider or athlete sponsorship",
          "Content creator collaboration",
          "Event or competition support",
          "Brand collaboration",
          "Venue or space partnership",
          "Community or non-profit initiative",
        ],
      },
      {
        name: "partnerLink",
        type: "text",
        label: "Profile, portfolio or event link",
        wide: true,
        hint: "Instagram, website, deck or video reel.",
      },
      {
        name: "supportType",
        type: "select",
        label: "Support sought",
        required: true,
        options: [
          "Product support",
          "Financial support",
          "Both",
          "Co-marketing only",
          "Not sure",
        ],
      },
      {
        name: "partnerLocation",
        type: "text",
        label: "Location",
      },
      {
        name: "eventDate",
        type: "date",
        label: "Event date, if applicable",
      },
      {
        name: "reach",
        type: "select",
        label: "Expected reach or audience",
        options: [
          "Under 1,000",
          "1,000 – 10,000",
          "10,000 – 100,000",
          "Above 100,000",
          "Not applicable",
        ],
      },
    ],
  },

  press: {
    team: "WeSkate brand team",
    sla: "2 working days",
    prefix: "BRD",
    legend: "ABOUT THE STORY",
    note: "State your deadline — we prioritise press enquiries by it.",
    fields: [
      {
        name: "outlet",
        type: "text",
        label: "Publication or outlet",
        required: true,
      },
      {
        name: "pressNeed",
        type: "select",
        label: "What you need",
        required: true,
        options: [
          "Interview or quotes",
          "Images or brand assets",
          "Product for review",
          "Site or park visit",
          "Company information",
        ],
      },
      {
        name: "pressDeadline",
        type: "date",
        label: "Your deadline",
        required: true,
      },
    ],
  },

  careers: {
    team: "WeSkate people team",
    sla: "5 working days",
    prefix: "BRD",
    legend: "ABOUT YOU",
    note: "We hire across retail, construction, coaching and operations. Open roles are not always advertised.",
    fields: [
      {
        name: "roleArea",
        type: "select",
        label: "Area of interest",
        required: true,
        options: [
          "Skatepark construction",
          "Design and architecture",
          "Retail and store operations",
          "Warehouse and logistics",
          "Coaching",
          "Marketing and content",
          "Sales and distribution",
          "Finance and admin",
          "Internship — any area",
        ],
      },
      {
        name: "cvLink",
        type: "url",
        label: "CV, LinkedIn or portfolio link",
        required: true,
        wide: true,
        placeholder: "https://",
      },
      {
        name: "experience",
        type: "select",
        label: "Experience",
        required: true,
        options: [
          "Student or fresher",
          "Under 2 years",
          "2 – 5 years",
          "5 – 10 years",
          "Over 10 years",
        ],
      },
      {
        name: "workLocation",
        type: "select",
        label: "Where you can work",
        required: true,
        options: [
          "Bengaluru",
          "Kerala",
          "On project sites, travel ready",
          "Remote",
          "Flexible",
        ],
      },
      {
        name: "noticePeriod",
        type: "select",
        label: "Availability",
        options: ["Immediately", "Within a month", "1 – 3 months", "Later"],
      },
    ],
  },

  other: {
    team: "WeSkate front desk",
    sla: "2 working days",
    prefix: "GEN",
    legend: "TELL US MORE",
    note: "We will read it and pass it to the right person.",
    fields: [],
  },
};

// ── Shared "Your details" fields ──────────────────────────────────────────

export const SHARED_FIELDS: readonly RouteField[] = [
  {
    name: "title",
    type: "select",
    label: "Title",
    options: ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Shri", "Smt."],
  },
  {
    name: "firstName",
    type: "text",
    label: "First name",
    required: true,
    hint: undefined, // autocomplete="given-name" set in JSX
  },
  {
    name: "lastName",
    type: "text",
    label: "Last name",
    required: true,
    hint: undefined, // autocomplete="family-name" set in JSX
  },
  {
    name: "org",
    type: "text",
    label: "Organisation",
    hint: "Leave blank if enquiring personally.",
  },
  {
    name: "designation",
    type: "text",
    label: "Designation",
    hint: "Helps us judge who else to include on the reply.",
  },
  {
    name: "email",
    type: "text",
    label: "Email address",
    required: true,
  },
  {
    name: "phone",
    type: "text",
    label: "Mobile number",
    required: true,
    hint: "So the team can call you about this enquiry.",
  },
  {
    name: "city",
    type: "text",
    label: "City and state",
    required: true,
  },
  {
    name: "heard",
    type: "select",
    label: "How did you hear about us?",
    options: [
      "Prefer not to say",
      "Google search",
      "Instagram",
      "Referral or word of mouth",
      "Saw a park we built",
      "Met us at an event",
      "Existing customer",
      "Other",
    ],
  },
  {
    name: "message",
    type: "textarea",
    label: "Your message",
    required: true,
    hint: "A few lines is enough. Specific beats long.",
  },
];

// ── Deflection blocks ─────────────────────────────────────────────────────

export interface DeflectionEntry {
  lead: string;
  body: string;
  linkLabel: string;
  href: string;
}

const DEFAULT_DEFLECTION: DeflectionEntry = {
  lead: "Building your own setup?",
  body: "The configurator lets you pick a deck, trucks and wheels that work together, and prices it as you go.",
  linkLabel: "Open the configurator",
  href: "https://weskateco.vercel.app/configurator",
};

export const DEFLECTIONS: Record<string, DeflectionEntry> = {
  default: DEFAULT_DEFLECTION,
  "product-advice": {
    lead: "Want to see the options first?",
    body: "The configurator walks you through deck, trucks and wheels and shows what fits together, with live pricing.",
    linkLabel: "Open the configurator",
    href: "https://weskateco.vercel.app/configurator",
  },
  "product-info": {
    lead: "Looking for sizing guidance?",
    body: "Our buying and wheel size guides answer most specification questions immediately.",
    linkLabel: "Read the buying guide",
    href: "https://weskateco.com/pages/skateboard-buying-guide",
  },
  sphere: {
    lead: "Just want to browse Sphere?",
    body: "The full range, including pro decks and completes, is on the store.",
    linkLabel: "View the Sphere range",
    href: "https://weskateco.com/collections/sphere",
  },
  "park-build": {
    lead: "New to working with us?",
    body: "See the parks we have built, our process and the materials we use before you commit to a conversation.",
    linkLabel: "View our projects",
    href: "https://weskateco.com/pages/wb-skateparks",
  },
  "park-upgrade": {
    lead: "New to working with us?",
    body: "See the parks we have built, our process and the materials we use before you commit to a conversation.",
    linkLabel: "View our projects",
    href: "https://weskateco.com/pages/wb-skateparks",
  },
  "park-consult": {
    lead: "New to working with us?",
    body: "See the parks we have built, our process and the materials we use before you commit to a conversation.",
    linkLabel: "View our projects",
    href: "https://weskateco.com/pages/wb-skateparks",
  },
  support: {
    lead: "Checking where your order is?",
    body: "Tracking and return status are available in your account without waiting for a reply.",
    linkLabel: "Track my order",
    href: "https://weskateco.com/account",
  },
  careers: {
    lead: "Looking for a listed role?",
    body: "Current openings are published on the careers page. This form is for speculative applications too.",
    linkLabel: "View open roles",
    href: "https://weskateco.com/pages/about-us",
  },
};

export function getDeflection(reason: string | null): DeflectionEntry {
  if (!reason) return DEFAULT_DEFLECTION;
  return DEFLECTIONS[reason] ?? DEFAULT_DEFLECTION;
}
