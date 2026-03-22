'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils/cn';

const options = [
  { id: 'light', label: 'Light', shortLabel: 'L' },
  { id: 'dark', label: 'Dark', shortLabel: 'D' },
] as const;

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title={`Tema atual: ${isDark ? 'dark' : 'light'}`}
      className={cn(
        'tivit-button-motion group relative inline-flex h-14 w-[11.5rem] items-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-1.5 shadow-glass backdrop-blur-xl hover:shadow-neo-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tivit-red/40 dark:border-white/10 dark:bg-white/5',
        !mounted && 'opacity-80'
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-1.5 left-1.5 right-1.5 z-0">
        <span
          className={cn(
            'block h-full w-1/2 rounded-full border border-white/30 bg-white/30 shadow-glass backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-white/10',
            isDark ? 'translate-x-full' : 'translate-x-0'
          )}
        />
      </span>

      <span className="relative z-10 grid w-full grid-cols-2 gap-1">
        {options.map((option) => {
          const selected = theme === option.id;

          return (
            <span
              key={option.id}
              className={cn(
                'flex h-11 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                selected
                  ? 'text-app-fg'
                  : 'scale-[0.96] text-app-muted/70 blur-[1.4px] opacity-60'
              )}
            >
              <span>{option.label}</span>
            </span>
          );
        })}
      </span>
    </button>
  );
}
