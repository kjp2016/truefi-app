"use client"
import React from 'react';
import { ChartData } from 'chart.js';
import { LineChartRetirement } from '../charts/line-chart-retirement';
import { cn } from '@/lib/utils';

export const RetirementCard = ({
  userType
}: {userType: string}) => {

  const chartData: ChartData = {
    labels: [
      '20',
      '25',
      '30',
      '40',
      '45',
      '50',
      '55',
      '60'
    ],
    datasets: [
      {
        label: 'Currently Saved',
        data: [0, 106000, 250424, NaN, NaN, NaN, NaN, NaN],
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
      {
        label: 'Future Projected Savings',
        data: [NaN, NaN, 250425, 400240, 554325, 795000, 1250000, 2000000],
        borderColor: '#00BAC7',
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: '#00BAC7',
        pointHoverBackgroundColor: '#00BAC7',
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      }
    ],
  };

  return (
    <div className={cn("flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl", userType === 'user' ? "col-span-full" : "col-span-full sm:col-span-6 xl:col-span-4")}>
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Retirement</h2>
      </header>
      <LineChartRetirement data={chartData} width={595} height={248} />
      <footer className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center">
        <p className="text-muted-foreground">Current contributions, along with adjusted investment strategies, are projected to reach approximately 75% of the target. Additional monthly contributions or portfolio adjustments may be needed to fully meet the $2 million goal by age 60, assuming an average annual return of 5-7%.</p>
      </footer>
    </div>
  );
}