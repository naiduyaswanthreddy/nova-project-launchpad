
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/utils/hive/types";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign, Tag, FileText, User, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ReviewStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ReviewStep = ({ form }: ReviewStepProps) => {
  const { title, category, description, fundingGoal, coverImage, socialLinks } = form.getValues();

  return (
    <div className="space-y-6">
      <div className="bg-secondary/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Project Preview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please review your project details before submitting. You can go back to previous steps to make changes.
        </p>

        {coverImage && (
          <div className="aspect-video bg-secondary/30 rounded-lg overflow-hidden mb-4">
            <img
              src={coverImage}
              alt="Cover image"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">{title || "Project Title"}</h2>
            <Badge variant="outline" className="mt-1">
              {category || "Category"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>Funding Goal: {fundingGoal || "0"} HIVE</span>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Description
            </h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {description || "No description provided."}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <LinkIcon className="h-4 w-4 mr-2" />
              Social Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {socialLinks.website && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Website:</span>
                  <span className="truncate">{socialLinks.website}</span>
                </div>
              )}
              {socialLinks.twitter && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Twitter:</span>
                  <span className="truncate">{socialLinks.twitter}</span>
                </div>
              )}
              {socialLinks.discord && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Discord:</span>
                  <span className="truncate">{socialLinks.discord}</span>
                </div>
              )}
              {socialLinks.github && (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">GitHub:</span>
                  <span className="truncate">{socialLinks.github}</span>
                </div>
              )}
              {!socialLinks.website && !socialLinks.twitter && !socialLinks.discord && !socialLinks.github && (
                <div className="text-muted-foreground col-span-2">No social links provided.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I agree to the terms and conditions
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
