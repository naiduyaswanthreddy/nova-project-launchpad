
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";

interface FundingStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function FundingStep({ form }: FundingStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Funding Goals</h3>
      <p className="text-gray-400 text-sm">Set your funding target and milestones.</p>
      
      <FormField
        control={form.control}
        name="fundingGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funding Goal (HIVE)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  min="10"
                  step="0.1"
                  placeholder="e.g., 1000" 
                  {...field} 
                  className="bg-background/50 pl-16"
                />
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-400 border-r border-gray-700">
                  HIVE
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Be realistic about what you need to complete your project. Minimum 10 HIVE.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Project milestones info */}
      <div className="bg-secondary/40 p-4 rounded-lg border border-purple-900/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Project Milestones</h4>
            <p className="text-xs text-gray-300">
              Your project will automatically have these funding milestones:
            </p>
            <ul className="text-xs text-gray-300 mt-2 space-y-1 ml-4 list-disc">
              <li>25% - First milestone reached</li>
              <li>50% - Halfway to goal</li>
              <li>75% - Three-quarters funded</li>
              <li>100% - Fully funded</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
