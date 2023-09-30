import { ReactNode } from 'react';
import { SpecificOrganizationClientLayout } from './SpecificOrganizationClientLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SpecificOrganizationClientLayout>
      {children}
    </SpecificOrganizationClientLayout>
  );
}
