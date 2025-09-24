import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

const variantStyles = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 bg-white hover:bg-gray-100',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'hover:bg-gray-100',
  link: 'text-blue-600 underline hover:text-blue-800',
}

const sizeStyles = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3',
  lg: 'h-10 rounded-md px-6',
  icon: 'h-9 w-9',
}

// Simple button component to resolve JSX component error
export const Button = (props: any) => {
  return <button {...props} />
}

Button.displayName = 'Button'
