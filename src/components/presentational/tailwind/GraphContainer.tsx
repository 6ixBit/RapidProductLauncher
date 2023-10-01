import { T } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';

type GraphContainerProps = {
    title: string;
    subTitle?: string;
    children: React.ReactNode;
    classname?: string;
};

export function GraphContainer({
    title,
    subTitle,
    children,
    classname,
}: GraphContainerProps) {
    return (
        <div className={cn('border rounded-xl overflow-hidden', classname)}>
            <div className="px-6 bg-gray-200/30 dark:bg-slate-900 border-b py-5 w-full ">
                <T.H4 className="mt-0 text-lg mb-1">{title}</T.H4>
                <T.P className="text-muted-foreground text-sm">{subTitle}</T.P>
            </div>
            <div className="px-6 py-5 bg-white dark:bg-slate-950/40 h-full ">
                {children}
            </div>
        </div>
    );
}
