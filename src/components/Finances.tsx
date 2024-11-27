import { Card } from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getRevenue, getExpenses } from '@/services/financeService';
import { useToast } from "@/components/ui/use-toast";

const Finances = () => {
  const { toast } = useToast();

  const { data: revenue = [] } = useQuery({
    queryKey: ['revenue'],
    queryFn: getRevenue,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load revenue data",
          variant: "destructive",
        });
        console.error('Error loading revenue:', error);
      },
    },
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load expenses data",
          variant: "destructive",
        });
        console.error('Error loading expenses:', error);
      },
    },
  });

  // Transform data for the chart
  const chartData = revenue.map((rev) => ({
    month: rev.month,
    revenue: rev.amount,
    expenses: expenses.find(exp => exp.month === rev.month)?.amount || 0
  }));

  // Calculate totals
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Calculate month-over-month changes
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const lastMonthRevenue = revenue[0]?.amount || 0;
  const previousMonthRevenue = revenue[1]?.amount || 0;
  const revenueChange = getPercentageChange(lastMonthRevenue, previousMonthRevenue);

  const lastMonthExpenses = expenses[0]?.amount || 0;
  const previousMonthExpenses = expenses[1]?.amount || 0;
  const expensesChange = getPercentageChange(lastMonthExpenses, previousMonthExpenses);

  return (
    <div className="space-y-8">
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                stroke="currentColor" 
                strokeOpacity={0.5}
                fontSize={12}
              />
              <YAxis 
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(153 60% 33%)" 
                radius={[4, 4, 0, 0]}
                name="Revenue" 
              />
              <Bar 
                dataKey="expenses" 
                fill="hsl(0 84.2% 60.2%)" 
                radius={[4, 4, 0, 0]}
                name="Expenses" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Finances;