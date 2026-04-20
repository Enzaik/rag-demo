"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ChevronRight, DotsVertical } from "@untitledui/icons"

import { cn } from "@/lib/utils"

// ─── Primitives ───────────────────────────────────────────────────────────────

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// ─── Content ──────────────────────────────────────────────────────────────────

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Layout
        "z-50 w-62 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto overflow-x-hidden",
        "rounded-lg bg-primary py-1 shadow-lg ring-1 ring-secondary_alt",
        "select-none outline-hidden backface-hidden",
        // Enter — unconditional so the animation fires on DOM mount
        "animate-in fade-in-0 duration-150 ease-out",
        "data-[side=bottom]:slide-in-from-top-1",
        "data-[side=top]:slide-in-from-bottom-1",
        "data-[side=left]:slide-in-from-right-1",
        "data-[side=right]:slide-in-from-left-1",
        // Exit
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-100 data-[state=closed]:ease-in",
        "data-[state=closed]:data-[side=bottom]:slide-out-to-top-1",
        "data-[state=closed]:data-[side=top]:slide-out-to-bottom-1",
        "data-[state=closed]:data-[side=left]:slide-out-to-right-1",
        "data-[state=closed]:data-[side=right]:slide-out-to-left-1",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

// ─── Item ─────────────────────────────────────────────────────────────────────

interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean
  icon?: React.FC<{ className?: string }>
  addon?: string
  destructive?: boolean
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, icon: Icon, addon, children, destructive, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "group block cursor-pointer px-1.5 py-px outline-hidden",
      "data-[disabled]:cursor-not-allowed",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    <div className={cn(
      "relative flex items-center rounded-md px-2.5 py-2",
      "transition duration-100 ease-linear",
      "outline-none",
      destructive
        ? "group-hover:bg-error-primary group-focus:bg-error-primary"
        : "group-hover:bg-primary_hover group-focus:bg-primary_hover",
      "group-data-[disabled]:opacity-50 group-data-[disabled]:group-hover:bg-transparent",
    )}>
      {Icon && (
        <Icon className={cn(
          "mr-2 size-4 shrink-0 stroke-[2.25px] transition-inherit-all",
          destructive ? "text-fg-error-secondary" : "text-fg-quaternary",
          "group-data-[disabled]:text-fg-disabled",
        )} />
      )}
      <span className={cn(
        "grow truncate text-sm font-semibold",
        destructive
          ? "text-error-primary group-hover:text-error-primary"
          : "text-secondary group-hover:text-secondary_hover",
        "group-data-[disabled]:text-disabled",
      )}>
        {children}
      </span>
      {addon && (
        <span className="ml-3 shrink-0 rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-inset ring-secondary">
          {addon}
        </span>
      )}
    </div>
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "group block cursor-pointer px-1.5 py-px outline-hidden",
      "data-[disabled]:cursor-not-allowed",
      className,
    )}
    checked={checked}
    {...props}
  >
    <div className={cn(
      "relative flex items-center rounded-md px-2.5 py-2 pl-8",
      "transition duration-100 ease-linear",
      "group-hover:bg-primary_hover group-focus:bg-primary_hover",
      "group-data-[disabled]:opacity-50",
    )}>
      <span className="absolute left-3.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <svg viewBox="0 0 14 14" fill="none" className="size-3.5 text-fg-brand-primary stroke-[2.5px]">
            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className="grow truncate text-sm font-semibold text-secondary group-hover:text-secondary_hover group-data-[disabled]:text-disabled">
        {children}
      </span>
    </div>
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

// ─── RadioItem ────────────────────────────────────────────────────────────────

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "group block cursor-pointer px-1.5 py-px outline-hidden",
      "data-[disabled]:cursor-not-allowed",
      className,
    )}
    {...props}
  >
    <div className={cn(
      "relative flex items-center rounded-md px-2.5 py-2 pl-8",
      "transition duration-100 ease-linear",
      "group-hover:bg-primary_hover group-focus:bg-primary_hover",
      "group-data-[disabled]:opacity-50",
    )}>
      <span className="absolute left-3.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <svg viewBox="0 0 10 10" className="size-2 fill-fg-brand-primary">
            <circle cx="5" cy="5" r="5" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className="grow truncate text-sm font-semibold text-secondary group-hover:text-secondary_hover group-data-[disabled]:text-disabled">
        {children}
      </span>
    </div>
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

// ─── Label ────────────────────────────────────────────────────────────────────

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-medium text-quaternary",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

// ─── Separator ────────────────────────────────────────────────────────────────

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-border-secondary", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

// ─── Shortcut (keyboard addon) ────────────────────────────────────────────────

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto shrink-0 rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-inset ring-secondary", className)}
    {...props}
  />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// ─── SubTrigger ───────────────────────────────────────────────────────────────

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "group block cursor-pointer px-1.5 py-px outline-hidden",
      "data-[disabled]:cursor-not-allowed",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    <div className={cn(
      "relative flex items-center rounded-md px-2.5 py-2",
      "transition duration-100 ease-linear",
      "group-hover:bg-primary_hover group-data-[state=open]:bg-primary_hover",
    )}>
      <span className="grow truncate text-sm font-semibold text-secondary">
        {children}
      </span>
      <ChevronRight className="ml-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary" />
    </div>
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

// ─── SubContent ───────────────────────────────────────────────────────────────

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 w-62 overflow-hidden rounded-lg bg-primary py-1 shadow-lg ring-1 ring-secondary_alt",
      "select-none outline-hidden backface-hidden",
      "animate-in fade-in-0 duration-150 ease-out",
      "data-[side=bottom]:slide-in-from-top-1",
      "data-[side=top]:slide-in-from-bottom-1",
      "data-[side=left]:slide-in-from-right-1",
      "data-[side=right]:slide-in-from-left-1",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-100 data-[state=closed]:ease-in",
      "data-[state=closed]:data-[side=bottom]:slide-out-to-top-1",
      "data-[state=closed]:data-[side=top]:slide-out-to-bottom-1",
      "data-[state=closed]:data-[side=left]:slide-out-to-right-1",
      "data-[state=closed]:data-[side=right]:slide-out-to-left-1",
      className,
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

// ─── AvatarTrigger ────────────────────────────────────────────────────────────

const DropdownMenuAvatarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger asChild>
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex p-0 cursor-pointer select-none rounded-full outline-none",
        "ring-offset-2 transition-shadow duration-150",
        "focus-visible:ring-2 focus-visible:ring-focus-ring",
        "data-[state=open]:ring-2 data-[state=open]:ring-focus-ring",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Trigger>
))
DropdownMenuAvatarTrigger.displayName = "DropdownMenuAvatarTrigger"

// ─── DotsButton ───────────────────────────────────────────────────────────────

const DropdownMenuDotsButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Open menu"
    className={cn(
      "cursor-pointer rounded-md p-1 text-fg-quaternary ring-0",
      "transition duration-100 ease-linear",
      "hover:bg-primary_hover hover:text-fg-quaternary_hover",
      "outline-none [--tw-ring-offset-shadow:0_0_0_0px_white,0_0_0_0px_var(--color-focus-ring)] focus-visible:[--tw-ring-offset-shadow:0_0_0_2px_white,0_0_0_4px_var(--color-focus-ring)] data-[state=open]:[--tw-ring-offset-shadow:0_0_0_2px_white,0_0_0_4px_var(--color-focus-ring)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <DotsVertical className="size-5 transition-inherit-all" />
  </button>
))
DropdownMenuDotsButton.displayName = "DropdownMenuDotsButton"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuDotsButton,
  DropdownMenuAvatarTrigger,
}
