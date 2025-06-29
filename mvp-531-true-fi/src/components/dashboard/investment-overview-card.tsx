"use client"
import React from 'react';

export const InvestmentOverviewCard = () => {
  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Investment Overview</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex flex-wrap justify-between items-end gap-y-2 gap-x-4">
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$187,000</div>
            <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+2%</div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Invested Amount</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">% of Total Assets</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Trend</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Company Stock</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$92,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">49%</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">4.2%</div>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Cash Savings</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$25,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">13%</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">3%</div>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Stocks and ETFs</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$30,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">16%</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">2.5%</div>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Bonds</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$10,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">5%</div>
                </td>
                <td className="p-2">
                  <div className="text-center">0%</div>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">Roth IRA</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$10,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">5%</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">0.8%</div>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <div className="text-gray-800 dark:text-gray-100">401(k)</div>
                </td>
                <td className="p-2">
                  <div className="text-center">$20,000</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-[#00BAC7]">11%</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">1.5%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}