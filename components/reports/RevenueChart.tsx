import React, { useEffect, useRef } from 'react';
import { RevenueReport } from '../../types';
// FIX: Added 'Chart' to the import list to resolve a type error.
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface RevenueChartProps {
    data: RevenueReport[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const renderChart = () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const labels = data.map(d => d.month);
            const revenueData = data.map(d => d.revenue);

            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? '#334155' : '#E2E8F0'; // neutral-700 and neutral-200
            const textColor = isDarkMode ? '#E2E8F0' : '#334155'; // neutral-200 and neutral-700
            
            const primary600_bg = 'rgba(72, 101, 129, 0.6)';
            const primary600 = 'rgba(72, 101, 129, 1)';
            const primary500_bg = 'rgba(98, 125, 152, 0.6)';
            const primary500 = 'rgba(98, 125, 152, 1)';
            
            const chartBgColor = isDarkMode ? primary500_bg : primary600_bg;
            const chartBorderColor = isDarkMode ? primary500 : primary600;

            const config: ChartConfiguration = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Monthly Revenue',
                        data: revenueData,
                        backgroundColor: chartBgColor,
                        borderColor: chartBorderColor,
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => `$${Number(value) / 1000}k`,
                                color: textColor,
                            },
                            grid: {
                                color: gridColor,
                            }
                        },
                        x: {
                            ticks: {
                                color: textColor,
                            },
                             grid: {
                                display: false,
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                             callbacks: {
                                label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toLocaleString()}`
                            }
                        }
                    }
                }
            };
            
            chartInstanceRef.current = new Chart(ctx, config);
        };

        renderChart();

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    renderChart();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => {
            observer.disconnect();
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return <div style={{ height: '300px' }}><canvas ref={chartRef} /></div>;
};

export default RevenueChart;