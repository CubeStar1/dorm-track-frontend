import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
};

const CustomButton = ({
  children,
  className,
  variant = 'primary',
  isLoading,
  fullWidth,
  disabled,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        'h-11 rounded-xl font-medium transition-colors',
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={isLoading || disabled}
      variant={variant === 'primary' ? 'default' : variant}
      {...props}
    >
      {isLoading && (
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  );
};

export default CustomButton; 