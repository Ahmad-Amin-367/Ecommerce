import clsx from 'clsx';

/**
 * @param {'default'|'success'|'warning'|'error'|'info'|'primary'} variant
 */
export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-background-hover text-text-secondary',
    primary: 'bg-primary-glow text-primary-light',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/15 text-error',
    info: 'bg-info/15 text-info',
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-[3px] rounded-full text-xs font-semibold uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
