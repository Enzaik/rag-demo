"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { Plus, User01 } from "@untitledui/icons"

import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

// ─── Size maps ────────────────────────────────────────────────────────────────

const sizeStyles: Record<AvatarSize, {
  root: string
  initials: string
  indicator: string
  badge: string
  verified: { root: string; tick: string }
}> = {
  xxs:  { root: "size-4 outline-[0.5px] -outline-offset-[0.5px]",   initials: "text-xs font-semibold",          indicator: "size-1.5", badge: "size-2",   verified: { root: "size-2.5", tick: "size-[4.38px]" } },
  xs:   { root: "size-6 outline-[0.5px] -outline-offset-[0.5px]",   initials: "text-xs font-semibold",          indicator: "size-1.5", badge: "size-2",   verified: { root: "size-2.5", tick: "size-[4.38px]" } },
  sm:   { root: "size-8 outline-[0.75px] -outline-offset-[0.75px]", initials: "text-sm font-semibold",          indicator: "size-2",   badge: "size-3",   verified: { root: "size-3",   tick: "size-[5.25px]" } },
  md:   { root: "size-10 outline-1 -outline-offset-1",              initials: "text-md font-semibold",          indicator: "size-2.5", badge: "size-3.5", verified: { root: "size-3.5", tick: "size-[6.13px]" } },
  lg:   { root: "size-12 outline-1 -outline-offset-1",              initials: "text-lg font-semibold",          indicator: "size-3",   badge: "size-4",   verified: { root: "size-4",   tick: "size-[7px]" } },
  xl:   { root: "size-14 outline-1 -outline-offset-1",              initials: "text-xl font-semibold",          indicator: "size-3.5", badge: "size-4.5", verified: { root: "size-4.5", tick: "size-[7.88px]" } },
  "2xl":{ root: "size-16 outline-1 -outline-offset-1",              initials: "text-display-xs font-semibold",  indicator: "size-4",   badge: "size-5 ring-[1.67px]", verified: { root: "size-5", tick: "size-[8.75px]" } },
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AvatarContext = React.createContext<{ size: AvatarSize }>({ size: "md" })
const useAvatarContext = () => React.useContext(AvatarContext)

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize
  contrastBorder?: boolean
  focusable?: boolean
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "md", contrastBorder = true, focusable = false, ...props }, ref) => (
  <AvatarContext.Provider value={{ size }}>
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-bg outline-transparent",
        contrastBorder && "outline outline-avatar-contrast-border",
        focusable && "group-focus-visible:outline-2 group-focus-visible:outline-offset-2",
        sizeStyles[size].root,
        className,
      )}
      {...props}
    />
  </AvatarContext.Provider>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// ─── AvatarImage ──────────────────────────────────────────────────────────────

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("aspect-square size-full rounded-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// ─── AvatarFallback ───────────────────────────────────────────────────────────

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  const { size } = useAvatarContext()
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-quaternary",
        sizeStyles[size].initials,
        className,
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ─── AvatarOnlineIndicator ────────────────────────────────────────────────────

interface AvatarOnlineIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "online" | "offline"
}

const AvatarOnlineIndicator = React.forwardRef<HTMLSpanElement, AvatarOnlineIndicatorProps>(
  ({ className, status, ...props }, ref) => {
    const { size } = useAvatarContext()
    return (
      <span
        ref={ref}
        data-slot="avatar-indicator"
        className={cn(
          "absolute right-0 bottom-0 rounded-full ring-[1.5px] ring-bg-primary",
          status === "online" ? "bg-fg-success-secondary" : "bg-fg-disabled_subtle",
          sizeStyles[size].indicator,
          className,
        )}
        {...props}
      />
    )
  }
)
AvatarOnlineIndicator.displayName = "AvatarOnlineIndicator"

// ─── AvatarVerifiedTick ───────────────────────────────────────────────────────

