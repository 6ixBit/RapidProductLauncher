import { Anchor } from '@/components/Anchor';
import AccountsIcon from 'lucide-react/dist/esm/icons/user';
import SecurityIcon from 'lucide-react/dist/esm/icons/lock';
import LogoutIcon from 'lucide-react/dist/esm/icons/log-out';
import { cn } from '@/utils/cn';

export function UserSidebarMenu() {
  return (
    <div className="dark:bg-black ">
      <Anchor
        href="/settings"
        className={cn(
          'hover:bg-gray-100 hover:text-gray-900 text-gray-700 rounded-sm dark:text-gray-400 dark:hover:bg-gray-700/50',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <AccountsIcon className="text-lg" /> Account settings
      </Anchor>

      <Anchor
        href="/settings/security"
        className={cn(
          'hover:bg-gray-100 hover:text-gray-900 text-gray-700 rounded-sm dark:text-gray-400 dark:hover:bg-gray-700/50',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <SecurityIcon className="text-lg" /> Security Settings
      </Anchor>
      <Anchor
        href="/logout"
        prefetch={false}
        className={cn(
          'hover:bg-gray-100 hover:text-gray-900 text-gray-700 rounded-sm dark:text-gray-400 dark:hover:bg-gray-700/50',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <LogoutIcon className="text-lg" />
        Sign out
      </Anchor>
    </div>
  );
}
