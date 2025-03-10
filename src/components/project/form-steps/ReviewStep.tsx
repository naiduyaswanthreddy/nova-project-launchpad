
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";

interface ReviewStepProps {
  form: UseFormReturn<ProjectFormValues>;
  tempCoverImage: string | null;
}

export function ReviewStep({ form, tempCoverImage }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Project</h3>
      <p className="text-gray-400 text-sm">Please review all details before submitting your project.</p>
      
      <div className="space-y-4">
        <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Title</p>
              <p className="font-medium">{form.watch("title")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Category</p>
              <p className="font-medium">{form.watch("category")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/20 rounded-lg p-4">
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm whitespace-pre-line">{form.watch("description")}</p>
        </div>
        
        <div className="bg-secondary/20 rounded-lg p-4">
          <h4 className="font-medium mb-2">Funding Goal</h4>
          <p className="font-medium text-purple-400">{form.watch("fundingGoal")} HIVE</p>
        </div>
        
        {tempCoverImage && (
          <div className="bg-secondary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Cover Image</h4>
            <img 
              src={tempCoverImage} 
              alt="Cover preview" 
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Social Links</h4>
          <div className="space-y-2">
            {form.watch("socialLinks.website") && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Website:</span>
                <span className="text-sm">{form.watch("socialLinks.website")}</span>
              </div>
            )}
            {form.watch("socialLinks.twitter") && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Twitter:</span>
                <span className="text-sm">{form.watch("socialLinks.twitter")}</span>
              </div>
            )}
            {form.watch("socialLinks.discord") && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Discord:</span>
                <span className="text-sm">{form.watch("socialLinks.discord")}</span>
              </div>
            )}
            {form.watch("socialLinks.github") && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">GitHub:</span>
                <span className="text-sm">{form.watch("socialLinks.github")}</span>
              </div>
            )}
            {!form.watch("socialLinks.website") && 
             !form.watch("socialLinks.twitter") && 
             !form.watch("socialLinks.discord") && 
             !form.watch("socialLinks.github") && (
              <p className="text-sm text-gray-400">No social links provided</p>
            )}
          </div>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm">
                I agree to the CrowdHive Terms of Service and Creator Guidelines
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
