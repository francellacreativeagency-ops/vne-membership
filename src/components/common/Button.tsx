import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-white text-slate-800 hover:scale-105 active:scale-95 shadow-lg',
  secondary: 'bg-[var(--theme-accent)] text-slate-900 hover:scale-105 active:scale-95 shadow-lg',
  ghost: 'bg-white/20 text-white hover:bg-white/30',
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-6 py-3 text-xl font-bold transition-transform duration-150 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
