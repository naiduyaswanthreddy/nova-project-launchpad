
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";

interface DescriptionStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function DescriptionStep({ form }: DescriptionStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Description</h3>
      <p className="text-gray-400 text-sm">Describe your project in detail to attract supporters.</p>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project in detail. What is it? Why does it matter? How will you execute it?" 
                {...field} 
                className="min-h-[200px] bg-background/50 resize-y"
              />
            </FormControl>
            <FormDescription>
              Be specific and comprehensive (minimum 50 characters). Include your goals, timeline, and what the funds will be used for.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
