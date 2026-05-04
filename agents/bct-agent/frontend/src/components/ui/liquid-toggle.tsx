"use client";

import React from 'react';
import { cn } from '@/lib/utils';

// I've updated the color variables here for better contrast and visual appeal.
const styles = {
  switch: `relative block cursor-pointer h-8 w-[52px]
    /* --- Color Palette --- */
    /* I've changed the active color to an indigo shade for better visibility. */
    [--c-active:#4F46E5] 
    [--c-success:#10B981]
    [--c-warning:#F59E0B]
    [--c-danger:#EF4444]
    [--c-active-inner:#FFFFFF]
    /* I've also updated the default 'off' colors to neutral grays for better theme compatibility. */
    [--c-default:#E5E7EB]
    [--c-default-dark:#D1D5DB]
    [--c-black:#1B1B22]
    
    /* --- Base Styles --- */
    [transform:translateZ(0)]
    [-webkit-transform:translateZ(0)]
    [backface-visibility:hidden]
    [-webkit-backface-visibility:hidden]
    [perspective:1000]
    [-webkit-perspective:1000]`,
  input: `h-full w-full cursor-pointer appearance-none rounded-full
    bg-[--c-default] outline-none transition-colors duration-500
    hover:bg-[--c-default-dark]
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]
    data-[checked=true]:bg-[--c-background]`,
  svg: `pointer-events-none absolute inset-0 fill-[--c-active-inner]
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]`,
  circle: `transform-gpu transition-transform duration-500
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]
    [backface-visibility:hidden]
    [-webkit-backface-visibility:hidden]`,
  dropCircle: `transform-gpu transition-transform duration-700
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]`
};

const variantStyles = {
  default: '[--c-background:var(--c-active)]',
  success: '[--c-background:var(--c-success)]',
  warning: '[--c-background:var(--c-warning)]',
  danger: '[--c-background:var(--c-danger)]',
};

interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Toggle({ 
  checked, // Removed default value to be controlled by parent
  onCheckedChange, 
  className,
  variant = 'default'
}: ToggleProps) {
  // The component is now fully controlled by the parent's state.
  const isChecked = checked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label className={cn(styles.switch, className)}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        data-checked={isChecked}
        className={cn(styles.input, variantStyles[variant])}
      />
      <svg
        viewBox="0 0 52 32"
        filter="url(#goo)"
        className={styles.svg}
      >
        {/* Circle for the "off" state */}
        <circle
          className={styles.circle}
          cx="16"
          cy="16"
          r="10"
          style={{
            transformOrigin: '16px 16px',
            transform: `translateX(${isChecked ? '12px' : '0px'}) scale(${isChecked ? '0' : '1'})`,
          }}
        />
        {/* Circle for the "on" state */}
        <circle
          className={styles.circle}
          cx="36"
          cy="16"
          r="10"
          style={{
            transformOrigin: '36px 16px',
            transform: `translateX(${isChecked ? '0px' : '-12px'}) scale(${isChecked ? '1' : '0'})`,
          }}
        />
        {/* The little drop effect when toggled on */}
        {isChecked && (
          <circle
            className={styles.dropCircle}
            cx="35"
            cy="-1"
            r="2.5"
          />
        )}
      </svg>
    </label>
  );
}

export function GooeyFilter() {
  return (
    <svg className="fixed w-0 h-0">
      <defs>
        <filter id="goo">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="2"
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite
            in="SourceGraphic"
            in2="goo"
            operator="atop"
          />
        </filter>
      </defs>
    </svg>
  );
}
