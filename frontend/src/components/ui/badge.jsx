import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-[#6B1D2A] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1] [a]:hover:bg-[#F4E7EA]/80",
        secondary:
          "bg-[#FFFCF7] text-[#5F5A5C] border-[#E8E3E1] [a]:hover:bg-[#F4E7EA]",
        destructive:
          "bg-[#F4E7EA] text-[#4A0E1C] border-[#E8E3E1] [a]:hover:bg-[#F4E7EA]/80",
        outline:
          "border-[#E8E3E1] text-[#1D1A1B] [a]:hover:bg-[#F4E7EA] [a]:hover:text-[#6B1D2A]",
        ghost:
          "hover:bg-[#F4E7EA] hover:text-[#6B1D2A] text-[#5F5A5C]",
        link: "text-[#6B1D2A] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps({
      className: cn(badgeVariants({ variant }), className),
    }, props),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants }
