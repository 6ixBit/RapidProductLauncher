import { Anchor } from '@/components/Anchor';
import AccountsIcon from 'lucide-react/dist/esm/icons/users';
import SecurityIcon from 'lucide-react/dist/esm/icons/shield';
import LogoutIcon from 'lucide-react/dist/esm/icons/log-out';
import { cn } from '@/utils/cn';

export function UserSidebarMenu() {
  return (
    <div>
      <Anchor
        href="/settings"
        className={cn(
          'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <AccountsIcon className="text-lg" /> Account settings
      </Anchor>

      <Anchor
        href="/settings/security"
        className={cn(
          'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <SecurityIcon className="text-lg" /> Security Settings
      </Anchor>
      <Anchor
        href="/logout"
        prefetch={false}
        className={cn(
          'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
          'flex px-3 gap-2 items-center py-2 text-sm'
        )}
      >
        <LogoutIcon className="text-lg" />
        Sign out
      </Anchor>
    </div>
  );
}
