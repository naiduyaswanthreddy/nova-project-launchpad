
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";
import { useState } from "react";

interface MediaStepProps {
  form: UseFormReturn<ProjectFormValues>;
  tempCoverImage: string | null;
  setTempCoverImage: (image: string | null) => void;
}

export function MediaStep({ form, tempCoverImage, setTempCoverImage }: MediaStepProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // In a real implementation, you would upload to IPFS or another decentralized storage
      // For now, we'll use a data URL
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setTempCoverImage(imageUrl);
        form.setValue("coverImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Media</h3>
      <p className="text-gray-400 text-sm">Upload images to showcase your project.</p>
      
      <FormField
        control={form.control}
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {tempCoverImage ? (
                  <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src={tempCoverImage} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
                      onClick={() => {
                        setTempCoverImage(null);
                        form.setValue("coverImage", "");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-background/30 hover:bg-background/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload a high-quality image that represents your project.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
