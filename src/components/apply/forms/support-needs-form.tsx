"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type SupportNeedsFormProps = {
  form: any;
  onNext: () => void;
  onPrevious: () => void;
};

export function SupportNeedsForm({ form, onNext, onPrevious }: SupportNeedsFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Support Needs Data:", data);
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support Needs</h2>
        <p className="text-muted-foreground">
          Tell us what support you need to grow your business and climate adaptation solution.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form fields will be implemented in the next step */}
          <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">Support needs form fields will be implemented here.</p>
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous: Financial Information
            </Button>
            <Button type="submit">
              Next: Review & Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 