const AvatarVerifiedTick = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const { size } = useAvatarContext()
    const { root } = sizeStyles[size].verified
    const isSmall = size === "xxs" || size === "xs"
    return (
      <span
        ref={ref}
        data-slot="avatar-verified"
        className={cn("absolute right-0 bottom-0 z-10", isSmall && "-right-px -bottom-px", className)}
        {...props}
      >
        <svg className={cn("text-utility-blue-500", root)} viewBox="0 0 10 10" fill="none">
          <path d="M7.72237 1.77098C7.81734 2.00068 7.99965 2.18326 8.2292 2.27858L9.03413 2.61199C9.26384 2.70714 9.44635 2.88965 9.5415 3.11936C9.63665 3.34908 9.63665 3.60718 9.5415 3.83689L9.20833 4.64125C9.11313 4.87106 9.113 5.12943 9.20863 5.35913L9.54122 6.16325C9.58839 6.27702 9.61268 6.39897 9.6127 6.52214C9.61272 6.6453 9.58847 6.76726 9.54134 6.88105C9.4942 6.99484 9.42511 7.09823 9.33801 7.18531C9.2509 7.27238 9.14749 7.34144 9.03369 7.38854L8.22934 7.72171C7.99964 7.81669 7.81706 7.99899 7.72174 8.22855L7.38833 9.03348C7.29318 9.26319 7.11067 9.4457 6.88096 9.54085C6.65124 9.636 6.39314 9.636 6.16343 9.54085L5.35907 9.20767C5.12935 9.11276 4.87134 9.11295 4.64177 9.20821L3.83684 9.54115C3.60725 9.63608 3.34937 9.636 3.11984 9.54092C2.89032 9.44585 2.70791 9.26356 2.6127 9.03409L2.27918 8.22892C2.18421 7.99923 2.0019 7.81665 1.77235 7.72133L0.967421 7.38792C0.737807 7.29281 0.555355 7.11041 0.460169 6.88083C0.364983 6.65125 0.364854 6.39327 0.45981 6.16359L0.792984 5.35924C0.8879 5.12952 0.887707 4.87151 0.792445 4.64193L0.459749 3.83642C0.41258 3.72265 0.388291 3.60069 0.388272 3.47753C0.388252 3.35436 0.412501 3.2324 0.459634 3.11861C0.506767 3.00482 0.57586 2.90144 0.662965 2.81436C0.75007 2.72728 0.853479 2.65822 0.967283 2.61113L1.77164 2.27795C2.00113 2.18306 2.1836 2.00099 2.27899 1.7717L2.6124 0.966768C2.70755 0.737054 2.89006 0.554547 3.11978 0.459397C3.34949 0.364246 3.60759 0.364246 3.83731 0.459397L4.64166 0.792571C4.87138 0.887487 5.12939 0.887293 5.35897 0.792031L6.16424 0.459913C6.39392 0.364816 6.65197 0.364836 6.88164 0.459968C7.11131 0.555099 7.29379 0.737554 7.38895 0.967208L7.72247 1.77238L7.72237 1.77098Z" className="fill-current" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6.95829 3.68932C7.02509 3.58439 7.04747 3.45723 7.02051 3.3358C6.99356 3.21437 6.91946 3.10862 6.81454 3.04182C6.70961 2.97502 6.58245 2.95264 6.46102 2.97959C6.33959 3.00655 6.23384 3.08064 6.16704 3.18557L4.33141 6.06995L3.49141 5.01995C3.41375 4.92281 3.30069 4.8605 3.17709 4.84673C3.05349 4.83296 2.92949 4.86885 2.83235 4.94651C2.73522 5.02417 2.67291 5.13723 2.65914 5.26083C2.64536 5.38443 2.68125 5.50843 2.75891 5.60557L4.00891 7.16807C4.0555 7.22638 4.11533 7.27271 4.18344 7.30323C4.25154 7.33375 4.32595 7.34757 4.40047 7.34353C4.47499 7.3395 4.54747 7.31773 4.61188 7.28004C4.67629 7.24234 4.73077 7.18981 4.77079 7.12682L6.95829 3.68932Z" fill="white" />
        </svg>
      </span>
    )
  }
)
AvatarVerifiedTick.displayName = "AvatarVerifiedTick"

// ─── AvatarBadge ──────────────────────────────────────────────────────────────
// Generic slot for company icons or custom badges positioned at bottom-right.

interface AvatarBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, src, alt, children, ...props }, ref) => {
    const { size } = useAvatarContext()
    return (
      <span
        ref={ref}
        data-slot="avatar-badge"
        className={cn(
          "absolute -right-0.5 -bottom-0.5 rounded-full ring-[1.5px] ring-bg-primary",
          sizeStyles[size].badge,
          className,
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="size-full rounded-full object-cover" />
        ) : children}
      </span>
    )
  }
)
AvatarBadge.displayName = "AvatarBadge"

