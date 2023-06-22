type TableHeaderProps = {
  children: React.ReactNode;
};

export default function TableHeader({ children }: TableHeaderProps) {
  return (
    <div className="bg-slate-50 text-sm font-[600] border border-r-1 border-slate-200 text-slate-600 px-6 py-3 text-left">
      {children}
    </div>
  );
}
