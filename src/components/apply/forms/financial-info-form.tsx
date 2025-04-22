"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type FinancialInfoFormProps = {
  form: any;
  onNext: () => void;
  onPrevious: () => void;
};

export function FinancialInfoForm({ form, onNext, onPrevious }: FinancialInfoFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Financial Info Data:", data);
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Information</h2>
        <p className="text-muted-foreground">
          Provide details about your business finances and funding history.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form fields will be implemented in the next step */}
          <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">Financial information form fields will be implemented here.</p>
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous: Climate Adaptation
            </Button>
            <Button type="submit">
              Next: Support Needs
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 