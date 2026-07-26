import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Input component
 * @param {string} label
 * @param {string} error - Error message string
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
const Input = forwardRef(function Input(
  { label, error, leftIcon, rightIcon, className, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className={clsx(
        "relative flex items-center border rounded-md bg-background-secondary transition-all duration-150 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-glow",
        error ? "border-error focus-within:border-error focus-within:ring-error/20" : "border-border"
      )}>
        {leftIcon && <span className="absolute left-4 flex items-center text-text-muted">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full py-2.5 px-4 bg-transparent border-none outline-none text-text-primary text-sm placeholder-text-muted",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {rightIcon && <span className="absolute right-4 flex items-center text-text-muted">{rightIcon}</span>}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
});

export default Input;
