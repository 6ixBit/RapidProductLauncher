'use client';
import { Table } from '@/types';
import { useGetProjectById } from '@/utils/react-queries/projects';
import { createContext, useContext } from 'react';

type ProjectContextType = {
  projectId: string;
  projectByIdData: Table<'projects'>;
};

export const ProjectContext = createContext<ProjectContextType>({
  projectId: '',
  projectByIdData: {} as Table<'projects'>,
});

export function useProjectContext() {
  return useContext(ProjectContext);
}

export function ProjectContextProvider({
  projectByIdData: initialProjectByIdData,
  children,
}: {
  children: React.ReactNode;
  projectByIdData: Table<'projects'>;
}) {
  const { data: _projectByIdData } = useGetProjectById(
    initialProjectByIdData.id,
    initialProjectByIdData
  );
  // This is a hack to bypass typescript error
  // as _data will never be undefined since we are passing initial data
  const projectByIdData = _projectByIdData ?? initialProjectByIdData;
  return (
    <ProjectContext.Provider
      value={{ projectByIdData, projectId: projectByIdData.id }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
