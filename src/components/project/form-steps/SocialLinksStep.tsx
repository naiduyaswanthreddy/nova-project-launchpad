
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";

interface SocialLinksStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function SocialLinksStep({ form }: SocialLinksStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Links</h3>
      <p className="text-gray-400 text-sm">Add links to your website and social media profiles.</p>
      
      <FormField
        control={form.control}
        name="socialLinks.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://yourwebsite.com" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your project's website or personal site (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://twitter.com/yourusername" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your Twitter profile (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.discord"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discord</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://discord.gg/invite" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your Discord server invite link (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://github.com/yourusername" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your GitHub profile or project repository (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
