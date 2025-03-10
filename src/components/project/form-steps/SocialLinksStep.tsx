
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/utils/hive/types";
import { Twitter, Globe, MessageSquare, Github } from "lucide-react";

interface SocialLinksStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const SocialLinksStep = ({ form }: SocialLinksStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Add social media links to help backers connect with you and learn more about your project.
        <br />
        All fields are optional but recommended.
      </div>

      <FormField
        control={form.control}
        name="socialLinks.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Website
            </FormLabel>
            <FormControl>
              <Input placeholder="https://yourwebsite.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </FormLabel>
            <FormControl>
              <Input placeholder="https://twitter.com/yourusername" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="socialLinks.discord"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discord
            </FormLabel>
            <FormControl>
              <Input placeholder="https://discord.gg/your-invite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="socialLinks.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/yourusername" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
