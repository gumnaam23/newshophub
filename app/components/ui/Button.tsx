'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl';
        case 'secondary':
          return 'bg-linear-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl';
        case 'outline':
          return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950';
        case 'ghost':
          return 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800';
        case 'danger':
          return 'bg-linear-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl';
        case 'success':
          return 'bg-linear-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl';
        default:
          return 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500';
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'xs':
          return 'px-2 py-1 text-xs gap-1';
        case 'sm':
          return 'px-3 py-1.5 text-sm gap-1.5';
        case 'md':
          return 'px-4 py-2 text-base gap-2';
        case 'lg':
          return 'px-6 py-3 text-lg gap-2';
        case 'xl':
          return 'px-8 py-4 text-xl gap-3';
        default:
          return 'px-4 py-2 text-base gap-2';
      }
    };

    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClass = fullWidth ? 'w-full' : '';
    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthClass} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="animate-spin" style={{ 
            width: size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20,
            height: size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20
          }} />
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="flex-shrink-0">{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };