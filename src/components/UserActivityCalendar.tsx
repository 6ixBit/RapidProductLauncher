import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useQuery } from '@tanstack/react-query';
import HeatMap from '@uiw/react-heat-map';
import React from 'react';
import { H2 } from './ui/Typography/H2';

const UserActivityCalendar = () => {
  const supabase = supabaseUserClientComponentClient;

  const { data: activityData } = useQuery({
    queryKey: ['userProductActivity'],
    queryFn: async () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabase
        .from('html_templates')
        .select('created_at')
        .gte('created_at', oneYearAgo.toISOString());

      if (error) throw error;

      // Group by date and count occurrences
      const activityMap = data.reduce(
        (acc: { [key: string]: number }, item) => {
          const date = new Date(item.created_at)
            .toISOString()
            .split('T')[0]
            .replace(/-/g, '/');
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        },
        {},
      );

      // Convert to required format
      return Object.entries(activityMap).map(([date, count]) => ({
        date,
        count,
      }));
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <H2>Product Launch Calendar</H2>
        <p className="text-gray-600 mb-2">
          Each lit-up square represents a day you leaped your competition.{' '}
        </p>
      </div>
      <HeatMap
        value={activityData || []}
        width={700}
        style={
          {
            color: '#000000',
            '--rhm-rect-active': '#000000',
          } as React.CSSProperties
        }
        startDate={new Date(new Date().getFullYear(), 0, 1)}
        panelColors={{
          0: '#e0f7fa',
          2: '#b2ebf2',
          4: '#80deea',
          10: '#4dd0e1',
          20: '#26c6da',
          30: '#00acc1',
        }}
        legendRender={(props) => (
          <rect {...props} y={Number(props.y) + 10} rx={5} />
        )}
        rectProps={{
          rx: 5,
        }}
      />
    </div>
  );
};

export default UserActivityCalendar;
