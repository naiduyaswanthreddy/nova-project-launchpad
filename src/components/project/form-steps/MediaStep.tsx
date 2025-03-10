
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "@/utils/hive/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface MediaStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const MediaStep = ({ form }: MediaStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    form.getValues("coverImage") || null
  );

  const handleImageUrlChange = (url: string) => {
    form.setValue("coverImage", url);
    setPreviewUrl(url);
  };

  const clearImage = () => {
    form.setValue("coverImage", "");
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://example.com/your-image.jpg" 
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleImageUrlChange(e.target.value);
                }}
              />
            </FormControl>
            <FormDescription>
              Provide a URL to an image that represents your project. 
              Recommended size: 1200x630 pixels.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {previewUrl ? (
        <div className="relative mt-4">
          <div className="aspect-video bg-secondary/30 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Cover image preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-2" />
          <p>No cover image provided</p>
          <p className="text-xs">Preview will appear here</p>
        </div>
      )}
    </div>
  );
};
