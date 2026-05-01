import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "peer inline-flex h-6 w-11 items-center rounded-full bg-input p-[2px] transition-colors",
      "data-[state=checked]:bg-primary",
      className
    )}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "h-5 w-5 rounded-full bg-white shadow transition-transform",
        "data-[state=checked]:-translate-x-[20px]",
        "data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));

export { Switch };
