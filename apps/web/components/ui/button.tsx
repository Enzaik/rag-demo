import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap font-semibold",
    "transition duration-100 ease-linear",
    "before:absolute",
    "outline-none [--tw-ring-offset-shadow:0_0_0_0px_white,0_0_0_0px_var(--color-focus-ring)] focus-visible:[--tw-ring-offset-shadow:0_0_0_2px_white,0_0_0_4px_var(--color-focus-ring)] data-[state=open]:[--tw-ring-offset-shadow:0_0_0_2px_white,0_0_0_4px_var(--color-focus-ring)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "aria-invalid:ring-error-500/20 aria-invalid:border-error",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-brand-solid text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset",
          "hover:bg-brand-solid_hover",
          "before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0%",
          "disabled:bg-disabled disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle disabled:opacity-100",
        ].join(" "),
        destructive: [
          "bg-error-solid text-white shadow-xs-skeumorphic ring-1 ring-transparent outline-error ring-inset",
          "hover:bg-error-700",
          "before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0%",
          "disabled:bg-disabled disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle disabled:opacity-100",
        ].join(" "),
        outline: [
          "bg-primary text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset",
          "hover:bg-primary_hover hover:text-secondary_hover",
          "disabled:shadow-xs disabled:ring-disabled_subtle",
        ].join(" "),
        secondary: [
          "bg-primary text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset",
          "hover:bg-primary_hover hover:text-secondary_hover",
          "disabled:shadow-xs disabled:ring-disabled_subtle",
        ].join(" "),
        ghost: "text-tertiary hover:bg-primary_hover hover:text-tertiary_hover",
        link: "text-brand-secondary justify-normal rounded p-0! underline underline-offset-2 decoration-transparent hover:decoration-current",
        "link-color": "text-brand-secondary justify-normal rounded p-0! underline underline-offset-2 decoration-transparent hover:text-brand-secondary_hover hover:decoration-current",
        "link-gray": "text-tertiary justify-normal rounded p-0! underline underline-offset-2 decoration-transparent hover:decoration-current hover:text-tertiary_hover",
        "secondary-destructive": [
          "bg-primary text-error-primary shadow-xs-skeumorphic ring-1 ring-error_subtle outline-error ring-inset",
          "hover:bg-error-primary hover:text-error-primary_hover",
          "disabled:bg-primary disabled:shadow-xs disabled:ring-disabled_subtle",
        ].join(" "),
        "tertiary-destructive": [
          "text-error-primary outline-error",
          "hover:bg-error-primary hover:text-error-primary_hover",
        ].join(" "),
        "link-destructive": [
          "text-error-primary justify-normal rounded p-0! outline-error",
          "underline underline-offset-2 decoration-transparent hover:decoration-current hover:text-error-primary_hover",
        ].join(" "),
      },
      size: {
        sm: "gap-1 rounded-lg px-3 py-2 text-sm has-[>svg]:px-2.5",
        default: "gap-1 rounded-lg px-3.5 py-2.5 text-sm has-[>svg]:px-3",
        lg: "gap-1.5 rounded-lg px-4 py-2.5 text-md has-[>svg]:px-3.5",
        xl: "gap-1.5 rounded-lg px-4.5 py-3 text-md has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
