"use client"

import * as React from "react"
import { X } from "@untitledui/icons"

import { TooltipContent, TooltipRoot, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── ButtonUtility ────────────────────────────────────────────────────────────

const colorStyles = {
  secondary: "bg-primary text-fg-quaternary shadow-xs-skeumorphic ring-1 ring-inset ring-primary hover:bg-primary_hover hover:text-fg-quaternary_hover disabled:shadow-xs disabled:ring-disabled_subtle",
  tertiary:  "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
}

type ButtonUtilitySize  = "xs" | "sm"
type ButtonUtilityColor = "secondary" | "tertiary"

interface ButtonUtilityBaseProps {
  size?:             ButtonUtilitySize
  color?:            ButtonUtilityColor
  icon?:             React.FC<{ className?: string; [k: string]: unknown }> | React.ReactNode
  tooltip?:          string
  tooltipSide?:      "top" | "right" | "bottom" | "left"
  isDisabled?:       boolean
}

interface ButtonUtilityButtonProps
  extends ButtonUtilityBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  href?: never
}

interface ButtonUtilityLinkProps
  extends ButtonUtilityBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
  href: string
}

export type ButtonUtilityProps = ButtonUtilityButtonProps | ButtonUtilityLinkProps

const iconSizes: Record<ButtonUtilitySize, string> = {
  xs: "*:data-icon:size-4",
  sm: "*:data-icon:size-5",
}

const ButtonUtility = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonUtilityProps
>(({
  tooltip,
  tooltipSide = "top",
  isDisabled,
  icon: Icon,
  size = "sm",
  color = "secondary",
  className,
  ...props
}, ref) => {
  const iconNode = typeof Icon === "function"
    ? <Icon data-icon />
    : React.isValidElement(Icon)
      ? Icon
      : null

  const baseClass = cn(
    "group relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5",
    "transition duration-100 ease-linear",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:cursor-not-allowed disabled:text-fg-disabled_subtle",
    "*:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:text-current *:data-icon:transition-inherit-all",
    iconSizes[size],
    colorStyles[color],
    className,
  )

  const inner = "href" in props && props.href ? (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      aria-label={tooltip}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : undefined}
      className={cn(baseClass, isDisabled && "pointer-events-none opacity-50")}
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {iconNode}
    </a>
  ) : (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={tooltip}
      disabled={isDisabled}
      className={baseClass}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {iconNode}
    </button>
  )

  if (tooltip) {
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent title={tooltip} side={tooltipSide} />
      </TooltipRoot>
    )
  }

  return inner
})
ButtonUtility.displayName = "ButtonUtility"

// ─── CloseButton ──────────────────────────────────────────────────────────────

const closeSizes = {
  xs: { root: "size-7", icon: "size-4" },
  sm: { root: "size-9", icon: "size-5" },
  md: { root: "size-10", icon: "size-5" },
  lg: { root: "size-11", icon: "size-6" },
}

const closeThemes = {
  light: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
  dark:  "text-fg-white/70 hover:text-fg-white hover:bg-white/20",
}

export interface CloseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ""> {
  size?:  keyof typeof closeSizes
  theme?: keyof typeof closeThemes
  label?: string
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ label, className, size = "sm", theme = "light", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label ?? "Close"}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg p-2",
        "transition duration-100 ease-linear",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        closeSizes[size].root,
        closeThemes[theme],
        className,
      )}
      {...props}
    >
      <X aria-hidden="true" className={cn("shrink-0 transition-inherit-all", closeSizes[size].icon)} />
    </button>
  )
)
CloseButton.displayName = "CloseButton"

export { ButtonUtility, CloseButton }
