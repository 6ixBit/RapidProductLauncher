import { T } from '@/components/ui/Typography';
import { withBaseDescription, withBaseTitle } from '@/utils/seo';

export const metadata = {
  title: withBaseTitle('Organization'),
  description: withBaseDescription('organization page of Nextbase Essentail version'),
}

export default async function OrganizationPage() {
  return (
    <div className="space-y-4">
      <T.P>Build something nice here</T.P>
    </div>
  );
}
