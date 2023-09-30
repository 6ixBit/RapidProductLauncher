import { GraphContainer } from '@/components/presentational/tailwind/GraphContainer';
import { T } from '@/components/ui/Typography';
import {
  Card,
  Title,
  AreaChart,
  BarChart,
  BarList,
  LineChart,
  DonutChart,
  Bold,
  Flex,
  Text,
} from '@tremor/react';
import { chartdata, barListData } from '@/utils/FakeData';

const dataFormatter = (number: number) => {
  return '$ ' + Intl.NumberFormat('us').format(number).toString();
};

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export function OrganizationGraphs() {
  return (
    <>
      <div className="h-2 mt-10">
        <T.H3 className="leading-none">Overview</T.H3>
      </div>
      <div className="w-full grid grid-cols-2 grid-flow-row auto-rows-max mt-10 gap-10">
        <GraphContainer
          title="Monthly Churn Rate"
          subTitle="Monthly churn rate vs Organization Count"
        >
          <AreaChart
            className="h-72 mt-8"
            data={chartdata}
            index="date"
            categories={[
              'SemiAnalysis',
              'The Pragmatic Engineer',
              'New Data 1',
              'New Data 2',
            ]}
            colors={['cyan', 'orange', 'red', 'blue']}
            valueFormatter={dataFormatter}
          />
        </GraphContainer>

        <GraphContainer
          title="Organizations by Month"
          subTitle="Number of organizations"
        >
          <BarChart
            className="mt-6"
            data={chartdata}
            index="date"
            categories={['SemiAnalysis', 'The Pragmatic Engineer']}
            colors={['teal', 'blue']}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
          />
        </GraphContainer>
        <GraphContainer
          title="MRR Analytics"
          subTitle="Monthly recurring revenue"
        >
          <DonutChart
            className="mt-12"
            data={chartdata}
            index="date"
            category="SemiAnalysis"
            colors={[
              'blue',
              'violet',
              'indigo',
              'rose',
              'cyan',
              'amber',
              'green',
              'orange',
              'pink',
              'red',
              'yellow',
              'lime',
              'emerald',
              'teal',
              'sky',
              'fuchsia',
              'purple',
              'gray',
            ]}
            valueFormatter={valueFormatter}
          />
        </GraphContainer>
        <GraphContainer title="Projects by Month" subTitle="Number of projects">
          <LineChart
            className="h-72 mt-4"
            data={chartdata}
            index="date"
            categories={['SemiAnalysis', 'The Pragmatic Engineer']}
            colors={['cyan', 'orange']}
          />
        </GraphContainer>
        <GraphContainer title="Users by Month" subTitle="Number of user">
          <BarList data={barListData} className="mt-2" />
        </GraphContainer>
        <GraphContainer
          title="Visitor Rate"
          subTitle="Number of visitors vs Organization Count"
        >
          <AreaChart
            className="h-72 mt-12"
            data={chartdata}
            index="date"
            categories={['SemiAnalysis', 'The Pragmatic Engineer']}
            colors={['cyan', 'orange']}
            valueFormatter={dataFormatter}
          />
        </GraphContainer>
      </div>
    </>
  );
}
