import { TeamInvitationsTableProps } from './types';
import {
  ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/ShadcnTable';

export const TeamInvitationsTable = ({
  invitations,
}: TeamInvitationsTableProps) => {
  return (
    <div className="rounded-lg border  shadow-sm overflow-hidden">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            <TableHead scope="col"> # </TableHead>
            <TableHead scope="col">Email</TableHead>

            <TableHead scope="col">Sent On</TableHead>
            <TableHead scope="col">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation, index) => {
            return (
              <TableRow key={invitation.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{invitation.email}</TableCell>

                <TableCell>{invitation.created_at}</TableCell>
                <TableCell className="uppercase">
                  <span>
                    {invitation.status === 'active'
                      ? 'pending'
                      : invitation.status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};
