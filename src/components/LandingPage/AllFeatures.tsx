import { T } from '@/components/ui/Typography';
import {
  Book,
  Building,
  CircleDollarSign,
  Clock3,
  File,
  FileText,
  Folder,
  HeartHandshake,
  Layers,
  LineChart,
  ShieldCheck,
  SmartphoneNfc,
  Store,
  TrafficCone,
  Undo2,
  UserRound,
} from 'lucide-react';

const features = [
  {
    name: 'Lorem Ipsum Dolor',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: <File className="group-hover:-8" />,
  },
  {
    name: 'Sit Amet Consectetur',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    icon: <Folder className="group-hover:-8" />,
  },
  {
    name: 'Adipiscing Elit Sed',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    icon: <Layers className="group-hover:-8" />,
  },
  {
    name: 'Eiusmod Tempor Incididunt',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    icon: <Book className="group-hover:-8" />,
  },
  {
    name: 'Ut Labore et Dolore',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: <TrafficCone className="group-hover:-8" />,
  },
  {
    name: 'Magna Aliqua Ut',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    icon: <FileText className="group-hover:-8" />,
  },
  {
    name: 'Enim Ad Minim',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    icon: <File className="group-hover:-8" />,
  },
  {
    name: 'Veniam Quis Nostrud',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    icon: <Clock3 className="group-hover:-8" />,
  },
  {
    name: 'Exercitation Ullamco',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: <CircleDollarSign className="group-hover:-8" />,
  },
  {
    name: 'Laboris Nisi Ut',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    icon: <SmartphoneNfc className="group-hover:-8" />,
  },
  {
    name: 'Aliquip Ex Ea',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    icon: <UserRound className="group-hover:-8" />,
  },
  {
    name: 'Commodo Consequat',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    icon: <ShieldCheck className="group-hover:-8" />,
  },
  {
    name: 'Duis Aute Irure',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: <Undo2 className="group-hover:-8" />,
  },
  {
    name: 'Dolor in Reprehenderit',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    icon: <Store className="group-hover:-8" />,
  },
  {
    name: 'In Voluptate Velit',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    icon: <Building className="group-hover:-8" />,
  },
  {
    name: 'Esse Cillum Dolore',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    icon: <HeartHandshake className="group-hover:-8" />,
  },
  {
    name: 'Eu Fugiat Nulla',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: <LineChart className="group-hover:-8" />,
  },
];

const AllFeatures = () => {
  return (
    <section>
      <div className="py-8 px-4 mx-auto md:container sm:pb-24 md:px-6 lg:px-6">
        <div className="mb-8 lg:mb-16 max-w-3xl mx-auto  w-full">
          <div className=" flex items-center justify-start md:justify-center w-full">
            <div className="mb-4 border border-border bg-muted rounded-lg shadow-sm px-2 py-[2px]">
              <T.Small className="text-muted-foregrouund">
                Features
              </T.Small>
            </div>
          </div>
          <h2 className="mb-5 text-4xl leading-[44px] md:text-center font-semibold text-foreground">
            Lorem ipsum dolor sit amet
          </h2>
          <p className="text-muted-foreground sm:text-xl sm:leading-[30px] md:text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {features.map((feature) => {
            return (
              <div key={feature.name} className="group">
                <div className="flex items-center justify-center border border-border bg-secondary/50 group-hover:bg-secondary group-hover:shadow-xl w-12 h-12 rounded-lg">
                  {feature.icon}
                </div>
                <T.H3 className="mb-2 mt-5 tracking-normal text-xl leading-[30px] font-bold text-foreground">
                  {feature.name}
                </T.H3>
                <T.P className="font-normal text-muted-foreground">
                  {feature.description}
                </T.P>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllFeatures;
