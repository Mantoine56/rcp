/**
 * @file stepper.tsx
 * @description A stepper component for multi-step processes
 * 
 * This component follows the GC Design System standards and provides
 * a visual representation of progress through a multi-step process.
 * It supports both horizontal and vertical orientations.
 */

"use client";

import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import * as React from "react";
import { createContext, useContext } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

// Types
/**
 * Context value for the Stepper component
 */
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

/**
 * Context value for individual step items
 */
type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

/**
 * Possible states for a step
 */
type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

/**
 * Hook to access the Stepper context
 * @returns The StepperContext value
 */
const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

/**
 * Hook to access the StepItem context
 * @returns The StepItemContext value
 */
const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
/**
 * Props for the Stepper component
 */
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

/**
 * The main Stepper component
 * Provides context for all step items and manages the active step
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    { defaultValue = 0, value, onValueChange, orientation = "horizontal", className, ...props },
    ref,
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) {
          setInternalStep(step);
        }
        onValueChange?.(step);
      },
      [value, onValueChange],
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className,
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

/**
 * Props for the StepperItem component
 */
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Individual step item in the stepper
 * Represents a single step in the multi-step process
 */
const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    { step, completed = false, disabled = false, loading = false, className, children, ...props },
    ref,
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
            className,
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": true } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

/**
 * Props for the StepperTrigger component
 */
interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/**
 * Trigger for a step item
 * Can be clicked to navigate to a specific step
 */
/**
 * Trigger component for steps
 * Creates a clickable trigger that allows navigation between steps
 */
const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    if (asChild) {
      return <div className={className}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 py-1 px-1 disabled:pointer-events-none disabled:opacity-50",
          "focus:outline-none", // Remove default focus outline
          className,
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

/**
 * Props for the StepperIndicator component
 */
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * Visual indicator for a step
 * Shows the step number, loading state, or completion state
 */
const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { state, step, isLoading } = useStepItem();

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
          // GC Design System colors - using direct color values for clarity
          "bg-[#f5f5f5] text-[#333333] border border-[#cccccc]",
          "data-[state=active]:bg-[#26374A] data-[state=active]:text-white data-[state=active]:border-[#26374A]",
          "data-[state=completed]:bg-[#26374A] data-[state=completed]:text-white data-[state=completed]:border-[#26374A]",
          "hover:bg-[#26374A] hover:text-white hover:border-[#26374A]",
          className,
        )}
        data-state={state}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span className="transition-all group-data-[loading=true]/step:scale-0 group-data-[state=completed]/step:scale-0 group-data-[loading=true]/step:opacity-0 group-data-[state=completed]/step:opacity-0 group-data-[loading=true]/step:transition-none">
              {step}
            </span>
            <CheckIcon
              className="absolute h-4 w-4 scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
              aria-hidden="true"
            />
            {isLoading && (
              <span className="absolute transition-all">
                <LoaderCircle
                  className="animate-spin"
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            )}
          </>
        )}
      </div>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

/**
 * Title component for a step
 * Displays the title of the step
 */
/**
 * Title component for a step
 * Displays the title of the step with proper styling based on step state
 */
/**
 * Title component for a step
 * Displays the title of the step with proper styling based on step state
 */
const StepperTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 
      ref={ref} 
      className={cn("text-xs font-medium ml-2 whitespace-nowrap", 
        "text-[#5C5C5C]", 
        "group-data-[state=active]/step:text-[#26374A] group-data-[state=active]/step:font-semibold",
        "group-data-[state=completed]/step:text-[#26374A] group-data-[state=completed]/step:font-semibold", 
        className
      )} 
      {...props} 
    />
  ),
);
StepperTitle.displayName = "StepperTitle";

/**
 * Description component for a step
 * Provides additional information about the step
 */
const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn("text-sm text-gc-light-text", className)} 
    {...props} 
  />
));
StepperDescription.displayName = "StepperDescription";

/**
 * Separator component between steps
 * Visually connects adjacent steps
 */
/**
 * Separator component between steps
 * Creates a visual connection between steps with proper state-based styling
 */
const StepperSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-2 bg-[#cccccc] group-data-[orientation=horizontal]/stepper:h-[1px] group-data-[orientation=vertical]/stepper:h-8 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-[1px] group-data-[orientation=horizontal]/stepper:flex-1 group-data-[state=completed]/step:bg-[#26374A]",
          className,
        )}
        {...props}
      />
    );
  },
);
StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
