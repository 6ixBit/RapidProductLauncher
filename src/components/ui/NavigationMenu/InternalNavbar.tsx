import { cn } from '@/utils/cn';
import Link from 'next/link';
import Home from 'lucide-react/dist/esm/icons/home';
import { ThemeToggle } from '@/components/presentational/tailwind/ThemeToggle';

export default function InternalNavbar() {
    return (
        <header className="sticky top-0 w-full z-10 dark:bg-slate-900/50 bg-white/90 backdrop-blur">
            <div
                className={cn(
                    'h-full flex mx-auto px-12 border-b dark:border-slate-700/50 py-5 w-full mb-8 justify-center items-center',
                )}
            >
                <div className={cn('hidden lg:block', 'relative ')}>
                    <Link
                        href="/dashboard"
                        className="flex items-center text-lg font-medium transition-colors hover:text-foreground/60 sm:text-sm"
                        aria-label="Home page"
                    >
                        <Home className="h-5 w-5 mr-2" /> Dashboard
                    </Link>
                </div>
                <div className="relative flex basis-0 items-center justify-end space-x-2 sm:gap-3 md:flex-grow">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
