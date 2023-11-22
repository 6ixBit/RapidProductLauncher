import { ReactNode } from 'react';
import { T } from '../Typography';
type ChangeLogListCardProps = {
  date: string;
  title: string;
  children: ReactNode;
};

export default function ChangeLogListCard({
  date,
  title,
  children,
}: ChangeLogListCardProps) {
  return (
    <div
      className="flex flex-col md:grid md:grid-cols-2 gap-8 border b-gray-200 bg-gray-200/30 dark:bg-slate-950/40 rounded-xl px-6 py-4 shadow-sm w-full"
      style={{ gridTemplateColumns: '160px auto' }}
    >
      <p>{date}</p>
      <div>
        <T.H2 className=" border-none text-blue-500">{title}</T.H2>
        {children}
      </div>
    </div>
  );
}
