import HeatMap from '@uiw/react-heat-map';
import React from 'react';
import { H2 } from './ui/Typography/H2';

const value = [
    { date: '2024/01/11', count: 2 },
    { date: '2024/04/12', count: 2 },
    { date: '2024/05/01', count: 5 },
    { date: '2024/05/02', count: 5 },
    { date: '2024/05/03', count: 1 },
    { date: '2024/05/04', count: 11 },
    { date: '2024/05/08', count: 32 },
];
const UserActivityCalendar = () => {
    return (
        <div className="space-y-4">
            <div>
                <H2>Product Launch Calendar</H2>
                <p className="text-gray-600 mb-2">Each lit-up square represents a day you embarassed your competition. </p>
            </div>
            <HeatMap
                value={value}
                width="100%"
                style={{ color: '#000000', '--rhm-rect-active': '#000000' } as React.CSSProperties}
                startDate={new Date(new Date().getFullYear(), 0, 1)}
                legendCellSize={0}
                panelColors={{
                    0: '#e0f7fa',  // Lightest blue
                    2: '#b2ebf2',
                    4: '#80deea',
                    10: '#4dd0e1',
                    20: '#26c6da',
                    30: '#00acc1',  // Darkest blue
                }}
            />
        </div>
    )
};

export default UserActivityCalendar;
