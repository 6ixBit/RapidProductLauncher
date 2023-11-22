import { Enum } from '@/types';

export function formatOrganizationRole(
  organizationRole: Enum<'organization_member_role'>,
) {
  switch (organizationRole) {
    case 'admin':
      return 'Admin';
    case 'member':
      return 'Member';
    case 'owner':
      return 'Owner';
    case 'readonly':
      return 'Read Only Member';
    default:
      throw new Error(`Unknown organization role: ${organizationRole}`);
  }
}

export function formatTeamRole(teamRole: Enum<'project_team_member_role'>) {
  switch (teamRole) {
    case 'admin':
      return 'Admin';
    case 'member':
      return 'Member';
    case 'readonly':
      return 'Read Only Member';
    default:
      throw new Error(`Unknown team role: ${teamRole}`);
  }
}
