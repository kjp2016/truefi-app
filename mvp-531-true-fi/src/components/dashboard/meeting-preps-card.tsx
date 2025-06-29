"use client";
import React from "react";

export const MeetingPrepsCard = () => {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Meeting Preps
        </h2>
      </header>
      <div className="p-3">
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            Next Meeting Agenda
          </header>
          <ul className="my-1">
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <p className="font-medium text-muted-foreground">
                      Review Alex’s potential home purchase change and assess
                      impact on cash flow.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <p className="font-medium text-muted-foreground">
                      Discuss potential adjustments to the retirement plan to
                      fully meet the $2 million goal.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex px-2">
              <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <p className="font-medium text-muted-foreground">
                      Explore discretionary budget adjustments post-home
                      purchase
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
