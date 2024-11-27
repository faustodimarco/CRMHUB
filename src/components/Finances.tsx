import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRevenue, getExpenses, deleteExpense, deleteRevenue } from '@/services/financeService';
import { useToast } from "@/hooks/use-toast";
import { filterFutureEntries } from '@/utils/dateUtils';
import FinanceHeader from './finances/FinanceHeader';
import FinanceStats from "./finances/FinanceStats";
import RevenueExpenseChart from "./finances/RevenueExpenseChart";
import ExpensesList from "./finances/ExpensesList";
import RevenueList from "./finances/RevenueList";

const Finances = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: revenue = [] } = useQuery({
    queryKey: ['revenue'],
    queryFn: getRevenue,
    select: (data) => filterFutureEntries(data),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load revenue data",
          variant: "destructive",
        });
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
      },
    },
  });

  const { mutate: deleteExpenseMutation } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteRevenueMutation } = useMutation({
    mutationFn: deleteRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue'] });
      toast({
        title: "Success",
        description: "Revenue deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete revenue",
        variant: "destructive",
      });
    },
  });

  // Calculate totals and changes
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

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

  // Transform data for the chart - using filtered revenue
  const chartData = revenue.map((rev) => ({
    month: rev.month,
    revenue: rev.amount,
    expenses: expenses.find(exp => exp.month === rev.month)?.amount || 0
  }));

  return (
    <div className="space-y-8">
      <FinanceHeader />

      <FinanceStats 
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        revenueChange={revenueChange}
        expensesChange={expensesChange}
      />

      <RevenueExpenseChart data={chartData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RevenueList revenue={revenue} onDelete={deleteRevenueMutation} />
        <ExpensesList expenses={expenses} onDelete={deleteExpenseMutation} />
      </div>
    </div>
  );
};

export default Finances;