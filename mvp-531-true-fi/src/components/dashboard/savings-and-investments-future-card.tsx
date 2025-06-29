"use client"
import React from 'react';
import { BarChart } from '../charts/bar-chart';
import { ChartData } from 'chart.js';

export const SavingsAndInvestmentsFutureCard = () => {

  const chartData: ChartData = {
    labels: ['Future Savings & Investments'],
    datasets: [
      {
        label: 'Retirement Fund Contributions (ETFs & Stocks)',
        data: [800],
        backgroundColor: '#00BAC7',
        hoverBackgroundColor: '#00BAC7',
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Emergency Fund Contribution',
        data: [400],
        backgroundColor: '#FFAC64',
        hoverBackgroundColor: '#FFAC64',
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Additional Investments (ETFs or High-Yield Savings)',
        data: [300],
        backgroundColor: '#46DC8F',
        hoverBackgroundColor: '#46DC8F',
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Future Savings & Investments</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$1,500</div>
        </div>
      </div>      
      <div className="grow">
        <BarChart data={chartData} width={595} height={48} />
      </div>
    </div>
  );
}