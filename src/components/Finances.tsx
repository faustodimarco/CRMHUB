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
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYear = new Date().getFullYear().toString();

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

  // Calculate current month totals
  const monthlyRevenue = revenue
    .filter(rev => rev.month === currentMonth)
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenses = expenses
    .filter(exp => exp.month === currentMonth)
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate yearly revenue (sum of all past months including current)
  const yearlyRevenue = revenue
    .filter(rev => rev.month.startsWith(currentYear) && rev.month <= currentMonth)
    .reduce((sum, item) => sum + item.amount, 0);

  const netProfit = monthlyRevenue - monthlyExpenses;

  // Calculate percentage changes
  const lastMonthRevenue = revenue
    .filter(rev => rev.month === currentMonth)
    .reduce((sum, item) => sum + item.amount, 0);
  const previousMonthRevenue = revenue
    .filter(rev => {
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return rev.month === prevMonth.toISOString().slice(0, 7);
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const revenueChange = previousMonthRevenue === 0 ? 0 : 
    ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  const lastMonthExpenses = monthlyExpenses;
  const previousMonthExpenses = expenses
    .filter(exp => {
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return exp.month === prevMonth.toISOString().slice(0, 7);
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const expensesChange = previousMonthExpenses === 0 ? 0 :
    ((lastMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

  // Transform data for the chart
  const chartData = revenue
    .filter(rev => rev.month <= currentMonth)
    .map((rev) => ({
      month: rev.month,
      revenue: rev.amount,
      expenses: expenses.find(exp => exp.month === rev.month)?.amount || 0
    }));

  return (
    <div className="space-y-8">
      <FinanceHeader />

      <FinanceStats 
        totalRevenue={yearlyRevenue}
        totalExpenses={monthlyExpenses}
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
