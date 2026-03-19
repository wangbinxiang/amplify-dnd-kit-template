import { z } from "zod";

const schemaId = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9-]+$/, "Ids may only contain letters, numbers, and hyphens.");

const textPropsSchema = z
  .object({
    text: z.string().min(1),
  })
  .strict();

const actionPropsSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .strict();

const featureItemPropsSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();

const imagePropsSchema = z
  .object({
    src: z.string().min(1),
    alt: z.string().min(1),
    side: z.enum(["left", "right"]),
  })
  .strict();

const headingElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("heading"),
    props: textPropsSchema,
  })
  .strict();

const copyElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("copy"),
    props: textPropsSchema,
  })
  .strict();

const paragraphElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("paragraph"),
    props: textPropsSchema,
  })
  .strict();

const eyebrowElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("eyebrow"),
    props: textPropsSchema,
  })
  .strict();

const buttonElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("button"),
    props: actionPropsSchema,
  })
  .strict();

const featureItemElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("featureItem"),
    props: featureItemPropsSchema,
  })
  .strict();

const imageElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("image"),
    props: imagePropsSchema,
  })
  .strict();

const copyrightElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("copyright"),
    props: textPropsSchema,
  })
  .strict();

const linkElementSchema = z
  .object({
    id: schemaId,
    type: z.literal("link"),
    props: actionPropsSchema,
  })
  .strict();

// Each section keeps its own allowed element union so invalid combinations fail fast.
const heroElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  copyElementSchema,
  buttonElementSchema,
]);

const richTextElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  paragraphElementSchema,
]);

const featuresElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  featureItemElementSchema,
]);

const imageTextElementSchema = z.discriminatedUnion("type", [
  eyebrowElementSchema,
  headingElementSchema,
  copyElementSchema,
  imageElementSchema,
]);

const ctaElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  copyElementSchema,
  buttonElementSchema,
]);

const footerElementSchema = z.discriminatedUnion("type", [
  copyrightElementSchema,
  linkElementSchema,
]);

const heroSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("hero"),
    elements: z.array(heroElementSchema).min(1),
  })
  .strict();

const richTextSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("richText"),
    elements: z.array(richTextElementSchema).min(1),
  })
  .strict();

const featuresSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("features"),
    elements: z.array(featuresElementSchema).min(1),
  })
  .strict();

const imageTextSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("imageText"),
    elements: z.array(imageTextElementSchema).min(1),
  })
  .strict();

const ctaSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("cta"),
    elements: z.array(ctaElementSchema).min(1),
  })
  .strict();

const footerSectionSchema = z
  .object({
    id: schemaId,
    type: z.literal("footer"),
    elements: z.array(footerElementSchema).min(1),
  })
  .strict();

export const pageElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  copyElementSchema,
  paragraphElementSchema,
  eyebrowElementSchema,
  buttonElementSchema,
  featureItemElementSchema,
  imageElementSchema,
  copyrightElementSchema,
  linkElementSchema,
]);

// The discriminated union keeps runtime validation and editor branching aligned.
export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  richTextSectionSchema,
  featuresSectionSchema,
  imageTextSectionSchema,
  ctaSectionSchema,
  footerSectionSchema,
]);

export const pageSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    sections: z.array(pageSectionSchema),
  })
  .strict();

export const pageSummarySchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
  })
  .strict();

export type PageElement = z.infer<typeof pageElementSchema>;
export type HeadingElement = z.infer<typeof headingElementSchema>;
export type CopyElement = z.infer<typeof copyElementSchema>;
export type ParagraphElement = z.infer<typeof paragraphElementSchema>;
export type EyebrowElement = z.infer<typeof eyebrowElementSchema>;
export type ButtonElement = z.infer<typeof buttonElementSchema>;
export type FeatureItemElement = z.infer<typeof featureItemElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type CopyrightElement = z.infer<typeof copyrightElementSchema>;
export type LinkElement = z.infer<typeof linkElementSchema>;
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
export type PageElementSchema = PageElement;
export type HeadingElementSchema = HeadingElement;
export type CopyElementSchema = CopyElement;
export type ParagraphElementSchema = ParagraphElement;
export type EyebrowElementSchema = EyebrowElement;
export type ButtonElementSchema = ButtonElement;
export type FeatureItemElementSchema = FeatureItemElement;
export type ImageElementSchema = ImageElement;
export type CopyrightElementSchema = CopyrightElement;
export type LinkElementSchema = LinkElement;
export type HeroSectionSchema = HeroSection;
export type RichTextSectionSchema = RichTextSection;
export type FeaturesSectionSchema = FeaturesSection;
export type ImageTextSectionSchema = ImageTextSection;
export type CtaSectionSchema = CtaSection;
export type FooterSectionSchema = FooterSection;

export function parsePageSchema(input: unknown): PageSchema {
  return pageSchema.parse(input);
}
