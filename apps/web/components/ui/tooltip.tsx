"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ─── Primitives ───────────────────────────────────────────────────────────────

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

// ─── TooltipContent ───────────────────────────────────────────────────────────

interface TooltipContentProps extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  arrow?: boolean
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, title, description, arrow = false, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 flex max-w-xs flex-col items-start gap-1 rounded-lg bg-primary-solid px-3 shadow-lg will-change-transform",
        description || title ? "py-3" : "py-2",
        // Enter animations
        "animate-in fade-in-0 zoom-in-95",
        "data-[side=top]:slide-in-from-bottom-1",
        "data-[side=bottom]:slide-in-from-top-1",
        "data-[side=left]:slide-in-from-right-1",
        "data-[side=right]:slide-in-from-left-1",
        // Exit animations
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "origin-(--radix-tooltip-content-transform-origin)",
        className,
      )}
      {...props}
    >
      {title && <span className="text-xs font-semibold text-white">{title}</span>}
      {description && <span className="text-xs font-medium text-tooltip-supporting-text">{description}</span>}
      {!title && !description && (
        <span className="text-xs font-semibold text-white">{children}</span>
      )}
      {arrow && (
        <TooltipPrimitive.Arrow asChild>
          <svg
            viewBox="0 0 100 100"
            className={cn(
              "size-2.5 fill-bg-primary-solid",
              "data-[side=left]:-rotate-90 data-[side=right]:rotate-90 data-[side=bottom]:rotate-180",
            )}
          >
            <path d="M0,0 L35.858,35.858 Q50,50 64.142,35.858 L100,0 Z" />
          </svg>
        </TooltipPrimitive.Arrow>
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// ─── Compound Tooltip ─────────────────────────────────────────────────────────
// Wraps trigger + content together, matching the Untitled UI base API.

interface TooltipProps {
  title: React.ReactNode
  description?: React.ReactNode
  arrow?: boolean
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  delay?: number  // overrides provider delayDuration when set
  isDisabled?: boolean
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Tooltip = ({
  title,
  description,
  arrow = false,
  side = "top",
  sideOffset = 6,
  delay,
  isDisabled = false,
  isOpen,
  defaultOpen,
  onOpenChange,
  children,
}: TooltipProps) => {
  if (isDisabled) return <>{children}</>

  return (
    <TooltipRoot delayDuration={delay} open={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        title={title}
        description={description}
        arrow={arrow}
        side={side}
        sideOffset={sideOffset}
      />
    </TooltipRoot>
  )
}

export { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent }
