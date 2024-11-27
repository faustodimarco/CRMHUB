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
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM
  const currentYear = currentDate.getFullYear();

  // Calculate monthly metrics for current month only
  const monthlyRevenue = totalRevenue;
  const monthlyExpenses = totalExpenses;
  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  // Calculate yearly revenue (only from past months including current)
  const yearlyRevenue = totalRevenue; // This will now come from accumulated past revenues

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Yearly Revenue</h3>
        <p className="text-3xl font-bold text-emerald-400">${yearlyRevenue.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{currentYear}</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-3xl font-bold text-emerald-400">${monthlyRevenue.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Current Month</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Monthly Expenses</h3>
        <p className="text-3xl font-bold text-red-500">${monthlyExpenses.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Current Month</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Monthly Net Profit</h3>
        <p className="text-3xl font-bold text-emerald-400">${monthlyProfit.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Current Month</p>
      </Card>
    </div>
  );
};

export default FinanceStats;