import { T } from '@/components/ui/Typography';
import { withBaseDescription, withBaseTitle } from '@/utils/seo';
import LayersIcon from 'lucide-react/dist/esm/icons/layers';

export const metadata = {
  title: withBaseTitle('Organization'),
  description: withBaseDescription(
    'Organization page of Nextbase Essential version',
  ),
};

export default async function OrganizationPage() {
  return (
    <div
      className="border dotted-bg dark:dotted-bg-dark p-10 border-gray-400/50 dark:border-gray-600/50 rounded-xl bg-gray-200/20 dark:bg-slate-950/40 h-[400px] flex justify-center items-center"
      style={{}}
    >
      <div className="bg-white dark:bg-slate-900 items-center px-4 pl-2 flex space-x-3 py-2 shadow-sm border border-gray-300 dark:border-gray-600/50 rounded-xl">
        <div className="p-3 w-fit bg-gray-200/50 dark:bg-slate-700/40 rounded-lg">
          <LayersIcon className=" w-6 h-6" />
        </div>
        <div className="flex flex-col justify-center space-y-1.5">
          <T.Small className=" leading-none m-0">
            Build something cool here!
          </T.Small>
          <T.Small className="text-muted-foreground leading-none m-0">
            Your business logic goes here.
          </T.Small>
        </div>
      </div>
    </div>
  );
}
