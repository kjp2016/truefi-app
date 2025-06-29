"use client"
import React from 'react';
import { ChartData } from 'chart.js';
import { LineChartFinancial } from '../charts/line-chart-financial';
import { cn } from '@/lib/utils';

export const FinancialSnapshotCard = ({
  userType
}: {userType: string}) => {

  const chartData: ChartData = {
    labels: [
      '05-01-2024',
      '06-01-2024',
      '07-01-2024',
      '08-01-2024',
      '09-01-2024',
      '10-01-2024',
    ],
    datasets: [
      {
        data: [169031, 174481, 173002, 180594, 179260, 187000],
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
    <div className={cn("flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl", userType === 'user' ? "col-span-full sm:col-span-6" : "col-span-full sm:col-span-6 xl:col-span-4")}>
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Financial Snapshot</h2>
      </header>
      <LineChartFinancial data={chartData} width={595} height={248} />
    </div>
  );
}