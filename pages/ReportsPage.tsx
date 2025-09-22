

import React from 'react';
import Table, { Column } from '../components/common/Table';
import Button from '../components/common/Button';
import { OccupancyReport, RevenueReport } from '../types';
import { mockOccupancy, mockRevenue } from '../data';
import OccupancyChart from '../components/reports/OccupancyChart';
import RevenueChart from '../components/reports/RevenueChart';
import Card from '../components/common/Card';

const ReportsPage: React.FC = () => {
  const occupancyColumns: Column<OccupancyReport & { id: string }>[] = [
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Occupied Rooms', accessor: 'occupiedRooms', sortable: true },
    { header: 'Available Rooms', accessor: 'availableRooms', sortable: true },
    { header: 'Occupancy Rate', accessor: (item) => `${item.occupancyRate.toFixed(1)}%`, sortable: true },
  ];

  const revenueColumns: Column<RevenueReport & { id: string }>[] = [
    { header: 'Month', accessor: 'month', sortable: true },
    { header: 'Revenue', accessor: (item) => `$${item.revenue.toLocaleString()}`, sortable: true },
    { header: 'ADR', accessor: (item) => `$${item.adr.toFixed(2)}`, sortable: true },
  ];
  
  const handleDownloadCSV = (data: any[], filename: string) => {
      if (data.length === 0) return;
      const headers = Object.keys(data[0]);
      const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(','), ...data.map(row => headers.map(header => row[header]).join(','))].join('\n');
      
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="space-y-8">
       <Card title="Occupancy Report">
        <div className="mb-6">
          <OccupancyChart data={mockOccupancy} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Detailed Data</h3>
          <Button variant="secondary" onClick={() => handleDownloadCSV(mockOccupancy, 'occupancy_report')}>Download CSV</Button>
        </div>
        <Table columns={occupancyColumns} data={mockOccupancy.map(o => ({ ...o, id: o.date }))} />
      </Card>

      <Card title="Revenue Report">
        <div className="mb-6">
            <RevenueChart data={mockRevenue} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Detailed Data</h3>
           <Button variant="secondary" onClick={() => handleDownloadCSV(mockRevenue, 'revenue_report')}>Download CSV</Button>
        </div>
        <Table columns={revenueColumns} data={mockRevenue.map(r => ({ ...r, id: r.month }))} />
      </Card>
    </div>
  );
};

export default ReportsPage;