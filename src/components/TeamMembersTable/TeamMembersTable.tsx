import { TeamMembersTableProps } from './types';
import {
  ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/ShadcnTable';

export const TeamMembersTable = ({ members }: TeamMembersTableProps) => {
  return (
    <div className="rounded-lg border  shadow-sm overflow-hidden">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            <TableHead> # </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => {
            return (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell className="capitalize">{member.role}</TableCell>
                <TableCell>{member.created_at}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};
