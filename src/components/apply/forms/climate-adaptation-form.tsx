"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type ClimateAdaptationFormProps = {
  form: any;
  onNext: () => void;
  onPrevious: () => void;
};

export function ClimateAdaptationForm({ form, onNext, onPrevious }: ClimateAdaptationFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Climate Adaptation Data:", data);
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Climate Adaptation Solution</h2>
        <p className="text-muted-foreground">
          Describe your climate adaptation solution and its impact.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form fields will be implemented in the next step */}
          <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">Climate adaptation solution form fields will be implemented here.</p>
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous: Business Information
            </Button>
            <Button type="submit">
              Next: Financial Information
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 