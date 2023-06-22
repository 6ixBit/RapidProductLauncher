import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

type TableCellProps = {
  children: React.ReactNode;
  classname: string;
};

export default function TableCell({ children, classname }: TableCellProps) {
  return (
    <div
      className={`flex hover:bg-slate-50 border border-r-1 border-b-1 group h-[59px] border-slate-200 text-black ${classname}`}
    >
      {children}
    </div>
  );
}
