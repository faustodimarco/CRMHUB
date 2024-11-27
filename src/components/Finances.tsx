import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRevenue, getExpenses, deleteExpense, deleteRevenue } from '@/services/financeService';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AddExpenseForm from "./finances/AddExpenseForm";
import AddRevenueForm from "./finances/AddRevenueForm";
import CsvUploader from "./finances/CsvUploader";
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

  // Transform data for the chart
  const chartData = revenue.map((rev) => ({
    month: rev.month,
    revenue: rev.amount,
    expenses: expenses.find(exp => exp.month === rev.month)?.amount || 0
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Finances</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Add Revenue
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Revenue</DialogTitle>
                </DialogHeader>
                <AddRevenueForm />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Add Expense
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <AddExpenseForm />
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Import Revenue CSV
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Revenue CSV</DialogTitle>
                </DialogHeader>
                <CsvUploader type="revenue" />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Import Expenses CSV
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Expenses CSV</DialogTitle>
                </DialogHeader>
                <CsvUploader type="expenses" />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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