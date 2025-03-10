
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/utils/hive/types";

interface FundingStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const FundingStep = ({ form }: FundingStepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="fundingGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funding Goal (HIVE)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="100" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Set a realistic funding goal in HIVE tokens. This should cover your project's needs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-secondary/30 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">💡 Funding Tips</h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Set a realistic goal that covers your project's essential needs</li>
          <li>Break down costs in your description to build backer confidence</li>
          <li>Remember that you'll only receive funds if your project is successful</li>
          <li>Include a buffer for unexpected expenses</li>
          <li>Consider offering different reward tiers for different contribution amounts</li>
        </ul>
      </div>
    </div>
  );
};
