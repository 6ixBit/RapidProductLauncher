import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const graphData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const CustomTooltip: ContentType<ValueType, NameType> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload) {
    return (
      <div className="custom-tooltip px-6 py-2 bg-black border-none focus-none rounded-xl shadow-md">
        <p className="value text-lg text-white font-bold">{`${payload[0].value}`}</p>
        <p className="label text-sm text-slate-300 font-medium mb-1">{`${label}`}</p>
      </div>
    );
  }

  return null;
};

export function OrganizationGraphs() {
  return (
    <div>
      <div>
        <div className="flex space-x-6">
          <div className="flex rounded-xl p-6 border border-slate-300 w-full">
            <div className="flex flex-col justify-between w-full pr-4 h-[320px]">
              <div className="mb-8 space-y-0">
                <h2 className="text-xl font-bold text-slate-900">
                  Performance Analytics
                </h2>
                <p className="text-base text-slate-500">
                  Performance based on User Acquisition
                </p>
              </div>

              <ResponsiveContainer width="100%" height="200%">
                <BarChart
                  width={500}
                  height={300}
                  data={graphData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                  barSize={40}
                >
                  <XAxis
                    dataKey="name"
                    scale="point"
                    padding={{ left: 40, right: 40 }}
                  />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar
                    dataKey="pv"
                    fill="#0D9387"
                    background={{ fill: '#E4E6EA' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex rounded-xl p-6 border border-slate-300 w-full">
            <div className="flex flex-col justify-between w-full pr-4 h-[320px]">
              <div className="mb-8 space-y-0">
                <h2 className="text-xl font-bold text-slate-900">
                  Performance Analytics
                </h2>
                <p className="text-base text-slate-500">
                  Performance based on User Acquisition
                </p>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={graphData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#3B81F5"
                    fill="url(#colorGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B81F5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B81F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
