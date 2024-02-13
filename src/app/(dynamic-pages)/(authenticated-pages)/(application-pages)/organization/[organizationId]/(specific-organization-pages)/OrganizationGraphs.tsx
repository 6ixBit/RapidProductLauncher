'use client';

import { GraphContainer } from '@/components/GraphContainer';
import { customTooltip } from '@/components/GraphCustomToolTip';
import { PageHeading } from '@/components/PageHeading';
import { AreaChart } from '@tremor/react';

const chartDataForMonth = [
  {
    Month: 'January',
    'Time Spent': 2890,
  },
  {
    Month: 'February',
    'Time Spent': 2756,
  },
  {
    Month: 'March',
    'Time Spent': 3322,
  },
  {
    Month: 'April',
    'Time Spent': 3470,
  },
  {
    Month: 'May',
    'Time Spent': 3475,
  },
  {
    Month: 'June',
    'Time Spent': 3129,
  },
  {
    Month: 'July',
    'Time Spent': 3482,
  },
  {
    Month: 'August',
    'Time Spent': 2412,
  },
  {
    Month: 'September',
    'Time Spent': 2678,
  },
  {
    Month: 'October',
    'Time Spent': 2190,
  },
  {
    Month: 'November',
    'Time Spent': 2498,
  },
  {
    Month: 'December',
    'Time Spent': 2598,
  },
];

const chartDataForWeek = [
  {
    week: 1,
    'Time Spent': 2890,
  },
  {
    week: 2,
    'Time Spent': 2756,
  },
  {
    week: 3,
    'Time Spent': 3322,
  },
  {
    week: 4,
    'Time Spent': 3470,
  },
];

const chartDataForYears = [
  {
    year: 2018,
    'Time Spent': 2890,
  },
  {
    year: 2019,
    'Time Spent': 2756,
  },
  {
    year: 2020,
    'Time Spent': 3322,
  },
  {
    year: 2021,
    'Time Spent': 4302,
  },
];

const calculateBadgeValue = (data) => {
  const lastMonth = data[data.length - 1]['Time Spent'];
  const secondLastMonth = data[data.length - 2]['Time Spent'];
  const percentageChange =
    ((lastMonth - secondLastMonth) / secondLastMonth) * 100;
  return {
    badgeValue: percentageChange.toFixed(2) + '%',
  };
};

const { badgeValue: badgeValueForMonth } =
  calculateBadgeValue(chartDataForMonth);

const { badgeValue: badgeValueforWeek } = calculateBadgeValue(chartDataForWeek);
const { badgeValue: badgeValueForYear } =
  calculateBadgeValue(chartDataForYears);

// const barListData = [
//   {
//     name: 'Jan 22',
//     value: 2890,
//   },
//   {
//     name: 'Feb 22',
//     value: 2756,
//   },
//   {
//     name: 'Mar 22',
//     value: 3322,
//   },
//   {
//     name: 'Apr 22',
//     value: 3470,
//   },
//   {
//     name: 'May 22',
//     value: 3475,
//   },
//   {
//     name: 'Jun 22',
//     value: 3129,
//   },
//   {
//     name: 'July 22',
//     value: 3482,
//   },
//   {
//     name: 'Aug 22',
//     value: 2412,
//   },
//   {
//     name: 'Sep 22',
//     value: 2678,
//   },
// ];

const dataFormatter = (number: number) => {
  return '$ ' + Intl.NumberFormat('us').format(number).toString();
};

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export function OrganizationGraphs() {
  return (
    <>
      <div className="mt-10 pb-16 flex flex-col gap-6">
        <PageHeading
          title="Overview"
          titleClassName="text-2xl leading-none"
          subTitle="Nextbase uses Tremor charts for graphs, to visualize and interpret performance data."
          subTitleClassName="leading-6 mb-0"
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row auto-rows-max gap-6">
          <GraphContainer
            title="Stock Price"
            subTitle="Detailed analysis of stock price for the week"
            badgeValue={badgeValueforWeek}
          >
            <AreaChart
              className="h-72 mt-8"
              data={chartDataForWeek}
              index="date"
              categories={['Time Spent']}
              colors={['blue-700']}
              curveType="natural"
              customTooltip={customTooltip}
              showAnimation={true}
              showGridLines={false}
              showXAxis={false}
              showYAxis={false}
            />
          </GraphContainer>
          <GraphContainer
            title="Time spent per month"
            subTitle="Detailed analysis on time spent  in a month "
            badgeValue={badgeValueForMonth}
          >
            <AreaChart
              className="h-72 mt-8"
              data={chartDataForMonth}
              index="date"
              categories={['Time Spent']}
              colors={['blue-700']}
              curveType="natural"
              customTooltip={customTooltip}
              showAnimation={true}
              showGridLines={false}
              showXAxis={false}
              showYAxis={false}
            />
          </GraphContainer>

          <GraphContainer
            title="Revenue per year"
            subTitle="Detailed analysis on revenue per year"
            badgeValue={badgeValueForYear}
          >
            <AreaChart
              className="h-72 mt-8"
              data={chartDataForYears}
              index="date"
              categories={['Time Spent']}
              colors={['blue-700']}
              curveType="natural"
              customTooltip={customTooltip}
              showAnimation={true}
              showGridLines={false}
              showXAxis={false}
              showYAxis={false}
            />
          </GraphContainer>
          {/* <GraphContainer
            title="Time spent all time"
            subTitle="Monthly recurring revenue"
          >
            <DonutChart
              className="h-72 mt-8"
              variant="donut"
              data={chartdata}
              index="date"
              category="Time Spent"
              showAnimation={true}
              colors={[
                'blue-900',
                'blue-800',
                'blue-700',
                'blue-600',
                'blue-500',
                'blue-400',
                'blue-300',
                'blue-200',
                'blue-100',
              ]}
              valueFormatter={valueFormatter}
              customTooltip={customTooltip}
            />
          </GraphContainer> */}
          {/* <GraphContainer
            title="Projects by Month"
            subTitle="Number of projects"
          >
            <AreaChart
              className="h-72 mt-8"
              data={chartdata}
              index="date"
              categories={['Time Spent', 'Month']}
              colors={['blue-700', 'slate-400']}
              curveType="natural"
              customTooltip={customTooltip}
              showAnimation={true}
              showGridLines={false}
              showXAxis={false}
              showYAxis={false}
            />
          </GraphContainer>
         <GraphContainer title="Users by Month" subTitle="Number of user">
            <BarList
              data={barListData}
              className="mt-2"
              showAnimation={true}
              color="blue-600"
            />
          </GraphContainer>
         <GraphContainer
            title="Visitor Rate"
            subTitle="Number of visitors vs Organization Count"
          >
            <AreaChart
              showGradient={true}
              className="h-64 mt-12"
              data={chartdata}
              index="date"
              categories={['Time Spent', 'Month']}
              colors={['blue-700', 'slate-400']}
              curveType="natural"
              showAnimation={true}
              showXAxis={false}
              showGridLines={false}
              showYAxis={false}
              customTooltip={customTooltip}
            />
          </GraphContainer> */}
        </div>
      </div>
    </>
  );
}
