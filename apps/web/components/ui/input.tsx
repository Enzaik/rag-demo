"use client"

import * as React from "react"
import { HelpCircle, InfoCircle } from "@untitledui/icons"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

// ─── Input ────────────────────────────────────────────────────────────────────

type InputSize = "sm" | "md"

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: InputSize
  /** Leading icon component */
  icon?: React.FC<{ className?: string }>
  /** Shows error ring + InfoCircle trailing icon */
  isInvalid?: boolean
  /** Shows HelpCircle tooltip trigger in trailing position */
  tooltip?: string
  /** Class applied to the outer wrapper div */
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = "sm", icon: Icon, isInvalid, tooltip, disabled, wrapperClassName, ...props }, ref) => {
    const hasTrailing = !!tooltip || !!isInvalid
    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-lg bg-primary shadow-xs",
          "ring-1 ring-primary ring-inset transition duration-100 ease-linear",
          "focus-within:ring-2 focus-within:ring-brand focus-within:ring-inset",
          isInvalid && "ring-error_subtle focus-within:ring-2 focus-within:ring-error focus-within:ring-inset",
          disabled && "cursor-not-allowed bg-disabled_subtle ring-disabled focus-within:ring-1 focus-within:ring-disabled",
          wrapperClassName,
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "pointer-events-none absolute size-5 text-fg-quaternary",
              disabled && "text-fg-disabled",
              size === "sm" ? "left-3" : "left-3.5",
            )}
          />
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder",
            "disabled:cursor-not-allowed disabled:text-disabled",
            size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5",
            Icon && (size === "sm" ? "pl-10" : "pl-10.5"),
            hasTrailing && (size === "sm" ? "pr-9" : "pr-9.5"),
            className,
          )}
          {...props}
        />

        {tooltip && !isInvalid && (
          <Tooltip title={tooltip}>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              className={cn(
                "absolute cursor-pointer text-fg-quaternary transition duration-200",
                "hover:text-fg-quaternary_hover focus-visible:text-fg-quaternary_hover outline-hidden",
                "disabled:pointer-events-none disabled:text-fg-disabled",
                size === "sm" ? "right-3" : "right-3.5",
              )}
            >
              <HelpCircle className="size-4" />
            </button>
          </Tooltip>
        )}

        {isInvalid && (
          <InfoCircle
            className={cn(
              "pointer-events-none absolute size-4 text-fg-error-secondary",
              size === "sm" ? "right-3" : "right-3.5",
            )}
          />
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

// ─── InputAddon ───────────────────────────────────────────────────────────────

const InputAddon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { disabled?: boolean }
>(({ children, className, disabled, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex shrink-0 items-center bg-primary px-3 text-md text-tertiary shadow-xs ring-1 ring-primary ring-inset",
      disabled && "bg-disabled_subtle text-disabled ring-disabled",
      className,
    )}
    {...props}
  >
    {children}
  </span>
))
InputAddon.displayName = "InputAddon"

// ─── InputGroup ───────────────────────────────────────────────────────────────

interface InputGroupProps {
  children: React.ReactNode
  leadingAddon?: React.ReactNode
  trailingAddon?: React.ReactNode
  disabled?: boolean
}

const InputGroup = ({ children, leadingAddon, trailingAddon, disabled }: InputGroupProps) => (
  <div className="flex w-full">
    {leadingAddon && (
      <InputAddon disabled={disabled} className="-mr-px rounded-l-lg">
        {leadingAddon}
      </InputAddon>
    )}
    <div className="relative z-10 min-w-0 flex-1 focus-within:z-20">
      {children}
    </div>
    {trailingAddon && (
      <InputAddon disabled={disabled} className="-ml-px rounded-r-lg">
        {trailingAddon}
      </InputAddon>
    )}
  </div>
)
InputGroup.displayName = "InputGroup"

export { Input, InputAddon, InputGroup }
