import clsx from 'clsx';

/**
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullPage - Centers spinner in full page
 */
export default function Spinner({ size = 'md', fullPage = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={clsx(
      "rounded-full border-border border-t-primary animate-slow-spin",
      sizes[size]
    )} />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        {spinner}
      </div>
    );
  }
  return spinner;
}
