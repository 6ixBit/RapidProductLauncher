import { cn } from '@/lib/utils';

interface AnnouncementProps {
    text: string;
    variant?: 'info' | 'success' | 'warning' | 'tip';
    className?: string;
}

export function Announcement({ text, variant = 'info', className }: AnnouncementProps) {
    const variantStyles = {
        info: 'bg-blue-50 text-blue-700 border-blue-100',
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        tip: 'bg-purple-50 text-purple-700 border-purple-100',
    };

    const variantIcons = {
        info: '📢',
        success: '✨',
        warning: '⚡',
        tip: '💡 Tip:',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md px-4 py-1.5',
                'text-sm font-medium border',
                variantStyles[variant],
                className
            )}
        >
            <span className="mr-2">{variantIcons[variant]}</span>
            {text}
        </span>
    );
}