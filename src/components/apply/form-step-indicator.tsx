"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2,
  CircleDot,
  Circle,
  ChevronRight
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface FormStepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function FormStepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: FormStepIndicatorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  if (isMobile) {
    // Show compact step indicator for mobile
    return (
      <div className={cn("w-full py-4", className)}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">
            Step {steps.findIndex(step => step.id === currentStep) + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((steps.findIndex(step => step.id === currentStep) + 1) / steps.length) * 100)}%
          </span>
        </div>
        
        <div className="w-full flex items-center">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  className={cn(
                    "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center",
                    isCompleted ? "bg-green-100 text-green-600 border-green-600" :
                    isActive ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  )}
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!isCompleted && !isActive}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </button>
                
                {!isLast && (
                  <div 
                    className={cn(
                      "h-0.5 flex-1 mx-1",
                      isCompleted ? "bg-green-500" : "bg-muted"
                    )} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Desktop view with more details
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = isCompleted || (index === 0) || 
            completedSteps.includes(steps[index - 1]?.id);
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex items-start space-x-3 py-1.5 px-2 rounded-md",
                isActive && "bg-primary/5",
                isClickable && "cursor-pointer hover:bg-muted/50 transition-colors",
                !isClickable && "opacity-50"
              )}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              <div className="pt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : isActive ? (
                  <CircleDot className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 
                    className={cn(
                      "text-sm font-medium",
                      isActive && "text-primary font-semibold"
                    )}
                  >
                    {step.label}
                  </h3>
                  
                  {isActive && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
              
              {isClickable && !isActive && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 