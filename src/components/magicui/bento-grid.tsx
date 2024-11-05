import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  description,
}: {
  name: string;
  className?: string;
  background: ReactNode;
  description: string;
}) => (
  <div
    key={name}
    className={cn(
      'group relative flex flex-col justify-between overflow-hidden rounded-xl',
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex bg-background transform-gpu flex-col gap-1 p-6">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="max-w-lg leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
