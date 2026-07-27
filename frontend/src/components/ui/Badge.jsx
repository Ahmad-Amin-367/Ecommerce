import clsx from 'clsx';

/**
 * @param {'default'|'success'|'warning'|'error'|'info'|'primary'|'bestseller'} variant
 */
export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-cloud text-warm-gray',
    primary: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-primary/10 text-primary',
    info: 'bg-info/10 text-info',
    bestseller: 'bg-amber-50 text-amber-700 border border-amber-200',
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
