import * as React from "react"
import { X as CloseX } from "@untitledui/icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "pill-color" | "badge-color" | "badge-modern"
export type BadgeColor =
  | "gray" | "brand" | "error" | "warning" | "success"
  | "gray-blue" | "blue-light" | "blue" | "indigo" | "purple" | "pink" | "orange"
export type BadgeSize = "sm" | "md" | "lg"

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

// ─── Color maps ───────────────────────────────────────────────────────────────

const colorMap: Record<BadgeColor, { root: string; addon: string; addonButton: string }> = {
  gray:       { root: "bg-utility-gray-50 text-utility-gray-700 ring-utility-gray-200",             addon: "text-utility-gray-500",       addonButton: "hover:bg-utility-gray-100 text-utility-gray-400 hover:text-utility-gray-500" },
  brand:      { root: "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200",          addon: "text-utility-brand-500",      addonButton: "hover:bg-utility-brand-100 text-utility-brand-400 hover:text-utility-brand-500" },
  error:      { root: "bg-utility-error-50 text-utility-error-700 ring-utility-error-200",          addon: "text-utility-error-500",      addonButton: "hover:bg-utility-error-100 text-utility-error-400 hover:text-utility-error-500" },
  warning:    { root: "bg-utility-warning-50 text-utility-warning-700 ring-utility-warning-200",    addon: "text-utility-warning-500",    addonButton: "hover:bg-utility-warning-100 text-utility-warning-400 hover:text-utility-warning-500" },
  success:    { root: "bg-utility-success-50 text-utility-success-700 ring-utility-success-200",    addon: "text-utility-success-500",    addonButton: "hover:bg-utility-success-100 text-utility-success-400 hover:text-utility-success-500" },
  "gray-blue":  { root: "bg-utility-gray-blue-50 text-utility-gray-blue-700 ring-utility-gray-blue-200",    addon: "text-utility-gray-blue-500",    addonButton: "hover:bg-utility-gray-blue-100 text-utility-gray-blue-400 hover:text-utility-gray-blue-500" },
  "blue-light": { root: "bg-utility-blue-light-50 text-utility-blue-light-700 ring-utility-blue-light-200", addon: "text-utility-blue-light-500",   addonButton: "hover:bg-utility-blue-light-100 text-utility-blue-light-400 hover:text-utility-blue-light-500" },
  blue:       { root: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200",             addon: "text-utility-blue-500",       addonButton: "hover:bg-utility-blue-100 text-utility-blue-400 hover:text-utility-blue-500" },
  indigo:     { root: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200",       addon: "text-utility-indigo-500",     addonButton: "hover:bg-utility-indigo-100 text-utility-indigo-400 hover:text-utility-indigo-500" },
  purple:     { root: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200",       addon: "text-utility-purple-500",     addonButton: "hover:bg-utility-purple-100 text-utility-purple-400 hover:text-utility-purple-500" },
  pink:       { root: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200",             addon: "text-utility-pink-500",       addonButton: "hover:bg-utility-pink-100 text-utility-pink-400 hover:text-utility-pink-500" },
  orange:     { root: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200",       addon: "text-utility-orange-500",     addonButton: "hover:bg-utility-orange-100 text-utility-orange-400 hover:text-utility-orange-500" },
}

const modernAddonMap: Record<BadgeColor, string> = {
  gray: "text-utility-gray-500", brand: "text-utility-brand-500", error: "text-utility-error-500",
  warning: "text-utility-warning-500", success: "text-utility-success-500", "gray-blue": "text-utility-gray-blue-500",
  "blue-light": "text-utility-blue-light-500", blue: "text-utility-blue-500", indigo: "text-utility-indigo-500",
  purple: "text-utility-purple-500", pink: "text-utility-pink-500", orange: "text-utility-orange-500",
}

// ─── CVA ──────────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        "pill-color": "rounded-full",
        "badge-color": "rounded-md",
        "badge-modern": "rounded-md shadow-xs bg-primary text-secondary ring-primary",
      },
      size: {
        sm: "py-0.5 px-2 text-xs",
        md: "py-0.5 px-2.5 text-sm",
        lg: "py-1 px-3 text-sm",
      },
    },
    compoundVariants: [
      { variant: ["badge-color", "badge-modern"], size: "sm", className: "px-1.5" },
      { variant: ["badge-color", "badge-modern"], size: "md", className: "px-2" },
      { variant: ["badge-color", "badge-modern"], size: "lg", className: "px-2.5 rounded-lg" },
    ],
    defaultVariants: {
      variant: "pill-color",
      size: "md",
    },
  }
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRootColor(variant: BadgeVariant, color: BadgeColor) {
  return variant === "badge-modern" ? "" : colorMap[color].root
}

function getAddonColor(variant: BadgeVariant, color: BadgeColor) {
  return variant === "badge-modern" ? modernAddonMap[color] : colorMap[color].addon
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
}

function Badge({ className, variant = "pill-color", color = "gray", size = "md", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), getRootColor(variant, color), className)}
      {...props}
    />
  )
}

