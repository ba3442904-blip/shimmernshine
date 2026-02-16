import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, VehicleSize, GalleryCategory } from "@prisma/client";
import { siteDefaults } from "../src/lib/siteDefaults";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: Role.owner },
  });

  const settings = [
    { key: "businessInfo", value: JSON.stringify(siteDefaults.businessInfo) },
    { key: "hours", value: JSON.stringify(siteDefaults.hours) },
    { key: "serviceArea", value: JSON.stringify(siteDefaults.serviceArea) },
    { key: "socials", value: JSON.stringify(siteDefaults.socials) },
    { key: "seo", value: JSON.stringify(siteDefaults.seo) },
    { key: "booking", value: JSON.stringify(siteDefaults.booking) },
    { key: "integrations", value: JSON.stringify(siteDefaults.integrations) },
    { key: "trustBadges", value: JSON.stringify(siteDefaults.trustBadges) },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  await prisma.priceTier.deleteMany();
  await prisma.service.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.fAQ.deleteMany();

  const services = await prisma.$transaction([
    prisma.service.create({
      data: {
        slug: "interior-detail",
        name: "Interior Detail",
        shortDescription: "Deep clean for seats, carpets, and dash.",
        longDescription:
          "A full interior reset with vacuuming, shampoo, steam cleaning, and conditioning for leather and trim.",
        durationMins: 150,
        sortOrder: 1,
      },
    }),
    prisma.service.create({
      data: {
        slug: "exterior-detail",
        name: "Exterior Detail",
        shortDescription: "Wash, decontaminate, and protect.",
        longDescription:
          "Foam wash, hand wash, clay bar, wheels and tires, and a durable sealant to protect the finish.",
        durationMins: 120,
        sortOrder: 2,
      },
    }),
    prisma.service.create({
      data: {
        slug: "full-detail",
        name: "Full Detail",
        shortDescription: "Inside + outside restoration.",
        longDescription:
          "Our most popular package with full interior and exterior detailing, gloss enhancement, and trim protection.",
        durationMins: 210,
        sortOrder: 3,
      },
    }),
  ]);

  const [interior, exterior, full] = services;

  const priceTiers = [
    { serviceId: interior.id, vehicleSize: VehicleSize.sedan, priceCents: 18900 },
    { serviceId: interior.id, vehicleSize: VehicleSize.suv, priceCents: 22900 },
    { serviceId: interior.id, vehicleSize: VehicleSize.truck, priceCents: 25900 },
    { serviceId: exterior.id, vehicleSize: VehicleSize.sedan, priceCents: 14900 },
    { serviceId: exterior.id, vehicleSize: VehicleSize.suv, priceCents: 17900 },
    { serviceId: exterior.id, vehicleSize: VehicleSize.truck, priceCents: 19900 },
    { serviceId: full.id, vehicleSize: VehicleSize.sedan, priceCents: 27900 },
    { serviceId: full.id, vehicleSize: VehicleSize.suv, priceCents: 32900 },
    { serviceId: full.id, vehicleSize: VehicleSize.truck, priceCents: 36900 },
  ];

  await prisma.priceTier.createMany({
    data: priceTiers.map((tier) => ({ ...tier, isStartingAt: true })),
  });

  await prisma.addOn.createMany({
    data: [
      {
        name: "Pet Hair Removal",
        description: "Deep extraction for stubborn pet hair.",
        priceCents: 3500,
        sortOrder: 1,
      },
      {
        name: "Odor Treatment",
        description: "Neutralize smoke, food, and mildew odors.",
        priceCents: 4500,
        sortOrder: 2,
      },
      {
        name: "Clay Bar + Sealant",
        description: "Extra paint decontamination and protection.",
        priceCents: 5500,
        sortOrder: 3,
      },
      {
        name: "Engine Bay Clean",
        description: "Degrease and dress engine bay surfaces.",
        priceCents: 4000,
        sortOrder: 4,
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        url: "/images/gallery-1.jpg",
        alt: "Interior before and after",
        category: GalleryCategory.interior,
        sortOrder: 1,
      },
      {
        url: "/images/gallery-2.jpg",
        alt: "Exterior shine",
        category: GalleryCategory.exterior,
        sortOrder: 2,
      },
      {
        url: "/images/gallery-3.jpg",
        alt: "Paint correction",
        category: GalleryCategory.paint,
        sortOrder: 3,
      },
      {
        url: "/images/gallery-4.jpg",
        alt: "Wheel detailing",
        category: GalleryCategory.wheels,
        sortOrder: 4,
      },
      {
        url: "/images/gallery-5.jpg",
        alt: "Seat restoration",
        category: GalleryCategory.interior,
        sortOrder: 5,
      },
      {
        url: "/images/gallery-6.jpg",
        alt: "SUV exterior polish",
        category: GalleryCategory.exterior,
        sortOrder: 6,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        name: "Jordan M.",
        stars: 5,
        text: "My SUV looks brand new. Super easy booking and they showed up on time.",
        date: "Jan 2026",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: "Alissa R.",
        stars: 5,
        text: "Interior detail was flawless and the team was professional.",
        date: "Dec 2025",
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: "Marcus D.",
        stars: 4,
        text: "Great service and communication. Will book again.",
        date: "Nov 2025",
        isFeatured: true,
        sortOrder: 3,
      },
    ],
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: "How long does a full detail take?",
        answer: "Most full details take 3-4 hours depending on the vehicle size.",
        sortOrder: 1,
      },
      {
        question: "Do you need access to water or power?",
        answer: "We bring our own water and power for most jobs.",
        sortOrder: 2,
      },
      {
        question: "What is your cancellation policy?",
        answer: "We ask for 24 hours notice to reschedule or cancel.",
        sortOrder: 3,
      },
      {
        question: "Can you handle pet hair or smoke odor?",
        answer: "Yes, we have add-ons for pet hair removal and odor treatments.",
        sortOrder: 4,
      },
      {
        question: "What vehicles do you service?",
        answer: "We service sedans, SUVs, trucks, and vans.",
        sortOrder: 5,
      },
      {
        question: "Do you offer maintenance plans?",
        answer: "Yes, monthly and biweekly plans are available on request.",
        sortOrder: 6,
      },
    ],
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
