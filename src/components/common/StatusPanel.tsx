import SurfaceCard from '@/components/common/SurfaceCard';
import { cn } from '@/lib/utils/cn';

type StatusVariant = 'loading' | 'error' | 'empty';

interface StatusPanelProps {
  title: string;
  description: string;
  variant: StatusVariant;
}

const variantStyles: Record<StatusVariant, { icon: string; accent: string }> = {
  loading: {
    icon: '◌',
    accent: 'from-surface-elevated to-surface-soft text-app-muted',
  },
  error: {
    icon: '✕',
    accent: 'from-tivit-red/15 to-accent-soft text-tivit-red',
  },
  empty: {
    icon: '·',
    accent: 'from-surface-elevated to-surface-soft text-app-muted',
  },
};

export default function StatusPanel({
  title,
  description,
  variant,
}: StatusPanelProps) {
  const style = variantStyles[variant];

  return (
    <SurfaceCard className="mx-auto flex min-h-[260px] w-full max-w-3xl animate-[fade-up_0.45s_ease-out] items-center justify-center p-8 sm:p-10">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div
          className={cn(
            'mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-3xl shadow-neo-inset',
            style.accent
          )}
        >
          {variant === 'loading' ? (
            <span className="animate-spin">◌</span>
          ) : (
            style.icon
          )}
        </div>
        <h2 className="font-display text-2xl font-semibold text-app-fg sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-app-muted sm:text-base">
          {description}
        </p>
      </div>
    </SurfaceCard>
  );
}
