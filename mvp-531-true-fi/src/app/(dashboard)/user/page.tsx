import { AlertsAndNotificationsUserCard } from "@/components/dashboard/alerts-and-notifications-user-card";
import { CarPurchaseCard } from "@/components/dashboard/car-purchase-card";
import { CurrentMonthlyBudgetBreakdownCard } from "@/components/dashboard/current-monthly-budget-breakdown-card";
import { DiscretionaryExpensesCard } from "@/components/dashboard/discretionary-expenses-card";
import { EssentialsCard } from "@/components/dashboard/essentials-card";
import { FinancialSnapshotCard } from "@/components/dashboard/financial-snapshot-card";
import { FixedExpensesCard } from "@/components/dashboard/fixed-expenses-card";
import { FutureMonthlyBudgetBreakdownCard } from "@/components/dashboard/future-monthly-budget-breakdown-card";
import { HomePurchaseCard } from "@/components/dashboard/home-purchase-card";
import { InvestmentOverviewCard } from "@/components/dashboard/investment-overview-card";
import { RetirementCard } from "@/components/dashboard/retirement-card";
import { SavingsAndInvestmentsCurrentCard } from "@/components/dashboard/savings-and-investments-current-card";
import { SavingsAndInvestmentsFutureCard } from "@/components/dashboard/savings-and-investments-future-card";
import { TravelAndLifestyleCard } from "@/components/dashboard/travel-and-lifestyle-card";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Dashboard actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            User Dashboard
          </h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Investment Overview */}
        <InvestmentOverviewCard />
        {/* Financial Snapshot */}
        <FinancialSnapshotCard userType={"user"} />
        {/* Alerts & Notifications */}
        <AlertsAndNotificationsUserCard />
        {/* Current Monthly Budget Breakdown */}
        <CurrentMonthlyBudgetBreakdownCard />
        {/* Essentials */}
        <EssentialsCard />
        {/* Travel & Lifestyle */}
        <TravelAndLifestyleCard />
        {/* Savings & Investments */}
        <SavingsAndInvestmentsCurrentCard />
        {/* Car Purchase */}
        <CarPurchaseCard />
        {/* Home Purchase */}
        <HomePurchaseCard />
        {/* Retirement */}
        <RetirementCard userType={"user"} />
        {/* Future Monthly Budget Breakdown */}
        <FutureMonthlyBudgetBreakdownCard />
        {/* Fixed Expenses */}
        <FixedExpensesCard />
        {/* Discretionary Expenses */}
        <DiscretionaryExpensesCard />
        {/* Total Discretionary Expenses */}
        <SavingsAndInvestmentsFutureCard />
      </div>
    </div>
  );
}
