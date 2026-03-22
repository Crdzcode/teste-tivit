import { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SurfaceCardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function SurfaceCard({
  as: Component = 'div',
  children,
  className,
  style,
}: SurfaceCardProps) {
  return (
    <Component
      style={style}
      className={cn(
        'rounded-[var(--radius-card)] border border-edge-soft/70 bg-surface/95 shadow-neo transition-all duration-300',
        'backdrop-blur-xl hover:-translate-y-1 hover:shadow-neo-hover',
        className
      )}
    >
      {children}
    </Component>
  );
}
