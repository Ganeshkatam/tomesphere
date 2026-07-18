import React from 'react';
import styles from './Icon.module.css';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bounce?: boolean;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ children, size = 'md', bounce = false, className = '', ...props }, ref) => {
    const classNames = [
      styles.icon,
      styles[size],
      bounce && styles.bounce,
      className
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {children}
      </span>
    );
  }
);

Icon.displayName = 'Icon';
