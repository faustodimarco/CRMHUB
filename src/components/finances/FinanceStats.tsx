import { Card } from "@/components/ui/card";

interface FinanceStatsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueChange: number;
  expensesChange: number;
}

const FinanceStats = ({ 
  totalRevenue, 
  totalExpenses, 
  netProfit, 
  revenueChange, 
  expensesChange 
}: FinanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
        <p className="text-sm text-emerald-500">{revenueChange.toFixed(1)}% from last month</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
        <p className="text-sm text-red-400">{expensesChange.toFixed(1)}% from last month</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
        <p className="text-3xl font-bold text-emerald-400">${netProfit.toLocaleString()}</p>
        <p className="text-sm text-emerald-500">{((netProfit / totalRevenue) * 100).toFixed(1)}% profit margin</p>
      </Card>
    </div>
  );
};

export default FinanceStats;