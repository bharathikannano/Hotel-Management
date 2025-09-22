import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { CheckInIcon, CheckOutIcon, ReservationIcon, GuestIcon } from '../icons';

const iconMap = {
  'Check-In': CheckInIcon,
  'Check-Out': CheckOutIcon,
  'New Reservation': ReservationIcon,
  'New Guest': GuestIcon,
};

const ActivityLogCard = ({ log, onNavigate }) => {

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const recentLog = log
    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5); // Show only the 5 most recent items on the dashboard

  return (
    <Card 
        title="Recent Activity" 
        className="h-full"
        actions={
            <Button variant="secondary" onClick={() => onNavigate('ActivityLog')} className="!py-1 !px-3 !text-xs">
                View Full Log
            </Button>
        }
    >
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {recentLog.length > 0 ? recentLog.map(item => {
            const Icon = iconMap[item.type];
            return (
                <li key={item.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-800/50 p-2 rounded-full">
                        <Icon className="text-xl text-primary-600 dark:text-primary-300" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.description}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                </li>
            );
        }) : <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">No recent activity.</p>}
      </ul>
    </Card>
  );
};

export default ActivityLogCard;
