import { Tab } from './Tab';
import { TabsNavigationProps } from './types';

export const TabsNavigation = ({ tabs }: TabsNavigationProps) => {
  return (
    <div className="border-b border-gray-50 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-5 min-w-max pb-2">
        {tabs.map((tab) => {
          return <Tab key={tab.href} {...tab} />;
        })}
      </div>
    </div>
  );
};
