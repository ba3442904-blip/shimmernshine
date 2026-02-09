import "dotenv/config";
import { writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { siteDefaults } from "../src/lib/siteDefaults";

const sqlString = (value: string) => `'${value.replace(/'/g, "''")}'`;
const cuid = () => randomUUID();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  const lines: string[] = [];

  lines.push(
    `INSERT INTO "User" ("id","email","passwordHash","role","createdAt") VALUES (${sqlString(
      cuid()
    )}, ${sqlString(email)}, ${sqlString(passwordHash)}, 'owner', ${sqlString(
      now
    )}) ON CONFLICT("email") DO UPDATE SET "passwordHash"=excluded."passwordHash";`
  );

  const settings: Array<[string, unknown]> = [
    ["businessInfo", siteDefaults.businessInfo],
    ["hours", siteDefaults.hours],
    ["serviceArea", siteDefaults.serviceArea],
    ["socials", siteDefaults.socials],
    ["seo", siteDefaults.seo],
    ["booking", siteDefaults.booking],
    ["trustBadges", siteDefaults.trustBadges],
  ];

  for (const [key, value] of settings) {
    lines.push(
      `INSERT INTO "Setting" ("key","value") VALUES (${sqlString(
        key
      )}, ${sqlString(JSON.stringify(value))}) ON CONFLICT("key") DO UPDATE SET "value"=excluded."value";`
    );
  }

  lines.push(
    `INSERT INTO "Service" ("id","slug","name","shortDescription","longDescription","durationMins","isActive","sortOrder","createdAt") VALUES ` +
      `(${sqlString(cuid())}, 'interior-detail', 'Interior Detail', ${sqlString(
        "Deep clean for seats, carpets, and dash."
      )}, ${sqlString(
        "A full interior reset with vacuuming, shampoo, steam cleaning, and conditioning for leather and trim."
      )}, 150, 1, 1, ${sqlString(now)}),` +
      `(${sqlString(cuid())}, 'exterior-detail', 'Exterior Detail', ${sqlString(
        "Wash, decontaminate, and protect."
      )}, ${sqlString(
        "Foam wash, hand wash, clay bar, wheels and tires, and a durable sealant to protect the finish."
      )}, 120, 1, 2, ${sqlString(now)}),` +
      `(${sqlString(cuid())}, 'full-detail', 'Full Detail', ${sqlString(
        "Inside + outside restoration."
      )}, ${sqlString(
        "Our most popular package with full interior and exterior detailing, gloss enhancement, and trim protection."
      )}, 210, 1, 3, ${sqlString(now)})` +
      ` ON CONFLICT("slug") DO UPDATE SET ` +
      `"name"=excluded."name",` +
      `"shortDescription"=excluded."shortDescription",` +
      `"longDescription"=excluded."longDescription",` +
      `"durationMins"=excluded."durationMins",` +
      `"isActive"=excluded."isActive",` +
      `"sortOrder"=excluded."sortOrder";`
  );

const priceTiers = [
  ["interior-detail", "sedan", 18900],
  ["interior-detail", "suv", 22900],
  ["interior-detail", "truck", 25900],
  ["exterior-detail", "sedan", 14900],
  ["exterior-detail", "suv", 17900],
  ["exterior-detail", "truck", 19900],
  ["full-detail", "sedan", 27900],
  ["full-detail", "suv", 32900],
  ["full-detail", "truck", 36900],
];

for (const [slug, vehicleSize, priceCents] of priceTiers) {
  lines.push(
    `INSERT INTO "PriceTier" ("id","serviceId","vehicleSize","priceCents","isStartingAt") ` +
      `SELECT ${sqlString(cuid())}, "id", ${sqlString(
        vehicleSize
      )}, ${priceCents}, 1 FROM "Service" WHERE "slug"=${sqlString(
        slug
      )} AND NOT EXISTS (` +
      `SELECT 1 FROM "PriceTier" WHERE "serviceId"="Service"."id" AND "vehicleSize"=${sqlString(
        vehicleSize
      )}` +
      `);`
  );
}

const addOns = [
  ["Pet Hair Removal", "Deep extraction for stubborn pet hair.", 3500, 1],
  ["Odor Treatment", "Neutralize smoke, food, and mildew odors.", 4500, 2],
  ["Clay Bar + Sealant", "Extra paint decontamination and protection.", 5500, 3],
  ["Engine Bay Clean", "Degrease and dress engine bay surfaces.", 4000, 4],
];

for (const [name, description, priceCents, sortOrder] of addOns) {
  lines.push(
    `INSERT INTO "AddOn" ("id","name","description","priceCents","isActive","sortOrder","createdAt") ` +
      `SELECT ${sqlString(cuid())}, ${sqlString(name)}, ${sqlString(
        description
      )}, ${priceCents}, 1, ${sortOrder}, ${sqlString(now)} ` +
      `WHERE NOT EXISTS (SELECT 1 FROM "AddOn" WHERE "name"=${sqlString(name)});`
  );
}

const gallery = [
  ["/images/gallery-1.jpg", "Interior before and after", "interior", 1],
  ["/images/gallery-2.jpg", "Exterior shine", "exterior", 2],
  ["/images/gallery-3.jpg", "Paint correction", "paint", 3],
  ["/images/gallery-4.jpg", "Wheel detailing", "wheels", 4],
  ["/images/gallery-5.jpg", "Seat restoration", "interior", 5],
  ["/images/gallery-6.jpg", "SUV exterior polish", "exterior", 6],
];

for (const [url, alt, category, sortOrder] of gallery) {
  lines.push(
    `INSERT INTO "GalleryImage" ("id","url","alt","category","sortOrder","isActive","createdAt") ` +
      `SELECT ${sqlString(cuid())}, ${sqlString(url)}, ${sqlString(
        alt
      )}, ${sqlString(category)}, ${sortOrder}, 1, ${sqlString(now)} ` +
      `WHERE NOT EXISTS (SELECT 1 FROM "GalleryImage" WHERE "url"=${sqlString(
        url
      )});`
  );
}

const reviews = [
  [
    "Jordan M.",
    5,
    "My SUV looks brand new. Super easy booking and they showed up on time.",
    "Jan 2026",
    1,
    1,
  ],
  [
    "Alissa R.",
    5,
    "Interior detail was flawless and the team was professional.",
    "Dec 2025",
    1,
    2,
  ],
  [
    "Marcus D.",
    4,
    "Great service and communication. Will book again.",
    "Nov 2025",
    1,
    3,
  ],
];

for (const [name, stars, text, date, isFeatured, sortOrder] of reviews) {
  lines.push(
    `INSERT INTO "Review" ("id","name","stars","text","date","isFeatured","isActive","sortOrder","createdAt") ` +
      `SELECT ${sqlString(cuid())}, ${sqlString(name)}, ${stars}, ${sqlString(
        text
      )}, ${sqlString(date)}, ${isFeatured ? 1 : 0}, 1, ${sortOrder}, ${sqlString(
        now
      )} WHERE NOT EXISTS (` +
      `SELECT 1 FROM "Review" WHERE "name"=${sqlString(name)} AND "date"=${sqlString(
        date
      )} AND "text"=${sqlString(text)}` +
      `);`
  );
}

const faqs = [
  [
    "How long does a full detail take?",
    "Most full details take 3-4 hours depending on the vehicle size.",
    1,
  ],
  [
    "Do you need access to water or power?",
    "We bring our own water and power for most jobs.",
    2,
  ],
  [
    "What is your cancellation policy?",
    "We ask for 24 hours notice to reschedule or cancel.",
    3,
  ],
  [
    "Can you handle pet hair or smoke odor?",
    "Yes, we have add-ons for pet hair removal and odor treatments.",
    4,
  ],
  ["What vehicles do you service?", "We service sedans, SUVs, trucks, and vans.", 5],
  ["Do you offer maintenance plans?", "Yes, monthly and biweekly plans are available on request.", 6],
];

for (const [question, answer, sortOrder] of faqs) {
  lines.push(
    `INSERT INTO "FAQ" ("id","question","answer","sortOrder","isActive","createdAt") ` +
      `SELECT ${sqlString(cuid())}, ${sqlString(question)}, ${sqlString(
        answer
      )}, ${sortOrder}, 1, ${sqlString(now)} ` +
      `WHERE NOT EXISTS (SELECT 1 FROM "FAQ" WHERE "question"=${sqlString(
        question
      )});`
  );
}

  const outputPath = path.join(process.cwd(), "prisma", "seed_d1.sql");
  await writeFile(outputPath, lines.join("\n"));

  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
