"use client"
import React from 'react';
import { ChartData } from 'chart.js';
import { LineChartHomePurchase } from '../charts/line-chart-home-purchase';

export const HomePurchaseCard = () => {

  const chartData: ChartData = {
    labels: [
      '07-01-2023',
      '03-01-2024',
      '10-01-2024'
    ],
    datasets: [
      {
        data: [95000, 102000, 109000],
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
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Home Purchase</h2>
      </header>
      <LineChartHomePurchase data={chartData} width={595} height={248} />
      <footer className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center">
        <p className="text-muted-foreground">100% - Goal met with successful purchase.</p>
      </footer>
    </div>
  );
}