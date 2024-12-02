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

  // Calculate current month's revenue and expenses only
  const currentMonthRevenue = revenue
    .filter(rev => {
      const isCurrentMonth = rev.month === currentMonth;
      const isNotRecurring = !rev.title?.includes('(Recurring)');
      return isCurrentMonth && isNotRecurring;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const currentMonthExpenses = expenses
    .filter(exp => {
      const isCurrentMonth = exp.month === currentMonth;
      const isNotRecurring = !exp.title?.includes('(Recurring)');
      return isCurrentMonth && isNotRecurring;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Calculate yearly revenue (sum of all past months including current)
  const yearlyRevenue = revenue
    .filter(rev => {
      const isThisYear = rev.month.startsWith(currentMonth.slice(0, 4));
      const isNotFuture = rev.month <= currentMonth;
      const isNotRecurring = !rev.title?.includes('(Recurring)');
      return isThisYear && isNotFuture && isNotRecurring;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const netProfit = currentMonthRevenue - currentMonthExpenses;

  // Calculate percentage changes
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);

  const previousMonthRevenue = revenue
    .filter(rev => {
      const isLastMonth = rev.month === lastMonth;
      const isNotRecurring = !rev.title?.includes('(Recurring)');
      return isLastMonth && isNotRecurring;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const revenueChange = previousMonthRevenue === 0 ? 0 : 
    ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  const previousMonthExpenses = expenses
    .filter(exp => {
      const isLastMonth = exp.month === lastMonth;
      const isNotRecurring = !exp.title?.includes('(Recurring)');
      return isLastMonth && isNotRecurring;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expensesChange = previousMonthExpenses === 0 ? 0 :
    ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

  // Transform data for the chart - consolidate entries by month, excluding recurring entries
  const chartData = Array.from(new Set(revenue.map(rev => rev.month)))
    .sort()
    .map(month => {
      const monthlyRev = revenue
        .filter(rev => {
          const isTargetMonth = rev.month === month;
          const isNotRecurring = !rev.title?.includes('(Recurring)');
          return isTargetMonth && isNotRecurring;
        })
        .reduce((sum, rev) => sum + Number(rev.amount), 0);
      
      const monthlyExp = expenses
        .filter(exp => {
          const isTargetMonth = exp.month === month;
          const isNotRecurring = !exp.title?.includes('(Recurring)');
          return isTargetMonth && isNotRecurring;
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      return {
        month,
        revenue: monthlyRev,
        expenses: monthlyExp
      };
    });

  return (
    <div className="space-y-8">
      <FinanceHeader />

      <FinanceStats 
        totalRevenue={yearlyRevenue}
        totalExpenses={currentMonthExpenses}
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
