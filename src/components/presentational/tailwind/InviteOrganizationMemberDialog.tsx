import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Enum } from '@/types';
import { OrganizationMemberRoleSelect } from './OrganizationMemberRoleSelect';

type Props = {
  onInvite: (email: string, role: Enum<'organization_member_role'>) => void;
  isLoading: boolean;
};

export const InviteOrganizationMemberDialog = ({
  onInvite,
  isLoading,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Enum<'organization_member_role'>>('member');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite user </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onInvite(email, role);
            setEmail('');
            setOpen(false);
          }}
        >
          <div className="space-y-2">
            <DialogDescription>
              Invite a user to your organization.
            </DialogDescription>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              disabled={isLoading}
            />
            <OrganizationMemberRoleSelect
              value={role}
              onChange={(newRole) => setRole(newRole)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" variant="success" disabled={isLoading}>
              {isLoading ? 'Inviting User' : 'Invite'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