// ─── AvatarAddButton ──────────────────────────────────────────────────────────

const addButtonSizes: Record<"xs" | "sm" | "md", { root: string; icon: string }> = {
  xs: { root: "size-6", icon: "size-4" },
  sm: { root: "size-8", icon: "size-4" },
  md: { root: "size-10", icon: "size-5" },
}

interface AvatarAddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md"
}

const AvatarAddButton = React.forwardRef<HTMLButtonElement, AvatarAddButtonProps>(
  ({ className, size = "sm", ...props }, ref) => (
    <button
      ref={ref}
      data-slot="avatar-add-button"
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full border border-dashed border-primary bg-primary text-fg-quaternary transition duration-100 ease-linear",
        "hover:bg-primary_hover hover:text-fg-quaternary_hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:border-disabled disabled:bg-secondary disabled:text-fg-disabled",
        addButtonSizes[size].root,
        className,
      )}
      {...props}
    >
      <Plus className={cn("text-current", addButtonSizes[size].icon)} />
    </button>
  )
)
AvatarAddButton.displayName = "AvatarAddButton"

// ─── AvatarProfilePhoto ───────────────────────────────────────────────────────

export type AvatarProfilePhotoSize = "sm" | "md" | "lg"

const profilePhotoStyles: Record<AvatarProfilePhotoSize, {
  root: string
  rootPlaceholder: string
  content: string
  icon: string
  initials: string
  badge: string
  verified: string
  indicator: string
}> = {
  sm: {
    root:            "size-18 p-0.75",
    rootPlaceholder: "p-1",
    content:         "",
    icon:            "size-9",
    initials:        "text-display-sm font-semibold",
    badge:           "bottom-0.5 right-0.5",
    verified:        "size-5",
    indicator:       "size-3.5",
  },
  md: {
    root:            "size-24 p-1",
    rootPlaceholder: "p-1.25",
    content:         "shadow-xl",
    icon:            "size-12",
    initials:        "text-display-md font-semibold",
    badge:           "bottom-1 right-1",
    verified:        "size-6",
    indicator:       "size-4.5",
  },
  lg: {
    root:            "size-40 p-1.5",
    rootPlaceholder: "p-1.75",
    content:         "shadow-2xl",
    icon:            "size-20",
    initials:        "text-display-xl font-semibold",
    badge:           "bottom-2 right-2",
    verified:        "size-8",
    indicator:       "size-6",
  },
}

interface AvatarProfilePhotoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarProfilePhotoSize
  src?: string
  alt?: string
  initials?: string
  verified?: boolean
  status?: "online" | "offline"
  contrastBorder?: boolean
}

