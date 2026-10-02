import { forwardRef } from 'react';

/**
 * Botón reutilizable.
 * @param {{ variant?: 'primary' | 'secondary' | 'quiet', as?: 'button' | 'a' }} props
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    as = 'button',
    type = 'button',
    className = '',
    children,
    ...props
  },
  ref,
) {
  const baseClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'link-quiet';

  const classes = [baseClass, className].filter(Boolean).join(' ');

  if (as === 'a') {
    return (
      <a ref={ref} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
