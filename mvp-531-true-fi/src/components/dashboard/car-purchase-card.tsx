"use client"
import React from 'react';
import { ChartData } from 'chart.js';
import { LineChartCarPurchase } from '../charts/line-chart-car-purchase';

export const CarPurchaseCard = () => {

  const chartData: ChartData = {
    labels: [
      '09-01-2023',
      '10-01-2023',
      '11-01-2023',
      '12-01-2023',
      '01-01-2024',
      '02-01-2024',
      '03-01-2024',
      '04-01-2024',
      '05-01-2024',
      '06-01-2024',
      '07-01-2024',
      '08-01-2024',
      '09-01-2024',
      '10-01-2024',
      '11-01-2024',
      '12-01-2024',
      '01-01-2025',
      '02-01-2025',
      '03-01-2025',
      '04-01-2025',
      '05-01-2025',
      '06-01-2025',
      '07-01-2025',
      '08-01-2025',
      '09-01-2025'
    ],
    datasets: [
      {
        data: [0, 1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500, 15000, 16500],
        borderColor: '#46DC8F',
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: '#46DC8F',
        pointHoverBackgroundColor: '#46DC8F',
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Car Purchase</h2>
      </header>
      <LineChartCarPurchase data={chartData} width={595} height={248} />
      <footer className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center">
        <p className="text-muted-foreground">55% toward goal, with estimated completion in 11 months (due to increased savings from budget adjustments).</p>
      </footer>
    </div>
  );
}