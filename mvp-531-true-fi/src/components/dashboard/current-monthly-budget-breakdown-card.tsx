"use client"
import React from 'react';
import { ChartData } from 'chart.js';
import { DoughnutChartMonthlyBudgetBreakdown } from '../charts/doughnut-chart-monthly-budget-breakdown';

export const CurrentMonthlyBudgetBreakdownCard = () => {

  const chartData: ChartData = {
    labels: ['Essentials', 'Travel & Lifestyle', 'Savings & Investments'],
    datasets: [
      {
        label: 'Current Monthly Budget Breakdown',
        data: [
          3300, 1250, 1500,
        ],
        backgroundColor: [
          '#00BAC7',
          '#FFAC64',
          '#46DC8F',
        ],
        hoverBackgroundColor: [
          '#00BAC7',
          '#FFAC64',
          '#46DC8F',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Current Monthly Budget Breakdown</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex flex-wrap justify-between items-end gap-y-2 gap-x-4">
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$7,500</div>
          </div>
        </div>
      </div>
      <DoughnutChartMonthlyBudgetBreakdown data={chartData} width={389} height={260} />
      <footer className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center">
        <p className="text-muted-foreground">Alert: Exceeded Travel and Lifestyle Budget this month by 11%</p>
      </footer>
    </div>
  );
}