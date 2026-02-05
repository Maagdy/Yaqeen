import { cn } from "@/lib/cn";
import { badgeVariants } from "./badge.variants";
import type { BadgeProps } from "./badge.types";

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
