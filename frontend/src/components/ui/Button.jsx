import clsx from 'clsx';

/**
 * Button component
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} isLoading
 * @param {boolean} fullWidth
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold font-sans cursor-pointer border-none transition-all duration-150 whitespace-nowrap';
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:not-disabled:-translate-y-[2px] hover:not-disabled:shadow-glow',
    secondary: 'bg-transparent text-text-primary border border-border-light hover:not-disabled:border-primary hover:not-disabled:bg-primary-glow',
    ghost: 'bg-transparent text-text-secondary hover:not-disabled:bg-background-hover hover:not-disabled:text-text-primary',
    danger: 'bg-error text-white hover:not-disabled:opacity-85 hover:not-disabled:-translate-y-[1px]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        baseStyles,
        disabledStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-slow-spin inline-block" aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  );
}
