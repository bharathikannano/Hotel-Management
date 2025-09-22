import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const OccupancyChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const renderChart = () => {
            // Destroy previous chart instance if it exists to prevent memory leaks
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const occupancyData = data.map(d => d.occupancyRate);
            
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? '#334155' : '#E2E8F0'; // neutral-700 and neutral-200
            const textColor = isDarkMode ? '#E2E8F0' : '#334155'; // neutral-200 and neutral-700
            const primary500 = 'rgba(98, 125, 152, 1)';
            const primary400 = 'rgba(130, 154, 177, 1)';
            
            const chartColor = isDarkMode ? primary400 : primary500;
            const chartBgColor = isDarkMode ? 'rgba(130, 154, 177, 0.2)' : 'rgba(98, 125, 152, 0.2)';


            const config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Occupancy Rate (%)',
                        data: occupancyData,
                        fill: true,
                        backgroundColor: chartBgColor,
                        borderColor: chartColor,
                        tension: 0.3,
                        pointBackgroundColor: chartColor,
                        pointBorderColor: isDarkMode ? '#1E293B' : '#fff' // neutral-800
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => `${value}%`,
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
                                label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                            }
                        }
                    }
                }
            };

            chartInstanceRef.current = new Chart(ctx, config);
        };

        renderChart(); // Initial render

        // Watch for theme changes to re-render the chart
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    renderChart();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        // Cleanup function
        return () => {
            observer.disconnect();
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]); // Re-run effect if data changes


    return <div style={{ height: '300px' }}><canvas ref={chartRef} /></div>;
};

export default OccupancyChart;
