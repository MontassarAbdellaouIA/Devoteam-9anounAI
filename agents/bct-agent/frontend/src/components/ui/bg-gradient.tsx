"use client"

import { cn } from "@/lib/utils"

interface BgGradientProps {
  className?: string
  /**
   * The starting color of the gradient. Defaults to your theme's background color.
   */
  gradientFrom?: string
  /**
   * The ending color of the gradient. Defaults to a subtle version of your theme's destructive color.
   */
  gradientTo?: string
  /**
   * The size of the radial gradient.
   */
  gradientSize?: string
  /**
   * The position of the gradient's center.
   */
  gradientPosition?: string
  /**
   * The point at which the 'from' color stops.
   */
  gradientStop?: string
}

export const BgGradient = ({
  className,
  // We use CSS variables to automatically handle light/dark mode.
  gradientFrom = "#ffff",
  gradientTo = "#f8485e", // Using HSL to make the color subtle
  gradientSize = "125% 125%",
  gradientPosition = "50% 10%",
  gradientStop = "50%",
}: BgGradientProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full -z-10", // Sits behind all other content
        className
      )}
      style={{
        // Creates the radial gradient using the provided style props
        background: `radial-gradient(${gradientSize} at ${gradientPosition}, ${gradientFrom} ${gradientStop}, ${gradientTo} 100%)`,
      }}
    />
  )
}