const AvatarProfilePhoto = React.forwardRef<HTMLDivElement, AvatarProfilePhotoProps>(
  ({ size = "md", src, alt, initials, verified, status, contrastBorder = true, className, ...props }, ref) => {
    const [failed, setFailed] = React.useState(false)
    const s = profilePhotoStyles[size]
    const showImage = src && !failed

    return (
      <div
        ref={ref}
        data-slot="avatar-profile-photo"
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full bg-primary ring-1 ring-secondary_alt",
          s.root,
          !showImage && s.rootPlaceholder,
          className,
        )}
        {...props}
      >
        {/* Inner content */}
        {showImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className={cn(
              "size-full rounded-full object-cover",
              contrastBorder && "outline-1 -outline-offset-1 outline-avatar-contrast-border",
              s.content,
            )}
          />
        ) : initials ? (
          <div className={cn("flex size-full items-center justify-center rounded-full bg-tertiary ring-1 ring-secondary_alt", s.content)}>
            <span className={cn("text-quaternary", s.initials)}>{initials}</span>
          </div>
        ) : (
          <div className={cn("flex size-full items-center justify-center rounded-full bg-tertiary ring-1 ring-secondary_alt", s.content)}>
            <User01 className={cn("text-fg-quaternary", s.icon)} />
          </div>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              "absolute rounded-full ring-2 ring-bg-primary",
              status === "online" ? "bg-fg-success-secondary" : "bg-fg-disabled_subtle",
              s.indicator,
              s.badge,
            )}
          />
        )}

        {/* Verified tick */}
        {verified && !status && (
          <span className={cn("absolute", s.badge)}>
            <svg className={cn("text-utility-blue-500", s.verified)} viewBox="0 0 10 10" fill="none">
              <path d="M7.72237 1.77098C7.81734 2.00068 7.99965 2.18326 8.2292 2.27858L9.03413 2.61199C9.26384 2.70714 9.44635 2.88965 9.5415 3.11936C9.63665 3.34908 9.63665 3.60718 9.5415 3.83689L9.20833 4.64125C9.11313 4.87106 9.113 5.12943 9.20863 5.35913L9.54122 6.16325C9.58839 6.27702 9.61268 6.39897 9.6127 6.52214C9.61272 6.6453 9.58847 6.76726 9.54134 6.88105C9.4942 6.99484 9.42511 7.09823 9.33801 7.18531C9.2509 7.27238 9.14749 7.34144 9.03369 7.38854L8.22934 7.72171C7.99964 7.81669 7.81706 7.99899 7.72174 8.22855L7.38833 9.03348C7.29318 9.26319 7.11067 9.4457 6.88096 9.54085C6.65124 9.636 6.39314 9.636 6.16343 9.54085L5.35907 9.20767C5.12935 9.11276 4.87134 9.11295 4.64177 9.20821L3.83684 9.54115C3.60725 9.63608 3.34937 9.636 3.11984 9.54092C2.89032 9.44585 2.70791 9.26356 2.6127 9.03409L2.27918 8.22892C2.18421 7.99923 2.0019 7.81665 1.77235 7.72133L0.967421 7.38792C0.737807 7.29281 0.555355 7.11041 0.460169 6.88083C0.364983 6.65125 0.364854 6.39327 0.45981 6.16359L0.792984 5.35924C0.8879 5.12952 0.887707 4.87151 0.792445 4.64193L0.459749 3.83642C0.41258 3.72265 0.388291 3.60069 0.388272 3.47753C0.388252 3.35436 0.412501 3.2324 0.459634 3.11861C0.506767 3.00482 0.57586 2.90144 0.662965 2.81436C0.75007 2.72728 0.853479 2.65822 0.967283 2.61113L1.77164 2.27795C2.00113 2.18306 2.1836 2.00099 2.27899 1.7717L2.6124 0.966768C2.70755 0.737054 2.89006 0.554547 3.11978 0.459397C3.34949 0.364246 3.60759 0.364246 3.83731 0.459397L4.64166 0.792571C4.87138 0.887487 5.12939 0.887293 5.35897 0.792031L6.16424 0.459913C6.39392 0.364816 6.65197 0.364836 6.88164 0.459968C7.11131 0.555099 7.29379 0.737554 7.38895 0.967208L7.72247 1.77238L7.72237 1.77098Z" className="fill-current" />
              <path fillRule="evenodd" clipRule="evenodd" d="M6.95829 3.68932C7.02509 3.58439 7.04747 3.45723 7.02051 3.3358C6.99356 3.21437 6.91946 3.10862 6.81454 3.04182C6.70961 2.97502 6.58245 2.95264 6.46102 2.97959C6.33959 3.00655 6.23384 3.08064 6.16704 3.18557L4.33141 6.06995L3.49141 5.01995C3.41375 4.92281 3.30069 4.8605 3.17709 4.84673C3.05349 4.83296 2.92949 4.86885 2.83235 4.94651C2.73522 5.02417 2.67291 5.13723 2.65914 5.26083C2.64536 5.38443 2.68125 5.50843 2.75891 5.60557L4.00891 7.16807C4.0555 7.22638 4.11533 7.27271 4.18344 7.30323C4.25154 7.33375 4.32595 7.34757 4.40047 7.34353C4.47499 7.3395 4.54747 7.31773 4.61188 7.28004C4.67629 7.24234 4.73077 7.18981 4.77079 7.12682L6.95829 3.68932Z" fill="white" />
            </svg>
          </span>
        )}
      </div>
    )
  }
)
AvatarProfilePhoto.displayName = "AvatarProfilePhoto"

export { Avatar, AvatarImage, AvatarFallback, AvatarOnlineIndicator, AvatarVerifiedTick, AvatarBadge, AvatarAddButton, AvatarProfilePhoto }
