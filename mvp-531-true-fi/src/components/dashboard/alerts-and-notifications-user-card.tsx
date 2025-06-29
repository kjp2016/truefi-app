"use client"
import React from 'react';

export const AlertsAndNotificationsUserCard = () => {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Alerts & Notifications</h2>
      </header>
      <div className="p-3">
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Monthly Spending Alert</header>
          <ul className="my-1">
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Food & Dining Alert:</h5>
                    <p className="font-medium text-muted-foreground">Spending increased due to Cabo trip; current budget unaffected.</p>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Savings Reminder:</h5>
                    <p className="font-medium text-muted-foreground">You’re on track to meet the quarterly savings goal!</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Budget Update Suggestions</header>
          <ul className="my-1">
          <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Expense Adjustments:</h5>
                    <p className="font-medium text-muted-foreground">Suggests $100 monthly savings on dining out to redirect to long-term savings.</p>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100">Goal Adjustment Option:</h5>
                    <p className="font-medium text-muted-foreground">Optional suggestions for maintaining lifestyle without goal impact.</p>
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