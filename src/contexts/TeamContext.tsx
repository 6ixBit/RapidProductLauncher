'use client';
import { createContext, useContext } from 'react';
import { useOrganizationContext } from './OrganizationContext';
import { Enum, Table } from '@/types';
import {
  useGetUserTeamRole,
  useGetTeamById,
} from '@/utils/react-queries/teams';

type TeamContextType = {
  teamId: number;
  canUserManageTeam: boolean;
  teamRole: Enum<'project_team_member_role'> | null;
  teamByIdData: Table<'teams'>;
};
export const TeamContext = createContext<TeamContextType>({
  teamId: -1,
  canUserManageTeam: false,
  teamRole: 'readonly',
  teamByIdData: {} as Table<'teams'>,
});

export function useTeamContext() {
  return useContext(TeamContext);
}

export function TeamContextProvider({
  children,
  teamId,
  teamRole: teamRoleProp,
  teamByIdData: teamByIdDataProp,
}: {
  children: React.ReactNode;
  teamId: number;
  teamRole: Enum<'project_team_member_role'> | null;
  teamByIdData: Table<'teams'>;
}) {
  const { organizationRole } = useOrganizationContext();

  const { data: _teamRoleData } = useGetUserTeamRole(teamId, {
    initialUserTeamRole: teamRoleProp,
  });

  const { data: _teamByIdData } = useGetTeamById(teamId, teamByIdDataProp);

  // These are just workarounds to get around typescript complaining about
  // the data being null. It's not null, but typescript doesn't know that.
  // This is a limitation in react-query.
  const teamRole = _teamRoleData ?? teamRoleProp;
  const teamByIdData = _teamByIdData ?? teamByIdDataProp;

  const canUserManageTeam =
    teamRole === 'admin' ||
    organizationRole === 'admin' ||
    organizationRole === 'owner';

  return (
    <TeamContext.Provider
      value={{ teamId: teamId, teamByIdData, teamRole, canUserManageTeam }}
    >
      {children}
    </TeamContext.Provider>
  );
}
