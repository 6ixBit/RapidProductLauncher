import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

export function Blockquote({
  className,
  ...rest
}: ComponentProps<'blockquote'>) {
  const classNames = cn(
    'mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800',
    className,
  );
  return <blockquote className={classNames} {...rest}></blockquote>;
}
