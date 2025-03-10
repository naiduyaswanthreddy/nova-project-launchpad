
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/utils/hive/types";

interface DescriptionStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const DescriptionStep = ({ form }: DescriptionStepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project in detail" 
                {...field} 
                className="min-h-[200px]"
              />
            </FormControl>
            <FormDescription>
              Include what your project is about, why it matters, and how you plan to execute it.
              <br />
              You can use Markdown formatting for headers, lists, and emphasis.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
