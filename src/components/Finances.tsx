import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRevenue, getExpenses, deleteExpense } from '@/services/financeService';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddExpenseForm from "./finances/AddExpenseForm";
import AddRevenueForm from "./finances/AddRevenueForm";
import CsvUploader from "./finances/CsvUploader";
import FinanceStats from "./finances/FinanceStats";
import RevenueExpenseChart from "./finances/RevenueExpenseChart";
import { Card } from './ui/card';

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

  const deleteMutation = useMutation({
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
    <div className="flex gap-6">
      {/* Side Menu */}
      <div className="w-64 shrink-0">
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Financial Management</h3>
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Add Revenue
                </Button>
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
                <Button variant="outline" className="w-full justify-start">
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <AddExpenseForm />
              </DialogContent>
            </Dialog>

            <Card className="p-4">
              <h4 className="font-medium mb-2">Import Data</h4>
              <div className="space-y-2">
                <CsvUploader type="revenue" />
                <CsvUploader type="expenses" />
              </div>
            </Card>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <FinanceStats 
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          revenueChange={revenueChange}
          expensesChange={expensesChange}
        />

        <RevenueExpenseChart data={chartData} />

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Expenses List</h3>
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{expense.month}</p>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">${expense.amount.toLocaleString()}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Finances;