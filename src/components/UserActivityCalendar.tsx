import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useQuery } from '@tanstack/react-query';
import HeatMap from '@uiw/react-heat-map';
import React from 'react';
import { H2 } from './ui/Typography/H2';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const UserActivityCalendar = () => {
  const user = useLoggedInUser();
  const supabase = supabaseUserClientComponentClient;

  const toLocalDateString = (utcDate: string) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '/');
  };

  const { data: activityData, isLoading, isFetched } = useQuery({
    queryKey: ['userProductActivity'],
    queryFn: async () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);

      const oneYearAgoUTC = new Date(
        oneYearAgo.getTime() + (oneYearAgo.getTimezoneOffset() * 60000)
      ).toISOString();

      const { data, error } = await supabase
        .from('html_templates')
        .select('created_at')
        .eq('user_id', user?.id)
        .gte('created_at', oneYearAgoUTC);

      if (error) throw error;

      const activityMap = data.reduce(
        (acc: { [key: string]: number }, item) => {
          const localDate = toLocalDateString(item.created_at);
          acc[localDate] = (acc[localDate] || 0) + 1;
          return acc;
        },
        {},
      );

      return Object.entries(activityMap).map(([date, count]) => ({
        date,
        count,
      }));
    },
  });

  const isToday = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr.replace(/\//g, '-'));
    date.setHours(0, 0, 0, 0);
    return today.getTime() === date.getTime();
  };

  const formatDate = (date: string) => {
    const d = new Date(date.replace(/\//g, '-'));
    const day = d.getDate();
    const month = d.toLocaleString(undefined, { month: 'short' });

    const suffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${suffix(day)} ${month}`;
  };

  const todayDate = toLocalDateString(new Date().toISOString());
  const todayContributions = activityData?.find(item => item.date === todayDate)?.count;

  console.log('activityData', activityData);
  console.log('todayContributions', todayContributions);

  return (
    <div className="space-y-4">
      <div>
        <H2>Product Launch Calendar</H2>

        {isLoading ? (
          <p className="text-gray-600 mb-2">Loading your activity...</p>
        ) : isFetched && activityData ? (
          <p className="text-gray-600 mb-2">
            {!todayContributions ? (
              <>You've only launched <strong>0</strong> products today. 😢</>
            ) : todayContributions <= 3 ? (
              <>You've launched <strong>{todayContributions}</strong> products today. Not bad! 🙂</>
            ) : (
              <>Great job! You've launched <strong>{todayContributions}</strong> products today! 🎉</>
            )}
          </p>
        ) : (
          <p className="text-gray-600 mb-2">No activity data available</p>
        )}
      </div>
      <TooltipProvider>
        <HeatMap
          value={activityData || []}
          width={700}
          style={
            {
              color: '#000000',
              '--rhm-rect-active': '#000000',
            } as React.CSSProperties
          }
          startDate={(() => {
            const date = new Date();
            date.setMonth(0, 1);
            date.setHours(0, 0, 0, 0);
            return date;
          })()}
          panelColors={{
            0: '#e0f7fa',
            2: '#b2ebf2',
            4: '#80deea',
            10: '#4dd0e1',
            20: '#26c6da',
            30: '#00acc1',
          }}
          legendRender={(props) => (
            <g>
              <rect {...props} y={Number(props.y) + 10} rx={5} />

            </g>
          )}
          rectProps={{
            rx: 5,
          }}
          rectRender={(props, data) => {
            if (!data) return <rect {...props} />;

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <g>
                    <rect {...props} />
                    {isToday(data.date) && (
                      <>
                        <rect
                          {...props}
                          stroke="#000000"
                          strokeWidth="2"
                          fill="none"
                          rx={5}
                        />
                        <rect
                          {...props}
                          className="animate-ping"
                          fill="#000000"
                          opacity="0.1"
                          rx={5}
                        />
                      </>
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {data.count > 0
                      ? `${data.count} generated on ${formatDate(data.date)}${isToday(data.date) ? ' (Today)' : ''}`
                      : `No activity on ${formatDate(data.date)}${isToday(data.date) ? ' (Today)' : ''}`
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }}
        />
      </TooltipProvider>
    </div>
  );
};

export default UserActivityCalendar;