// ─── Shared layout (icon leading / dot use same padding as each other) ─────────

const iconGapMap: Record<BadgeVariant, Record<BadgeSize, { leading: string; trailing: string }>> = {
  "pill-color": {
    sm: { leading: "gap-0.5 py-0.5 pr-2 pl-1.5 text-xs", trailing: "gap-0.5 py-0.5 pl-2 pr-1.5 text-xs" },
    md: { leading: "gap-1 py-0.5 pr-2.5 pl-2 text-sm", trailing: "gap-1 py-0.5 pl-2.5 pr-2 text-sm" },
    lg: { leading: "gap-1 py-1 pr-3 pl-2.5 text-sm", trailing: "gap-1 py-1 pl-3 pr-2.5 text-sm" },
  },
  "badge-color": {
    sm: { leading: "gap-0.5 py-0.5 pr-1.5 pl-1 text-xs", trailing: "gap-0.5 py-0.5 pl-1.5 pr-1 text-xs" },
    md: { leading: "gap-1 py-0.5 pr-2 pl-1.5 text-sm", trailing: "gap-1 py-0.5 pl-2 pr-1.5 text-sm" },
    lg: { leading: "gap-1 py-1 pr-2.5 pl-2 text-sm", trailing: "gap-1 py-1 pl-2.5 pr-2 text-sm" },
  },
  "badge-modern": {
    sm: { leading: "gap-0.5 py-0.5 pr-1.5 pl-1 text-xs", trailing: "gap-0.5 py-0.5 pl-1.5 pr-1 text-xs" },
    md: { leading: "gap-1 py-0.5 pr-2 pl-1.5 text-sm", trailing: "gap-1 py-0.5 pl-2 pr-1.5 text-sm" },
    lg: { leading: "gap-1 py-1 pr-2.5 pl-2 text-sm", trailing: "gap-1 py-1 pl-2.5 pr-2 text-sm" },
  },
}

const dotGapMap: Record<BadgeVariant, Record<BadgeSize, string>> = {
  "pill-color": { sm: iconGapMap["pill-color"].sm.leading, md: iconGapMap["pill-color"].md.leading, lg: iconGapMap["pill-color"].lg.leading },
  "badge-color": { sm: iconGapMap["badge-color"].sm.leading, md: iconGapMap["badge-color"].md.leading, lg: iconGapMap["badge-color"].lg.leading },
  "badge-modern": { sm: iconGapMap["badge-modern"].sm.leading, md: iconGapMap["badge-modern"].md.leading, lg: iconGapMap["badge-modern"].lg.leading },
}

// ─── BadgeWithDot ─────────────────────────────────────────────────────────────

function BadgeWithDot({ className, variant = "pill-color", color = "gray", size = "md", children, ...props }: BadgeProps) {
  const addonColor = getAddonColor(variant, color)
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center whitespace-nowrap font-medium ring-1 ring-inset",
        variant === "pill-color" ? "rounded-full" : variant === "badge-modern" ? "rounded-md shadow-xs bg-primary text-secondary ring-primary" : "rounded-md",
        size === "lg" && variant !== "pill-color" && "rounded-lg",
        size === "sm" ? "text-xs" : "text-sm",
        dotGapMap[variant][size],
        getRootColor(variant, color),
        className,
      )}
      {...props}
    >
      <svg className={cn("size-1.5 shrink-0 fill-current", addonColor)} viewBox="0 0 6 6" aria-hidden>
        <circle cx="3" cy="3" r="3" />
      </svg>
      {children}
    </span>
  )
}

// ─── BadgeWithIcon ─────────────────────────────────────────────────────────────

interface BadgeWithIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  iconLeading?: IconType
  iconTrailing?: IconType
}

