// FakeData.ts

// Generate a random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Array of month names
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Generate chart data
const chartdata = Array.from({ length: 12 }, (_, index) => ({
  date: months[index],
  SemiAnalysis: getRandomNumber(700, 2500),
  'The Pragmatic Engineer': getRandomNumber(1000, 2400),
  'New Data 1': getRandomNumber(500, 3000),
  'New Data 2': getRandomNumber(800, 900),
}));

// Generate bar list data
const barListData = Array.from({ length: 12 }, (_, index) => ({
  name: months[index],
  value: getRandomNumber(1000, 2400),
  'New Value 1': getRandomNumber(500, 1000),
  'New Value 2': getRandomNumber(3000, 4000),
}));

// Generate mrr data
const fakemrrData = [
  { month: 'Jan', mrr: '100.00' },
  { month: 'Feb', mrr: '150.00' },
  { month: 'Mar', mrr: '200.00' },
  { month: 'Apr', mrr: '350.00' },
  { month: 'May', mrr: '400.00' },
  { month: 'Jun', mrr: '550.00' },
  { month: 'Jul', mrr: '600.00' },
  { month: 'Aug', mrr: '700.00' },
  { month: 'Sep', mrr: '750.00' },
  { month: 'Oct', mrr: '850.00' },
  { month: 'Nov', mrr: '900.00' },
  { month: 'Dec', mrr: '1000.00' },
];

// Generate churn rate data
const fakechurnRateData = Array.from({ length: 12 }, (_, index) => ({
  month: months[index],
  churnRate: getRandomNumber(0, 50).toFixed(2),
}));

// Generate organization count by month data
const fakeorganizationCountByMonth = Array.from({ length: 12 }, (_, index) => ({
  month: months[index],
  number_of_organizations: getRandomNumber(10, 50),
}));

// Generate project count by month data
const fakeprojectCountByMonth = Array.from({ length: 12 }, (_, index) => ({
  month: months[index],
  number_of_projects: getRandomNumber(10, 50),
}));

// Generate user count by month data
const fakeuserCountByMonth = Array.from({ length: 12 }, (_, index) => ({
  month: months[index],
  number_of_users: getRandomNumber(10, 50),
}));

// Get the highest values from the respective fake data arrays
const fakeCurrentMRR = Math.max(
  ...fakemrrData.map((data) => parseFloat(data.mrr))
);
const fakeTotalUserCount = Math.max(
  ...fakeuserCountByMonth.map((data) => data.number_of_users)
);
const fakeTotalOrganizationsCount = Math.max(
  ...fakeorganizationCountByMonth.map((data) => data.number_of_organizations)
);
const fakeTotalProjectsCount = Math.max(
  ...fakeprojectCountByMonth.map((data) => data.number_of_projects)
);
const fakeActiveUsers = Math.max(
  ...fakeuserCountByMonth.map((data) => data.number_of_users)
);
const fakeMaxChurnRate = Math.max(
  ...fakechurnRateData.map((data) => parseFloat(data.churnRate))
);

export {
  chartdata,
  barListData,
  fakemrrData,
  fakechurnRateData,
  fakeorganizationCountByMonth,
  fakeprojectCountByMonth,
  fakeuserCountByMonth,
  fakeCurrentMRR,
  fakeMaxChurnRate,
  fakeTotalUserCount,
  fakeTotalOrganizationsCount,
  fakeTotalProjectsCount,
  fakeActiveUsers,
};
