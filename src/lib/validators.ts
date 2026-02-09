import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["quote", "booking"]),
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  vehicleType: z.string().optional().or(z.literal("")),
  serviceId: z.string().optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(10),
  longDescription: z.string().min(10),
  durationMins: z.coerce.number().min(15),
  isActive: z.coerce.boolean().optional().default(true),
});

export const addOnSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  priceCents: z.coerce.number().min(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export const reviewSchema = z.object({
  name: z.string().min(2),
  stars: z.coerce.number().min(1).max(5),
  text: z.string().min(10),
  date: z.string().min(4),
  isFeatured: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  isActive: z.coerce.boolean().optional().default(true),
});
