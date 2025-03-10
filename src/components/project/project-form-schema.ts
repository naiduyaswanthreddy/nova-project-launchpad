
import * as z from "zod";

export const CATEGORIES = [
  "Art",
  "Comics",
  "Community",
  "Crafts",
  "Dance",
  "Design",
  "Education",
  "Environment",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Health",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater"
];

export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  fundingGoal: z.string().min(1, "Please enter a funding goal"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  coverImage: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    discord: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
  }).transform(data => ({
    website: data.website || "",
    twitter: data.twitter || "",
    discord: data.discord || "",
    github: data.github || ""
  })),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

export const FORM_STEPS = [
  { title: "Basic Info", description: "Project title and category" },
  { title: "Description", description: "Detailed information about your project" },
  { title: "Funding", description: "Set your funding goal and milestones" },
  { title: "Media", description: "Upload images and videos" },
  { title: "Links", description: "Add your social media links" },
  { title: "Review", description: "Review and publish your project" }
];

export type ProjectFormValues = z.infer<typeof projectSchema>;
