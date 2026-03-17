import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1, "Link label is required."),
  href: z.string().min(1, "Link href is required."),
});

const heroSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaHref: z.string().optional(),
});

const richTextSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("richText"),
  title: z.string().optional(),
  body: z.string().min(1),
});

const featureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const featuresSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("features"),
  title: z.string().optional(),
  items: z.array(featureItemSchema).min(1),
});

const imageTextSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("imageText"),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  body: z.string().min(1),
  imageSrc: z.string().min(1),
  imageAlt: z.string().min(1),
  imageSide: z.enum(["left", "right"]),
});

const ctaSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("cta"),
  title: z.string().min(1),
  body: z.string().optional(),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
});

const footerSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("footer"),
  copyright: z.string().min(1),
  links: z.array(linkSchema),
});

// The discriminated union keeps runtime validation and editor branching aligned.
export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  richTextSectionSchema,
  featuresSectionSchema,
  imageTextSectionSchema,
  ctaSectionSchema,
  footerSectionSchema,
]);

export const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sections: z.array(pageSectionSchema),
});

export const pageSummarySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
});

export type PageSection = z.infer<typeof pageSectionSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type RichTextSection = z.infer<typeof richTextSectionSchema>;
export type FeaturesSection = z.infer<typeof featuresSectionSchema>;
export type ImageTextSection = z.infer<typeof imageTextSectionSchema>;
export type CtaSection = z.infer<typeof ctaSectionSchema>;
export type FooterSection = z.infer<typeof footerSectionSchema>;
export type PageSchema = z.infer<typeof pageSchema>;
export type PageSummary = z.infer<typeof pageSummarySchema>;

// Public aliases keep the schema model naming explicit for both runtime pages and editor code.
export type SectionSchema = PageSection;
export type HeroSectionSchema = HeroSection;
export type RichTextSectionSchema = RichTextSection;
export type FeaturesSectionSchema = FeaturesSection;
export type ImageTextSectionSchema = ImageTextSection;
export type CtaSectionSchema = CtaSection;
export type FooterSectionSchema = FooterSection;

export function parsePageSchema(input: unknown): PageSchema {
  return pageSchema.parse(input);
}
