"use client"
import React from 'react';
import { tailwindConfig } from '@/lib/utils';
import { BarChart } from '../charts/bar-chart';
import { ChartData } from 'chart.js';

export const EssentialsCard = () => {

  const chartData: ChartData = {
    labels: ['Essentials'],
    datasets: [
      {
        label: 'Rent',
        data: [2500],
        backgroundColor: '#00BAC7',
        hoverBackgroundColor: '#00BAC7',
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Utilities',
        data: [150],
        backgroundColor: '#FFAC64',
        hoverBackgroundColor: '#FFAC64',
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Groceries',
        data: [400],
        backgroundColor: '#46DC8F',
        hoverBackgroundColor: '#46DC8F',
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Insurance',
        data: [50],
        backgroundColor: tailwindConfig().theme.colors.violet[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.violet[600],
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Healthcare Costs',
        data: [200],
        backgroundColor: tailwindConfig().theme.colors.gray[300],
        hoverBackgroundColor: tailwindConfig().theme.colors.gray[400],
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Current Essentials</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$3,300</div>
        </div>
      </div>      
      <div className="grow">
        <BarChart data={chartData} width={595} height={48} />
      </div>
    </div>
  );
}