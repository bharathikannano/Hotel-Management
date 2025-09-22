import React, { useState, useMemo } from 'react';
import { ActivityLog } from '../types';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { CheckInIcon, CheckOutIcon, ReservationIcon, GuestIcon } from '../components/icons';

interface ActivityLogPageProps {
    activityLog: ActivityLog[];
}

const iconMap: { [key in ActivityLog['type']]: React.FC<{className?: string}> } = {
  'Check-In': CheckInIcon,
  'Check-Out': CheckOutIcon,
  'New Reservation': ReservationIcon,
  'New Guest': GuestIcon,
};

const ActivityLogPage: React.FC<ActivityLogPageProps> = ({ activityLog }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredLogs = useMemo(() => {
        return activityLog
            .filter(log => log.timestamp.startsWith(selectedDate))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [activityLog, selectedDate]);
    
    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Activity Log</h1>
                 <div className="w-full sm:w-auto">
                    <Input
                        label="Select a date"
                        id="date-filter"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                 </div>
            </div>
           
            <Card>
                <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4 border-b dark:border-neutral-700 pb-2">
                    Logs for {formattedDate}
                </h2>
                <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map(item => {
                            const Icon = iconMap[item.type];
                            const logTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <li key={item.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
                                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-800/50 p-3 rounded-full">
                                        <Icon className="text-2xl text-primary-600 dark:text-primary-300" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.type}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.description}</p>
                                    </div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 text-right">
                                        {logTime}
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p className="text-center text-neutral-500 dark:text-neutral-400 py-12">
                            No activity recorded on this day.
                        </p>
                    )}
                </ul>
            </Card>
        </div>
    );
};

export default ActivityLogPage;