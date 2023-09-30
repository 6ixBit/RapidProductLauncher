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
        <div
            className={cn(
                'p-6 bg-gray-200/30 dark:bg-gray-800/40 rounded-2xl w-full ',
                classname
            )}
        >
            <T.H4 className="mt-0">{title}</T.H4>
            <T.P className="text-muted-foreground">{subTitle}</T.P>
            {children}
        </div>
    );
}
