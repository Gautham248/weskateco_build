import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f25zmr6t";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN is missing in environment.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

async function seed() {
  console.log("🌱 Starting Sanity initial data seed...");

  // 1. Site Settings
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: "WeSkate Co",
    siteName: "WeSkate Co",
    announcementBar_en: "FREE SHIPPING ON ALL ORDERS OVER ₹2,999 | MADE IN INDIA",
    announcementBar_hi: "₹2,999 से अधिक के सभी ऑर्डर पर मुफ़्त शिपिंग | भारत में निर्मित",
    announcementBarEnabled: true,
    contactEmail: "support@weskateco.com",
    contactPhone: "+91 98765 43210",
    socialLinks: {
      instagram: "https://instagram.com/weskateco",
      youtube: "https://youtube.com/@weskateco",
      facebook: "https://facebook.com/weskateco",
      twitter: "https://twitter.com/weskateco",
    },
    footerText_en: "© 2026 WeSkate Co. All rights reserved. Premium Skateboards & Surfskates.",
    footerText_hi: "© 2026 WeSkate Co. सर्वाधिकार सुरक्षित। प्रीमियम स्केटबोर्ड और सर्फस्केट।",
    heroSettings: {
      mediaType: "gif",
      overlayEnabled: false,
      ctaButtons: [
        { label_en: "Shop Skateboards", label_hi: "स्केटबोर्ड खरीदें", href: "/store/skateboard-completes" },
        { label_en: "Shop Surfskates", label_hi: "सर्फस्केट खरीदें", href: "/store/surfskate-completes" },
        { label_en: "Build Your Setup", label_hi: "अपना सेटअप बनाएं", href: "/configurator" },
      ],
    },
    categoryGrid: [
      { title_en: "SKATEBOARDS", title_hi: "स्केटबोर्ड", href: "/store/skateboard-completes" },
      { title_en: "SURFSKATES", title_hi: "सर्फस्केट", href: "/store/surfskate-completes" },
      { title_en: "ACCESSORIES", title_hi: "एक्सेसरीज", href: "/store/accessories" },
    ],
  });
  console.log("✅ Seeded siteSettings");

  // 2. Navigation
  await client.createOrReplace({
    _id: "navigation-header",
    _type: "navigation",
    identifier: "header",
    title: "Header Navigation",
    items: [
      {
        label_en: "STORE",
        label_hi: "स्टोर",
        href: "/store",
        children: [
          { label_en: "Skateboards", label_hi: "स्केटबोर्ड", href: "/store/skateboard-completes" },
          { label_en: "Surfskates", label_hi: "सर्फस्केट", href: "/store/surfskate-completes" },
          { label_en: "Accessories", label_hi: "एक्सेसरीज", href: "/store/accessories" },
          { label_en: "Protective Gear", label_hi: "सुरक्षात्मक गियर", href: "/store/protective-gear" },
          { label_en: "Footwear", label_hi: "जूते", href: "/store/footwear" },
          { label_en: "Apparel", label_hi: "परिधान", href: "/store/apparel" },
        ],
      },
      {
        label_en: "GUIDES",
        label_hi: "गाइड्स",
        href: "/guides",
        children: [
          { label_en: "Skateboarding 101", label_hi: "स्केटबोर्डिंग 101", href: "/guides/skateboard-buying-guide" },
          { label_en: "Maintenance Guide", label_hi: "रखरखाव गाइड", href: "/guides/wheels-guide" },
        ],
      },
      { label_en: "ACADEMY", label_hi: "अकादमी", href: "/academy" },
      { label_en: "SKATEPARKS", label_hi: "स्केटपार्क", href: "/skateparks" },
    ],
  });
  console.log("✅ Seeded navigation");

  // 3. Home Newly Released
  await client.createOrReplace({
    _id: "homeNewlyReleased",
    _type: "homeNewlyReleased",
    slides: [
      {
        title: "PIGEON OG PRO",
        subtitle: "7-PLY CANADIAN MAPLE / STEEP CONCAVE",
        shopifyProductHandle: "pigeon-og-pro",
        price: "₹4,999",
        oldPrice: "₹5,999",
      },
      {
        title: "BOMBAY SURFER",
        subtitle: "CX TRUCK SYSTEM / DEEP CARVE",
        shopifyProductHandle: "bombay-surfer",
        price: "₹7,499",
        oldPrice: "₹8,999",
      },
    ],
  });
  console.log("✅ Seeded homeNewlyReleased");

  // 4. Home Shop Now
  await client.createOrReplace({
    _id: "homeShopNow",
    _type: "homeShopNow",
    products: [
      { shopifyProductHandle: "pigeon-og-pro", discountBadge: "15% OFF", emiBadge: "EMI starts at ₹416/mo" },
      { shopifyProductHandle: "bombay-surfer", discountBadge: "16% OFF", emiBadge: "EMI starts at ₹624/mo" },
    ],
  });
  console.log("✅ Seeded homeShopNow");

  console.log("🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
