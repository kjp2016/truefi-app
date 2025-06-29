"use client"
import React from 'react';

export const AlertsAndNotificationsAdvisorCard = () => {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Alerts & Notifications</h2>
      </header>
      <div className="p-3">
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Financial Plan Change Alert</header>
          <ul className="my-1">
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Potential Plan Adjustment:</h5>
                    <p className="font-medium text-muted-foreground">Alex is considering purchasing a home valued at $545,000 instead of $500,000 and aims to buy sooner than originally planned. Review cash flow impact and potential adjustments to savings or investment allocations.</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Monthly Spending Alert</header>
          <ul className="my-1">
          <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Dining & Travel:</h5>
                    <p className="font-medium text-muted-foreground">Increased spending due to recent Cabo trip, though overall budget remains unaffected.</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Quarterly Savings Goal Reminder</header>
          <ul className="my-1">
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Status:</h5>
                    <p className="font-medium text-muted-foreground">On track to meet the quarterly savings target.</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Budget Optimization Suggestions</header>
          <ul className="my-1">
          <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Dining Out:</h5>
                    <p className="font-medium text-muted-foreground">Recommends saving $100/month on dining out to enhance long-term savings contributions.</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}