function BadgeWithIcon({ className, variant = "pill-color", color = "gray", size = "md", iconLeading: IconLeading, iconTrailing: IconTrailing, children, ...props }: BadgeWithIconProps) {
  const pos = IconLeading ? "leading" : "trailing"
  const addonColor = getAddonColor(variant, color)
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center whitespace-nowrap font-medium ring-1 ring-inset",
        variant === "pill-color" ? "rounded-full" : variant === "badge-modern" ? "rounded-md shadow-xs bg-primary text-secondary ring-primary" : "rounded-md",
        size === "lg" && variant !== "pill-color" && "rounded-lg",
        iconGapMap[variant][size][pos],
        getRootColor(variant, color),
        className,
      )}
      {...props}
    >
      {IconLeading && <IconLeading className={cn("size-3 stroke-[3px]", addonColor)} />}
      {children}
      {IconTrailing && <IconTrailing className={cn("size-3 stroke-[3px]", addonColor)} />}
    </span>
  )
}

// ─── BadgeWithButton ──────────────────────────────────────────────────────────

const buttonGapMap: Record<BadgeVariant, Record<BadgeSize, string>> = {
  "pill-color":  { sm: "gap-0.5 py-0.5 pl-2 pr-0.75 text-xs",   md: "gap-0.5 py-0.5 pl-2.5 pr-1 text-sm",   lg: "gap-0.5 py-1 pl-3 pr-1.5 text-sm" },
  "badge-color": { sm: "gap-0.5 py-0.5 pl-1.5 pr-0.75 text-xs", md: "gap-0.5 py-0.5 pl-2 pr-1 text-sm",     lg: "gap-0.5 py-1 pl-2.5 pr-1.5 text-sm" },
  "badge-modern":{ sm: "gap-0.5 py-0.5 pl-1.5 pr-0.75 text-xs", md: "gap-0.5 py-0.5 pl-2 pr-1 text-sm",     lg: "gap-0.5 py-1 pl-2.5 pr-1.5 text-sm" },
}

interface BadgeWithButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  icon?: IconType
  buttonLabel?: string
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>
}

function BadgeWithButton({ className, variant = "pill-color", color = "gray", size = "md", icon: Icon = CloseX, buttonLabel, onButtonClick, children, ...props }: BadgeWithButtonProps) {
  const colors = variant === "badge-modern" ? { addonButton: colorMap[color].addonButton } : colorMap[color]
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center whitespace-nowrap font-medium ring-1 ring-inset",
        variant === "pill-color" ? "rounded-full" : variant === "badge-modern" ? "rounded-md shadow-xs bg-primary text-secondary ring-primary" : "rounded-md",
        size === "lg" && variant !== "pill-color" && "rounded-lg",
        buttonGapMap[variant][size],
        getRootColor(variant, color),
        className,
      )}
      {...props}
    >
      {children}
      <button
        type="button"
        aria-label={buttonLabel}
        onClick={onButtonClick}
        className={cn(
          "flex cursor-pointer items-center justify-center p-0.5 transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-1",
          colors.addonButton,
          variant === "pill-color" ? "rounded-full" : "rounded-[3px]",
        )}
      >
        <Icon className="size-3 stroke-[3px] transition-inherit-all" />
      </button>
    </span>
  )
}

// ─── BadgeIcon ────────────────────────────────────────────────────────────────

const iconOnlyMap: Record<BadgeVariant, Record<BadgeSize, string>> = {
  "pill-color":  { sm: "p-1.25", md: "p-1.5", lg: "p-2" },
  "badge-color": { sm: "p-1.25", md: "p-1.5", lg: "p-2" },
  "badge-modern":{ sm: "p-1.25", md: "p-1.5", lg: "p-2" },
}

interface BadgeIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  icon: IconType
}

function BadgeIcon({ className, variant = "pill-color", color = "gray", size = "md", icon: Icon, ...props }: BadgeIconProps) {
  const addonColor = getAddonColor(variant, color)
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center whitespace-nowrap ring-1 ring-inset",
        variant === "pill-color" ? "rounded-full" : variant === "badge-modern" ? "rounded-md shadow-xs bg-primary text-secondary ring-primary" : "rounded-md",
        size === "lg" && variant !== "pill-color" && "rounded-lg",
        iconOnlyMap[variant][size],
        getRootColor(variant, color),
        className,
      )}
      {...props}
    >
      <Icon className={cn("size-3 stroke-[3px]", addonColor)} />
    </span>
  )
}

export { Badge, BadgeWithDot, BadgeWithIcon, BadgeWithButton, BadgeIcon, badgeVariants }
