'use server';

import { getPendingInvitationCountOfUser } from '@/data/user/invitation';
import FeedbackIcon from 'lucide-react/dist/esm/icons/mail';
import Link from 'next/link';
import { Badge } from '../Badge';

export async function PendingInvitationCounter() {
  const count = await getPendingInvitationCountOfUser();
  if (count) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-px h-5 mx-2 bg-gray-300 dark:bg-slate-700" />
        <Link href="/invitations">
          <Badge
            size="lg"
            className="px-3 w-max h-fit rounded-md py-2"
            variant="default"
          >
            <FeedbackIcon className="h-4 w-4 mr-2" />
            {count} pending invites
          </Badge>
        </Link>
      </div>
    );
  }
  return null;
}
